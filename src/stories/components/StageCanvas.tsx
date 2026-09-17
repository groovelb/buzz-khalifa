import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BuildingProgressContext } from '../../components/three/BuildingProgressContext';

/**
 * 공정 스토리용 캔버스.
 *
 * 스크롤 문맥 없이 진행도만 넣어 공정 하나를 세운다. 건물 좌표는 절대값이므로
 * frameY 만큼 내려 화면 가운데로 옮기고, 궤도 카메라의 표적은 원점에 둔다.
 *
 * Props:
 * @param {number} progress - 건설 진행도 0..1 [Required]
 * @param {number} frameY - 화면 가운데로 옮길 기준 높이 [Optional, 기본값: 0]
 * @param {number} zoom - 정사영 배율 [Optional, 기본값: 40]
 * @param {ReactNode} children - 캔버스 안에 세울 공정 [Required]
 *
 * Example usage:
 * <StageCanvas progress={ 1 } frameY={ 4 } zoom={ 60 }><Core /></StageCanvas>
 */
export interface StageCanvasProps {
  progress: number;
  frameY?: number;
  zoom?: number;
  children: ReactNode;
}

export function StageCanvas({ progress, frameY = 0, zoom = 40, children }: StageCanvasProps) {
  // 진행도는 ref 로 전달한다. 매 프레임 값을 읽는 공정 코드가 리렌더를 일으키지 않는다.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <div style={ { width: '100%', height: '100vh', background: '#c7d3dd' } }>
      <Canvas orthographic camera={ { zoom, position: [24, 26, 24] } } shadows>
        <ambientLight intensity={ 0.7 } color="#FFF8DC" />
        <directionalLight position={ [10, 15, 10] } intensity={ 1.4 } color="#FFFAF0" castShadow />
        <pointLight position={ [-8, 8, -5] } intensity={ 0.4 } color="#e0f0ff" />
        <BuildingProgressContext.Provider value={ progressRef }>
          <group position={ [0, -frameY, 0] }>
            { children }
          </group>
        </BuildingProgressContext.Provider>
        <OrbitControls enablePan={ false } target={ [0, 0, 0] } />
      </Canvas>
    </div>
  );
}
