import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingModel } from '@/components/three/BuildingModel';
import { DayNightCycle } from '@/components/three/environment/DayNightCycle';
import { BUILDING } from '@/data/burjKhalifaData';
import { SCENE_TIMING } from '@/data/scrollConfig';
import { getDayNightState } from '@/hooks/useDayNight';
import { setThemeProgress } from '@/hooks/useTheme';

/**
 * 스크롤에 반응하는 유일한 3D 컴포넌트.
 *
 * 진행도를 한 곳에서 읽어 모델(BuildingModel), 건물의 회전과 수직 이동,
 * 카메라 배율, 조명, 낮과 밤, 지면 테마에 나눠 준다.
 * 모델 자체는 진행도만 받는 순수 컴포넌트다.
 */

/**
 * 진행도 동기화 전용 노드.
 *
 * 장면의 첫 자식으로 두어 같은 프레임 안에서 공정 컴포넌트보다 먼저 값을 쓴다.
 * useFrame 구독 순서는 마운트 순서를 따르므로 이 위치가 한 프레임 지연을 막는다.
 */
const ScrollProgressSync: React.FC<{ targetRef: React.MutableRefObject<number> }> = ({ targetRef }) => {
  const scroll = useScroll();

  useFrame(() => {
    targetRef.current = scroll.offset;
  });

  return null;
};

export const ConstructionScene: React.FC = () => {
  const scroll = useScroll();
  const { camera } = useThree();

  // 모델에 넘기는 진행도 소스
  const progressRef = useRef(0);

  // 건물 회전과 수직 이동을 담당하는 그룹
  const buildingGroupRef = useRef<THREE.Group>(null);

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
    // 건물 회전과 수직 이동 (예전 Building 컴포넌트의 일)
    // ============================================
    if (buildingGroupRef.current) {
      // Gentle rotation as we scroll - full spiral view
      buildingGroupRef.current.rotation.y = progress * Math.PI * 0.5;

      // 건설 중 (0-85.7%): 건물이 아래로 스크롤되며 현재 건설 부분 표시
      // 완성 시 (85.7-100%): 건물 중앙이 화면에 오도록 위치 조정
      let targetY: number;

      if (progress < SCENE_TIMING.constructionEnd) {
        // Multiplier 55 aligns tower top (47 units) with scroll 0.857
        targetY = -progress * SCENE_TIMING.buildingTravel;
      } else {
        const finalProgress = (progress - SCENE_TIMING.constructionEnd) / SCENE_TIMING.finaleLength;
        const constructionEndY = -SCENE_TIMING.constructionEnd * SCENE_TIMING.buildingTravel;
        const centeredY = -BUILDING.TOTAL_HEIGHT / 2; // 건물 중앙이 화면 중앙에 오도록
        targetY = THREE.MathUtils.lerp(constructionEndY, centeredY, finalProgress);
      }

      buildingGroupRef.current.position.y = targetY;
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
      {/* 진행도 동기화 (공정 컴포넌트보다 먼저 구독되어야 한다) */}
      <ScrollProgressSync targetRef={progressRef} />

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

      <group ref={buildingGroupRef}>
        <BuildingModel progress={progressRef.current} progressSource={progressRef} />
      </group>
    </>
  );
};
