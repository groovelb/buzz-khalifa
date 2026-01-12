
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import { useSprings, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import { tierData } from './Setbacks';

const AnimatedRoundedBox = animated(RoundedBox);

const Cladding: React.FC = () => {
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
    scale: [1, 0, 1],
    position: [0, -0.5, 0],
    opacity: 0,
    config: { mass: 1, tension: 120, friction: 14 },
  }));

  useFrame(() => {
    const offset = scroll.offset;
    const isVisible = offset > 0.58;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.6) / 0.2));

    if (groupRef.current) groupRef.current.visible = isVisible;

    api.start((index) => {
      const threshold = index / tiers.length;
      const tierProgress = Math.max(0, Math.min(1, (localProgress - threshold) * tiers.length * 1.5));
      
      if (tierProgress > 0) {
        return {
          scale: [1, 1, 1],
          position: tiers[index].position,
          opacity: 1,
        };
      } else {
        return {
          scale: [1, 0, 1],
          position: [tiers[index].position[0], tiers[index].position[1] - 0.2, tiers[index].position[2]],
          opacity: 0,
        };
      }
    });

    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.62 && offset < 0.78) ? "1" : "0";
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {springs.map((props, i) => {
        const tier = tiers[i];
        return (
          <group key={`glass-${tier.id}`} rotation={[0, THREE.MathUtils.degToRad(tier.rotation), 0]}>
            {[0, 120, 240].map((angle, wingIdx) => (
              <group key={`wing-glass-${wingIdx}`} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
                <AnimatedRoundedBox
                  // Optimized args to prevent wings from overlapping at the center hub
                  args={[tier.radius * 0.48, tier.height, tier.radius * 0.95]}
                  radius={0.06}
                  smoothness={4}
                  // Offset position further out to avoid center-point mesh congestion
                  position={props.position.to((x, y, z) => [x, y + tier.height / 2, z + tier.radius * 0.45])}
                  scale={props.scale}
                >
                  <meshPhysicalMaterial 
                    color="#a0d8ef"
                    transmission={0.9}
                    roughness={0.15}
                    thickness={0.2}
                    ior={1.3}
                    clearcoat={1}
                    transparent
                    opacity={0.5}
                    envMapIntensity={1.5}
                    // Prevent viewing back faces through the front faces to clean up overlaps
                    side={THREE.FrontSide}
                    depthWrite={false}
                  />
                </AnimatedRoundedBox>
              </group>
            ))}
          </group>
        );
      })}

      <Html position={[0, 15, 0]} center>
        <div 
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/95 px-6 py-3 rounded-full shadow-2xl border border-blue-200 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-4 h-4 bg-blue-400 rounded-sm rotate-45 animate-spin" />
          <span className="text-md font-extrabold text-slate-800 uppercase tracking-widest italic">Phase 04: Glass Cladding</span>
        </div>
      </Html>
    </group>
  );
};

export default Cladding;
