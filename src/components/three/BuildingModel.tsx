import React, { useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Cladding, Core, Foundation, Illumination, Setbacks, Spire } from '@/components/three/stages';
import { BuildingProgressContext } from '@/components/three/BuildingProgressContext';

/**
 * BuildingModel - 진행도 하나로 서는 순수 건물 모델
 *
 * 스크롤, 카메라, 회전, 낮과 밤 판단을 하지 않는다. 받은 진행도(0..1)에 맞춰
 * 기초, 코어, 세트백, 외피, 상부, 첨탑의 상태만 그린다.
 * 비율은 실제 부르즈 할리파에서 가져왔다. 전체 55, 타워 47, 첨탑 8(선언값).
 *
 * Props:
 * @param {number} progress - 건설 진행도 0..1 [Required]
 * @param {object} progressSource - 매 프레임 갱신되는 진행도 ref [Optional, 기본값: 없음]
 *
 * Example usage:
 * <BuildingModel progress={ 0.5 } />
 */
export interface BuildingModelProps {
  progress: number;
  progressSource?: MutableRefObject<number>;
}

export const BuildingModel: React.FC<BuildingModelProps> = ({ progress, progressSource }) => {
  // 정적 진행도를 쓸 때의 기본 소스. 렌더 시점에 prop 값을 그대로 옮긴다.
  const staticProgressRef = useRef(progress);
  staticProgressRef.current = progress;

  // 스크롤처럼 살아 있는 소스가 있으면 그쪽을 쓴다. 리렌더 없이 매 프레임 값이 바뀐다.
  const source = progressSource ?? staticProgressRef;

  return (
    <BuildingProgressContext.Provider value={source}>
      {/* Phase 1: Foundation (0 - 0.143) */}
      <Foundation />

      {/* Phase 2: Central Core (0.143 - 0.286) - 7 units tall */}
      <Core />

      {/* Phase 3: Lower Tower (0.286 - 0.429) - SLOW animation */}
      <Setbacks />

      {/* Phase 4: Mid Tower (0.429 - 0.571) - MEDIUM animation */}
      <Cladding />

      {/* Phase 5: Upper Tower (0.571 - 0.857) - FAST animation, 2x scroll length */}
      <Illumination />

      {/* Phase 6: The Spire (0.857 - 1.0) - 8 units, dramatic finale */}
      <Spire />
    </BuildingProgressContext.Provider>
  );
};
