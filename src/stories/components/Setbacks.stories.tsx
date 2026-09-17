import type { Meta, StoryObj } from '@storybook/react-vite';
import { Setbacks } from '../../components/three/stages/Setbacks';
import { PHASES } from '../../data/scrollConfig';
import { StageCanvas } from './StageCanvas';

/** 진행도만 받는 공정 컴포넌트. 스크롤 문맥 없이 이 공정만 세운다. */
interface StageArgs {
  progress: number;
}

const RANGE = PHASES.LOWER_TOWER;
const MIDDLE = RANGE.start + (RANGE.end - RANGE.start) / 2;

const meta: Meta<StageArgs> = {
  title: 'Custom Component/1. Building Stages/Setbacks',
  component: Setbacks,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '하부 타워의 티어가 아래에서 위로 차례를 두고 서는 공정입니다. 세 날개가 서로 다른 높이에서 물러서며 나선형 실루엣이 생깁니다. 진행도 29%~43% 구간을 씁니다. 드래그하면 궤도 카메라로 돌려볼 수 있습니다.' } },
  },
  args: { progress: RANGE.end },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
  render: ({ progress }) => (
    <StageCanvas progress={ progress } frameY={ 15 } zoom={ 30 }>
      <Setbacks />
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
