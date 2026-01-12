
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
import { BUILDING } from './BurjKhalifaData';

/**
 * Building Component - Main container for all construction phases
 *
 * Accurate proportions based on real Burj Khalifa (55 total units):
 * - Foundation: ground level
 * - Core: 7 units (increased - represents up to Tier 3, 120m)
 * - Lower Tower (8 tiers): ~14.5 units - SLOWEST animation
 * - Mid Tower (7 tiers): ~12.5 units - MEDIUM animation
 * - Upper Tower (8 tiers): ~7 units - FASTEST animation
 * - Spire: 8 units (14.8% - accurate to real 122m/829m)
 *
 * Total Tower Height: 47 units (85.5%)
 * Total Spire Height: 8 units (14.5%)
 * Total: 55 units
 *
 * Camera movement adjusted for dramatic vertical reveal with
 * accelerating construction speed feel
 */
const Building: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const offset = scroll.offset;

    if (groupRef.current) {
      // Gentle rotation as we scroll - full spiral view
      groupRef.current.rotation.y = offset * Math.PI * 0.5;

      // Dynamic camera/building position
      // 건설 중 (0-85.7%): 건물이 아래로 스크롤되며 현재 건설 부분 표시
      // 완성 시 (85.7-100%): 건물 중앙이 화면에 오도록 위치 조정
      //
      // Camera scroll rate: 55 units over 0.857 scroll = ~64 units/scroll
      // This ensures we see up to the tower top (47 units) at scroll 0.857
      let targetY: number;

      if (offset < 0.857) {
        // 건설 단계: 계속 아래로 스크롤
        // Multiplier 55 aligns tower top (47 units) with scroll 0.857
        targetY = -offset * 55;
      } else {
        // 최종 단계: 스파이어 + 전체 건물 reveal
        // 건물 중앙 = 전체 높이(55)의 절반 = 27.5
        const finalProgress = (offset - 0.857) / 0.143;
        const constructionEndY = -0.857 * 55; // 건설 끝 위치 (~-47)
        const centeredY = -BUILDING.TOTAL_HEIGHT / 2; // 건물 중앙이 화면 중앙에 오도록
        targetY = THREE.MathUtils.lerp(constructionEndY, centeredY, finalProgress);
      }

      groupRef.current.position.y = targetY;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Phase 1: Foundation (0 - 0.143) */}
      <Foundation />

      {/* Phase 2: Central Core (0.143 - 0.286) - 7 units tall */}
      <Core />

      {/* Phase 3: Lower Tower - 8 tiers (0.286 - 0.429) - SLOW animation */}
      <Setbacks />

      {/* Phase 4: Mid Tower - 7 tiers (0.429 - 0.571) - MEDIUM animation */}
      <Cladding />

      {/* Phase 5: Upper Tower - 8 tiers (0.571 - 0.857) - FAST animation, 2x scroll length */}
      <Illumination />

      {/* Phase 6: The Spire (0.857 - 1.0) - 8 units, dramatic finale */}
      <Spire />
    </group>
  );
};

export default Building;
