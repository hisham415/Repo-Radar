import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <InboxRoundedIcon fontSize="inherit" />,
    title: 'No tracked repositories yet',
    description: 'Search for repositories and track the ones you care about.',
    actionLabel: 'Go to search',
    onAction: fn(),
  },
};
