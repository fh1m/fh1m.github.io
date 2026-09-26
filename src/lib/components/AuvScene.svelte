<script lang="ts">
  import { onMount } from 'svelte';

  // Which subsystem the accompanying narrative is currently pointing at —
  // 'perception' (nose/cameras) | 'control' (the board) | 'estimator' (the
  // EKF/status brain) | 'thrust' (props + ducts) | null (idle, ambient).
  let { highlight = null }: { highlight?: 'perception' | 'control' | 'estimator' | 'thrust' | null } = $props();

  let host: HTMLDivElement;
  let failed = $state(false);

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      failed = true;
      return;
    }
    let raf = 0;
    let renderer: any, scene: any, cam: any, ro: ResizeObserver, io: IntersectionObserver;
    let rig: any, prop: any, ping: any, bubbles: any, statusLight: any, thrusterLight: any;
    const disposables: { dispose?: () => void }[] = [];
    let pointer = { x: 0.5, y: 0.5 };
    let alive = true;
    let visible = true;
    let running = false;

    const defer = (fn: () => void) =>
      'requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout: 800 }) : setTimeout(fn, 200);

    defer(() => {
      (async () => {
        try {
          const THREE = await import('three');

          const canvas = document.createElement('canvas');
          renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          host.appendChild(canvas);

          scene = new THREE.Scene();
          scene.fog = new THREE.FogExp2(0x04060b, 0.1);

          const BASE_YAW = Math.PI * 0.4;
          cam = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
          cam.position.set(1.55, 0.46, 2.15);
          cam.lookAt(0, -0.03, 0);

          // ---- lights: dark-stage product shot — strong rim + key so the
          // hull silhouette reads clearly against the near-black backdrop ----
          scene.add(new THREE.HemisphereLight(0x3a6cff, 0x04060b, 0.85));
          const key = new THREE.DirectionalLight(0xcfe0ff, 2.3);
          key.position.set(2.2, 2.6, 2.4);
          scene.add(key);
          const rim = new THREE.DirectionalLight(0x5a8dff, 2.0);
          rim.position.set(-2.4, 0.6, -2.2);
          scene.add(rim);
          const fill = new THREE.DirectionalLight(0xffffff, 0.35);
          fill.position.set(-1.4, -0.6, 1.8);
          scene.add(fill);
          thrusterLight = new THREE.PointLight(0xff5747, 1.4, 3.2, 2);
          thrusterLight.position.set(0, 0, 1.0);
          scene.add(thrusterLight);

          // ---- the vehicle: procedural low-poly AUV, nose toward +Z ----
          rig = new THREE.Group();
          rig.rotation.y = BASE_YAW;
          scene.add(rig);

          const hullMat = new THREE.MeshStandardMaterial({ color: 0x4a5468, metalness: 0.72, roughness: 0.26, emissive: 0x0d1420, emissiveIntensity: 0.6 });
          const trimMat = new THREE.MeshStandardMaterial({ color: 0x5c6780, metalness: 0.7, roughness: 0.24 });
          // Each highlightable subsystem gets its OWN material instance (never
          // shared) so pulsing one part never bleeds into another.
          const noseMat = new THREE.MeshStandardMaterial({ color: 0x5a8dff, emissive: 0x5a8dff, emissiveIntensity: 1.1, metalness: 0.1, roughness: 0.25 });
          const controlMat = new THREE.MeshStandardMaterial({ color: 0x5c6780, emissive: 0x5a8dff, emissiveIntensity: 0.4, metalness: 0.5, roughness: 0.3 });
          const thrustMat = new THREE.MeshStandardMaterial({ color: 0x5a8dff, emissive: 0x5a8dff, emissiveIntensity: 1.1, metalness: 0.1, roughness: 0.25 });
          const hubMat = new THREE.MeshStandardMaterial({ color: 0xff5747, emissive: 0xff5747, emissiveIntensity: 1.1, metalness: 0.1, roughness: 0.3 });
          const statusMat = new THREE.MeshStandardMaterial({ color: 0xff5747, emissive: 0xff5747, emissiveIntensity: 1.6, metalness: 0.1, roughness: 0.3 });
          disposables.push(hullMat, trimMat, noseMat, controlMat, thrustMat, hubMat, statusMat);

          const hullGeo = new THREE.CapsuleGeometry(0.42, 1.05, 6, 14);
          const hull = new THREE.Mesh(hullGeo, hullMat);
          hull.rotation.x = Math.PI / 2; // capsule's long axis (Y) -> forward (Z)
          rig.add(hull);
          disposables.push(hullGeo);

          const noseGeo = new THREE.SphereGeometry(0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
          const nose = new THREE.Mesh(noseGeo, noseMat);
          nose.rotation.x = -Math.PI / 2;
          nose.position.set(0, 0, 0.92);
          rig.add(nose);
          disposables.push(noseGeo);

          // the "board" — a lit ring around the hull's midsection
          const bandGeo = new THREE.TorusGeometry(0.435, 0.025, 8, 24);
          const band = new THREE.Mesh(bandGeo, controlMat);
          band.rotation.y = Math.PI / 2;
          band.position.set(0, 0, 0.15);
          rig.add(band);
          disposables.push(bandGeo);

          // tail fins — four, crossed
          const finGeo = new THREE.BoxGeometry(0.03, 0.34, 0.46);
          for (let i = 0; i < 4; i++) {
            const fin = new THREE.Mesh(finGeo, trimMat);
            fin.position.set(0, 0, -0.62);
            fin.rotation.z = (Math.PI / 2) * i;
            fin.translateY(0.32);
            rig.add(fin);
          }
          disposables.push(finGeo);

          // spinning propeller at the tail
          prop = new THREE.Group();
          prop.position.set(0, 0, -0.86);
          const bladeGeo = new THREE.BoxGeometry(0.026, 0.22, 0.05);
          for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(bladeGeo, trimMat);
            blade.rotation.z = (i * Math.PI * 2) / 3;
            blade.translateY(0.12);
            prop.add(blade);
          }
          const hubGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 10);
          const hub = new THREE.Mesh(hubGeo, hubMat);
          hub.rotation.x = Math.PI / 2;
          prop.add(hub);
          rig.add(prop);
          disposables.push(bladeGeo, hubGeo);

          // side thruster housings + glowing ducts (the "thrust" group)
          const housingGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.16, 12);
          const thrustRingGeo = new THREE.TorusGeometry(0.075, 0.012, 6, 16);
          [-1, 1].forEach((side) => {
            const housing = new THREE.Mesh(housingGeo, trimMat);
            housing.rotation.z = Math.PI / 2;
            housing.position.set(side * 0.46, -0.02, -0.25);
            rig.add(housing);
            const ring = new THREE.Mesh(thrustRingGeo, thrustMat);
            ring.rotation.y = Math.PI / 2;
            ring.position.set(side * (0.46 + 0.09), -0.02, -0.25);
            rig.add(ring);
          });
          disposables.push(housingGeo, thrustRingGeo);

          // blinking status beacon on top — the estimator's heartbeat
          const beaconGeo = new THREE.SphereGeometry(0.035, 8, 8);
          statusLight = new THREE.Mesh(beaconGeo, statusMat);
          statusLight.position.set(0, 0.4, 0.2);
          rig.add(statusLight);
          disposables.push(beaconGeo);

          // ---- sonar ping ring, expanding from the nose ----
          const pingGeo = new THREE.RingGeometry(0.7, 0.74, 48);
          const pingMat = new THREE.MeshBasicMaterial({ color: 0x5a8dff, transparent: true, opacity: 0, side: THREE.DoubleSide });
          ping = new THREE.Mesh(pingGeo, pingMat);
          ping.rotation.x = -Math.PI / 2;
          ping.position.set(0, -0.02, 0.9);
          scene.add(ping);
          disposables.push(pingGeo);

          // ---- depth grid floor ----
          const grid = new THREE.GridHelper(7, 14, 0x1a2540, 0x0d1220);
          grid.position.y = -0.95;
          (grid.material as any).transparent = true;
          (grid.material as any).opacity = 0.5;
          scene.add(grid);

          // ---- rising bubble particles ----
          const N = 90;
          const bpos = new Float32Array(N * 3);
          const bspeed = new Float32Array(N);
          for (let i = 0; i < N; i++) {
            bpos[i * 3] = (Math.random() - 0.5) * 4.4;
            bpos[i * 3 + 1] = (Math.random() - 0.5) * 2.4 - 0.6;
            bpos[i * 3 + 2] = (Math.random() - 0.5) * 3.6;
            bspeed[i] = 0.15 + Math.random() * 0.3;
          }
          const bgeo = new THREE.BufferGeometry();
          bgeo.setAttribute('position', new THREE.BufferAttribute(bpos, 3));
          const bmat = new THREE.PointsMaterial({ color: 0x8fb4ff, size: 0.028, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
          bubbles = new THREE.Points(bgeo, bmat);
          scene.add(bubbles);
          disposables.push(bgeo, bmat);

          const resize = () => {
            const w = host.clientWidth || 320;
            const h = host.clientHeight || 180;
            renderer.setSize(w, h, false);
            cam.aspect = w / h;
            cam.updateProjectionMatrix();
          };
          ro = new ResizeObserver(resize);
          ro.observe(host);
          resize();

          const onMove = (e: PointerEvent) => {
            const r = host.getBoundingClientRect();
            pointer.x = (e.clientX - r.left) / r.width;
            pointer.y = (e.clientY - r.top) / r.height;
          };
          window.addEventListener('pointermove', onMove, { passive: true });

          const start = performance.now();
          let pingT = 0;
          const loop = () => {
            if (!alive || !visible) { running = false; return; }
            const t = (performance.now() - start) / 1000;

            rig.rotation.y += 0.0022 + ((pointer.x - 0.5) * 0.35 - (rig.rotation.y - BASE_YAW)) * 0.01;
            rig.rotation.x += ((pointer.y - 0.5) * -0.18 - rig.rotation.x) * 0.04;
            rig.position.y = Math.sin(t * 0.7) * 0.045;

            prop.rotation.z += 0.42;

            pingT += 0.016;
            const cycle = 2.4;
            const p = (pingT % cycle) / cycle;
            const scale = 0.15 + p * 1.7;
            ping.scale.set(scale, scale, scale);
            (ping.material as any).opacity = p < 0.06 ? p / 0.06 * 0.5 : Math.max(0, 0.5 * (1 - p));

            // Spotlight whichever subsystem the narrative is on; ease everyone
            // else back to their idle glow. Each part owns its material, so
            // this never bleeds into a neighbour.
            const hiBoost = 2.6 + Math.sin(t * 2.6) * 0.5;
            const setGlow = (mat: any, idle: number, key: string) => {
              const target = highlight === key ? hiBoost : idle;
              mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.07;
            };
            setGlow(noseMat, 1.1, 'perception');
            setGlow(controlMat, 0.4, 'control');
            setGlow(thrustMat, 1.1, 'thrust');
            setGlow(hubMat, 1.1, 'thrust');

            const beacon = 0.6 + Math.max(0, Math.sin(t * (highlight === 'estimator' ? 7 : 3.2))) * (highlight === 'estimator' ? 2.4 : 1.2);
            statusMat.emissiveIntensity = beacon;
            thrusterLight.intensity = 1.1 + Math.sin(t * 5) * 0.3 + Math.random() * 0.08;

            const pos = bubbles.geometry.attributes.position as any;
            for (let i = 0; i < N; i++) {
              pos.array[i * 3 + 1] += bspeed[i] * 0.01;
              if (pos.array[i * 3 + 1] > 1.3) pos.array[i * 3 + 1] = -1.5;
            }
            pos.needsUpdate = true;

            renderer.render(scene, cam);
            raf = requestAnimationFrame(loop);
          };
          const startLoop = () => { if (!running && alive && visible) { running = true; raf = requestAnimationFrame(loop); } };

          io = new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
            if (visible) startLoop();
          }, { threshold: 0.01 });
          io.observe(host);
          startLoop();

          (renderer as any)._cleanup = () => window.removeEventListener('pointermove', onMove);
        } catch (e) {
          failed = true;
          console.warn('AUV scene unavailable', e);
        }
      })();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      renderer?._cleanup?.();
      disposables.forEach((d) => d?.dispose?.());
      renderer?.dispose?.();
    };
  });
</script>

<div class="auv-scene" class:failed bind:this={host} aria-hidden="true"></div>

<style>
  .auv-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .auv-scene :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
  .auv-scene.failed {
    background:
      radial-gradient(60% 70% at 50% 60%, color-mix(in oklab, var(--sea) 24%, transparent), transparent 65%),
      radial-gradient(40% 30% at 70% 30%, color-mix(in oklab, var(--cad-red) 14%, transparent), transparent 60%);
  }
</style>
