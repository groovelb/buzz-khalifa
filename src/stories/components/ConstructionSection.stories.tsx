import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConstructionSection } from '../../components/scroll/ConstructionSection';
import { CONSTRUCTION_STAGES } from '../../data/constructionStages';

const meta = {
  title: 'Section/ConstructionSection',
  component: ConstructionSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: '공정 하나의 번호, 해설, 수치, 사진을 묶습니다. page의 홀짝으로 좌우 정렬을 바꾸며 조명 공정은 두 화면 높이를 사용합니다.' } } },
  args: { data: CONSTRUCTION_STAGES[0], page: 0, heightMultiplier: 1 },
  argTypes: {
    data: { control: 'object' },
    page: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    heightMultiplier: { control: 'select', options: [1, 2] },
  },
} satisfies Meta<typeof ConstructionSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Illumination: Story = { args: { data: CONSTRUCTION_STAGES[4], page: 4, heightMultiplier: 2 } };
