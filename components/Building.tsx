
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Foundation from './Foundation';
import Core from './Core';
import Setbacks from './Setbacks';
import Cladding from './Cladding';
import Spire from './Spire';

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
      {/* Stage 1: Foundation (0.0 - 0.2) */}
      <Foundation />

      {/* Stage 2: Central Core (0.2 - 0.4) */}
      <Core />

      {/* Stage 3: Structural Setbacks (0.4 - 0.6) */}
      <Setbacks />

      {/* Stage 4: Glass Cladding (0.6 - 0.8) */}
      <Cladding />

      {/* Stage 5: The Spire (0.8 - 1.0) */}
      <Spire />
    </group>
  );
};

export default Building;
