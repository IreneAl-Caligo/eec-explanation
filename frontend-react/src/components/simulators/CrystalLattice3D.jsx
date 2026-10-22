import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, RotateCcw, Eye, Flame, Zap, Layers, Sparkles } from 'lucide-react';
import { playMechanicalClick, playBuzzer } from '../../utils/audioEngine';

/**
 * 3D Semiconductor Crystal Lattice Simulator (Three.js WebGL)
 * Accurately models Silicon Diamond Tetrahedral Covalent Lattice (Topics 1-5)
 * Features:
 * - 3D Orbit drag to rotate, scroll to zoom
 * - Live Doping: Pure Silicon (Intrinsic), Phosphorus (N-Type + Free Electron), Boron (P-Type + Hole)
 * - Thermal Generation (0K to 450K): Lattice vibrations & electron-hole pair generation
 * - Bilingual controls (EN + BN)
 */
export default function CrystalLattice3D({ langMode = 'dual', initialDoping = 'pure' }) {
  const mountRef = useRef(null);
  const [dopingType, setDopingType] = useState(initialDoping); // 'pure', 'n_type', 'p_type'
  const [temperatureK, setTemperatureK] = useState(300); // 0K - 450K
  const [showBondLines, setShowBondLines] = useState(true);
  const [freeElectronsCount, setFreeElectronsCount] = useState(0);
  const [holesCount, setHolesCount] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  const sceneStateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    atomsGroup: null,
    bondsGroup: null,
    freeParticlesGroup: null,
    animationFrameId: null,
    dopantAtomMesh: null,
    freeElectrons: [],
    holes: [],
  });

  // Calculate free carriers based on temperature and doping
  useEffect(() => {
    let baseThermalPairs = Math.floor(Math.max(0, (temperatureK - 150) / 35));
    if (temperatureK <= 77) baseThermalPairs = 0;

    let n = baseThermalPairs;
    let p = baseThermalPairs;

    if (dopingType === 'n_type') {
      n += 6; // Majority electrons from pentavalent donor
    } else if (dopingType === 'p_type') {
      p += 6; // Majority holes from trivalent acceptor
    }

    setFreeElectronsCount(n);
    setHolesCount(p);
  }, [dopingType, temperatureK]);

  // Set up Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 440;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2.5, 50);
    pointLight1.position.set(10, 15, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 1.8, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 10, 15);
    scene.add(dirLight);

    // 3. Groups for Atoms, Bonds, and Mobile Particles
    const atomsGroup = new THREE.Group();
    const bondsGroup = new THREE.Group();
    const freeParticlesGroup = new THREE.Group();
    scene.add(atomsGroup);
    scene.add(bondsGroup);
    scene.add(freeParticlesGroup);

    // Build Silicon Diamond Tetrahedral Lattice Unit Cell
    // A central atom connected to 4 tetrahedral positions:
    // Tetrahedral vectors: (1, 1, 1), (-1, -1, 1), (-1, 1, -1), (1, -1, -1) normalized
    const atomRadius = 0.65;
    const siGeometry = new THREE.SphereGeometry(atomRadius, 32, 32);
    const siMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0369a1,
      emissiveIntensity: 0.25,
    });

    // Lattice Coordinates (FCC / Diamond Tetrahedral representation)
    const positions = [
      [0, 0, 0], // Center atom (can be replaced by dopant)
      [2.2, 2.2, 2.2],
      [-2.2, -2.2, 2.2],
      [-2.2, 2.2, -2.2],
      [2.2, -2.2, -2.2],
      // Extended outer shell atoms for rich 3D lattice
      [4.4, 0, 0],
      [-4.4, 0, 0],
      [0, 4.4, 0],
      [0, -4.4, 0],
      [0, 0, 4.4],
      [0, 0, -4.4],
    ];

    const atomMeshes = [];
    positions.forEach((pos, idx) => {
      const mesh = new THREE.Mesh(siGeometry, siMaterial.clone());
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.userData = { originalPos: new THREE.Vector3(...pos), isCenter: idx === 0 };
      atomsGroup.add(mesh);
      atomMeshes.push(mesh);
    });

    // Create Covalent Bond Cylinders connecting tetrahedral neighbors to center
    const bondMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.75,
    });

    const createCylinderBetween = (v1, v2) => {
      const distance = v1.distanceTo(v2);
      const bondGeom = new THREE.CylinderGeometry(0.12, 0.12, distance, 16);
      const bond = new THREE.Mesh(bondGeom, bondMaterial);

      const midPoint = v1.clone().add(v2).multiplyScalar(0.5);
      bond.position.copy(midPoint);

      const orientation = new THREE.Matrix4();
      orientation.lookAt(v1, v2, new THREE.Vector3(0, 1, 0));
      const rotation = new THREE.Matrix4();
      rotation.makeRotationX(Math.PI / 2);
      orientation.multiply(rotation);
      bond.applyMatrix4(orientation);

      bondsGroup.add(bond);
    };

    // Connect central atom to the 4 tetrahedral positions
    const centerPos = new THREE.Vector3(0, 0, 0);
    for (let i = 1; i <= 4; i++) {
      createCylinderBetween(centerPos, new THREE.Vector3(...positions[i]));
    }
    // Connect outer shell pairs
    createCylinderBetween(new THREE.Vector3(...positions[1]), new THREE.Vector3(...positions[5]));
    createCylinderBetween(new THREE.Vector3(...positions[2]), new THREE.Vector3(...positions[6]));
    createCylinderBetween(new THREE.Vector3(...positions[3]), new THREE.Vector3(...positions[7]));
    createCylinderBetween(new THREE.Vector3(...positions[4]), new THREE.Vector3(...positions[8]));

    sceneStateRef.current = {
      scene,
      camera,
      renderer,
      atomsGroup,
      bondsGroup,
      freeParticlesGroup,
      atomMeshes,
      centerMesh: atomMeshes[0],
      dopantMesh: null,
      electronMeshes: [],
      holeMeshes: [],
      animationFrameId: null,
    };

    // Mouse Drag Rotation Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      atomsGroup.rotation.y += deltaX * 0.008;
      atomsGroup.rotation.x += deltaY * 0.008;
      bondsGroup.rotation.y = atomsGroup.rotation.y;
      bondsGroup.rotation.x = atomsGroup.rotation.x;
      freeParticlesGroup.rotation.y = atomsGroup.rotation.y;
      freeParticlesGroup.rotation.x = atomsGroup.rotation.x;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(8, Math.min(25, camera.position.z + e.deltaY * 0.015));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile / tablets
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      atomsGroup.rotation.y += deltaX * 0.01;
      atomsGroup.rotation.x += deltaY * 0.01;
      bondsGroup.rotation.y = atomsGroup.rotation.y;
      bondsGroup.rotation.x = atomsGroup.rotation.x;
      freeParticlesGroup.rotation.y = atomsGroup.rotation.y;
      freeParticlesGroup.rotation.x = atomsGroup.rotation.x;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const state = sceneStateRef.current;
      if (!state || !state.renderer) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Auto rotation if enabled and not actively dragging
      if (isRotating && !isDragging) {
        atomsGroup.rotation.y += 0.004;
        atomsGroup.rotation.x += 0.0015;
        bondsGroup.rotation.y = atomsGroup.rotation.y;
        bondsGroup.rotation.x = atomsGroup.rotation.x;
        freeParticlesGroup.rotation.y = atomsGroup.rotation.y;
        freeParticlesGroup.rotation.x = atomsGroup.rotation.x;
      }

      // Thermal lattice vibration (proportional to temperature)
      const vibrationAmp = Math.max(0, (temperatureK - 50) / 450) * 0.08;
      atomMeshes.forEach((atom, i) => {
        const orig = atom.userData.originalPos;
        atom.position.x = orig.x + Math.sin(time * 8 + i) * vibrationAmp;
        atom.position.y = orig.y + Math.cos(time * 7 + i * 1.5) * vibrationAmp;
        atom.position.z = orig.z + Math.sin(time * 9 + i * 2) * vibrationAmp;
      });

      // Animate drifting free electrons & holes
      if (state.electronMeshes) {
        state.electronMeshes.forEach((eMesh, idx) => {
          const speed = 1.2 + (temperatureK / 300);
          const r = 2.8 + Math.sin(time * 2 + idx) * 0.5;
          const theta = time * speed * 0.8 + idx * (Math.PI / 3);
          const phi = time * speed * 0.5 + idx * (Math.PI / 4);
          eMesh.position.x = r * Math.sin(theta) * Math.cos(phi);
          eMesh.position.y = r * Math.sin(theta) * Math.sin(phi);
          eMesh.position.z = r * Math.cos(theta);
        });
      }

      renderer.render(scene, camera);
      state.animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (sceneStateRef.current.animationFrameId) {
        cancelAnimationFrame(sceneStateRef.current.animationFrameId);
      }
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Doping Material & Mobile Particles
  useEffect(() => {
    const state = sceneStateRef.current;
    if (!state || !state.centerMesh || !state.freeParticlesGroup) return;

    // 1. Update Center Atom Appearance
    const centerMesh = state.centerMesh;
    if (dopingType === 'pure') {
      centerMesh.material.color.setHex(0x38bdf8); // Silicon cyan-blue
      centerMesh.material.emissive.setHex(0x0369a1);
      centerMesh.scale.set(1, 1, 1);
    } else if (dopingType === 'n_type') {
      centerMesh.material.color.setHex(0xf97316); // Phosphorus orange
      centerMesh.material.emissive.setHex(0xc2410c);
      centerMesh.scale.set(1.15, 1.15, 1.15); // Larger donor atom (+5)
    } else if (dopingType === 'p_type') {
      centerMesh.material.color.setHex(0xa855f7); // Boron purple-magenta
      centerMesh.material.emissive.setHex(0x7e22ce);
      centerMesh.scale.set(0.9, 0.9, 0.9); // Smaller acceptor atom (+3)
    }

    // 2. Rebuild Free Particle Clouds (Electrons = bright yellow-green dots, Holes = bright cyan-pink hollow rings)
    const fpGroup = state.freeParticlesGroup;
    fpGroup.clear();

    const electronMeshes = [];
    const holeMeshes = [];

    const electronGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    });

    const holeGeom = new THREE.TorusGeometry(0.24, 0.08, 12, 24);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.9,
    });

    for (let i = 0; i < freeElectronsCount; i++) {
      const eMesh = new THREE.Mesh(electronGeom, electronMat);
      eMesh.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
      fpGroup.add(eMesh);
      electronMeshes.push(eMesh);
    }

    for (let i = 0; i < holesCount; i++) {
      const hMesh = new THREE.Mesh(holeGeom, holeMat);
      hMesh.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
      hMesh.rotation.x = Math.PI / 4;
      fpGroup.add(hMesh);
      holeMeshes.push(hMesh);
    }

    state.electronMeshes = electronMeshes;
    state.holeMeshes = holeMeshes;
  }, [dopingType, freeElectronsCount, holesCount]);

  // Toggle Bond Visibility
  useEffect(() => {
    if (sceneStateRef.current?.bondsGroup) {
      sceneStateRef.current.bondsGroup.visible = showBondLines;
    }
  }, [showBondLines]);

  const resetCamera = () => {
    playMechanicalClick();
    if (sceneStateRef.current?.camera && sceneStateRef.current?.atomsGroup) {
      sceneStateRef.current.camera.position.set(0, 0, 16);
      sceneStateRef.current.atomsGroup.rotation.set(0, 0, 0);
      sceneStateRef.current.bondsGroup.rotation.set(0, 0, 0);
      sceneStateRef.current.freeParticlesGroup.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-white space-y-4 overflow-hidden relative">
      {/* Top Header & Mode Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-2 text-white">
              {langMode === 'bn' ? '৩-ডি সিলিকন ক্রিস্টাল ল্যাটিস ও ডোপিং সিমুলেটর' : '3D Silicon Crystal Lattice & Doping Simulator'}
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Three.js WebGL
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {langMode === 'bn'
                ? 'মাউস টেনে ৩৬০° ঘুরিয়ে টেট্রাহেড্রাল সমযোজী বন্ধন ও ক্যারিয়ার জেনারেশন দেখুন'
                : 'Drag with mouse/touch to rotate 360° and observe tetrahedral covalent sharing'}
            </p>
          </div>
        </div>

        {/* Camera and Rotation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isRotating
                ? 'bg-indigo-600/40 border-indigo-400 text-indigo-200'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Auto-rotate 3D Lattice"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Rotating' : 'Paused'}</span>
          </button>
          <button
            onClick={() => setShowBondLines(!showBondLines)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              showBondLines
                ? 'bg-sky-600/40 border-sky-400 text-sky-200'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Covalent Bond Lines"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showBondLines ? 'Bonds ON' : 'Bonds OFF'}</span>
          </button>
          <button
            onClick={resetCamera}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition text-xs"
            title="Reset Camera View"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="relative w-full h-[440px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-inner flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Overlay HUD: Live Carrier Counter */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-xs space-y-1.5 shadow-lg pointer-events-none">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 font-medium">Lattice Type:</span>
            <span className="font-bold text-sky-400 capitalize">
              {dopingType === 'pure' ? 'Pure Si (Diamond)' : dopingType === 'n_type' ? 'N-Type (P-Doped)' : 'P-Type (B-Doped)'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block shadow-xs"></span>
              Free Electrons ($n$):
            </span>
            <span className="font-mono font-bold text-yellow-400">{freeElectronsCount}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-pink-400 inline-block shadow-xs"></span>
              Mobile Holes ($p$):
            </span>
            <span className="font-mono font-bold text-pink-400">{holesCount}</span>
          </div>
          <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-4 text-[11px]">
            <span className="text-slate-500">Temp:</span>
            <span className="font-mono font-bold text-amber-400">{temperatureK} K ({temperatureK - 273}°C)</span>
          </div>
        </div>

        {/* Legend on Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-[11px] space-y-1 hidden sm:block pointer-events-none">
          <span className="text-slate-400 font-bold uppercase text-[9px] block">3D Color Legend:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400 shadow-xs"></span>
            <span>Silicon Atoms (Valence = 4)</span>
          </div>
          {dopingType === 'n_type' && (
            <div className="flex items-center gap-2 text-orange-400 font-bold">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-xs"></span>
              <span>Phosphorus Dopant (Valence = 5)</span>
            </div>
          )}
          {dopingType === 'p_type' && (
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-xs"></span>
              <span>Boron Dopant (Valence = 3)</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-yellow-400">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-xs"></span>
            <span>Conduction Electron ($e^-$)</span>
          </div>
          <div className="flex items-center gap-2 text-pink-400">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-pink-400 shadow-xs"></span>
            <span>Valence Hole ($h^+$)</span>
          </div>
        </div>
      </div>

      {/* Interactive Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
        {/* 1. Doping Material Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>{langMode === 'bn' ? 'ক্রিস্টাল ডোপিং নির্বাচন করুন:' : 'Select Crystal Doping Material:'}</span>
            <span className="text-[11px] text-indigo-400 font-mono">Topics 1-5</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                playMechanicalClick();
                setDopingType('pure');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                dopingType === 'pure'
                  ? 'bg-sky-600/30 border-sky-400 text-sky-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-sm">💎 Pure Si</span>
              <span className="text-[10px] text-slate-400">Intrinsic ($n=p=n_i$)</span>
            </button>

            <button
              onClick={() => {
                playMechanicalClick();
                setDopingType('n_type');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                dopingType === 'n_type'
                  ? 'bg-orange-600/30 border-orange-400 text-orange-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-sm">⚡ N-Type</span>
              <span className="text-[10px] text-orange-400">Phosphorus (+5)</span>
            </button>

            <button
              onClick={() => {
                playMechanicalClick();
                setDopingType('p_type');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                dopingType === 'p_type'
                  ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-sm">🟣 P-Type</span>
              <span className="text-[10px] text-purple-400">Boron (+3)</span>
            </button>
          </div>
        </div>

        {/* 2. Thermal Energy & Temperature Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              {langMode === 'bn' ? 'তাপমাত্রা ও তাপীয় শক্তি (Thermal Energy):' : 'Lattice Temperature (Thermal Energy):'}
            </span>
            <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              {temperatureK} K ({temperatureK - 273}°C)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="450"
            step="10"
            value={temperatureK}
            onChange={(e) => setTemperatureK(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 K (Absolute Zero)</span>
            <span>300 K (Room Temp)</span>
            <span>450 K (High Thermal Breakage)</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-snug">
            {temperatureK <= 77
              ? (langMode === 'bn' ? '❄️ পরম শূন্য তাপমাত্রায় সমস্ত সমযোজী বন্ধন অক্ষত থাকে। পরিবাহিতা শূন্য।' : '❄️ Near 0K: Covalent bonds are rigid. Zero thermal carriers, insulator behavior.')
              : temperatureK <= 320
              ? (langMode === 'bn' ? '🌡️ কক্ষ তাপমাত্রায় (300K) তাপীয় কম্পনের ফলে কিছু সমযোজী বন্ধন ভেঙে ইলেকট্রন-হোল জোড়া মুক্ত হয়।' : '🌡️ At room temperature (300K), thermal energy kT creates intrinsic electron-hole pairs.')
              : (langMode === 'bn' ? '🔥 উচ্চ তাপমাত্রায় অতিরিক্ত বন্ধন ভাঙন ঘটে, যার ফলে তীব্র ক্যারিয়ার প্রবাহ ও ল্যাটিস কম্পন দেখা দেয়।' : '🔥 High temperature causes vigorous lattice vibration and rapid covalent bond ruptures.')}
          </p>
        </div>
      </div>
    </div>
  );
}
