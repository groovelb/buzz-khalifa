import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextReveal } from '../../components/kinetic-typography/TextReveal';

const meta = {
  title: 'Custom Component/4. Narrative Overlay/TextReveal',
  component: TextReveal,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '화면에 들어온 글자를 순서대로 보여줍니다. 단위는 밀리초이며 once를 끄면 재진입할 때 반복합니다.' } } },
  args: { text: 'The Vertical Breath', as: 'h2', className: 'font-headline text-5xl text-ink', delay: 0, staggerDelay: 40, duration: 600, threshold: 0.3, once: true },
  argTypes: {
    text: { control: 'text' },
    as: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'p', 'span'] },
    className: { control: 'text' },
    delay: { control: { type: 'range', min: 0, max: 2000, step: 100 } },
    staggerDelay: { control: { type: 'range', min: 0, max: 120, step: 5 } },
    duration: { control: { type: 'range', min: 0, max: 2000, step: 100 } },
    threshold: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    once: { control: 'boolean' },
  },
} satisfies Meta<typeof TextReveal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
