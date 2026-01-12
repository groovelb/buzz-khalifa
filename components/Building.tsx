
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Foundation from './Foundation';
import Core from './Core';
import Setbacks from './Setbacks';
import Cladding from './Cladding';
import Spire from './Spire';
import Illumination from './Illumination';

const Building: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const offset = scroll.offset;

    if (groupRef.current) {
      // Gentle rotation as we scroll
      groupRef.current.rotation.y = offset * Math.PI * 0.4;

      // Dynamic camera/building position
      groupRef.current.position.y = -offset * 12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Phase 1: Foundation (0 - 0.143) */}
      <Foundation />

      {/* Phase 2: Central Core (0.143 - 0.286) */}
      <Core />

      {/* Phase 3: Structural Setbacks (0.286 - 0.429) */}
      <Setbacks />

      {/* Phase 4: Glass Cladding (0.429 - 0.571) */}
      <Cladding />

      {/* Phase 5: Crown/Illumination (0.571 - 0.857) - 2x length */}
      <Illumination />

      {/* Phase 6: The Spire (0.857 - 1.0) - Final touch */}
      <Spire />
    </group>
  );
};

export default Building;
