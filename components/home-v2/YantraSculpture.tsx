"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type PointerMotion = { x: number; y: number };

type YantraSculptureProps = {
  pointer: MutableRefObject<PointerMotion>;
  reducedMotion: boolean;
  isDark: boolean;
};

export default function YantraSculpture({
  pointer,
  reducedMotion,
  isDark,
}: YantraSculptureProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0, 0.12, 7.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error("Unable to initialize the e-Yantra mascot:", error);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    scene.add(
      new THREE.HemisphereLight(isDark ? 0xf1dfc9 : 0xfff8ec, 0x5a4238, 2.25),
    );

    const keyLight = new THREE.DirectionalLight(0xffe1b5, 3.4);
    keyLight.position.set(-3.5, 5, 7);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffb16a, 70, 16, 2);
    fillLight.position.set(4, 1.5, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xc94336, 38, 12, 2);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);

    const mascot = new THREE.Group();
    const bodyMotion = new THREE.Group();
    const headMotion = new THREE.Group();
    scene.add(mascot);
    mascot.add(bodyMotion);
    bodyMotion.add(headMotion);

    const ivory = new THREE.MeshStandardMaterial({
      color: isDark ? 0xe0d4c3 : 0xf0e8dc,
      roughness: 0.34,
      metalness: 0.12,
    });
    const ceramicLight = new THREE.MeshStandardMaterial({
      color: isDark ? 0xbdb1a4 : 0xd8cabb,
      roughness: 0.4,
      metalness: 0.16,
    });
    const graphite = new THREE.MeshStandardMaterial({
      color: 0x343438,
      roughness: 0.29,
      metalness: 0.62,
    });
    const faceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x25272a,
      roughness: 0.19,
      metalness: 0.28,
      clearcoat: 0.9,
      clearcoatRoughness: 0.16,
    });
    const steel = new THREE.MeshStandardMaterial({
      color: 0xa79b8d,
      roughness: 0.27,
      metalness: 0.78,
    });
    const crimson = new THREE.MeshStandardMaterial({
      color: 0xc63730,
      roughness: 0.22,
      metalness: 0.38,
      emissive: 0x8c1818,
      emissiveIntensity: 0.42,
    });
    const visorRim = new THREE.MeshStandardMaterial({
      color: 0xffd27d,
      roughness: 0.2,
      metalness: 0.24,
      emissive: 0xffa72e,
      emissiveIntensity: 1.05,
    });
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdfaa,
      roughness: 0.16,
      emissive: 0xffb867,
      emissiveIntensity: 0.8,
    });
    const seamMaterial = new THREE.MeshStandardMaterial({
      color: 0x856e5d,
      roughness: 0.34,
      metalness: 0.6,
    });

    const addMesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      parent: THREE.Object3D,
      position: [number, number, number],
      scale?: [number, number, number],
    ) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      if (scale) mesh.scale.set(...scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const addRounded = (
      parent: THREE.Object3D,
      material: THREE.Material,
      position: [number, number, number],
      size: [number, number, number],
      radius = 0.12,
    ) =>
      addMesh(
        new RoundedBoxGeometry(...size, 5, radius),
        material,
        parent,
        position,
      );

    const addLimb = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      radius: number,
      material: THREE.Material,
      parent: THREE.Object3D,
    ) => {
      const direction = new THREE.Vector3().subVectors(end, start);
      const limb = addMesh(
        new THREE.CylinderGeometry(radius * 0.84, radius, direction.length(), 16),
        material,
        parent,
        [0, 0, 0],
      );
      limb.position.copy(start).add(end).multiplyScalar(0.5);
      limb.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      );
      return limb;
    };

    const torso = new THREE.Group();
    bodyMotion.add(torso);
    addRounded(torso, ivory, [0, -0.58, 0], [1.22, 1.05, 0.82], 0.25);
    addRounded(torso, seamMaterial, [0, -0.54, 0.421], [0.72, 0.63, 0.095], 0.12);
    addRounded(torso, ceramicLight, [0, -0.54, 0.478], [0.65, 0.56, 0.075], 0.1);
    addRounded(torso, ceramicLight, [0, -1.08, 0.01], [1.08, 0.24, 0.7], 0.1);

    const chestIndicators = [
      { x: -0.2, y: -0.37, material: crimson },
      { x: 0.2, y: -0.37, material: visorRim },
      { x: -0.2, y: -0.71, material: steel },
      { x: 0.2, y: -0.71, material: steel },
    ];
    chestIndicators.forEach(({ x, y, material }) => {
      addMesh(
        new THREE.SphereGeometry(0.038, 16, 12),
        material,
        torso,
        [x, y, 0.53],
      );
    });
    addRounded(torso, ceramicLight, [-0.1, -0.39, 0.53], [0.15, 0.035, 0.018], 0.012);
    addRounded(torso, visorRim, [0.21, -0.4, 0.53], [0.055, 0.025, 0.018], 0.008);

    addRounded(torso, steel, [0, 0.02, 0], [0.34, 0.2, 0.34], 0.1);
    addMesh(
      new THREE.TorusGeometry(0.15, 0.034, 10, 32),
      crimson,
      torso,
      [0, 0.03, 0.14],
    );

    const leftArm = new THREE.Group();
    const rightArm = new THREE.Group();
    leftArm.position.set(-0.56, -0.22, 0);
    rightArm.position.set(0.56, -0.22, 0);
    torso.add(leftArm, rightArm);

    const buildArm = (arm: THREE.Group, direction: -1 | 1) => {
      addMesh(
        new THREE.SphereGeometry(0.24, 24, 20),
        ivory,
        arm,
        [direction * 0.02, 0, 0],
      );
      addLimb(
        new THREE.Vector3(direction * 0.04, -0.03, 0),
        new THREE.Vector3(direction * 0.31, -0.33, 0.03),
        0.17,
        ivory,
        arm,
      );
      addMesh(
        new THREE.SphereGeometry(0.18, 20, 16),
        ceramicLight,
        arm,
        [direction * 0.3, -0.3, 0.04],
      );
      const forearm = new THREE.Group();
      forearm.position.set(direction * 0.3, -0.3, 0.04);
      arm.add(forearm);
      const elbowBand = addMesh(
        new THREE.TorusGeometry(0.15, 0.026, 10, 32),
        seamMaterial,
        forearm,
        [0, -0.045, 0.04],
      );
      elbowBand.rotation.x = Math.PI / 2;
      addLimb(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(direction * 0.06, -0.26, 0.07),
        0.14,
        ivory,
        forearm,
      );
      const cuff = addMesh(
        new THREE.TorusGeometry(0.145, 0.035, 10, 36),
        seamMaterial,
        forearm,
        [direction * 0.06, -0.25, 0.08],
      );
      cuff.rotation.x = Math.PI / 2;
      const wrist = addMesh(
        new THREE.TorusGeometry(0.145, 0.018, 8, 36),
        steel,
        forearm,
        [direction * 0.06, -0.31, 0.08],
      );
      wrist.rotation.x = Math.PI / 2;
      addRounded(
        forearm,
        ivory,
        [direction * 0.06, -0.42, 0.09],
        [0.29, 0.25, 0.3],
        0.11,
      );
      return forearm;
    };
    buildArm(leftArm, -1);
    const rightForearm = buildArm(rightArm, 1);

    const legs = new THREE.Group();
    bodyMotion.add(legs);
    [-0.29, 0.29].forEach((x, index) => {
      addMesh(
        new THREE.SphereGeometry(0.15, 20, 16),
        steel,
        legs,
        [x, -1.11, 0],
      );
      addLimb(
        new THREE.Vector3(x, -1.12, 0),
        new THREE.Vector3(x + (index === 0 ? -0.02 : 0.02), -1.4, 0.02),
        0.14,
        ivory,
        legs,
      );
      const ankle = addMesh(
        new THREE.TorusGeometry(0.145, 0.025, 8, 32),
        seamMaterial,
        legs,
        [x, -1.38, 0.04],
      );
      ankle.rotation.x = Math.PI / 2;
      addRounded(
        legs,
        ivory,
        [x, -1.51, 0.15],
        [0.48, 0.28, 0.62],
        0.11,
      );
      addRounded(
        legs,
        crimson,
        [x, -1.53, 0.46],
        [0.2, 0.035, 0.018],
        0.012,
      );
    });

    const head = new THREE.Group();
    headMotion.position.set(0, 0.45, 0);
    bodyMotion.add(headMotion);
    headMotion.add(head);

    addRounded(head, ivory, [0, 0, 0], [2.04, 1.9, 1.28], 0.48);
    addRounded(
      head,
      seamMaterial,
      [0, 0, 0.651],
      [1.72, 1.59, 0.16],
      0.39,
    );
    addRounded(
      head,
      visorRim,
      [0, 0, 0.704],
      [1.69, 1.57, 0.115],
      0.4,
    );
    addRounded(
      head,
      faceMaterial,
      [0, 0, 0.763],
      [1.54, 1.43, 0.12],
      0.36,
    );

    [-0.28, 0.28].forEach((x) => {
      const eyeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x - 0.13, 0.03, 0.843),
        new THREE.Vector3(x - 0.075, 0.105, 0.855),
        new THREE.Vector3(x, 0.13, 0.86),
        new THREE.Vector3(x + 0.075, 0.105, 0.855),
        new THREE.Vector3(x + 0.13, 0.03, 0.843),
      ]);
      addMesh(
        new THREE.TubeGeometry(eyeCurve, 24, 0.025, 8, false),
        eyeMaterial,
        head,
        [0, 0, 0],
      );
    });

    const smilePoints = [
      new THREE.Vector3(-0.17, -0.2, 0.843),
      new THREE.Vector3(-0.09, -0.27, 0.854),
      new THREE.Vector3(0, -0.29, 0.858),
      new THREE.Vector3(0.09, -0.27, 0.854),
      new THREE.Vector3(0.17, -0.2, 0.843),
    ];
    const smile = new THREE.CatmullRomCurve3(smilePoints);
    addMesh(
      new THREE.TubeGeometry(smile, 28, 0.018, 8, false),
      eyeMaterial,
      head,
      [0, 0, 0],
    );

    const topVent = addRounded(
      head,
      seamMaterial,
      [0.3, 0.78, 0.65],
      [0.46, 0.08, 0.035],
      0.035,
    );
    topVent.rotation.z = -0.03;

    const sidePods = [-1, 1] as const;
    sidePods.forEach((side) => {
      const pod = addMesh(
        new THREE.CylinderGeometry(0.34, 0.34, 0.22, 32),
        graphite,
        head,
        [side * 0.98, -0.02, 0],
      );
      pod.rotation.z = Math.PI / 2;
      const outerCap = addMesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.12, 32),
        ivory,
        head,
        [side * 1.12, -0.02, 0],
      );
      outerCap.rotation.z = Math.PI / 2;
      const podRing = addMesh(
        new THREE.TorusGeometry(0.27, 0.027, 10, 40),
        seamMaterial,
        head,
        [side * 1.19, -0.02, 0],
      );
      podRing.rotation.y = Math.PI / 2;
      const centerCap = addMesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.06, 32),
        side === -1 ? crimson : steel,
        head,
        [side * 1.2, -0.02, 0],
      );
      centerCap.rotation.z = Math.PI / 2;
      const centerInset = addMesh(
        new THREE.SphereGeometry(0.07, 20, 16),
        graphite,
        head,
        [side * 1.235, -0.02, 0],
        [0.4, 1, 1],
      );
      centerInset.rotation.y = side * 0.15;
    });

    const antennaStem = addLimb(
      new THREE.Vector3(-0.43, 0.91, -0.04),
      new THREE.Vector3(-0.5, 1.13, -0.02),
      0.035,
      steel,
      head,
    );
    antennaStem.rotation.z = 0.08;
    addMesh(
      new THREE.SphereGeometry(0.105, 24, 20),
      crimson,
      head,
      [-0.5, 1.15, -0.02],
    );
    addMesh(
      new THREE.SphereGeometry(0.04, 16, 12),
      eyeMaterial,
      head,
      [-0.5, 1.15, 0.075],
    );

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const viewportWidth = window.innerWidth;
      camera.aspect = width / height;
      camera.position.z = viewportWidth < 600 ? 8.4 : viewportWidth < 900 ? 8 : 7.8;
      mascot.position.x =
        viewportWidth < 600 ? 0 : viewportWidth < 900 ? 0.16 : 0.48;
      mascot.scale.setScalar(viewportWidth < 600 ? 0.88 : 0.92);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let frame = 0;
    let lastTime = 0;
    let waving = false;
    const animate = (time: number) => {
      frame = window.requestAnimationFrame(animate);
      if (time - lastTime < 1000 / 30) return;
      lastTime = time;

      const elapsed = time * 0.001;
      const targetHeadX = reducedMotion ? 0 : pointer.current.y * -0.12;
      const targetHeadY = reducedMotion ? 0 : pointer.current.x * 0.2;
      headMotion.rotation.x += (targetHeadX - headMotion.rotation.x) * 0.055;
      headMotion.rotation.y += (targetHeadY - headMotion.rotation.y) * 0.055;

      if (!reducedMotion) {
        const wavePhase = elapsed % 18;
        const isWaving = wavePhase < 1.8;
        const waveStrength = isWaving
          ? Math.min(1, wavePhase / 0.28, (1.8 - wavePhase) / 0.34)
          : 0;
        bodyMotion.position.y = Math.sin(elapsed * 1.05) * 0.045;
        mascot.rotation.y += (pointer.current.x * 0.16 - mascot.rotation.y) * 0.035;
        mascot.rotation.x += (pointer.current.y * -0.08 - mascot.rotation.x) * 0.035;
        bodyMotion.rotation.z =
          Math.sin(elapsed * 0.52) * 0.018 + pointer.current.x * 0.018;
        leftArm.rotation.z = Math.sin(elapsed * 0.72 + 0.3) * 0.045;
        rightArm.rotation.z =
          Math.sin(elapsed * 0.72) * 0.035 + waveStrength * 0.7;
        rightForearm.rotation.z =
          Math.sin(elapsed * 7.5) * 0.28 * waveStrength;
        if (waving !== isWaving) {
          waving = isWaving;
          renderer.domElement.dataset.gesture = isWaving ? "wave" : "idle";
        }
      } else {
        mascot.rotation.set(0, 0, 0);
        bodyMotion.rotation.set(0, 0, 0);
        bodyMotion.position.y = 0;
        leftArm.rotation.z = 0;
        rightArm.rotation.z = 0;
        rightForearm.rotation.z = 0;
      }

      renderer.render(scene, camera);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark, pointer, reducedMotion]);

  return <div ref={mountRef} className="yantraSculptureCanvas" />;
}
