
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Html } from '@react-three/drei';
import * as THREE from 'three';

// Calculate total height from Setbacks tiers
const SETBACKS_TOTAL_HEIGHT = 10.4;
const SPIRE_BASE_Y = SETBACKS_TOTAL_HEIGHT + 0.5;

const Spire: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const spireRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const offset = scroll.offset;
    const isVisible = offset > 0.78;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.8) / 0.2));

    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    if (spireRef.current && isVisible) {
      // Spire descends from sky
      const targetY = THREE.MathUtils.lerp(20, SPIRE_BASE_Y, Math.min(localProgress * 1.5, 1));
      spireRef.current.position.y = targetY;

      // Scale in
      const scale = Math.min(localProgress * 2, 1);
      spireRef.current.scale.setScalar(scale);
    }

    // Label visibility
    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.82 && offset < 0.98) ? '1' : '0';
    }
  });

  // Spire segments - tapered design
  const spireSegments = useMemo(() => [
    { height: 1.5, radiusBottom: 0.4, radiusTop: 0.35, y: 0 },
    { height: 1.2, radiusBottom: 0.35, radiusTop: 0.28, y: 1.5 },
    { height: 1.0, radiusBottom: 0.28, radiusTop: 0.2, y: 2.7 },
    { height: 0.8, radiusBottom: 0.2, radiusTop: 0.12, y: 3.7 },
    { height: 0.6, radiusBottom: 0.12, radiusTop: 0.06, y: 4.5 },
    { height: 1.5, radiusBottom: 0.04, radiusTop: 0.02, y: 5.1 },
    { height: 1.0, radiusBottom: 0.025, radiusTop: 0.015, y: 6.6 },
  ], []);

  return (
    <group ref={groupRef} visible={false}>
      <group ref={spireRef} position={[0, 20, 0]} scale={0}>
        {/* Main Spire Structure */}
        {spireSegments.map((seg, i) => (
          <mesh
            key={`spire-seg-${i}`}
            position={[0, seg.y + seg.height / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[seg.radiusTop, seg.radiusBottom, seg.height, 16]} />
            <meshStandardMaterial
              color="#f0f0f0"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        ))}

        {/* Decorative rings */}
        {[1.5, 2.7, 3.7].map((y, i) => (
          <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32 - i * 0.06, 0.025, 8, 24]} />
            <meshStandardMaterial color="#d0d0d0" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}

        {/* Antenna tip */}
        <mesh position={[0, 7.8, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#ff6b6b"
            emissive="#ff4444"
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* Phase Label */}
      <Html position={[0, 20, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-amber-100 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Phase 05: The Spire
          </span>
        </div>
      </Html>
    </group>
  );
};

export default Spire;
