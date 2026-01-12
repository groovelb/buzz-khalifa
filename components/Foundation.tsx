
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const Foundation: React.FC = () => {
  const scroll = useScroll();
  const matRef = useRef<THREE.Mesh>(null);
  const pilesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Range 0.0 to 0.2
    const progress = scroll.range(0, 0.2);
    
    if (matRef.current) {
      // Mat appears from scale 0 to 1
      const matScale = THREE.MathUtils.smoothstep(progress, 0, 0.5);
      matRef.current.scale.set(matScale, matScale, matScale);
      matRef.current.position.y = (1 - matScale) * -1;
    }

    if (pilesRef.current) {
      // Piles appear from 0.5 to 1.0 of the current range
      const pilesProgress = THREE.MathUtils.smoothstep(progress, 0.4, 1);
      pilesRef.current.position.y = (1 - pilesProgress) * -2;
      pilesRef.current.visible = pilesProgress > 0.01;
    }
  });

  // Create a grid of piles (12x12)
  const pileGrid = [];
  const spacing = 0.25;
  const count = 6;
  for (let x = -count; x <= count; x++) {
    for (let z = -count; z <= count; z++) {
      // Only keep piles inside a rough circle/hexagon shape to match Burj Khalifa base
      const dist = Math.sqrt(x * x + z * z);
      if (dist < 6.5) {
        pileGrid.push(<Pile key={`${x}-${z}`} position={[x * spacing, -1, z * spacing]} />);
      }
    }
  }

  return (
    <group>
      {/* Main Concrete Mat */}
      <RoundedBox
        ref={matRef}
        args={[4, 0.5, 4]} // Width, Height, Depth
        radius={0.1}
        smoothness={4}
        position={[0, 0.25, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#d1d5db" roughness={0.7} />
      </RoundedBox>

      {/* Piling System */}
      <group ref={pilesRef}>
        {pileGrid}
      </group>
    </group>
  );
};

const Pile: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <RoundedBox
      args={[0.12, 2, 0.12]}
      radius={0.03}
      smoothness={2}
      position={position}
      castShadow
    >
      <meshStandardMaterial color="#9ca3af" roughness={0.8} />
    </RoundedBox>
  );
};

export default Foundation;
