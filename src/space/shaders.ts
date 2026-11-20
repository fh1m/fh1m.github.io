/**
 * Procedural materials for the fictional silicon world, atmospheres and stars.
 * The other worlds and the Sun use the credited local surface maps in engine.ts.
 */
import * as THREE from "three";

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


export function siliconMaterial(colours: [string, string, string]) {
  return new THREE.ShaderMaterial({
    uniforms: { uA: { value: new THREE.Color(colours[0]) }, uB: { value: new THREE.Color(colours[1]) }, uC: { value: new THREE.Color(colours[2]) }, uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      uniform vec3 uA, uB, uC; uniform float uTime; varying vec3 vObj; varying vec3 vN; varying vec3 vW; ${NOISE}
      void main(){
        vec3 col; float spec = 0., emit = 0.;
        vec2 g = vec2(atan(vObj.z, vObj.x) * 12., asin(vObj.y) * 12.);
        vec2 cc = abs(fract(g) - .5);
        float trace = smoothstep(.47, .5, max(cc.x, cc.y)) * step(.45, fbm(floor(vec3(g, 1.)) * .7));
        col = mix(uA, uB, fbm(vObj * 4.));
        col += uC * trace * (.5 + .5 * sin(uTime * 1.5 + g.x)) * .9; emit = trace * .6;
        vec3 L = normalize(-vW), V = normalize(cameraPosition - vW), N = normalize(vN);
        float d = dot(N, L), lit = smoothstep(-.15, .35, d);
        float s = pow(max(dot(reflect(-L, N), V), 0.), 40.) * spec * .6;
        vec3 night = max(col * .18, vec3(.022, .025, .032));
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
