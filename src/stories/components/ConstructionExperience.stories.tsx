import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConstructionExperience } from '../../components/three/ConstructionExperience';

const meta = {
  title: 'Custom Component/Three/ConstructionExperience',
  component: ConstructionExperience,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Canvas, 스크롤 문맥, 장면, 해설, Bloom을 연결합니다. 부모가 높이를 제공하면 독립적으로 재사용할 수 있습니다. 별도 props는 없습니다.' } } },
  decorators: [(Story) => <div style={{ width: '100%', height: '100vh' }}><Story /></div>],
} satisfies Meta<typeof ConstructionExperience>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
