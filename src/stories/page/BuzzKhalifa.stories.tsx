import type { Meta, StoryObj } from '@storybook/react-vite';
import App from '../../App';

const meta = {
  title: 'Page/Buzz Khalifa',
  component: App,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: '여섯 공정을 일곱 화면 길이로 관람하는 전체 페이지입니다. Canvas 안에서 스크롤하면 건설, 카메라, 낮과 밤이 함께 진행됩니다. 별도 props는 없습니다.' } } },
  decorators: [(Story) => <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}><Story /></div>],
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
