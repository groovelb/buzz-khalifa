
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Html } from '@react-three/drei';
import * as THREE from 'three';

// Spire sits on top of Crown structure
// Crown is at: BUILDING_HEIGHT (10.4) + 0.5 + CROWN_HEIGHT (4.0) = 14.9
const CROWN_TOTAL_HEIGHT = 14.9;
const SPIRE_BASE_Y = CROWN_TOTAL_HEIGHT;

const Spire: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const spireRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const beacon1Ref = useRef<THREE.Mesh>(null);
  const beacon2Ref = useRef<THREE.Mesh>(null);

  // Brushed steel material for main spire
  const steelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d8dce0'),
      metalness: 0.85,
      roughness: 0.25,
    });
  }, []);

  // Polished steel for decorative elements
  const polishedSteelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e5e8eb'),
      metalness: 0.95,
      roughness: 0.1,
    });
  }, []);

  // Antenna material - lighter steel
  const antennaMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f0f2f4'),
      metalness: 0.9,
      roughness: 0.15,
    });
  }, []);

  useFrame((state) => {
    const offset = scroll.offset;
    // Phase 6: 0.857 - 1.0 (final phase)
    const isVisible = offset > 0.82;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.857) / 0.143));

    // Already at night in Phase 6, beacon should be bright
    const nightProgress = Math.min(1, localProgress * 2);

    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    if (spireRef.current && isVisible) {
      // Spire descends from sky onto Crown
      const targetY = THREE.MathUtils.lerp(SPIRE_BASE_Y + 15, SPIRE_BASE_Y, Math.min(localProgress * 1.8, 1));
      spireRef.current.position.y = targetY;

      // Scale in
      const scale = Math.min(localProgress * 2.5, 1);
      spireRef.current.scale.setScalar(scale);
    }

    // Aviation beacon blinking effect (bright at night)
    if (beacon1Ref.current && beacon2Ref.current) {
      const mat1 = beacon1Ref.current.material as THREE.MeshStandardMaterial;
      const mat2 = beacon2Ref.current.material as THREE.MeshStandardMaterial;

      // Full intensity at night
      const baseIntensity = 1.0 + nightProgress * 1.0;

      // Fast blinking at night
      const blinkSpeed = 4;
      const blink1 = Math.sin(state.clock.elapsedTime * blinkSpeed) * 0.5 + 0.5;
      const blink2 = Math.sin(state.clock.elapsedTime * blinkSpeed + Math.PI) * 0.5 + 0.5;

      mat1.emissiveIntensity = baseIntensity * blink1;
      mat2.emissiveIntensity = baseIntensity * blink2 * 0.6;
    }

    // Label visibility - Phase 6 is 0.857 - 1.0
    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.88 && offset < 0.98) ? '1' : '0';
    }
  });

  // Spire segments - telescopic steel structure
  const spireSegments = useMemo(() => [
    { height: 1.5, radiusBottom: 0.38, radiusTop: 0.32, y: 0 },
    { height: 1.2, radiusBottom: 0.32, radiusTop: 0.26, y: 1.5 },
    { height: 1.0, radiusBottom: 0.26, radiusTop: 0.20, y: 2.7 },
    { height: 0.8, radiusBottom: 0.20, radiusTop: 0.14, y: 3.7 },
    { height: 0.6, radiusBottom: 0.14, radiusTop: 0.08, y: 4.5 },
  ], []);

  // Antenna segments
  const antennaSegments = useMemo(() => [
    { height: 1.2, radiusBottom: 0.05, radiusTop: 0.035, y: 5.1 },
    { height: 1.0, radiusBottom: 0.035, radiusTop: 0.02, y: 6.3 },
    { height: 0.8, radiusBottom: 0.02, radiusTop: 0.01, y: 7.3 },
  ], []);

  return (
    <group ref={groupRef} visible={false}>
      <group ref={spireRef} position={[0, 20, 0]} scale={0}>
        {/* Main Spire Structure - Structural Steel */}
        {spireSegments.map((seg, i) => (
          <mesh
            key={`spire-seg-${i}`}
            position={[0, seg.y + seg.height / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[seg.radiusTop, seg.radiusBottom, seg.height, 24]} />
            <primitive object={steelMaterial} attach="material" />
          </mesh>
        ))}

        {/* Decorative transition rings */}
        {[1.5, 2.7, 3.7, 4.5].map((y, i) => (
          <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.30 - i * 0.05, 0.02, 12, 32]} />
            <primitive object={polishedSteelMaterial} attach="material" />
          </mesh>
        ))}

        {/* Vertical support struts (architectural detail) */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <mesh
            key={`strut-${i}`}
            position={[
              Math.sin(THREE.MathUtils.degToRad(angle)) * 0.25,
              2.5,
              Math.cos(THREE.MathUtils.degToRad(angle)) * 0.25,
            ]}
          >
            <boxGeometry args={[0.015, 4, 0.015]} />
            <meshStandardMaterial
              color="#c0c5ca"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Antenna Assembly */}
        {antennaSegments.map((seg, i) => (
          <mesh
            key={`antenna-${i}`}
            position={[0, seg.y + seg.height / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[seg.radiusTop, seg.radiusBottom, seg.height, 16]} />
            <primitive object={antennaMaterial} attach="material" />
          </mesh>
        ))}

        {/* Antenna tip beacon - aviation warning light */}
        <mesh ref={beacon1Ref} position={[0, 8.2, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Secondary beacon */}
        <mesh ref={beacon2Ref} position={[0, 6.8, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff0000"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Beacon glow (visible at night) */}
        <pointLight
          position={[0, 8.2, 0]}
          color="#ff3333"
          intensity={0.5}
          distance={3}
        />
      </group>

      {/* Phase Label */}
      <Html position={[0, 26, 0]} center>
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

export default Spire;
