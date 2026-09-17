import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from '../../components/layout/Header';

const meta = {
  title: 'Custom Component/5. Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: '화면 위에 고정되는 간행 정보와 제호입니다. 클릭을 막아 3D 장면의 조작을 가리지 않습니다. 색은 지면 테마 변수를 따라가므로 밤 구간에서는 밝은 글자와 금색 강조로 바뀝니다. 별도 props는 없습니다.' } } },
  decorators: [(Story) => <div style={ { width: '100%', height: '60vh', background: 'var(--color-warm-white)', position: 'relative' } }><Story /></div>],
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
