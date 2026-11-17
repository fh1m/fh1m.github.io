/**
 * Planet, atmosphere and star materials. Everything is procedural (no textures to download):
 * 3D value-noise fbm on the sphere, lit by the star at the origin, with a soft terminator.
 */
import * as THREE from "three";
import type { Surface } from "./system";

const NOISE = /* glsl */ `
float h3(vec3 p){ p = fract(p * 0.3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i+vec3(0,0,0)),h3(i+vec3(1,0,0)),f.x), mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x), mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x), f.y), f.z); }
float fbm(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p *= 2.03; a *= .5; } return s; }
`;

const VERT = /* glsl */ `
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
void main(){ vObj = normalize(position); vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;

const SURF: Record<Surface, string> = {
  // banded gas giant: latitude bands, stretched turbulence
  gas: `float b = vObj.y * 9. + fbm(vec3(vObj.x * 2., vObj.y * 14., vObj.z * 2.) + uTime * .01) * 2.2;
        float k = .5 + .5 * sin(b); col = mix(uA, uB, k); col = mix(col, uC, smoothstep(.6, .9, fbm(vObj * 5. + 3.)) * .5);`,
  // ocean world: deep water, a few islands, cloud wisps
  ocean: `float land = smoothstep(.62, .66, fbm(vObj * 2.6 + 7.)); col = mix(uA, uB * .8, fbm(vObj * 6.) * .6); col = mix(col, vec3(.24,.3,.2), land);
          float cl = smoothstep(.55, .75, fbm(vObj * 4. + vec3(uTime * .02, 0., 0.))); col = mix(col, uC, cl * .75); spec = (1. - land) * (1. - cl);`,
  // desert world: dunes, dark basalt, polar frost
  desert: `float n = fbm(vObj * 3.5); col = mix(uA, uB, n); col = mix(col, uC, smoothstep(.62, .75, fbm(vObj * 9. + 2.)) * .6);
           col = mix(col, vec3(.86,.84,.8), smoothstep(.82, .9, abs(vObj.y)));`,
  // silicon: dark plates, lit traces, warm hotspots like a chip under load
  silicon: `vec2 g = vec2(atan(vObj.z, vObj.x) * 12., asin(vObj.y) * 12.); vec2 cc = abs(fract(g) - .5);
            float trace = smoothstep(.47, .5, max(cc.x, cc.y)) * step(.45, fbm(floor(vec3(g, 1.)) * .7));
            col = mix(uA, uB, fbm(vObj * 4.)); col += uC * trace * (.5 + .5 * sin(uTime * 1.5 + g.x)) * .9; emit = trace * .6;`,
  rock: `col = mix(uA, uB, fbm(vObj * 5.));`,
  // home: oceans, continents, cloud
  earth: `float land = smoothstep(.5, .54, fbm(vObj * 2.2 + 11.)); col = mix(uA, uB, land); float cl = smoothstep(.55, .72, fbm(vObj * 5. + uTime * .015)); col = mix(col, uC, cl * .8); spec = (1. - land) * (1. - cl);`,
};

export function planetMaterial(surface: Surface, colours: [string, string, string]) {
  return new THREE.ShaderMaterial({
    uniforms: { uA: { value: new THREE.Color(colours[0]) }, uB: { value: new THREE.Color(colours[1]) }, uC: { value: new THREE.Color(colours[2]) }, uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      uniform vec3 uA, uB, uC; uniform float uTime; varying vec3 vObj; varying vec3 vN; varying vec3 vW; ${NOISE}
      void main(){
        vec3 col; float spec = 0., emit = 0.;
        ${SURF[surface]}
        vec3 L = normalize(-vW), V = normalize(cameraPosition - vW), N = normalize(vN);
        float d = dot(N, L), lit = smoothstep(-.15, .35, d);
        float s = pow(max(dot(reflect(-L, N), V), 0.), 40.) * spec * .6;
        vec3 night = col * .035;
        vec3 c = mix(night, col * (.25 + .9 * max(d, 0.)), lit) + s + col * emit;
        float rim = pow(1. - max(dot(N, V), 0.), 3.) * lit * .25; c += rim * uB;
        gl_FragColor = vec4(c, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}

export function atmosphere(radius: number, colour: string) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uC: { value: new THREE.Color(colour) } },
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      uniform vec3 uC; varying vec3 vObj; varying vec3 vN; varying vec3 vW;
      void main(){ vec3 V = normalize(cameraPosition - vW), N = normalize(vN), L = normalize(-vW);
        float f = pow(1. - abs(dot(N, V)), 2.2); float lit = clamp(dot(-N, L) * .6 + .5, 0., 1.);
        gl_FragColor = vec4(uC * f * lit * 1.4, f * lit); }`,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), mat);
}

export function starMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, vertexColors: true,
    vertexShader: /* glsl */ `attribute float size; varying vec3 vC; void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_PointSize = size * (min(2., 1.0) ); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */ `varying vec3 vC; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d); gl_FragColor = vec4(vC, a * .9); }`,
  });
}

export const rockMaterial = (colour: string) => new THREE.MeshStandardMaterial({ color: colour, roughness: 0.95, metalness: 0.05, flatShading: true });

/** The star: granulated surface, darker at the limb, slowly boiling. */
export function sunMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      uniform float uTime; varying vec3 vObj; varying vec3 vN; varying vec3 vW; ${NOISE}
      void main(){ vec3 V = normalize(cameraPosition - vW); float mu = max(dot(normalize(vN), V), 0.);
        float g = fbm(vObj * 18. + uTime * .05) * .6 + fbm(vObj * 4. - uTime * .02) * .4;
        vec3 c = mix(vec3(1., .62, .25), vec3(1., .95, .82), g); c *= .55 + .45 * pow(mu, .45);
        gl_FragColor = vec4(c * 1.4, 1.); }`,
  });
}
