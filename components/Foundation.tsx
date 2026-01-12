
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

const Foundation: React.FC = () => {
  const scroll = useScroll();
  const matRef = useRef<THREE.Mesh>(null);
  const pilesRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const uplightRefs = useRef<THREE.PointLight[]>([]);

  // Reinforced concrete mat material
  const matMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c9cdd1'),
      roughness: 0.95,
      metalness: 0.0,
    });
  }, []);

  // Concrete pile material - slightly darker
  const pileMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8b9298'),
      roughness: 0.9,
      metalness: 0.05,
    });
  }, []);

  useFrame(() => {
    const offset = scroll.offset;
    // Phase 1: 0 - 0.143 (1/7)
    const progress = Math.min(1, offset / 0.143);

    // Night progress for exterior lighting (starts at ~60% scroll)
    const nightProgress = Math.max(0, Math.min(1, (offset - 0.6) / 0.3));

    if (matRef.current) {
      const matScale = THREE.MathUtils.smoothstep(progress, 0, 0.5);
      matRef.current.scale.set(matScale, matScale, matScale);
      matRef.current.position.y = 0.25 + (1 - matScale) * -1;
    }

    if (pilesRef.current) {
      const pilesProgress = THREE.MathUtils.smoothstep(progress, 0.4, 1);
      pilesRef.current.position.y = (1 - pilesProgress) * -2;
      pilesRef.current.visible = pilesProgress > 0.01;
    }

    // Exterior uplights turn on at night
    uplightRefs.current.forEach((light) => {
      if (light) {
        light.intensity = nightProgress * 2;
      }
    });

    if (labelRef.current) {
      // Phase 1 label: visible from 2% to 12%
      labelRef.current.style.opacity = (offset > 0.02 && offset < 0.12) ? "1" : "0";
    }
  });

  // Create a grid of piles - Y-shaped pattern to match Burj Khalifa
  const pileGrid = useMemo(() => {
    const piles: JSX.Element[] = [];
    const spacing = 0.28;
    const count = 6;

    for (let x = -count; x <= count; x++) {
      for (let z = -count; z <= count; z++) {
        const dist = Math.sqrt(x * x + z * z);
        if (dist < 6.5) {
          piles.push(
            <Pile
              key={`${x}-${z}`}
              position={[x * spacing, -1, z * spacing]}
              material={pileMaterial}
            />
          );
        }
      }
    }
    return piles;
  }, [pileMaterial]);

  return (
    <group>
      {/* Main Concrete Mat Foundation */}
      <RoundedBox
        ref={matRef}
        args={[4, 0.5, 4]}
        radius={0.08}
        smoothness={4}
        position={[0, 0.25, 0]}
        castShadow
        receiveShadow
        material={matMaterial}
      />

      {/* Mat surface detail - construction joints */}
      <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 3.8]} />
        <meshStandardMaterial
          color="#b8bcc0"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Piling System */}
      <group ref={pilesRef}>
        {pileGrid}
      </group>

      {/* Phase Label */}
      <Html position={[0, 2, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Phase 01: Foundation</span>
        </div>
      </Html>

      {/* Exterior uplights - building base illumination at night */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <pointLight
          key={`uplight-${i}`}
          ref={(el) => { if (el) uplightRefs.current[i] = el; }}
          position={[
            Math.cos(THREE.MathUtils.degToRad(angle)) * 2.5,
            0.1,
            Math.sin(THREE.MathUtils.degToRad(angle)) * 2.5,
          ]}
          color="#fff5e6"
          intensity={0}
          distance={8}
          decay={2}
        />
      ))}
    </group>
  );
};

interface PileProps {
  position: [number, number, number];
  material: THREE.Material;
}

const Pile: React.FC<PileProps> = ({ position, material }) => {
  return (
    <RoundedBox
      args={[0.12, 2, 0.12]}
      radius={0.02}
      smoothness={2}
      position={position}
      castShadow
      material={material}
    />
  );
};

export default Foundation;
