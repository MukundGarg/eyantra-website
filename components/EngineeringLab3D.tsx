"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
    inView: true,
    pointerDown: false,
    pointerMoved: false,
    pointerStartX: 0,
    pointerStartY: 0,
    onStationSelect,
  });

  // Keep state updated
  useEffect(() => {
    sceneState.current.activeStation = activeStation;
  }, [activeStation]);

  useEffect(() => {
    sceneState.current.onStationSelect = onStationSelect;
  }, [onStationSelect]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.rotateSpeed = 0.48;
    controls.autoRotateSpeed = 0.24;
    controls.target.set(0, 0.4, 0);
    const calculateCameraDistance = (w: number, h: number) => {
      const viewAspect = w / h;
      const halfFovTangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const widthFit = 11.5 / (2 * halfFovTangent * viewAspect * 0.84);
      const heightFit = 8.2 / (2 * halfFovTangent * 0.78);
      return Math.max(widthFit, heightFit) * 1.08;
    };
    let baseCameraDistance = calculateCameraDistance(width, height);
    const overviewDirection = new THREE.Vector3(0.52, 0.72, 0.64).normalize();
    camera.position
      .copy(overviewDirection)
      .multiplyScalar(baseCameraDistance)
      .add(controls.target);
    controls.minDistance = baseCameraDistance * 0.48;
    controls.maxDistance = baseCameraDistance * 1.6;
    controls.update();
    let lastInteraction = performance.now() - 4000;
    let isDragging = false;
    let cameraAnimating = false;

    // ─── Lighting ───
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.55 : 0.72);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(
      isDark ? 0x8298c5 : 0xf5f8ff,
      isDark ? 0x171a22 : 0x777985,
      isDark ? 0.85 : 1.05,
    );
    scene.add(hemisphereLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.2 : 2.6);
    dirLight.position.set(12, 18, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 768;
    dirLight.shadow.mapSize.height = 768;
    dirLight.shadow.camera.left = -9;
    dirLight.shadow.camera.right = 9;
    dirLight.shadow.camera.top = 9;
    dirLight.shadow.camera.bottom = -9;
    dirLight.shadow.bias = -0.0002;
    dirLight.shadow.normalBias = 0.025;
    dirLight.shadow.radius = 4;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xa5b4fc, isDark ? 0.5 : 0.4);
    fillLight.position.set(-10, 8, -8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd8c4, isDark ? 0.7 : 0.55);
    rimLight.position.set(3, 6, -10);
    scene.add(rimLight);

    // ─── Master Lab Platform Group ───
    const labGroup = new THREE.Group();
    scene.add(labGroup);

    // ─── Materials ───
    const matTable = new THREE.MeshStandardMaterial({
      color: isDark ? 0x252a32 : 0x353b45,
      roughness: 0.46,
      metalness: 0.58,
    });

    const matTableEdge = new THREE.MeshStandardMaterial({
      color: isDark ? 0x15191f : 0x20252e,
      roughness: 0.32,
      metalness: 0.78,
    });

    const matRedAccent = new THREE.MeshStandardMaterial({
      color: 0xd83a32,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0xd83a32,
      emissiveIntensity: isDark ? 0.3 : 0.15,
    });

    const matSilver = new THREE.MeshStandardMaterial({
      color: 0xb8c2ce,
      roughness: 0.28,
      metalness: 0.82,
    });

    const matDarkGraphite = new THREE.MeshStandardMaterial({
      color: 0x202630,
      roughness: 0.38,
      metalness: 0.42,
    });

    const matOffWhite = new THREE.MeshStandardMaterial({
      color: 0xfcfcfc,
      roughness: 0.8,
      metalness: 0.05,
    });

    const matPcbGreen = new THREE.MeshStandardMaterial({
      color: 0x075c4b,
      roughness: 0.4,
      metalness: 0.28,
    });

    const matCopper = new THREE.MeshStandardMaterial({
      color: 0xc77a45,
      roughness: 0.3,
      metalness: 0.8,
    });

    const matBoardTrace = new THREE.MeshStandardMaterial({
      color: 0xd6a15e,
      roughness: 0.36,
      metalness: 0.72,
      emissive: 0x5c3118,
      emissiveIntensity: 0.12,
    });

    const matScreen = new THREE.MeshStandardMaterial({
      color: 0x071723,
      roughness: 0.24,
      metalness: 0.12,
      emissive: 0x123449,
      emissiveIntensity: 0.85,
    });

    const matKey = new THREE.MeshStandardMaterial({
      color: 0x303844,
      roughness: 0.48,
      metalness: 0.32,
    });

    const matWheel = new THREE.MeshStandardMaterial({
      color: 0x20242b,
      roughness: 0.82,
      metalness: 0.06,
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

    const matGlowPath = new THREE.MeshStandardMaterial({
      color: 0xb84a42,
      roughness: 0.34,
      metalness: 0.72,
      emissive: 0x531a18,
      emissiveIntensity: isDark ? 0.5 : 0.24,
    });

    // ─── 1. Main Workbench Slab ───
    const baseGeo = new THREE.BoxGeometry(11.2, 0.5, 7.8);
    const baseMesh = new THREE.Mesh(baseGeo, matTable);
    baseMesh.position.y = -0.25;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    labGroup.add(baseMesh);

    // Edge rails wrap the slab sides instead of overlapping its top face.
    const longRailGeo = new THREE.BoxGeometry(11.32, 0.42, 0.075);
    const shortRailGeo = new THREE.BoxGeometry(0.075, 0.42, 7.8);
    const edgeRails: { geometry: THREE.BoxGeometry; position: [number, number, number] }[] = [
      { geometry: longRailGeo, position: [0, -0.25, -3.91] },
      { geometry: longRailGeo, position: [0, -0.25, 3.91] },
      { geometry: shortRailGeo, position: [-5.61, -0.25, 0] },
      { geometry: shortRailGeo, position: [5.61, -0.25, 0] },
    ];
    edgeRails.forEach(({ geometry, position }) => {
      const rail = new THREE.Mesh(geometry, matTableEdge);
      rail.position.set(...position);
      rail.castShadow = true;
      rail.receiveShadow = true;
      labGroup.add(rail);
    });

    const topAccentGeo = new THREE.BoxGeometry(11.08, 0.018, 0.025);
    const topAccent = new THREE.Mesh(topAccentGeo, matCopper);
    topAccent.position.set(0, 0.012, 3.82);
    labGroup.add(topAccent);

    // Station hitboxes & highlight groups
    const stationMeshes: { id: StationId; group: THREE.Group; marker: THREE.Mesh }[] = [];
    const stationRingGeo = new THREE.RingGeometry(1.08, 1.25, 40);
    const stationRingMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x77859a : 0x66717f,
      roughness: 0.42,
      metalness: 0.58,
      emissive: 0x253244,
      emissiveIntensity: 0.2,
    });
    const stationHitGeo = new THREE.CylinderGeometry(1.4, 1.4, 2.5, 16);
    const invisibleMat = new THREE.MeshBasicMaterial({ visible: false });

    // Helper to add interactive station
    const createStationZone = (id: StationId, x: number, z: number) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Station pedestal / outline ring
      const ring = new THREE.Mesh(stationRingGeo, stationRingMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.045;
      group.add(ring);

      // Invisible raycast cylinder
      const hitMesh = new THREE.Mesh(stationHitGeo, invisibleMat);
      hitMesh.position.y = 1.0;
      hitMesh.userData = { stationId: id };
      group.add(hitMesh);

      labGroup.add(group);
      stationMeshes.push({ id, group, marker: ring });
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

    const pageLineGeo = new THREE.BoxGeometry(0.72, 0.006, 0.012);
    const sketchGeo = new THREE.BoxGeometry(0.25, 0.008, 0.012);
    const sketchMat = new THREE.MeshStandardMaterial({
      color: 0x65778b,
      roughness: 0.78,
    });
    for (let i = 0; i < 5; i += 1) {
      const pageLine = new THREE.Mesh(pageLineGeo, sketchMat);
      pageLine.position.set(0.08, 0.103, -0.31 + i * 0.11);
      pageLine.rotation.y = 0.2;
      ideaGroup.add(pageLine);
    }
    [
      [-0.31, 0.105, -0.12],
      [-0.31, 0.105, 0.04],
      [-0.31, 0.105, 0.2],
    ].forEach(([x, y, z]) => {
      const sketchLine = new THREE.Mesh(sketchGeo, sketchMat);
      sketchLine.position.set(x, y, z);
      sketchLine.rotation.y = 0.2;
      ideaGroup.add(sketchLine);
    });
    const wheelSketchGeo = new THREE.RingGeometry(0.035, 0.046, 16);
    for (const x of [-0.34, -0.14]) {
      const wheelSketch = new THREE.Mesh(wheelSketchGeo, sketchMat);
      wheelSketch.rotation.set(-Math.PI / 2, 0.2, 0);
      wheelSketch.position.set(x, 0.109, 0.29);
      ideaGroup.add(wheelSketch);
    }
    const sketchConnectorGeo = new THREE.BoxGeometry(0.24, 0.008, 0.012);
    const sketchConnector = new THREE.Mesh(sketchConnectorGeo, sketchMat);
    sketchConnector.position.set(-0.24, 0.109, 0.29);
    sketchConnector.rotation.y = 0.2;
    ideaGroup.add(sketchConnector);

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

    // Laptop base with inset keyboard and firmware display.
    const laptop = new THREE.Group();
    laptop.rotation.y = -0.25;
    codeGroup.add(laptop);
    const laptopBaseGeo = new THREE.BoxGeometry(1.2, 0.055, 0.9);
    const laptopBase = new THREE.Mesh(laptopBaseGeo, matSilver);
    laptopBase.position.set(0, 0.065, 0);
    laptopBase.castShadow = true;
    laptop.add(laptopBase);

    const keyboardBed = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.012, 0.4),
      matDarkGraphite,
    );
    keyboardBed.position.set(0, 0.101, 0.12);
    laptop.add(keyboardBed);
    const keyGeo = new THREE.BoxGeometry(0.105, 0.018, 0.07);
    for (let row = 0; row < 3; row += 1) {
      const keyCount = row === 2 ? 6 : 7;
      for (let col = 0; col < keyCount; col += 1) {
        const key = new THREE.Mesh(keyGeo, matKey);
        key.position.set(
          (col - (keyCount - 1) / 2) * 0.125,
          0.116,
          -0.015 + row * 0.105,
        );
        laptop.add(key);
      }
    }
    const trackpad = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.006, 0.13),
      matSilver,
    );
    trackpad.position.set(0, 0.102, 0.37);
    laptop.add(trackpad);

    const screenGeo = new THREE.BoxGeometry(1.12, 0.72, 0.055);
    const screen = new THREE.Mesh(screenGeo, matDarkGraphite);
    screen.position.set(0, 0.49, -0.405);
    screen.castShadow = true;
    laptop.add(screen);

    const codeScreenGeo = new THREE.PlaneGeometry(1.0, 0.6);
    const codeScreenMat = new THREE.MeshBasicMaterial({ color: 0x102536 });
    const codePlane = new THREE.Mesh(codeScreenGeo, codeScreenMat);
    codePlane.position.set(0, 0.49, -0.373);
    laptop.add(codePlane);
    const codeLineGeo = new THREE.BoxGeometry(0.42, 0.016, 0.008);
    for (let row = 0; row < 5; row += 1) {
      const codeLine = new THREE.Mesh(
        codeLineGeo,
        row === 4 ? matBoardTrace : matScreen,
      );
      codeLine.scale.x = row % 2 === 0 ? 0.78 : 1;
      codeLine.position.set(-0.21 + (row % 2) * 0.08, 0.68 - row * 0.09, -0.363);
      laptop.add(codeLine);
    }

    // ─── Station 3: ELECTRONICS (Arduino PCB, Breadboard, Jumper Signals) ───
    const elecGroup = createStationZone("electronics", -0.2, 0.2);

    // Arduino / Blue-Green microcontroller board
    const pcbGeo = new THREE.BoxGeometry(1.3, 0.06, 0.95);
    const pcb = new THREE.Mesh(pcbGeo, matPcbGreen);
    pcb.position.set(-0.45, 0.05, -0.3);
    pcb.castShadow = true;
    pcb.receiveShadow = true;
    elecGroup.add(pcb);

    // ATmega IC chip
    const chipGeo = new THREE.BoxGeometry(0.48, 0.1, 0.24);
    const chip = new THREE.Mesh(chipGeo, matDarkGraphite);
    chip.position.set(-0.4, 0.14, -0.3);
    elecGroup.add(chip);
    const chipLegGeo = new THREE.BoxGeometry(0.035, 0.025, 0.055);
    for (let side = -1; side <= 1; side += 2) {
      for (let pin = 0; pin < 5; pin += 1) {
        const leg = new THREE.Mesh(chipLegGeo, matCopper);
        leg.position.set(-0.4 + (pin - 2) * 0.085, 0.09, -0.3 + side * 0.15);
        elecGroup.add(leg);
      }
    }

    const traceGeo = new THREE.BoxGeometry(0.012, 0.008, 0.3);
    [
      [-0.87, 0.086, 0.02],
      [-0.73, 0.086, 0.01],
      [-0.08, 0.086, -0.02],
      [-0.87, 0.086, -0.62],
    ].forEach(([x, y, z]) => {
      const trace = new THREE.Mesh(traceGeo, matBoardTrace);
      trace.position.set(x, y, z);
      elecGroup.add(trace);
    });

    // USB Type-B port
    const usbGeo = new THREE.BoxGeometry(0.26, 0.18, 0.3);
    const usb = new THREE.Mesh(usbGeo, matSilver);
    usb.position.set(-1.02, 0.15, -0.5);
    elecGroup.add(usb);
    const usbOpening = new THREE.Mesh(
      new THREE.BoxGeometry(0.17, 0.08, 0.012),
      matDarkGraphite,
    );
    usbOpening.position.set(-1.02, 0.15, -0.343);
    elecGroup.add(usbOpening);

    const headerPinGeo = new THREE.BoxGeometry(0.035, 0.16, 0.035);
    for (const x of [-0.9, -0.05]) {
      for (let pin = 0; pin < 6; pin += 1) {
        const headerPin = new THREE.Mesh(headerPinGeo, matCopper);
        headerPin.position.set(x, 0.15, -0.62 + pin * 0.12);
        elecGroup.add(headerPin);
      }
    }
    const headerRailGeo = new THREE.BoxGeometry(0.09, 0.045, 0.76);
    for (const x of [-0.9, -0.05]) {
      const headerRail = new THREE.Mesh(headerRailGeo, matDarkGraphite);
      headerRail.position.set(x, 0.115, -0.32);
      elecGroup.add(headerRail);
    }

    // Mini Breadboard
    const bbGeo = new THREE.BoxGeometry(1.3, 0.1, 0.6);
    const bb = new THREE.Mesh(bbGeo, matBreadboard);
    bb.position.set(0.35, 0.075, 0.4);
    bb.castShadow = true;
    elecGroup.add(bb);
    const breadboardHoleGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.008, 6);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0x68717b,
      roughness: 0.7,
      metalness: 0.12,
    });
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 12; col += 1) {
        const hole = new THREE.Mesh(breadboardHoleGeo, holeMat);
        hole.position.set(0.35 - 0.5 + col * 0.09, 0.128, 0.19 + row * 0.13);
        elecGroup.add(hole);
      }
    }

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

    // Side-mounted drive motors and wheels have an axle along the robot's X axis.
    const motorGeo = new THREE.BoxGeometry(0.28, 0.22, 0.38);
    const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.16, 24);
    const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.17, 16);
    for (const side of [-1, 1]) {
      const motor = new THREE.Mesh(motorGeo, matSilver);
      motor.position.set(side * 0.56, 0.29, 0.02);
      motor.castShadow = true;
      buildGroup.add(motor);

      const wheel = new THREE.Mesh(wheelGeo, matWheel);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(side * 0.78, 0.3, 0.02);
      wheel.castShadow = true;
      buildGroup.add(wheel);

      const hub = new THREE.Mesh(hubGeo, matCopper);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(side * 0.87, 0.3, 0.02);
      buildGroup.add(hub);
    }

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

    // Matte line-following route with a junction and contrasting edge markers.
    const lineTrackGeo = new THREE.BoxGeometry(1.68, 0.014, 0.075);
    const lineTrack = new THREE.Mesh(lineTrackGeo, matDarkGraphite);
    lineTrack.position.set(0, 0.059, 0);
    testGroup.add(lineTrack);
    const trackBranchGeo = new THREE.BoxGeometry(0.075, 0.014, 0.9);
    const trackBranch = new THREE.Mesh(trackBranchGeo, matDarkGraphite);
    trackBranch.position.set(-0.42, 0.059, -0.35);
    testGroup.add(trackBranch);
    const calibrationGeo = new THREE.BoxGeometry(0.12, 0.012, 0.12);
    for (const [x, z] of [[-0.72, 0.55], [-0.42, 0.55], [-0.12, 0.55]]) {
      const calibrationMark = new THREE.Mesh(calibrationGeo, matOffWhite);
      calibrationMark.position.set(x, 0.06, z);
      testGroup.add(calibrationMark);
    }

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

    // ─── Routed twin signal traces between the station pads ───
    const curvePoints = [
      new THREE.Vector3(-2.55, 0.025, 1.8),
      new THREE.Vector3(-2.2, 0.025, 1.15),
      new THREE.Vector3(-2.2, 0.025, -0.85),
      new THREE.Vector3(-2.2, 0.025, -1.8),
      new THREE.Vector3(-1.7, 0.025, -1.8),
      new THREE.Vector3(-1.45, 0.025, -0.8),
      new THREE.Vector3(-1.45, 0.025, 0.2),
      new THREE.Vector3(-0.2, 0.025, -1.05),
      new THREE.Vector3(1.35, 0.025, -1.05),
      new THREE.Vector3(2, 0.025, -1.6),
      new THREE.Vector3(4.65, 0.025, -1.6),
      new THREE.Vector3(4.85, 0.025, -1.1),
      new THREE.Vector3(4.85, 0.025, 1.1),
      new THREE.Vector3(4.65, 0.025, 1.8),
    ];

    const curve = new THREE.CatmullRomCurve3(curvePoints, false, "centripetal");
    const tubeGeo = new THREE.TubeGeometry(curve, 96, 0.018, 6, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, matGlowPath);
    tubeMesh.receiveShadow = true;
    labGroup.add(tubeMesh);

    const secondTrace = new THREE.CatmullRomCurve3(
      curvePoints.map((point) => new THREE.Vector3(point.x + 0.055, point.y, point.z)),
      false,
      "centripetal",
    );
    const secondTraceGeo = new THREE.TubeGeometry(secondTrace, 96, 0.009, 5, false);
    const secondTraceMesh = new THREE.Mesh(secondTraceGeo, matCopper);
    labGroup.add(secondTraceMesh);

    // ─── Raycasting for interactive clicks & hover ───
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const raycastTargets = stationMeshes.flatMap(({ group }) =>
      group.children.filter((child) => child.userData?.stationId),
    );

    const desiredCameraPosition = new THREE.Vector3();
    const desiredCameraTarget = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    const stationWorldPosition = new THREE.Vector3();
    let focusedStation = sceneState.current.activeStation;

    const focusStation = (id: StationId) => {
      const station = stationMeshes.find((item) => item.id === id);
      if (!station) return;

      station.group.getWorldPosition(stationWorldPosition);
      desiredCameraTarget.copy(stationWorldPosition).add(new THREE.Vector3(0, 0.48, 0));
      cameraDirection.copy(camera.position).sub(controls.target).normalize();
      desiredCameraPosition
        .copy(cameraDirection)
        .multiplyScalar(Math.max(9, baseCameraDistance * 0.66))
        .add(desiredCameraTarget);
      cameraAnimating = true;
      lastInteraction = performance.now();
      focusedStation = id;
    };

    controls.addEventListener("start", () => {
      isDragging = true;
      cameraAnimating = false;
      controls.autoRotate = false;
      lastInteraction = performance.now();
    });
    controls.addEventListener("end", () => {
      isDragging = false;
      lastInteraction = performance.now();
    });

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      sceneState.current.pointerDown = true;
      sceneState.current.pointerMoved = false;
      sceneState.current.pointerStartX = e.clientX;
      sceneState.current.pointerStartY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (sceneState.current.pointerDown) {
        const distanceX = e.clientX - sceneState.current.pointerStartX;
        const distanceY = e.clientY - sceneState.current.pointerStartY;
        if (Math.hypot(distanceX, distanceY) > 5) {
          sceneState.current.pointerMoved = true;
        }
      }

      if (isDragging) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      container.style.cursor = intersects.length > 0 ? "pointer" : "grab";
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!sceneState.current.pointerDown) return;
      const wasClick = !sceneState.current.pointerMoved;
      sceneState.current.pointerDown = false;
      if (!wasClick) return;

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (!intersects.length) return;

      const hitId = intersects[0].object.userData.stationId as StationId;
      if (!hitId) return;
      focusStation(hitId);
      sceneState.current.onStationSelect(hitId);
    };

    const handlePointerCancel = () => {
      sceneState.current.pointerDown = false;
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerCancel);

    // Track document visibility and intersection separately
    let isIntersecting = true;
    let isDocumentVisible = !document.hidden;

    const updateVisibility = () => {
      const shouldBeActive = isIntersecting && isDocumentVisible;
      if (shouldBeActive !== sceneState.current.inView) {
        sceneState.current.inView = shouldBeActive;
        if (shouldBeActive && !animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    // ─── IntersectionObserver for power saving ───
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateVisibility();
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ─── VisibilityChange listener ───
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      updateVisibility();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // WebGL Context Loss & Restore handling
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };
    const handleContextRestored = () => {
      updateVisibility();
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored);

    // ─── Resize Handler ───
    const handleResize = () => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      const nextCameraDistance = calculateCameraDistance(w, h);
      const distanceRatio = nextCameraDistance / baseCameraDistance;
      camera.position
        .sub(controls.target)
        .multiplyScalar(distanceRatio)
        .add(controls.target);
      if (cameraAnimating) {
        desiredCameraPosition
          .sub(controls.target)
          .multiplyScalar(distanceRatio)
          .add(controls.target);
      }
      baseCameraDistance = nextCameraDistance;
      controls.minDistance = baseCameraDistance * 0.48;
      controls.maxDistance = baseCameraDistance * 1.6;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ─── Animation Loop ───
    let animationFrameId = 0;
    const timer = new THREE.Timer();
    const animate = (timestamp: number) => {
      if (!sceneState.current.inView) {
        animationFrameId = 0;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);

      const elapsed = timer.getElapsed();
      const delta = timer.getDelta();

      const subtleFloat = reducedMotion ? 0 : Math.sin(elapsed * 1.5) * 0.08;
      labGroup.position.y = subtleFloat;

      if (sceneState.current.activeStation !== focusedStation) {
        focusStation(sceneState.current.activeStation);
      }

      if (cameraAnimating) {
        const transition = 1 - Math.exp(-Math.min(delta, 0.05) * 3.5);
        camera.position.lerp(desiredCameraPosition, transition);
        controls.target.lerp(desiredCameraTarget, transition);
        if (
          camera.position.distanceToSquared(desiredCameraPosition) < 0.0025 &&
          controls.target.distanceToSquared(desiredCameraTarget) < 0.0025
        ) {
          camera.position.copy(desiredCameraPosition);
          controls.target.copy(desiredCameraTarget);
          cameraAnimating = false;
        }
      }

      controls.autoRotate =
        !reducedMotion &&
        !isDragging &&
        !cameraAnimating &&
        performance.now() - lastInteraction > 6500;
      controls.update(Math.min(delta, 0.05));

      // Gently emphasize the selected station without adding floating markers.
      const currentActive = sceneState.current.activeStation;
      stationMeshes.forEach(({ id, group, marker }) => {
        const isActive = id === currentActive;
        const scale = isActive ? 1.02 + Math.sin(elapsed * 3) * 0.012 : 1;
        marker.scale.set(scale, scale, scale);

        // Gentle hover highlight
        const targetY = isActive ? 0.08 : 0.0;
        group.position.y += (targetY - group.position.y) * 0.1;
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // ─── Cleanup ───
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      timer.dispose();
      observer.disconnect();
      resizeObserver.disconnect();
      controls.dispose();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerCancel);

      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          geometries.add(obj.geometry);
          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) => materials.add(material));
          } else {
            materials.add(obj.material);
          }
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

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
        className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y select-none"
      />

      {/* Floating Interaction Hint */}
      <div className="absolute bottom-4 right-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)]/85 backdrop-blur-md border border-[var(--border)] text-[10px] font-mono text-[var(--text-secondary)] shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
        <span>Drag to rotate • Click stations</span>
      </div>
    </div>
  );
}
