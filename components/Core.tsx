
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

const Core: React.FC = () => {
  const scroll = useScroll();
  const coreRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // High-strength concrete core material
  const coreMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e8e8e5'),
      roughness: 0.75,
      metalness: 0.02,
    });
  }, []);

  // Elevator shaft interior - darker
  const shaftMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#404040'),
      roughness: 0.9,
      metalness: 0.1,
    });
  }, []);

  useFrame(() => {
    const offset = scroll.offset;

    // Phase 2: 0.143 - 0.286 (1/7)
    const isVisible = offset >= 0.12;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.143) / 0.143));

    if (coreRef.current) {
      coreRef.current.visible = isVisible;
      if (isVisible) {
        coreRef.current.scale.y = Math.max(0.001, localProgress * 10);
        coreRef.current.position.y = 0.5;
      }
    }

    if (labelRef.current) {
      // Phase 2 label: visible from 15% to 26%
      labelRef.current.style.opacity = (offset > 0.15 && offset < 0.26) ? "1" : "0";
    }
  });

  return (
    <group>
      <group ref={coreRef} visible={false}>
        {/* Y-Shaped Core: 3 wings - concrete shear walls */}
        {[0, 120, 240].map((angle, i) => (
          <group key={i} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
            {/* Main core wall */}
            <RoundedBox
              args={[0.7, 1, 1.4]}
              radius={0.04}
              smoothness={4}
              position={[0, 0.5, 0.55]}
              castShadow
              receiveShadow
              material={coreMaterial}
            />

            {/* Vertical construction joint detail */}
            <mesh position={[0, 0.5, 1.26]}>
              <boxGeometry args={[0.6, 1, 0.02]} />
              <meshStandardMaterial
                color="#d5d5d0"
                roughness={0.95}
                metalness={0}
              />
            </mesh>
          </group>
        ))}

        {/* Central Hub - elevator core */}
        <RoundedBox
          args={[0.9, 1, 0.9]}
          radius={0.08}
          smoothness={4}
          position={[0, 0.5, 0]}
          castShadow
          receiveShadow
          material={coreMaterial}
        />

        {/* Elevator shaft openings (3 sides) */}
        {[0, 120, 240].map((angle, i) => (
          <mesh
            key={`shaft-${i}`}
            position={[
              Math.sin(THREE.MathUtils.degToRad(angle)) * 0.35,
              0.5,
              Math.cos(THREE.MathUtils.degToRad(angle)) * 0.35,
            ]}
            rotation={[0, THREE.MathUtils.degToRad(-angle), 0]}
          >
            <boxGeometry args={[0.25, 0.95, 0.1]} />
            <meshStandardMaterial {...shaftMaterial} />
          </mesh>
        ))}
      </group>

      <Html position={[0, 5, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-blue-100 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Phase 02: Central Core</span>
        </div>
      </Html>
    </group>
  );
};

export default Core;
