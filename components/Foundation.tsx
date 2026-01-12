
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BUILDING, COLORS } from './BurjKhalifaData';
import { getDayNightState } from '../hooks/useDayNight';

// 기초 크기 (건물 비율에 맞게 축소)
const FOUNDATION_SIZE = BUILDING.BASE_WING_LENGTH * 1.8;  // ~3.6

const Foundation: React.FC = () => {
  const scroll = useScroll();
  const matRef = useRef<THREE.Mesh>(null);
  const pilesRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const uplightRefs = useRef<THREE.PointLight[]>([]);

  // Reinforced concrete mat material - 세련된 콘크리트 질감
  const matMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.FOUNDATION),
      roughness: 0.82,
      metalness: 0.06,
    });
  }, []);

  // Concrete pile material - 깊이감 있는 어두운 콘크리트
  const pileMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.FOUNDATION_DARK),
      roughness: 0.78,
      metalness: 0.05,
    });
  }, []);

  useFrame(() => {
    const offset = scroll.offset;
    // Phase 1: 0 - 0.143 (1/7)
    const progress = Math.min(1, offset / 0.143);

    // 낮/밤 상태 계산
    const dayNight = getDayNightState(offset);

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

    // 외부 업라이트 - 밤에 건물 하부 조명
    uplightRefs.current.forEach((light, index) => {
      if (light) {
        // 밤 강도에 따라 켜짐
        const baseIntensity = dayNight.nightIntensity * 2.5;
        // 약간의 변화를 주어 자연스럽게
        const variation = Math.sin(Date.now() * 0.001 + index * 0.5) * 0.1 + 1;
        light.intensity = baseIntensity * variation;

        // 밤에는 따뜻한 색상으로
        if (dayNight.nightIntensity > 0.5) {
          light.color.setHex(0xFFE8D0);  // 따뜻한 백색
        } else {
          light.color.setHex(0xFFF5E6);  // 기본 백색
        }
      }
    });

    if (labelRef.current) {
      // Phase 1 label: visible from 2% to 12%
      labelRef.current.style.opacity = (offset > 0.02 && offset < 0.12) ? "1" : "0";
    }
  });

  // Create a grid of piles - Y-shaped pattern to match Burj Khalifa (비율 수정)
  const pileGrid = useMemo(() => {
    const piles: JSX.Element[] = [];
    const spacing = 0.22;
    const count = 5;
    const maxDist = FOUNDATION_SIZE / 2 - 0.2;

    for (let x = -count; x <= count; x++) {
      for (let z = -count; z <= count; z++) {
        const dist = Math.sqrt((x * spacing) ** 2 + (z * spacing) ** 2);
        if (dist < maxDist) {
          piles.push(
            <Pile
              key={`${x}-${z}`}
              position={[x * spacing, -0.8, z * spacing]}
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
      {/* Main Concrete Mat Foundation - 비율 수정 */}
      <RoundedBox
        ref={matRef}
        args={[FOUNDATION_SIZE, 0.4, FOUNDATION_SIZE]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.2, 0]}
        castShadow
        receiveShadow
        material={matMaterial}
      />

      {/* Mat surface detail - construction joints */}
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[FOUNDATION_SIZE * 0.95, FOUNDATION_SIZE * 0.95]} />
        <meshStandardMaterial
          color={COLORS.CONCRETE_DARK}
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
            Math.cos(THREE.MathUtils.degToRad(angle)) * (FOUNDATION_SIZE / 2 + 0.3),
            0.1,
            Math.sin(THREE.MathUtils.degToRad(angle)) * (FOUNDATION_SIZE / 2 + 0.3),
          ]}
          color="#fff5e6"
          intensity={0}
          distance={6}
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
      args={[0.08, 1.5, 0.08]}
      radius={0.015}
      smoothness={2}
      position={position}
      castShadow
      material={material}
    />
  );
};

export default Foundation;
