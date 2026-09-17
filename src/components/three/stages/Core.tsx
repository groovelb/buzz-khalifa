
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BUILDING, WING_ANGLES, COLORS } from '@/data/burjKhalifaData';
import { PHASES } from '@/data/scrollConfig';

/**
 * Core Component - Phase 2: Central Core
 * The massive hexagonal concrete core that forms the structural spine
 * Y-shaped cross-section with 3 wings at 120° intervals
 *
 * Height: 7 units (increased from 3)
 * This represents the foundation structure up to ~Tier 3 (120m in reality)
 */
export const Core: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // High-strength concrete core material - 세련된 쿨 그레이
  const coreMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.CONCRETE),
      roughness: 0.68,
      metalness: 0.10,
    });
  }, []);

  // Darker material for recessed areas - 깊이감 있는 음영
  const recessMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.CONCRETE_DARK),
      roughness: 0.75,
      metalness: 0.06,
    });
  }, []);

  // 알루미늄 프레임 재질 (날개 끝) - 광택 강화
  const aluminumMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.ALUMINUM),
      roughness: 0.22,
      metalness: 0.92,
    });
  }, []);

  useFrame(() => {
    const offset = scroll.offset;
    const { start, end } = PHASES.CORE;

    const isVisible = offset >= start - 0.02;
    const localProgress = Math.max(0, Math.min(1, (offset - start) / (end - start)));

    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    if (coreRef.current) {
      // Core rises dramatically - now 7 units tall
      const targetHeight = localProgress * BUILDING.CORE_HEIGHT;
      coreRef.current.scale.y = Math.max(0.001, targetHeight);
      coreRef.current.position.y = 0.5;
    }

    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.15 && offset < 0.26) ? '1' : '0';
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <group ref={coreRef}>
        {/* Central hexagonal hub - elevator core - 비율 수정 (더 가늘게) */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[BUILDING.CORE_RADIUS, BUILDING.CORE_RADIUS * 1.2, 1, 6]} />
          <primitive object={coreMaterial} attach="material" />
        </mesh>

        {/* Y-Shaped wings extending from central core - 비율 수정 */}
        {WING_ANGLES.map((angle, i) => (
          <group key={i} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
            {/* Main wing structure - 새로운 비율 적용 */}
            <RoundedBox
              args={[BUILDING.BASE_WING_WIDTH, 1, BUILDING.BASE_WING_LENGTH * 0.8]}
              radius={0.03}
              smoothness={4}
              position={[0, 0.5, BUILDING.BASE_WING_LENGTH * 0.4]}
              castShadow
              receiveShadow
              material={coreMaterial}
            />

            {/* Wing tip - lobular shape - 알루미늄 프레임 */}
            <mesh position={[0, 0.5, BUILDING.BASE_WING_LENGTH * 0.85]} castShadow>
              <cylinderGeometry args={[BUILDING.BASE_WING_WIDTH * 0.35, BUILDING.BASE_WING_WIDTH * 0.45, 1, 12]} />
              <primitive object={aluminumMaterial} attach="material" />
            </mesh>

            {/* Vertical recess line (construction joint detail) */}
            <mesh position={[0, 0.5, BUILDING.BASE_WING_LENGTH * 0.25]}>
              <boxGeometry args={[0.07, 0.98, BUILDING.BASE_WING_LENGTH * 0.5]} />
              <primitive object={recessMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Floor slab markers */}
        {[0.15, 0.30, 0.45, 0.60, 0.75, 0.90].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[BUILDING.CORE_RADIUS * 0.9, BUILDING.CORE_RADIUS * 1.3, 6]} />
            <meshStandardMaterial
              color={COLORS.CONCRETE_DARK}
              roughness={0.9}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Phase Label */}
      <Html position={[0, 8, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-blue-100 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Phase 02: Central Core
          </span>
        </div>
      </Html>
    </group>
  );
};
