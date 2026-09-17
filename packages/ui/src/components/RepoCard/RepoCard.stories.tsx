import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { sampleIdentity, sampleRepo } from '../../test/utils';
import { RepoCard } from './RepoCard';

const meta = {
  title: 'Components/RepoCard',
  component: RepoCard,
  args: {
    identity: sampleIdentity,
    repo: sampleRepo,
    isTracked: false,
    onToggleTrack: fn(),
    onRefresh: fn(),
    onRetry: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RepoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tracked: Story = { args: { isTracked: true } };

export const Loading: Story = { args: { repo: undefined, isLoading: true } };

export const Refreshing: Story = { args: { isTracked: true, isRefreshing: true } };

export const WithError: Story = {
  args: { repo: undefined, isTracked: true, errorMessage: 'API rate limit exceeded.' },
};

export const StaleWithError: Story = {
  args: { isTracked: true, errorMessage: 'Network error. Showing cached data.' },
};

export const NoDescription: Story = {
  args: { repo: { ...sampleRepo, description: null, language: null } },
};
