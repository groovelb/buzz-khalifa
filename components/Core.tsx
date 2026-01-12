
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

const Core: React.FC = () => {
  const scroll = useScroll();
  const coreRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const offset = scroll.offset;
    
    // Stage 2: 0.2 to 0.4
    const isVisible = offset >= 0.2;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.2) / 0.2));

    if (coreRef.current) {
      coreRef.current.visible = isVisible;
      if (isVisible) {
        // Scale height based on localProgress
        // Use a small minimum scale to avoid matrix errors
        coreRef.current.scale.y = Math.max(0.001, localProgress * 10); 
        coreRef.current.position.y = 0.5;
      }
    }

    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.22 && offset < 0.38) ? "1" : "0";
    }
  });

  return (
    <group>
      <group ref={coreRef} visible={false}>
        {/* Y-Shaped Core: 3 wings */}
        {[0, 120, 240].map((angle, i) => (
          <group key={i} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
            <RoundedBox
              args={[0.8, 1, 1.5]}
              radius={0.05}
              smoothness={4}
              position={[0, 0.5, 0.5]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </RoundedBox>
          </group>
        ))}
        {/* Central Hub */}
        <RoundedBox
          args={[1, 1, 1]}
          radius={0.1}
          smoothness={4}
          position={[0, 0.5, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>
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
