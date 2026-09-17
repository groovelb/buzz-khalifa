import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BuildingModel } from '../../components/three/BuildingModel';
import { PHASES } from '../../data/scrollConfig';

/** 진행도 하나만 받는 순수 모델. 스크롤과 카메라 연출은 ConstructionScene 이 맡는다. */
const meta = {
  title: 'Custom Component/Three/BuildingModel',
  component: BuildingModel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '진행도 0..1 하나로 기초, 코어, 세트백, 외피, 상부, 첨탑의 상태를 그리는 순수 모델입니다. 스크롤도 카메라 연출도 하지 않아 고정 카메라에서 단계를 직접 비교할 수 있습니다. 드래그하면 궤도 카메라로 돌려볼 수 있습니다.' } },
  },
  args: { progress: PHASES.SPIRE.end },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    progressSource: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={ { width: '100%', height: '100vh', background: '#c7d3dd' } }>
        <Canvas orthographic camera={ { zoom: 26, position: [24, 26, 24] } } shadows>
          <ambientLight intensity={ 0.7 } color="#FFF8DC" />
          <directionalLight position={ [10, 15, 10] } intensity={ 1.4 } color="#FFFAF0" castShadow />
          <pointLight position={ [-8, 8, -5] } intensity={ 0.4 } color="#e0f0ff" />
          <group position={ [0, -24, 0] }>
            <Story />
          </group>
          <OrbitControls enablePan={ false } target={ [0, 24, 0] } />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof BuildingModel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 완성 상태. 슬라이더로 진행도를 움직이면 공정이 되감긴다. */
export const Default: Story = {};

/** 기초 공정이 끝나는 시점 */
export const Foundation: Story = { args: { progress: PHASES.FOUNDATION.end } };

/** 코어가 다 올라온 시점 */
export const Core: Story = { args: { progress: PHASES.CORE.end } };

/** 하부 세트백까지 선 시점 */
export const Setbacks: Story = { args: { progress: PHASES.LOWER_TOWER.end } };

/** 첨탑이 내려오는 중간 시점 */
export const Spire: Story = { args: { progress: PHASES.SPIRE.start + 0.07 } };

/** 전체 완성 */
export const Complete: Story = { args: { progress: 1 } };
