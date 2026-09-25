<script lang="ts">
  import { onMount } from 'svelte';

  let { intensity = 1.0, class: cls = '' }: { intensity?: number; class?: string } = $props();
  let host: HTMLDivElement;
  let failed = $state(false);

  const frag = `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec2  u_mouse;
    uniform float u_intensity;

    // hash / noise / fbm
    float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
      vec2 u=f*f*(3.0-2.0*f);
      return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
    }
    float fbm(vec2 p){
      float v=0.0, a=0.5;
      for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
      return v;
    }

    void main(){
      vec2 uv=(gl_FragCoord.xy - 0.5*u_res)/u_res.y;
      float t=u_time*0.05;

      // domain-warped caustic field
      vec2 q=vec2(fbm(uv*2.0+t), fbm(uv*2.0-t+5.2));
      vec2 r=vec2(fbm(uv*2.0+q*1.6+t*1.3), fbm(uv*2.0+q*1.6-t));
      float f=fbm(uv*2.5+r*1.8);

      // caustic ridges
      float caustic=abs(sin((f+length(r))*6.2831 + t*3.0));
      caustic=pow(caustic,2.2);

      // pointer light
      vec2 m=(u_mouse - 0.5)*vec2(u_res.x/u_res.y,1.0);
      float d=length(uv - m*1.0);
      float glow=smoothstep(0.9,0.0,d)*0.6;

      vec3 deep=vec3(0.02,0.024,0.04);
      vec3 sea =vec3(0.0,0.30,1.0);
      vec3 red =vec3(1.0,0.16,0.10);

      vec3 col=deep;
      col=mix(col, sea, f*0.55);
      col+=sea*caustic*0.22;
      col+=red*pow(caustic,3.0)*0.12*(0.5+0.5*sin(t*2.0));
      col+=sea*glow;

      // scan drift + vignette
      col*= 0.9+0.1*sin(gl_FragCoord.y*0.7 + u_time);
      float vig=smoothstep(1.25,0.2,length(uv));
      col*=vig;

      col*=u_intensity;
      gl_FragColor=vec4(col,1.0);
    }
  `;
  const vert = `
    attribute vec3 position;
    void main(){ gl_Position=vec4(position,1.0); }
  `;

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      failed = true;
      return;
    }
    let raf = 0;
    let renderer: any, mesh: any, mat: any, geo: any, scene: any, cam: any, ro: ResizeObserver;
    let mouse = { x: 0.5, y: 0.5 };
    let alive = true;

    (async () => {
      try {
        const THREE = await import('three');
        const canvas = document.createElement('canvas');
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        host.appendChild(canvas);

        scene = new THREE.Scene();
        cam = new THREE.Camera();
        geo = new THREE.BufferGeometry();
        const verts = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
        geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        mat = new THREE.RawShaderMaterial({
          vertexShader: vert,
          fragmentShader: frag,
          uniforms: {
            u_time: { value: 0 },
            u_res: { value: new THREE.Vector2(1, 1) },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_intensity: { value: intensity },
          },
        });
        mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false;
        scene.add(mesh);

        const resize = () => {
          const w = host.clientWidth || window.innerWidth;
          const h = host.clientHeight || window.innerHeight;
          renderer.setSize(w, h, false);
          mat.uniforms.u_res.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
        };
        ro = new ResizeObserver(resize);
        ro.observe(host);
        resize();

        const onMove = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          mouse.x = (e.clientX - r.left) / r.width;
          mouse.y = 1 - (e.clientY - r.top) / r.height;
        };
        window.addEventListener('pointermove', onMove, { passive: true });

        const start = performance.now();
        const loop = () => {
          if (!alive) return;
          const now = performance.now();
          mat.uniforms.u_time.value = (now - start) / 1000;
          mat.uniforms.u_mouse.value.x += (mouse.x - mat.uniforms.u_mouse.value.x) * 0.05;
          mat.uniforms.u_mouse.value.y += (mouse.y - mat.uniforms.u_mouse.value.y) * 0.05;
          renderer.render(scene, cam);
          raf = requestAnimationFrame(loop);
        };
        loop();

        (renderer as any)._cleanup = () => window.removeEventListener('pointermove', onMove);
      } catch (e) {
        failed = true;
        console.warn('WebGL field unavailable', e);
      }
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      renderer?._cleanup?.();
      geo?.dispose?.();
      mat?.dispose?.();
      renderer?.dispose?.();
    };
  });
</script>

<div class="field {cls}" class:failed bind:this={host} aria-hidden="true"></div>

<style>
  .field {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .field :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
  /* Fallback gradient when WebGL is off / reduced motion */
  .field.failed {
    background:
      radial-gradient(80% 60% at 30% 20%, color-mix(in oklab, var(--sea) 30%, transparent), transparent 60%),
      radial-gradient(70% 50% at 80% 80%, color-mix(in oklab, var(--cad-red) 16%, transparent), transparent 60%),
      var(--surface-0);
  }
</style>
