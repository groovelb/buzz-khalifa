
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { Building } from '@/components/three/Building';
import { DayNightCycle } from '@/components/three/environment/DayNightCycle';
import { SCENE_TIMING } from '@/data/scrollConfig';
import { getDayNightState } from '@/hooks/useDayNight';
import { setThemeProgress } from '@/hooks/useTheme';

export const ConstructionScene: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();

  // 조명 refs
  const fillLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const nightFillRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const progress = scroll.offset;

    // Update UI theme based on progress
    setThemeProgress(progress);

    // 낮/밤 상태 계산
    const dayNight = getDayNightState(progress);

    // ============================================
    // 조명 낮/밤 반응
    // ============================================

    // 낮 필라이트 - 밤에는 어두워짐
    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.lerp(0.4, 0.05, dayNight.nightIntensity);
      // 석양에는 따뜻한 색상
      if (dayNight.isSunset) {
        fillLightRef.current.color.setHex(0xFFE4C4);
      } else if (dayNight.isNight) {
        fillLightRef.current.color.setHex(0x2030A0);
      } else {
        fillLightRef.current.color.setHex(0xe0f0ff);
      }
    }

    // 림라이트 - 낮에 활성화 (건물 윤곽 강조)
    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(0.25, 0, dayNight.nightIntensity);
    }

    // 밤 필라이트 - 밤에만 활성화 (은은한 달빛/도시 조명 반사)
    if (nightFillRef.current) {
      nightFillRef.current.intensity = dayNight.nightIntensity * 0.15;
    }

    // ============================================
    // 카메라 줌 - 건설 중엔 가깝게, 완성 시 전체 조망
    // ============================================
    const orthoCamera = camera as THREE.OrthographicCamera;

    // 비선형 줌 커브 - 새로운 비율에 맞춤:
    // 0% - 85.7%: 건설 단계, 가깝게 시작하여 천천히 줌아웃 (zoom 95 → 52)
    // 85.7% - 100%: 스파이어 & 완성, 드라마틱 줌아웃 (zoom 52 → 15)
    let targetZoom: number;

    if (progress < SCENE_TIMING.constructionEnd) {
      const constructionProgress = progress / SCENE_TIMING.constructionEnd;
      const eased = 1 - Math.pow(1 - constructionProgress, 1.5);
      targetZoom = THREE.MathUtils.lerp(SCENE_TIMING.constructionZoom.from, SCENE_TIMING.constructionZoom.to, eased);
    } else {
      const finalProgress = (progress - SCENE_TIMING.constructionEnd) / SCENE_TIMING.finaleLength;
      const eased = 1 - (1 - finalProgress) * (1 - finalProgress);
      targetZoom = THREE.MathUtils.lerp(SCENE_TIMING.finaleZoom.from, SCENE_TIMING.finaleZoom.to, eased);
    }

    orthoCamera.zoom = THREE.MathUtils.lerp(orthoCamera.zoom, targetZoom, SCENE_TIMING.zoomDamping);
    orthoCamera.updateProjectionMatrix();
  });

  return (
    <>
      {/* Day/Night Cycle System */}
      <DayNightCycle />

      {/* 낮 필라이트 - 밤에 어두워짐 */}
      <pointLight
        ref={fillLightRef}
        position={[-8, 8, -5]}
        intensity={0.4}
        color="#e0f0ff"
      />

      {/* 림라이트 - 낮에 건물 윤곽 강조 */}
      <pointLight
        ref={rimLightRef}
        position={[12, 15, 8]}
        intensity={0.25}
        color="#fff8f0"
      />

      {/* 밤 보조 조명 - 도시 조명 반사 느낌 */}
      <pointLight
        ref={nightFillRef}
        position={[0, -5, 10]}
        intensity={0}
        color="#4060a0"
      />

      {/* Environment for reflections - 낮에 하늘/주변 건물 반사 */}
      <Environment preset="city" />

      <Building />
    </>
  );
};
