
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

export const tierData = [
  { id: 0, height: 1.5, radius: 1.8, rotation: 0 },
  { id: 1, height: 1.4, radius: 1.6, rotation: 40 },
  { id: 2, height: 1.3, radius: 1.4, rotation: 80 },
  { id: 3, height: 1.2, radius: 1.2, rotation: 120 },
  { id: 4, height: 1.1, radius: 1.0, rotation: 160 },
  { id: 5, height: 1.0, radius: 0.8, rotation: 200 },
  { id: 6, height: 0.9, radius: 0.7, rotation: 240 },
  { id: 7, height: 0.8, radius: 0.6, rotation: 280 },
  { id: 8, height: 0.7, radius: 0.5, rotation: 320 },
];

const Setbacks: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const tiers = useMemo(() => {
    let currentY = 0.5;
    return tierData.map((tier) => {
      const pos = [0, currentY, 0] as [number, number, number];
      currentY += tier.height;
      return { ...tier, position: pos };
    });
  }, []);

  // Concrete material - slightly rough with warm tone
  const concreteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f5f5f0'),
      roughness: 0.85,
      metalness: 0.02,
      // Polygon offset to ensure proper layering
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
  }, []);

  useFrame(() => {
    const offset = scroll.offset;
    // Phase 3: 0.286 - 0.429 (1/7)
    const isVisible = offset > 0.26;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.286) / 0.143));

    if (groupRef.current) groupRef.current.visible = isVisible;

    // Animate each tier
    tiers.forEach((tier, index) => {
      const threshold = index / tiers.length;
      const tierProgress = Math.max(0, Math.min(1, (localProgress - threshold) * tiers.length * 2));

      // Update meshes for this tier (3 wings per tier)
      for (let wingIdx = 0; wingIdx < 3; wingIdx++) {
        const meshIndex = index * 3 + wingIdx;
        const mesh = meshRefs.current[meshIndex];
        if (mesh) {
          const targetScale = tierProgress > 0 ? 1 : 0.001;
          mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.08);
          mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetScale, 0.08);
          mesh.scale.z = THREE.MathUtils.lerp(mesh.scale.z, targetScale, 0.08);
        }
      }
    });

    if (labelRef.current) {
      // Phase 3 label: visible from 30% to 40%
      labelRef.current.style.opacity = (offset > 0.30 && offset < 0.40) ? "1" : "0";
    }
  });

  let meshIndex = 0;

  return (
    <group ref={groupRef} visible={false}>
      {tiers.map((tier, i) => (
        <group key={tier.id} rotation={[0, THREE.MathUtils.degToRad(tier.rotation), 0]}>
          {[0, 120, 240].map((angle, wingIdx) => {
            const currentMeshIndex = meshIndex++;
            return (
              <group key={wingIdx} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
                {/* Main structural slab */}
                <RoundedBox
                  ref={(el) => { meshRefs.current[currentMeshIndex] = el as THREE.Mesh; }}
                  args={[tier.radius * 0.48, tier.height - 0.04, tier.radius * 0.95]}
                  radius={0.05}
                  smoothness={4}
                  position={[0, tier.position[1] + tier.height / 2, tier.radius / 2.5]}
                  castShadow
                  receiveShadow
                  material={concreteMaterial}
                />

                {/* Floor slab lines - architectural detail */}
                <mesh
                  position={[0, tier.position[1] + tier.height - 0.01, tier.radius / 2.5]}
                >
                  <boxGeometry args={[tier.radius * 0.46, 0.03, tier.radius * 0.92]} />
                  <meshStandardMaterial
                    color="#e8e8e5"
                    roughness={0.9}
                    metalness={0.0}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      <Html position={[0, 12, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-amber-100 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Phase 03: Structural Setbacks</span>
        </div>
      </Html>
    </group>
  );
};

export default Setbacks;
