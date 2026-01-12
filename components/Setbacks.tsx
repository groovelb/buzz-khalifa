
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import { useSprings, animated, config } from '@react-spring/three';
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

const AnimatedRoundedBox = animated(RoundedBox);

const Setbacks: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const tiers = useMemo(() => {
    let currentY = 0.5;
    return tierData.map((tier) => {
      const pos = [0, currentY, 0];
      currentY += tier.height;
      return { ...tier, position: pos };
    });
  }, []);

  const [springs, api] = useSprings(tiers.length, (index) => ({
    scale: [0, 0, 0],
    position: [0, -1, 0],
    config: config.wobbly,
  }));

  useFrame(() => {
    const offset = scroll.offset;
    const isVisible = offset > 0.38;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.4) / 0.2));

    if (groupRef.current) groupRef.current.visible = isVisible;

    api.start((index) => {
      const threshold = index / tiers.length;
      const tierProgress = Math.max(0, Math.min(1, (localProgress - threshold) * tiers.length * 2));
      
      if (tierProgress > 0) {
        return {
          scale: [1, 1, 1],
          position: tiers[index].position,
          immediate: false,
        };
      } else {
        return {
          scale: [0, 0, 0],
          position: [tiers[index].position[0], tiers[index].position[1] - 0.5, tiers[index].position[2]],
          immediate: offset < 0.35, 
        };
      }
    });

    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.42 && offset < 0.58) ? "1" : "0";
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {springs.map((props, i) => {
        const tier = tiers[i];
        return (
          <group key={tier.id} rotation={[0, THREE.MathUtils.degToRad(tier.rotation), 0]}>
            {[0, 120, 240].map((angle, wingIdx) => (
              <group key={wingIdx} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
                <AnimatedRoundedBox
                  args={[tier.radius * 0.5, tier.height, tier.radius]}
                  radius={0.05}
                  smoothness={4}
                  position={props.position.to((x, y, z) => [x, y + tier.height / 2, z + tier.radius / 2.5])}
                  scale={props.scale}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial color="#fefefe" roughness={0.4} />
                </AnimatedRoundedBox>
              </group>
            ))}
          </group>
        );
      })}

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
