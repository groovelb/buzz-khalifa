import type { Meta, StoryObj } from '@storybook/react-vite';
import { Core } from '../../components/three/stages/Core';
import { PHASES } from '../../data/scrollConfig';
import { StageCanvas } from './StageCanvas';

/** 진행도만 받는 공정 컴포넌트. 스크롤 문맥 없이 이 공정만 세운다. */
interface StageArgs {
  progress: number;
}

const RANGE = PHASES.CORE;
const MIDDLE = RANGE.start + (RANGE.end - RANGE.start) / 2;

const meta: Meta<StageArgs> = {
  title: 'Custom Component/1. Building Stages/Core',
  component: Core,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '중심 코어와 세 날개가 올라오는 공정입니다. 진행도에 따라 높이가 자라고 날개 끝은 알루미늄 프레임으로 마감됩니다. 진행도 14%~29% 구간을 씁니다. 드래그하면 궤도 카메라로 돌려볼 수 있습니다.' } },
  },
  args: { progress: RANGE.end },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
  render: ({ progress }) => (
    <StageCanvas progress={ progress } frameY={ 4 } zoom={ 55 }>
      <Core />
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
