import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cladding } from '../../components/three/stages/Cladding';
import { PHASES } from '../../data/scrollConfig';
import { StageCanvas } from './StageCanvas';

/** 진행도만 받는 공정 컴포넌트. 스크롤 문맥 없이 이 공정만 세운다. */
interface StageArgs {
  progress: number;
}

const RANGE = PHASES.MID_TOWER;
const MIDDLE = RANGE.start + (RANGE.end - RANGE.start) / 2;

const meta: Meta<StageArgs> = {
  title: 'Custom Component/1. Building Stages/Cladding',
  component: Cladding,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '중부 타워에 커튼월 유리와 멀리언이 입혀지는 공정입니다. 티어마다 유리면과 수직 프레임이 함께 자랍니다. 진행도 43%~57% 구간을 씁니다. 드래그하면 궤도 카메라로 돌려볼 수 있습니다.' } },
  },
  args: { progress: RANGE.end },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
  render: ({ progress }) => (
    <StageCanvas progress={ progress } frameY={ 30 } zoom={ 30 }>
      <Cladding />
    </StageCanvas>
  ),
};

export default meta;
type Story = StoryObj<StageArgs>;

/** 공정이 끝난 상태 */
export const Default: Story = {};

/** 공정이 막 시작한 시점 */
export const Start: Story = { args: { progress: RANGE.start } };

/** 공정 중간 */
export const Middle: Story = { args: { progress: MIDDLE } };

/** 공정 완료 직후 */
export const Complete: Story = { args: { progress: RANGE.end } };
