
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { tierData } from './Setbacks';

// Glass curtain wall offset to prevent Z-fighting with Setbacks
const GLASS_OFFSET = 0.08;

// Window light colors for night effect
const WINDOW_LIGHT_COLORS = [
  '#fff8dc', // Warm white
  '#ffe4b5', // Moccasin
  '#ffd700', // Gold
  '#87ceeb', // Light blue (cool office)
];

const Cladding: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const windowLightRefs = useRef<(THREE.Mesh | null)[]>([]);

  const tiers = useMemo(() => {
    let currentY = 0.5;
    return tierData.map((tier) => {
      const pos = [0, currentY, 0] as [number, number, number];
      currentY += tier.height;
      return { ...tier, position: pos };
    });
  }, []);

  // Pre-generate which windows are "lit" (random pattern)
  const litWindows = useMemo(() => {
    const pattern: boolean[] = [];
    const totalWindows = tiers.length * 3 * 3; // tiers * wings * floors per tier
    for (let i = 0; i < totalWindows; i++) {
      // 70% of windows are lit at night
      pattern.push(Math.random() > 0.3);
    }
    return pattern;
  }, [tiers.length]);

  // Random light colors for each window
  const windowColors = useMemo(() => {
    return litWindows.map(() =>
      WINDOW_LIGHT_COLORS[Math.floor(Math.random() * WINDOW_LIGHT_COLORS.length)]
    );
  }, [litWindows]);

  useFrame(() => {
    const offset = scroll.offset;
    // Phase 4: 0.429 - 0.571 (1/7)
    const isVisible = offset > 0.40;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.429) / 0.142));

    // Night lighting intensity (starts at ~60% scroll)
    const nightProgress = Math.max(0, Math.min(1, (offset - 0.6) / 0.35));

    if (groupRef.current) groupRef.current.visible = isVisible;

    // Animate each tier
    tiers.forEach((tier, index) => {
      const threshold = index / tiers.length;
      const tierProgress = Math.max(0, Math.min(1, (localProgress - threshold) * tiers.length * 1.5));

      // Update glass meshes for this tier (3 wings per tier)
      for (let wingIdx = 0; wingIdx < 3; wingIdx++) {
        const meshIndex = index * 3 + wingIdx;
        const mesh = meshRefs.current[meshIndex];
        if (mesh) {
          const targetScale = tierProgress > 0 ? 1 : 0;
          mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetScale, 0.1);
          mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.1);
          mesh.scale.z = THREE.MathUtils.lerp(mesh.scale.z, targetScale, 0.1);
        }
      }
    });

    // Update window lights based on night progress
    windowLightRefs.current.forEach((light, i) => {
      if (light && litWindows[i]) {
        const mat = light.material as THREE.MeshStandardMaterial;
        // Staggered turn-on effect
        const stagger = (i % 15) * 0.03;
        const lightIntensity = Math.max(0, Math.min(1, (nightProgress - stagger) * 2.5));

        // Much stronger emissive at night
        mat.emissiveIntensity = lightIntensity * 3;
        mat.opacity = 0.4 + lightIntensity * 0.6;

        // Scale up slightly when lit for glow effect
        if (lightIntensity > 0.5) {
          light.scale.setScalar(1 + lightIntensity * 0.1);
        }
      }
    });

    if (labelRef.current) {
      // Phase 4 label: visible from 44% to 54%
      labelRef.current.style.opacity = (offset > 0.44 && offset < 0.54) ? "1" : "0";
    }
  });

  // Create glass material with proper settings for curtain wall
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#87ceeb'),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      thickness: 0.5,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.0,
      transparent: true,
      opacity: 0.7,
      side: THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }, []);

  let meshIndex = 0;
  let windowLightIndex = 0;

  return (
    <group ref={groupRef} visible={false}>
      {tiers.map((tier, i) => (
        <group key={`glass-${tier.id}`} rotation={[0, THREE.MathUtils.degToRad(tier.rotation), 0]}>
          {[0, 120, 240].map((angle, wingIdx) => {
            const currentMeshIndex = meshIndex++;
            return (
              <group key={`wing-glass-${wingIdx}`} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
                <RoundedBox
                  ref={(el) => { meshRefs.current[currentMeshIndex] = el as THREE.Mesh; }}
                  args={[
                    tier.radius * 0.52,
                    tier.height - 0.02,
                    tier.radius * 0.98
                  ]}
                  radius={0.04}
                  smoothness={4}
                  position={[
                    0,
                    tier.position[1] + tier.height / 2,
                    tier.radius / 2.5 + GLASS_OFFSET
                  ]}
                  material={glassMaterial}
                />

                {/* Window frame detail - horizontal mullions */}
                {[0.25, 0.5, 0.75].map((ratio, mullionIdx) => (
                  <mesh
                    key={`mullion-h-${mullionIdx}`}
                    position={[
                      0,
                      tier.position[1] + tier.height * ratio,
                      tier.radius / 2.5 + GLASS_OFFSET + 0.01
                    ]}
                  >
                    <boxGeometry args={[tier.radius * 0.5, 0.015, tier.radius * 0.96]} />
                    <meshStandardMaterial
                      color="#c0c0c0"
                      metalness={0.8}
                      roughness={0.3}
                    />
                  </mesh>
                ))}

                {/* Interior window lights (visible at night) */}
                {[0.15, 0.4, 0.65].map((ratio, lightIdx) => {
                  const currentLightIndex = windowLightIndex++;
                  const lightColor = windowColors[currentLightIndex] || '#fff8dc';
                  return (
                    <mesh
                      key={`window-light-${lightIdx}`}
                      ref={(el) => { windowLightRefs.current[currentLightIndex] = el; }}
                      position={[
                        0,
                        tier.position[1] + tier.height * ratio + 0.1,
                        tier.radius / 2.5 - 0.02  // Slightly behind glass
                      ]}
                    >
                      <boxGeometry args={[tier.radius * 0.4, tier.height * 0.2, tier.radius * 0.8]} />
                      <meshStandardMaterial
                        color={lightColor}
                        emissive={lightColor}
                        emissiveIntensity={0}
                        transparent
                        opacity={0.3}
                      />
                    </mesh>
                  );
                })}
              </group>
            );
          })}
        </group>
      ))}

      <Html position={[0, 15, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/95 px-6 py-3 rounded-full shadow-2xl border border-blue-200 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-4 h-4 bg-blue-400 rounded-sm rotate-45" />
          <span className="text-md font-extrabold text-slate-800 uppercase tracking-widest">Phase 04: Glass Cladding</span>
        </div>
      </Html>
    </group>
  );
};

export default Cladding;
