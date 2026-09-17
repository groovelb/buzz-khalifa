import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from '../../components/layout/Footer';

const meta = {
  title: 'Custom Component/5. Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: '화면 아래에 고정되는 크레딧과 인용문입니다. 머리말과 같은 테마 변수를 쓰고 클릭을 막습니다. 별도 props는 없습니다.' } } },
  decorators: [(Story) => <div style={ { width: '100%', height: '60vh', background: 'var(--color-warm-white)', position: 'relative' } }><Story /></div>],
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
