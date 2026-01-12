
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import Building from './Building';
import DayNightCycle from './DayNightCycle';
import { setThemeProgress } from '../hooks/useTheme';

const Experience: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();
  const groundRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const progress = scroll.offset;

    // Update UI theme based on progress
    setThemeProgress(progress);

    // ============================================
    // 카메라 줌 - 처음엔 가깝게, 완성되면 멀리서
    // ============================================
    const orthoCamera = camera as THREE.OrthographicCamera;
    // 시작: zoom 90 (가까이) → 끝: zoom 40 (멀리서 전체 보기)
    const targetZoom = THREE.MathUtils.lerp(90, 40, progress);
    // 부드럽게 전환
    orthoCamera.zoom = THREE.MathUtils.lerp(orthoCamera.zoom, targetZoom, 0.05);
    orthoCamera.updateProjectionMatrix();

    // Ground color transitions with time of day
    if (groundRef.current) {
      const groundMat = groundRef.current.material as THREE.MeshStandardMaterial;
      if (progress < 0.6) {
        groundMat.color.setHex(0xeeeeee);
      } else {
        const t = (progress - 0.6) / 0.4;
        groundMat.color.set('#eeeeee').lerp(new THREE.Color('#1a1a2e'), t);
      }
    }

    // Shadow opacity decreases at night
    if (shadowRef.current) {
      const shadowOpacity = progress < 0.6 ? 0.4 : Math.max(0.1, 0.4 - (progress - 0.6) * 0.6);
      shadowRef.current.children.forEach(child => {
        if ((child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.Material).opacity = shadowOpacity;
        }
      });
    }
  });

  return (
    <>
      {/* Day/Night Cycle System */}
      <DayNightCycle />

      {/* Fill light - stays constant but dims at night */}
      <pointLight position={[-8, 8, -5]} intensity={0.3} color="#e0f0ff" />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Ground plane */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#eeeeee" transparent opacity={0.5} />
      </mesh>

      {/* Contact shadows */}
      <group ref={shadowRef}>
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={20}
          blur={2}
          far={4.5}
        />
      </group>

      <Building />
    </>
  );
};

export default Experience;
