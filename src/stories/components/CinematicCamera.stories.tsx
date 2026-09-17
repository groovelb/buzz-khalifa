import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { CinematicCamera } from '../../components/three/CinematicCamera';
import { BuildingModel } from '../../components/three/BuildingModel';
import { BuildingProgressContext } from '../../components/three/BuildingProgressContext';
import { SCROLL_CONFIG } from '../../data/scrollConfig';

/** 카메라 경로를 눈으로 확인할 기준물 */
function CameraPathStage() {
  const progressRef = useRef(1);

  return (
    <div style={ { width: '100%', height: '100vh', background: '#c7d3dd' } }>
      <Canvas orthographic camera={ { zoom: 120, position: [6, 4, 6] } } shadows>
        <ambientLight intensity={ 0.7 } color="#FFF8DC" />
        <directionalLight position={ [10, 15, 10] } intensity={ 1.4 } color="#FFFAF0" castShadow />
        <ScrollControls pages={ SCROLL_CONFIG.pages } damping={ SCROLL_CONFIG.damping }>
          <CinematicCamera />
          <BuildingProgressContext.Provider value={ progressRef }>
            <BuildingModel progress={ 1 } progressSource={ progressRef } />
          </BuildingProgressContext.Provider>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

/** 스토리가 끝나면 스크롤 위치가 남지 않도록 맨 위로 되돌린다. */
function ScrollResetFrame() {
  useEffect(() => () => window.scrollTo(0, 0), []);

  return <CameraPathStage />;
}

const meta = {
  title: 'Custom Component/2. Environment & Camera/CinematicCamera',
  component: CinematicCamera,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '현재 미사용 컴포넌트입니다. 사이트에서는 ConstructionScene 이 배율만 바꾸고 각도를 고정하므로 이 파일을 불러오지 않습니다. 남아 있는 세 키프레임(근접 120 배율, 중간 80, 원경 45)을 따라 위치와 표적이 함께 움직이는 카메라 경로만 보여 줍니다. 완성된 타워를 기준물로 두고 스크롤하면 경로를 확인할 수 있습니다. 별도 props는 없습니다.' } },
  },
  render: () => <ScrollResetFrame />,
} satisfies Meta<typeof CinematicCamera>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 카메라 경로 (현재 미사용) */
export const Default: Story = {};
