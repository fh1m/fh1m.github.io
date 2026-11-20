import * as THREE from "three";
import { oxocarbon } from "../data/palette";

/** Navigation symbols, not CAD or a claim that an unfinished vehicle exists. */
export function createArtefactFactory() {
  const material = (color: string, metalness = 0.1) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness });
  const alloy = material("#bfc8d2", 0.65), carbon = material("#242c36", 0.25);
  const ivory = material("#e5e6e2"), board = material("#214a3d"), blue = material(oxocarbon.blue);
  const cyan = material(oxocarbon.cyan), green = material(oxocarbon.green), pink = material(oxocarbon.pink);
  const amber = material("#d6a253"), red = material(oxocarbon.magenta);
  const glass = new THREE.MeshStandardMaterial({ color: "#aad5e4", roughness: 0.18, metalness: 0.1, transparent: true, opacity: 0.58 });
  const wire = new THREE.MeshBasicMaterial({ color: oxocarbon.blue, wireframe: true, transparent: true, opacity: 0.7 });
  const box = new THREE.BoxGeometry(1, 1, 1), tube = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 20);
  const wheel = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 20), lens = new THREE.CylinderGeometry(0.25, 0.25, 0.18, 20);
  const hoop = new THREE.TorusGeometry(0.7, 0.065, 8, 40), ball = new THREE.SphereGeometry(1, 12, 8);
  const nose = new THREE.ConeGeometry(0.19, 0.6, 20), shoulder = new THREE.CylinderGeometry(0.09, 0.32, 0.3, 24);
  const yAxis = new THREE.Vector3(0, 1, 0), direction = new THREE.Vector3();

  return (id: string) => {
    const group = new THREE.Group(); group.name = `schematic:${id}`;
    const parts: THREE.Mesh[] = [];
    const add = (geometry: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) => {
      const part = new THREE.Mesh(geometry, mat); part.position.set(x, y, z); part.scale.set(sx, sy, sz); parts.push(part); return part;
    };
    const bar = (a: [number, number, number], b: [number, number, number], width: number, mat = alloy) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], length = Math.hypot(dx, dy, dz);
      const part = add(box, mat, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, width, length, width);
      part.quaternion.setFromUnitVectors(yAxis, direction.set(dx / length, dy / length, dz / length)); return part;
    };
    const screen = (x: number, y: number, z: number, width = 1.5, height = 1, mat = blue) => {
      add(box, carbon, x, y, z, width, height, 0.12);
      add(box, mat, x, y, z + 0.07, width * 0.87, height * 0.8, 0.025);
    };
    const rover = (mat: THREE.Material) => {
      add(box, mat, 0, 0, 0, 1.4, 0.3, 0.85);
      for (const x of [-0.5, 0.5]) for (const z of [-0.55, 0.55]) add(wheel, carbon, x, -0.12, z).rotation.x = Math.PI / 2;
    };

    switch (id) {
      case "aerd":
        add(tube, alloy, 0, 0, 0, 0.45, 1.4, 0.45);
        add(nose, ivory, 0, 1.55, 0);
        add(box, carbon, 0, -0.8, 0, 0.8, 0.6, 0.06);
        add(box, carbon, 0, -0.8, 0, 0.06, 0.6, 0.8);
        add(wheel, amber, 0, -1.28, 0, 0.5, 0.5, 0.5);
        break;
      case "gimbal":
        add(hoop, alloy, 0, 0, 0);
        add(hoop, carbon, 0, 0, 0, 0.75, 0.75, 0.75).rotation.y = Math.PI / 2;
        add(tube, ivory, 0, 0, 0, 0.32, 0.7, 0.32).rotation.z = 0.1;
        for (const x of [-0.8, 0.8]) add(box, carbon, x, 0, 0, 0.23, 0.4, 0.35);
        bar([-0.8, -0.2, 0], [-0.8, -0.8, 0], 0.12); bar([0.8, -0.2, 0], [0.8, -0.8, 0], 0.12);
        add(box, alloy, 0, -0.85, 0, 1.9, 0.12, 0.7);
        break;
      case "meghdhut":
        add(box, ivory, 0, 0, 0, 0.55, 0.2, 0.7);
        for (const x of [-0.65, 0.65]) for (const z of [-0.65, 0.65]) {
          bar([0, 0, 0], [x, 0, z], 0.09, carbon);
          add(wheel, carbon, x, 0.08, z, 1, 0.15, 1);
        }
        add(lens, blue, 0, -0.08, 0.38).rotation.x = Math.PI / 2;
        break;
      case "duburi":
        for (const z of [-0.4, 0.4]) add(tube, ivory, 0, 0, z, 0.48, 0.9, 0.48).rotation.z = Math.PI / 2;
        for (const x of [-0.75, 0.75]) {
          add(box, amber, x, -0.28, 0, 0.1, 0.12, 1.25);
          for (const z of [-0.55, 0.55]) add(box, amber, x, 0.12, z, 0.1, 0.8, 0.1);
        }
        add(lens, blue, 0.88, 0, 0.4).rotation.z = Math.PI / 2;
        break;
      case "mongla":
        // A pipeline exhibit, not invented vehicle geometry or unfinished hull CAD.
        add(box, ivory, 0, -0.3, 0, 2.6, 0.08, 1.15);
        for (const y of [0, 0.5]) {
          add(box, carbon, -0.95, y + 0.05, 0.15, 0.42, 0.32, 0.3);
          add(lens, alloy, -0.95, y + 0.05, 0.36, 0.7, 0.7, 0.7).rotation.x = Math.PI / 2;
          add(lens, blue, -0.95, y + 0.05, 0.43, 0.48, 0.3, 0.48).rotation.x = Math.PI / 2;
        }
        bar([-0.95, -0.25, 0], [-0.95, 0.55, 0], 0.07, alloy);
        add(box, board, 0, -0.02, 0, 0.9, 0.06, 0.78);
        add(box, carbon, 0, 0.05, 0, 0.48, 0.09, 0.44);
        add(box, alloy, 0, 0.13, 0, 0.56, 0.08, 0.52);
        for (let i = 0; i < 5; i++) add(box, alloy, -0.22 + i * 0.11, 0.23, 0, 0.035, 0.14, 0.52);
        add(box, board, 0, 0.34, -0.37, 0.68, 0.06, 0.22);
        add(box, carbon, 0, 0.4, -0.37, 0.36, 0.07, 0.16);
        add(box, board, 0.96, -0.02, 0, 0.5, 0.06, 0.7);
        add(box, carbon, 0.96, 0.06, 0, 0.25, 0.1, 0.28);
        for (const x of [0.8, 0.96, 1.12]) add(box, amber, x, 0.07, 0.28, 0.05, 0.13, 0.05);
        for (const x of [-0.32, 0.32, 0.8, 1.12]) for (const z of [-0.25, 0.25]) bar([x, -0.25, z], [x, -0.05, z], 0.035, alloy);
        bar([-0.72, -0.13, 0.22], [-0.48, -0.13, 0.22], 0.05, cyan);
        bar([0.48, -0.13, 0.22], [0.69, -0.13, 0.22], 0.05, blue);
        break;
      case "mongla-sim":
        add(box, wire, 0, 0.1, 0, 2.2, 1.7, 1.7);
        add(box, blue, 0, -0.78, 0, 2.2, 0.05, 1.7);
        for (const x of [-0.6, 0.6]) add(box, ivory, x, 0, -0.4, 0.08, 1.3, 0.08);
        add(box, ivory, 0, 0.65, -0.4, 1.28, 0.08, 0.08);
        add(box, carbon, 0, -0.35, 0.4, 0.7, 0.25, 0.4);
        break;
      case "green-at-depth":
        screen(0, 0, 0, 2.2, 1.5, ivory);
        add(box, green, -0.12, 0, 0.14, 1.1, 0.22, 0.06);
        add(nose, green, 0.58, 0, 0.14, 1.5, 1, 0.2).rotation.z = -Math.PI / 2;
        break;
      case "interview-bottle":
        add(tube, glass, 0, 0, 0, 0.8, 0.8, 0.8);
        add(shoulder, glass, 0, 0.87, 0);
        add(tube, glass, 0, 1.06, 0, 0.225, 0.1, 0.225);
        add(wheel, blue, 0, 1.19, 0, 0.36, 0.55, 0.36);
        add(wheel, ivory, 0, -0.08, 0, 1.035, 1.8, 1.035);
        add(tube, blue, 0, -0.1, 0, 0.68, 0.6, 0.68);
        break;
      case "rupsha":
        rover(alloy); add(box, carbon, 0.25, 0.4, 0, 0.12, 0.7, 0.12);
        add(box, board, 0.25, 0.77, 0, 0.4, 0.25, 0.12); add(lens, blue, 0.25, 0.77, 0.12).rotation.x = Math.PI / 2;
        break;
      case "e-bhapa":
        rover(amber); add(box, board, 0.7, 0.35, 0, 0.08, 0.3, 0.6);
        for (const z of [-0.18, 0.18]) add(lens, alloy, 0.79, 0.35, z, 0.5, 0.5, 0.5).rotation.z = Math.PI / 2;
        add(box, carbon, -0.25, 0.28, 0, 0.6, 0.25, 0.45);
        break;
      case "mongol-tori":
        add(box, carbon, -0.55, -0.6, 0, 0.7, 0.2, 0.7);
        bar([-0.55, -0.5, 0], [-0.3, 0.65, 0], 0.18);
        bar([-0.3, 0.65, 0], [0.8, 0.1, 0], 0.14);
        for (const [x, y] of [[-0.55, -0.45], [-0.3, 0.65], [0.8, 0.1]]) add(wheel, blue, x, y, 0).rotation.x = Math.PI / 2;
        bar([0.8, 0.1, 0], [0.8, -0.5, 0], 0.05, carbon);
        add(box, carbon, 0.8, -0.65, 0, 1.4, 0.08, 0.65);
        for (let x = 0; x < 6; x++) for (let z = 0; z < 3; z++) add(box, ivory, 0.25 + x * 0.22, -0.58, -0.2 + z * 0.2, 0.17, 0.05, 0.15);
        break;
      case "four-leds":
        add(box, board, 0, 0, 0, 1.8, 0.1, 1.1);
        for (const [index, mat] of [red, green, blue, amber].entries()) {
          const x = -0.6 + index * 0.4; add(ball, mat, x, 0.2, 0, 0.13, 0.17, 0.13);
          bar([x, 0.08, 0], [x, 0.07, 0.38], 0.025, alloy);
        }
        add(box, carbon, 0, 0.1, -0.32, 0.8, 0.12, 0.25);
        break;
      case "dristy":
        add(box, board, 0, 0, 0, 1.6, 0.1, 1.1);
        add(box, carbon, -0.45, 0.3, 0, 0.55, 0.5, 0.45);
        add(lens, blue, -0.45, 0.3, 0.3).rotation.x = Math.PI / 2;
        screen(0.4, 0.4, 0, 0.8, 0.65, cyan);
        break;
      case "den":
        add(box, alloy, 0, -0.65, 0.15, 2.4, 0.08, 1.3);
        screen(0, 0.15, -0.4, 2.4, 1.5, carbon);
        for (let i = 0; i < 5; i++) add(box, i === 0 ? pink : blue, -0.84 + (i % 3) * 0.8, 0.48 - Math.floor(i / 3) * 0.62, -0.31, 0.64, 0.42, 0.03);
        for (let i = 0; i < 9; i++) add(box, carbon, -0.85 + i * 0.21, -0.59, 0.15, 0.14, 0.03, 0.4);
        break;
      case "pareidolia":
        screen(0, 0, 0, 1.9, 1.5, ivory);
        for (let i = 0; i < 9; i++) add(box, i % 2 ? carbon : blue, -0.55 + (i % 3) * 0.55, 0.42 - Math.floor(i / 3) * 0.42, 0.1, 0.4, 0.23, 0.03);
        add(lens, carbon, -0.82, 0.77, 0).rotation.x = Math.PI / 2;
        break;
      case "half-a-second":
        screen(-0.36, 0.12, -0.2, 1.5, 1.2, blue); screen(0.4, -0.12, 0.16, 1.5, 1.2, pink);
        add(ball, ivory, 0.15, 0.72, 0.25, 0.33, 0.33, 0.06);
        bar([0.15, 0.72, 0.33], [0.15, 0.94, 0.33], 0.035, carbon);
        bar([0.15, 0.72, 0.33], [0.33, 0.63, 0.33], 0.035, carbon);
        break;
      case "trust-issues":
        screen(0, 0, 0, 2, 1.5, carbon);
        bar([-0.76, -0.52, 0.12], [0.76, -0.52, 0.12], 0.035, ivory);
        bar([-0.76, -0.52, 0.12], [-0.76, 0.52, 0.12], 0.035, ivory);
        bar([-0.65, -0.4, 0.13], [0.65, 0.38, 0.13], 0.025, cyan);
        for (const [x, y] of [[-0.55, -0.34], [-0.12, -0.08], [0.5, 0.28]]) add(ball, cyan, x, y, 0.15, 0.07, 0.07, 0.07);
        add(ball, red, -0.3, 0.5, 0.15, 0.09, 0.09, 0.09);
        break;
      case "tools":
        screen(0, 0, 0, 2, 1.5, carbon);
        for (let i = 0; i < 4; i++) add(box, i === 0 ? cyan : ivory, -0.28 + i * 0.08, 0.38 - i * 0.24, 0.12, 0.9 - i * 0.12, 0.07, 0.02);
        bar([-0.75, 0.42, 0.12], [-0.6, 0.3, 0.12], 0.04, cyan);
        bar([-0.6, 0.3, 0.12], [-0.75, 0.18, 0.12], 0.04, cyan);
        break;
      default:
        throw new Error(`No project schematic is defined for ${id}`);
    }

    // Repeated keys, wheels and frame members share one draw per geometry/material pair.
    const batches = new Map<string, THREE.Mesh[]>();
    for (const part of parts) {
      const key = `${part.geometry.id}:${(part.material as THREE.Material).id}`;
      const batch = batches.get(key); if (batch) batch.push(part); else batches.set(key, [part]);
    }
    for (const batch of batches.values()) {
      if (batch.length === 1) group.add(batch[0]);
      else {
        const instances = new THREE.InstancedMesh(batch[0].geometry, batch[0].material, batch.length);
        batch.forEach((part, index) => { part.updateMatrix(); instances.setMatrixAt(index, part.matrix); });
        group.add(instances);
      }
    }
    group.traverse(part => { part.userData.obj = id; });
    return group;
  };
}
