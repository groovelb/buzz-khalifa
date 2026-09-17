import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConstructionOverlay } from '../../components/scroll/ConstructionOverlay';

const meta = {
  title: 'Template/ConstructionOverlay',
  component: ConstructionOverlay,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: '여섯 공정 섹션을 순서대로 쌓은 스크롤 본문 전체입니다. 실제 화면에서는 3D 장면 위에 얹히지만 본문만 따로 세워도 같은 순서와 좌우 교대 배치를 확인할 수 있습니다. 별도 props는 없습니다.' } } },
  decorators: [(Story) => <div style={ { width: '100%', overflowX: 'hidden' } }><Story /></div>],
} satisfies Meta<typeof ConstructionOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
