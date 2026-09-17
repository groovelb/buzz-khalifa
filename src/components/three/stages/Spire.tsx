
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingProgress } from '@/components/three/BuildingProgressContext';
import { BUILDING, COLORS } from '@/data/burjKhalifaData';
import { PHASES } from '@/data/scrollConfig';
import { UPPER_TOWER_TOP_Y } from './Illumination';
import { getDayNightState } from '@/hooks/useDayNight';

/**
 * Spire Component - Phase 6: The Spire
 * The iconic telescopic spire crowning the Burj Khalifa
 * 14.8% of total building height (8 units out of 55) - accurate to real proportions
 * Features: Tapered steel structure, aviation beacons, antenna
 * Dramatic final reveal - the crowning achievement
 *
 * Real Burj Khalifa: Spire is 122m out of 829.8m total (14.7%)
 * Model: 8 units out of 55 units total (14.5%)
 */

const SPIRE_BASE_Y = UPPER_TOWER_TOP_Y;
const SPIRE_HEIGHT = BUILDING.SPIRE_HEIGHT; // 8 units (reduced from 13)

export const Spire: React.FC = () => {
  const buildingProgress = useBuildingProgress();
  const groupRef = useRef<THREE.Group>(null);
  const spireRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const beacon1Ref = useRef<THREE.Mesh>(null);
  const beacon2Ref = useRef<THREE.Mesh>(null);
  const beacon3Ref = useRef<THREE.Mesh>(null);

  // Brushed steel material - 세련된 브러시드 스틸
  const steelMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(COLORS.STEEL),
      metalness: 0.94,
      roughness: 0.22,
      clearcoat: 0.35,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.4,
    });
  }, []);

  // Polished steel for decorative rings - 고광택 크롬 효과
  const polishedSteelMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(COLORS.STEEL_POLISHED),
      metalness: 0.98,
      roughness: 0.04,
      clearcoat: 0.65,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.8,
    });
  }, []);

  // Antenna material - 밝고 깨끗한 알루미늄
  const antennaMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(COLORS.ALUMINUM_LIGHT),
      metalness: 0.96,
      roughness: 0.08,
      clearcoat: 0.55,
      clearcoatRoughness: 0.10,
      envMapIntensity: 1.6,
    });
  }, []);

  // Spire segments - telescopic tapered structure (6 segments)
  // 비율 수정: 반경 50% 축소 (가늘고 높은 비율에 맞춤)
  const spireSegments = useMemo(() => [
    { height: 1.5,  radiusBottom: 0.25, radiusTop: 0.21, y: 0 },     // Base - concrete-steel transition
    { height: 1.3,  radiusBottom: 0.21, radiusTop: 0.17, y: 1.5 },   // Seg 1
    { height: 1.1,  radiusBottom: 0.17, radiusTop: 0.13, y: 2.8 },   // Seg 2
    { height: 0.9,  radiusBottom: 0.13, radiusTop: 0.09, y: 3.9 },   // Seg 3
    { height: 0.8,  radiusBottom: 0.09, radiusTop: 0.06, y: 4.8 },   // Seg 4
    { height: 0.7,  radiusBottom: 0.06, radiusTop: 0.03, y: 5.6 },   // Seg 5
  ], []);

  // Antenna segments - final ~1.7 units of height (비율 수정)
  const antennaSegments = useMemo(() => [
    { height: 1.0,  radiusBottom: 0.03, radiusTop: 0.01, y: 6.3 },   // Antenna main
    { height: 0.7,  radiusBottom: 0.01, radiusTop: 0.003, y: 7.3 },  // Antenna tip
  ], []);

  // Decorative ring positions (at segment transitions)
  const ringPositions = useMemo(() => [1.5, 2.8, 3.9, 4.8, 5.6, 6.3], []);

  useFrame((state) => {
    const offset = buildingProgress.current;
    const { start, end } = PHASES.SPIRE;

    const isVisible = offset > start - 0.02;
    const localProgress = Math.max(0, Math.min(1, (offset - start) / (end - start)));

    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    if (spireRef.current) {
      // Spire descends from above - dramatic crane lowering effect
      const targetY = THREE.MathUtils.lerp(SPIRE_BASE_Y + 20, SPIRE_BASE_Y, Math.min(localProgress * 1.8, 1));
      spireRef.current.position.y = targetY;

      // Scale in with slight bounce effect
      const rawScale = Math.min(localProgress * 2.2, 1);
      const scale = rawScale > 0.9 ? 1 + (rawScale - 0.9) * 0.5 * Math.sin((rawScale - 0.9) * 30) : rawScale;
      spireRef.current.scale.setScalar(Math.max(0, scale));
    }

    // 낮/밤 상태
    const dayNight = getDayNightState(offset);
    const time = state.clock.elapsedTime;

    // Aviation beacon - 단순한 빨간색 깜빡임 (밤에 더 밝게)
    if (beacon1Ref.current && beacon2Ref.current && beacon3Ref.current) {
      const mat1 = beacon1Ref.current.material as THREE.MeshStandardMaterial;
      const mat2 = beacon2Ref.current.material as THREE.MeshStandardMaterial;
      const mat3 = beacon3Ref.current.material as THREE.MeshStandardMaterial;

      const blinkSpeed = 4;
      const blink1 = Math.sin(time * blinkSpeed) * 0.5 + 0.5;
      const blink2 = Math.sin(time * blinkSpeed + Math.PI * 0.66) * 0.5 + 0.5;
      const blink3 = Math.sin(time * blinkSpeed + Math.PI * 1.33) * 0.5 + 0.5;

      // 밤에는 더 밝은 발광 (bloom 유도)
      const nightBoost = 1 + dayNight.nightIntensity * 2;

      mat1.emissiveIntensity = localProgress * 3.0 * blink1 * nightBoost;
      mat2.emissiveIntensity = localProgress * 2.5 * blink2 * nightBoost;
      mat3.emissiveIntensity = localProgress * 2.0 * blink3 * nightBoost;
    }

    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.88 && offset < 0.98) ? '1' : '0';
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <group ref={spireRef} position={[0, SPIRE_BASE_Y + 20, 0]} scale={0}>
        {/* Main Spire Structure - Telescopic segments */}
        {spireSegments.map((seg, i) => (
          <mesh
            key={`spire-seg-${i}`}
            position={[0, seg.y + seg.height / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[seg.radiusTop, seg.radiusBottom, seg.height, 16]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
        ))}

        {/* Decorative transition rings - 비율 수정 */}
        {ringPositions.map((y, i) => (
          <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.21 - i * 0.03, 0.008, 8, 24]} />
            <primitive object={polishedSteelMaterial} attach="material" />
          </mesh>
        ))}

        {/* Vertical support struts - structural detail (비율 수정) */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <mesh
            key={`strut-${i}`}
            position={[
              Math.sin(THREE.MathUtils.degToRad(angle)) * 0.11,
              3.0,
              Math.cos(THREE.MathUtils.degToRad(angle)) * 0.11,
            ]}
          >
            <boxGeometry args={[0.006, 5.5, 0.006]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
        ))}

        {/* Cross bracing for structural realism (비율 수정) */}
        {[0, 120, 240].map((angle, i) => (
          <group key={`brace-${i}`} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
            <mesh position={[0.09, 2, 0]} rotation={[0, 0, Math.PI / 6]}>
              <boxGeometry args={[0.004, 1.8, 0.004]} />
              <primitive object={steelMaterial} attach="material" />
            </mesh>
            <mesh position={[0.09, 4.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.004, 1.8, 0.004]} />
              <primitive object={steelMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Antenna Assembly */}
        {antennaSegments.map((seg, i) => (
          <mesh
            key={`antenna-${i}`}
            position={[0, seg.y + seg.height / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[seg.radiusTop, seg.radiusBottom, seg.height, 12]} />
            <primitive object={antennaMaterial} attach="material" />
          </mesh>
        ))}

        {/* Antenna tip beacon - primary aviation warning light (비율 수정) */}
        <mesh ref={beacon1Ref} position={[0, SPIRE_HEIGHT, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff0000"
            emissiveIntensity={0}
          />
        </mesh>

        {/* Secondary beacon - mid spire */}
        <mesh ref={beacon2Ref} position={[0, 5.2, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff0000"
            emissiveIntensity={0}
          />
        </mesh>

        {/* Tertiary beacon - lower spire */}
        <mesh ref={beacon3Ref} position={[0, 3.2, 0]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff0000"
            emissiveIntensity={0}
          />
        </mesh>

        {/* Beacon glow lights */}
        <pointLight
          position={[0, SPIRE_HEIGHT, 0]}
          color="#ff3333"
          intensity={1.0}
          distance={6}
          decay={2}
        />
        <pointLight
          position={[0, 5.2, 0]}
          color="#ff3333"
          intensity={0.5}
          distance={3}
          decay={2}
        />
      </group>

      {/* Phase Label */}
      <Html position={[0, SPIRE_BASE_Y + SPIRE_HEIGHT + 3, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-black/80 px-6 py-3 rounded-full shadow-2xl border border-yellow-500/50 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50" />
          <span className="text-md font-extrabold text-yellow-100 uppercase tracking-widest">
            Phase 06: The Spire
          </span>
        </div>
      </Html>
    </group>
  );
};
