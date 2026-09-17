import type { Preview } from '@storybook/react-vite';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    options: { storySort: { order: ['Overview', 'Custom Component', 'Section', 'Page'] } },
  },
};

export default preview;
