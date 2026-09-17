import { createContext, useContext } from 'react';
import type { MutableRefObject } from 'react';

/**
 * 건설 진행도(0..1)를 공정 컴포넌트에 전달하는 문맥.
 *
 * 값은 ref다. 진행도는 매 프레임 바뀌므로 상태로 두면 프레임마다 리렌더가 일어난다.
 * 공급자는 BuildingModel 하나이고, 스크롤에서 값을 받을 때는 ConstructionScene 이
 * 같은 ref 를 매 프레임 갱신한다.
 */
export const BuildingProgressContext = createContext<MutableRefObject<number> | null>(null);

/**
 * 공정 컴포넌트가 진행도 ref 를 읽는다. BuildingModel 밖에서 쓰면 오류를 던져
 * 스크롤 문맥 없이 렌더됐을 때 조용히 0 으로 그리는 일을 막는다.
 */
export const useBuildingProgress = (): MutableRefObject<number> => {
  const progressRef = useContext(BuildingProgressContext);

  if (!progressRef) {
    throw new Error('useBuildingProgress must be used inside <BuildingModel />');
  }

  return progressRef;
};
