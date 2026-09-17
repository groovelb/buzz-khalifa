import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageReveal } from '../../components/media/ImageReveal';
import stageImage from '../../assets/stages/1.jpeg';

const meta = {
  title: 'Custom Component/Media/ImageReveal',
  component: ImageReveal,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '실제 공정 사진의 스크롤 진입 효과입니다. 원본 비율을 유지하며 방향과 거리를 조정합니다.' } } },
  args: { src: stageImage, alt: 'Foundation construction', className: 'w-full max-w-sm h-auto', delay: 0, duration: 800, threshold: 0.3, direction: 'up', distance: 30 },
  argTypes: {
    src: { control: 'text' }, alt: { control: 'text' }, className: { control: 'text' },
    delay: { control: { type: 'range', min: 0, max: 2000, step: 100 } },
    duration: { control: { type: 'range', min: 0, max: 2000, step: 100 } },
    threshold: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    direction: { control: 'select', options: ['up', 'down', 'left', 'right'] },
    distance: { control: { type: 'range', min: 0, max: 100, step: 5 } },
  },
} satisfies Meta<typeof ImageReveal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
