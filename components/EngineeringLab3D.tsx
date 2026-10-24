"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type StationId = "idea" | "code" | "electronics" | "build" | "test";

export interface StationData {
  id: StationId;
  step: string;
  name: string;
  subtitle: string;
  description: string;
}

export const STATIONS: StationData[] = [
  {
    id: "idea",
    step: "01",
    name: "Engineering Journal",
    subtitle: "Schematics & Problem Framing",
    description: "Initial mechanical kinematics, circuit diagrams, and project system requirements sketched on paper.",
  },
  {
    id: "code",
    step: "02",
    name: "Firmware Station",
    subtitle: "Embedded C++ & Control",
    description: "Real-time motor control algorithms, PID routines, and sensor fusion firmware written for onboard controllers.",
  },
  {
    id: "electronics",
    step: "03",
    name: "Circuits & PCB",
    subtitle: "Microcontroller & Power Rails",
    description: "ATmega/ARM microcontroller core, voltage regulation, breadboard prototyping, and discrete sensor headers.",
  },
  {
    id: "build",
    step: "04",
    name: "Robotics Chassis",
    subtitle: "Hardware & Actuators",
    description: "Modular dual-chassis assembly with gearmotors, wheels, brackets, and custom sensor mounts.",
  },
  {
    id: "test",
    step: "05",
    name: "Test Arena",
    subtitle: "Validation & Tuning",
    description: "Infrared line test track and obstacle calibration markers for autonomous path verification.",
  },
];

interface EngineeringLab3DProps {
  activeStation: StationId;
  onStationSelect: (id: StationId) => void;
  isDark?: boolean;
}

export default function EngineeringLab3D({
  activeStation,
  onStationSelect,
  isDark = false,
}: EngineeringLab3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // References to communicate with Three.js animate loop
  const sceneState = useRef({
    activeStation,
    isDark,
    targetRotationY: 0,
    currentRotationY: 0,
    targetRotationX: 0,
    currentRotationX: 0,
    inView: true,
    pointerDown: false,
    prevPointerX: 0,
    prevPointerY: 0,
  });

  // Keep state updated
  useEffect(() => {
    sceneState.current.activeStation = activeStation;
  }, [activeStation]);

  useEffect(() => {
    sceneState.current.isDark = isDark;
  }, [isDark]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL support check
    let hasGl = true;
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) hasGl = false;
    } catch {
      hasGl = false;
    }

    if (!hasGl) {
      const timer = setTimeout(() => setWebGlSupported(false), 0);
      return () => clearTimeout(timer);
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    // ─── Scene & Camera (Isometric Orthographic) ───
    const scene = new THREE.Scene();

    const aspect = width / height;
    const frustumSize = 13.5;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );

    // Isometric viewing angle: ~45 deg Y, ~35.26 deg X
    const isoAngleY = Math.PI / 4;
    const isoAngleX = Math.atan(1 / Math.SQRT2);
    const cameraDistance = 22;

    camera.position.set(
      cameraDistance * Math.cos(isoAngleX) * Math.sin(isoAngleY),
      cameraDistance * Math.sin(isoAngleX),
      cameraDistance * Math.cos(isoAngleX) * Math.cos(isoAngleY)
    );
    camera.lookAt(0, 0.4, 0);

    // ─── Renderer ───
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      const timer = setTimeout(() => setWebGlSupported(false), 0);
      return () => clearTimeout(timer);
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // ─── Lighting ───
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.85 : 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.4 : 1.6);
    dirLight.position.set(12, 18, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.left = -9;
    dirLight.shadow.camera.right = 9;
    dirLight.shadow.camera.top = 9;
    dirLight.shadow.camera.bottom = -9;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xa5b4fc, isDark ? 0.5 : 0.4);
    fillLight.position.set(-10, 8, -8);
    scene.add(fillLight);

    // ─── Master Lab Platform Group ───
    const labGroup = new THREE.Group();
    scene.add(labGroup);

    // ─── Materials ───
    const matTable = new THREE.MeshStandardMaterial({
      color: isDark ? 0x222428 : 0xf1f1ed,
      roughness: 0.7,
      metalness: 0.1,
    });

    const matTableEdge = new THREE.MeshStandardMaterial({
      color: isDark ? 0x303338 : 0xdadad4,
      roughness: 0.5,
      metalness: 0.25,
    });

    const matRedAccent = new THREE.MeshStandardMaterial({
      color: 0xd83a32,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0xd83a32,
      emissiveIntensity: isDark ? 0.3 : 0.15,
    });

    const matSilver = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.3,
      metalness: 0.7,
    });

    const matDarkGraphite = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.2,
    });

    const matOffWhite = new THREE.MeshStandardMaterial({
      color: 0xfcfcfc,
      roughness: 0.8,
      metalness: 0.05,
    });

    const matPcbGreen = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.45,
      metalness: 0.1,
    });

    const matBreadboard = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.9,
      metalness: 0.0,
    });

    const matTrack = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1f2125 : 0xe4e4de,
      roughness: 0.8,
    });

    const matGlowPath = new THREE.MeshBasicMaterial({
      color: 0xd83a32,
    });

    // ─── 1. Main Workbench Slab ───
    const baseGeo = new THREE.BoxGeometry(11.2, 0.5, 7.8);
    const baseMesh = new THREE.Mesh(baseGeo, matTable);
    baseMesh.position.y = -0.25;
    baseMesh.receiveShadow = true;
    labGroup.add(baseMesh);

    // Bevel rim / trim
    const rimGeo = new THREE.BoxGeometry(11.4, 0.12, 8.0);
    const rimMesh = new THREE.Mesh(rimGeo, matTableEdge);
    rimMesh.position.y = -0.06;
    labGroup.add(rimMesh);

    // Station hitboxes & highlight groups
    const stationMeshes: { id: StationId; group: THREE.Group; marker: THREE.Mesh }[] = [];

    // Helper to add interactive station
    const createStationZone = (id: StationId, x: number, z: number) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Station pedestal / outline ring
      const ringGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.04, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x2b2e34 : 0xe2e2db,
        roughness: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.02;
      ring.receiveShadow = true;
      group.add(ring);

      // Pulsing indicator pip
      const pipGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pipMat = new THREE.MeshBasicMaterial({ color: 0xd83a32 });
      const pip = new THREE.Mesh(pipGeo, pipMat);
      pip.position.set(0, 1.6, 0);
      group.add(pip);

      // Invisible raycast cylinder
      const hitGeo = new THREE.CylinderGeometry(1.4, 1.4, 2.5, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = 1.0;
      hitMesh.userData = { stationId: id };
      group.add(hitMesh);

      labGroup.add(group);
      stationMeshes.push({ id, group, marker: pip });
      return group;
    };

    // ─── Station 1: IDEA (Sketchbook & Pen) ───
    const ideaGroup = createStationZone("idea", -3.8, 1.8);

    // Engineering Notebook
    const bookGeo = new THREE.BoxGeometry(1.3, 0.08, 1.0);
    const book = new THREE.Mesh(bookGeo, matOffWhite);
    book.position.set(0, 0.06, 0);
    book.rotation.y = 0.2;
    book.castShadow = true;
    book.receiveShadow = true;
    ideaGroup.add(book);

    // Notebook spine & strap
    const spineGeo = new THREE.BoxGeometry(0.12, 0.09, 1.02);
    const spine = new THREE.Mesh(spineGeo, matRedAccent);
    spine.position.set(-0.6, 0.065, 0);
    spine.rotation.y = 0.2;
    ideaGroup.add(spine);

    // Draftsman Pen / Stylus
    const penGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.9, 12);
    const pen = new THREE.Mesh(penGeo, matSilver);
    pen.position.set(0.65, 0.06, 0.15);
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = -0.4;
    pen.castShadow = true;
    ideaGroup.add(pen);

    // ─── Station 2: CODE (Mini Laptop / Monitor) ───
    const codeGroup = createStationZone("code", -3.6, -1.8);

    // Laptop base
    const laptopBaseGeo = new THREE.BoxGeometry(1.2, 0.05, 0.9);
    const laptopBase = new THREE.Mesh(laptopBaseGeo, matSilver);
    laptopBase.position.set(0, 0.05, 0);
    laptopBase.rotation.y = -0.25;
    laptopBase.castShadow = true;
    codeGroup.add(laptopBase);

    // Laptop screen
    const screenGeo = new THREE.BoxGeometry(1.16, 0.75, 0.04);
    const screen = new THREE.Mesh(screenGeo, matDarkGraphite);
    screen.position.set(0.1, 0.45, -0.42);
    screen.rotation.y = -0.25;
    screen.rotation.x = 0.2;
    screen.castShadow = true;
    codeGroup.add(screen);

    // Screen display glow (firmware code lines)
    const codeScreenGeo = new THREE.PlaneGeometry(1.0, 0.6);
    const codeScreenMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
    });
    const codePlane = new THREE.Mesh(codeScreenGeo, codeScreenMat);
    codePlane.position.set(0.1, 0.45, -0.395);
    codePlane.rotation.y = -0.25;
    codePlane.rotation.x = 0.2;
    codeGroup.add(codePlane);

    // Emissive code cursor line
    const codeLineGeo = new THREE.BoxGeometry(0.3, 0.03, 0.01);
    const codeLineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const codeLine = new THREE.Mesh(codeLineGeo, codeLineMat);
    codeLine.position.set(-0.15, 0.58, -0.37);
    codeLine.rotation.y = -0.25;
    codeLine.rotation.x = 0.2;
    codeGroup.add(codeLine);

    // ─── Station 3: ELECTRONICS (Arduino PCB, Breadboard, Jumper Signals) ───
    const elecGroup = createStationZone("electronics", -0.2, 0.2);

    // Arduino / Blue-Green microcontroller board
    const pcbGeo = new THREE.BoxGeometry(1.3, 0.06, 0.95);
    const pcb = new THREE.Mesh(pcbGeo, matPcbGreen);
    pcb.position.set(-0.45, 0.05, -0.3);
    pcb.castShadow = true;
    elecGroup.add(pcb);

    // ATmega IC chip
    const chipGeo = new THREE.BoxGeometry(0.55, 0.08, 0.2);
    const chip = new THREE.Mesh(chipGeo, matDarkGraphite);
    chip.position.set(-0.4, 0.1, -0.3);
    elecGroup.add(chip);

    // USB Type-B port
    const usbGeo = new THREE.BoxGeometry(0.24, 0.2, 0.28);
    const usb = new THREE.Mesh(usbGeo, matSilver);
    usb.position.set(-1.0, 0.13, -0.5);
    elecGroup.add(usb);

    // Mini Breadboard
    const bbGeo = new THREE.BoxGeometry(1.3, 0.1, 0.6);
    const bb = new THREE.Mesh(bbGeo, matBreadboard);
    bb.position.set(0.35, 0.06, 0.4);
    bb.castShadow = true;
    elecGroup.add(bb);

    // Tiny red status LED
    const ledGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12);
    const led = new THREE.Mesh(ledGeo, matRedAccent);
    led.position.set(-0.6, 0.12, -0.1);
    elecGroup.add(led);

    // ─── Station 4: BUILD (Robot Chassis under assembly) ───
    const buildGroup = createStationZone("build", 3.4, -1.6);

    // Robot lower chassis plate
    const botChassisGeo = new THREE.BoxGeometry(1.4, 0.06, 1.0);
    const botChassis = new THREE.Mesh(botChassisGeo, matDarkGraphite);
    botChassis.position.set(0, 0.35, 0);
    botChassis.castShadow = true;
    buildGroup.add(botChassis);

    // Robot upper deck
    const topDeckGeo = new THREE.BoxGeometry(1.1, 0.05, 0.8);
    const topDeck = new THREE.Mesh(topDeckGeo, matSilver);
    topDeck.position.set(0, 0.65, 0);
    topDeck.castShadow = true;
    buildGroup.add(topDeck);

    // Standoff pillars
    const pillarGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8);
    [
      [-0.45, -0.32],
      [0.45, -0.32],
      [-0.45, 0.32],
      [0.45, 0.32],
    ].forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(pillarGeo, matSilver);
      pillar.position.set(px, 0.5, pz);
      buildGroup.add(pillar);
    });

    // Wheels (Left and Right)
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.16, 24);
    const wheelL = new THREE.Mesh(wheelGeo, matRedAccent);
    wheelL.rotation.x = Math.PI / 2;
    wheelL.position.set(-0.55, 0.3, 0.55);
    wheelL.castShadow = true;
    buildGroup.add(wheelL);

    const wheelR = new THREE.Mesh(wheelGeo, matRedAccent);
    wheelR.rotation.x = Math.PI / 2;
    wheelR.position.set(0.55, 0.3, 0.55);
    wheelR.castShadow = true;
    buildGroup.add(wheelR);

    // Ultrasonic sensor "eyes" on front
    const sensorBaseGeo = new THREE.BoxGeometry(0.4, 0.18, 0.06);
    const sensorBase = new THREE.Mesh(sensorBaseGeo, matSilver);
    sensorBase.position.set(0, 0.5, -0.52);
    buildGroup.add(sensorBase);

    const sensorCylGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16);
    const eye1 = new THREE.Mesh(sensorCylGeo, matDarkGraphite);
    eye1.rotation.x = Math.PI / 2;
    eye1.position.set(-0.1, 0.5, -0.58);
    buildGroup.add(eye1);

    const eye2 = new THREE.Mesh(sensorCylGeo, matDarkGraphite);
    eye2.rotation.x = Math.PI / 2;
    eye2.position.set(0.1, 0.5, -0.58);
    buildGroup.add(eye2);

    // ─── Station 5: TEST (Arena & Line Track Zone) ───
    const testGroup = createStationZone("test", 3.6, 1.8);

    // Track mat
    const testPadGeo = new THREE.BoxGeometry(1.9, 0.04, 1.6);
    const testPad = new THREE.Mesh(testPadGeo, matTrack);
    testPad.position.set(0, 0.03, 0);
    testPad.receiveShadow = true;
    testGroup.add(testPad);

    // Contrast line strip (Robo-race path)
    const lineTrackGeo = new THREE.BoxGeometry(1.6, 0.05, 0.15);
    const lineTrack = new THREE.Mesh(lineTrackGeo, matDarkGraphite);
    lineTrack.position.set(0, 0.035, 0);
    testGroup.add(lineTrack);

    // Tiny test obstacle beacon
    const beaconGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.35, 16);
    const beacon = new THREE.Mesh(beaconGeo, matRedAccent);
    beacon.position.set(0.5, 0.2, 0.4);
    beacon.castShadow = true;
    testGroup.add(beacon);

    // Mini finish gate
    const gateGeo = new THREE.BoxGeometry(0.06, 0.5, 0.06);
    const gate1 = new THREE.Mesh(gateGeo, matSilver);
    gate1.position.set(-0.7, 0.28, -0.4);
    testGroup.add(gate1);

    const gate2 = new THREE.Mesh(gateGeo, matSilver);
    gate2.position.set(0.7, 0.28, -0.4);
    testGroup.add(gate2);

    const gateCrossGeo = new THREE.BoxGeometry(1.46, 0.06, 0.06);
    const gateCross = new THREE.Mesh(gateCrossGeo, matRedAccent);
    gateCross.position.set(0, 0.52, -0.4);
    testGroup.add(gateCross);

    // ─── Connected Signal Path (Visible Red Guide Lines) ───
    const curvePoints = [
      new THREE.Vector3(-3.8, 0.06, 1.8), // 01 Idea
      new THREE.Vector3(-3.6, 0.06, -1.8), // 02 Code
      new THREE.Vector3(-0.2, 0.06, 0.2), // 03 Electronics
      new THREE.Vector3(3.4, 0.06, -1.6), // 04 Build
      new THREE.Vector3(3.6, 0.06, 1.8), // 05 Test
    ];

    const curve = new THREE.CatmullRomCurve3(curvePoints, false, "centripetal");
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.032, 8, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, matGlowPath);
    labGroup.add(tubeMesh);

    // Traveling packet / signal pulse along path
    const packetGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const packetMesh = new THREE.Mesh(packetGeo, packetMat);
    labGroup.add(packetMesh);

    // ─── Raycasting for interactive clicks & hover ───
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getRaycastTargets = () => {
      const targets: THREE.Object3D[] = [];
      scene.traverse((obj) => {
        if (obj.userData?.stationId) {
          targets.push(obj);
        }
      });
      return targets;
    };

    const handlePointerDown = (e: PointerEvent) => {
      sceneState.current.pointerDown = true;
      sceneState.current.prevPointerX = e.clientX;
      sceneState.current.prevPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (sceneState.current.pointerDown) {
        const dx = e.clientX - sceneState.current.prevPointerX;
        const dy = e.clientY - sceneState.current.prevPointerY;
        sceneState.current.prevPointerX = e.clientX;
        sceneState.current.prevPointerY = e.clientY;

        // Controlled rotation clamp
        sceneState.current.targetRotationY += dx * 0.006;
        sceneState.current.targetRotationX = Math.max(
          Math.min(sceneState.current.targetRotationX + dy * 0.004, 0.25),
          -0.2
        );
      } else {
        // Hover raycast
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(getRaycastTargets());
        container.style.cursor = intersects.length > 0 ? "pointer" : "grab";
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (sceneState.current.pointerDown) {
        sceneState.current.pointerDown = false;

        // Check if it was a quick click rather than a drag
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(getRaycastTargets());
        if (intersects.length > 0) {
          const hitId = intersects[0].object.userData.stationId as StationId;
          if (hitId) onStationSelect(hitId);
        }
      }
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // ─── IntersectionObserver for power saving ───
    const observer = new IntersectionObserver(
      ([entry]) => {
        sceneState.current.inView = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // ─── VisibilityChange listener ───
    const handleVisibilityChange = () => {
      sceneState.current.inView = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ─── Resize Handler ───
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      const a = w / h;
      camera.left = (-frustumSize * a) / 2;
      camera.right = (frustumSize * a) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ─── Animation Loop ───
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!sceneState.current.inView) return;

      const elapsed = clock.getElapsedTime();

      // Smooth damped lerp for user drag rotation
      sceneState.current.currentRotationY +=
        (sceneState.current.targetRotationY - sceneState.current.currentRotationY) * 0.08;
      sceneState.current.currentRotationX +=
        (sceneState.current.targetRotationX - sceneState.current.currentRotationX) * 0.08;

      // Gentle subtle breathing float if not reduced motion
      const subtleFloat = reducedMotion ? 0 : Math.sin(elapsed * 1.5) * 0.08;
      labGroup.position.y = subtleFloat;

      labGroup.rotation.y = sceneState.current.currentRotationY;
      labGroup.rotation.x = sceneState.current.currentRotationX;

      // Pulse active station marker and signal packet
      const currentActive = sceneState.current.activeStation;
      stationMeshes.forEach(({ id, group, marker }) => {
        const isActive = id === currentActive;
        const scale = isActive ? 1.0 + Math.sin(elapsed * 4) * 0.25 : 0.8;
        marker.scale.set(scale, scale, scale);

        // Gentle hover highlight
        const targetY = isActive ? 0.08 : 0.0;
        group.position.y += (targetY - group.position.y) * 0.1;
      });

      // Signal packet motion along red circuit pipeline
      if (!reducedMotion) {
        const t = (elapsed * 0.22) % 1;
        const pt = curve.getPointAt(t);
        packetMesh.position.copy(pt);
        packetMesh.position.y += 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onStationSelect, isDark]);

  // Fallback if WebGL isn't supported
  if (!webGlSupported) {
    return (
      <div className="w-full h-full min-h-[440px] flex items-center justify-center p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--accent-red)]/10 text-[var(--accent-red)] flex items-center justify-center font-mono font-bold text-xl">
            01-05
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            e-Yantra Robotics Innovation Lab
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            The 5 connected phases of robotics engineering: Idea &rarr; Code &rarr; Electronics &rarr; Build &rarr; Test.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center">
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      />

      {/* Floating Interaction Hint */}
      <div className="absolute bottom-4 right-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)]/85 backdrop-blur-md border border-[var(--border)] text-[10px] font-mono text-[var(--text-secondary)] shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
        <span>Drag to rotate • Click stations</span>
      </div>
    </div>
  );
}
