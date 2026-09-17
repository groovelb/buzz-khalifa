import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DayNightCycle } from '../../components/three/environment/DayNightCycle';
import { BuildingProgressContext } from '../../components/three/BuildingProgressContext';
import { BuildingModel } from '../../components/three/BuildingModel';

/** 진행도만 받아 하늘, 해와 달, 태양광과 환경광을 바꾸는 컴포넌트 */
interface DayNightArgs {
  progress: number;
  showBuilding: boolean;
}

/** 하늘 변화를 가늠할 기준물로 완성된 타워를 함께 세울 수 있다. */
function DayNightStage({ progress, showBuilding }: DayNightArgs) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <div style={ { width: '100%', height: '100vh' } }>
      <Canvas orthographic camera={ { zoom: 14, position: [24, 26, 24] } } shadows>
        <BuildingProgressContext.Provider value={ progressRef }>
          <DayNightCycle />
          { showBuilding && (
            <group position={ [0, -26, 0] }>
              <BuildingModel progress={ 1 } />
            </group>
          ) }
        </BuildingProgressContext.Provider>
        <OrbitControls enablePan={ false } target={ [0, 0, 0] } />
      </Canvas>
    </div>
  );
}

const meta: Meta<DayNightArgs> = {
  title: 'Custom Component/2. Environment & Camera/DayNightCycle',
  component: DayNightCycle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '진행도 하나로 하늘색 일곱 단계, 해의 궤적과 소멸, 달의 등장, 태양광과 환경광의 세기와 색을 바꿉니다. 스크롤을 직접 읽지 않고 진행도 문맥에서 값을 받습니다. 슬라이더를 오른쪽으로 옮기면 낮에서 밤으로 넘어갑니다.' } },
  },
  args: { progress: 0.2, showBuilding: true },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    showBuilding: { control: 'boolean' },
  },
  render: (args) => <DayNightStage { ...args } />,
};

export default meta;
type Story = StoryObj<DayNightArgs>;

/** 아침 하늘 */
export const Default: Story = {};

/** 정오 */
export const Midday: Story = { args: { progress: 0.35 } };

/** 석양 */
export const Sunset: Story = { args: { progress: 0.65 } };

/** 황혼 */
export const Dusk: Story = { args: { progress: 0.8 } };

/** 완전한 밤 */
export const Night: Story = { args: { progress: 1 } };
