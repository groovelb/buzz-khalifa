import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { ConstructionScene } from '../../components/three/ConstructionScene';
import { SCROLL_CONFIG } from '../../data/scrollConfig';
import { resetTheme } from '../../hooks/useTheme';

/** 스크롤 문맥을 제공하고 스토리가 끝나면 지면 테마를 낮으로 돌려놓는 껍데기 */
function ScrollFrame({ children }: { children: React.ReactNode }) {
  useEffect(() => resetTheme, []);

  return (
    <div style={ { width: '100%', height: '100vh' } }>
      <Canvas orthographic camera={ { zoom: 90, position: [15, 20, 15] } } shadows gl={ { antialias: true } }>
        <ScrollControls pages={ SCROLL_CONFIG.pages } damping={ SCROLL_CONFIG.damping }>
          { children }
        </ScrollControls>
      </Canvas>
    </div>
  );
}

const meta = {
  title: 'Custom Component/Three/ConstructionScene',
  component: ConstructionScene,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '스크롤에 반응하는 유일한 3D 컴포넌트입니다. 진행도를 한 번 읽어 모델, 건물 회전과 수직 이동, 카메라 배율, 조명, 낮과 밤, 지면 테마에 나눠 줍니다. 해설 지면과 Bloom 없이 장면만 세워 스크롤 반응을 확인합니다. 별도 props는 없습니다.' } },
  },
  decorators: [(Story) => <ScrollFrame><Story /></ScrollFrame>],
} satisfies Meta<typeof ConstructionScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
