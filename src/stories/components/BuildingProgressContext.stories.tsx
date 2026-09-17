import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  BuildingProgressContext,
  useBuildingProgress,
} from '../../components/three/BuildingProgressContext';

/** 진행도 문맥 데모의 인자 */
interface ProgressArgs {
  progress: number;
}

/**
 * 소비자 예시.
 *
 * 공정 컴포넌트가 하는 일과 같다. 매 프레임 ref 를 읽어 형상을 바꾼다.
 * 값이 바뀌어도 리렌더가 일어나지 않는다.
 */
function ProgressProbe() {
  const buildingProgress = useBuildingProgress();
  const barRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const offset = buildingProgress.current;

    if (barRef.current) {
      barRef.current.scale.y = Math.max(0.001, offset * 6);
      barRef.current.position.y = (offset * 6) / 2;
      const material = barRef.current.material as THREE.MeshStandardMaterial;
      material.color.setHSL(0.58 - offset * 0.12, 0.25, 0.45 + offset * 0.2);
    }

    if (labelRef.current) {
      labelRef.current.textContent = `progress ${ offset.toFixed(2) }`;
    }
  });

  return (
    <>
      <mesh ref={ barRef } position={ [0, 0, 0] } castShadow>
        <boxGeometry args={ [1, 1, 1] } />
        <meshStandardMaterial color="#506872" roughness={ 0.4 } metalness={ 0.3 } />
      </mesh>
      <mesh position={ [0, -0.05, 0] } rotation={ [-Math.PI / 2, 0, 0] } receiveShadow>
        <planeGeometry args={ [8, 8] } />
        <meshStandardMaterial color="#c8cdd2" roughness={ 0.9 } />
      </mesh>
      <Html position={ [1.4, 3, 0] }>
        <div
          ref={ labelRef }
          style={ { fontFamily: 'monospace', fontSize: 12, color: '#1a1a1a', whiteSpace: 'nowrap' } }
        />
      </Html>
    </>
  );
}

/** 제공자 예시. BuildingModel 과 ConstructionScene 이 같은 방식으로 값을 내려 준다. */
function ProgressProviderDemo({ progress }: ProgressArgs) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <div style={ { width: '100%', height: '100vh', background: '#e8edf1' } }>
      <Canvas orthographic camera={ { zoom: 70, position: [8, 7, 8] } } shadows>
        <ambientLight intensity={ 0.8 } color="#FFF8DC" />
        <directionalLight position={ [6, 9, 6] } intensity={ 1.2 } color="#FFFAF0" castShadow />
        <BuildingProgressContext.Provider value={ progressRef }>
          <ProgressProbe />
        </BuildingProgressContext.Provider>
        <OrbitControls enablePan={ false } target={ [0, 2, 0] } />
      </Canvas>
    </div>
  );
}

const meta: Meta<ProgressArgs> = {
  title: 'Custom Component/3. Scene/BuildingProgressContext',
  component: ProgressProviderDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '진행도(0..1)를 공정 컴포넌트에 전달하는 문맥입니다. 값이 매 프레임 바뀌므로 상태가 아니라 ref 를 내려 보내 리렌더를 막습니다. 이 데모는 제공자 한 개와 소비자 한 개로 사용법만 보여 줍니다. 슬라이더를 움직이면 소비자가 높이와 색으로 반응합니다.' } },
  },
  args: { progress: 0.5 },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
  render: (args) => <ProgressProviderDemo { ...args } />,
};

export default meta;
type Story = StoryObj<ProgressArgs>;

/** 절반 */
export const Default: Story = {};

/** 시작 */
export const Start: Story = { args: { progress: 0 } };

/** 완료 */
export const Complete: Story = { args: { progress: 1 } };
