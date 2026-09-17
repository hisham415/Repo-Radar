import type { Meta, StoryObj } from '@storybook/react';
import { StarsBarChart } from './StarsBarChart';

const meta = {
  title: 'Components/StarsBarChart',
  component: StarsBarChart,
} satisfies Meta<typeof StarsBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      { label: 'facebook/react', stars: 230_000 },
      { label: 'vuejs/vue', stars: 208_000 },
      { label: 'angular/angular', stars: 96_000 },
      { label: 'sveltejs/svelte', stars: 80_000 },
      { label: 'solidjs/solid', stars: 32_000 },
    ],
  },
};

export const Empty: Story = { args: { data: [] } };
