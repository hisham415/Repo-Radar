import type { Meta, StoryObj } from '@storybook/react';
import { RateLimitIndicator } from './RateLimitIndicator';

const meta = {
  title: 'Components/RateLimitIndicator',
  component: RateLimitIndicator,
} satisfies Meta<typeof RateLimitIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unknown: Story = { args: { info: null } };
export const Healthy: Story = {
  args: { info: { resource: 'core', limit: 60, remaining: 48, resetAt: 0 } },
};
export const Low: Story = {
  args: { info: { resource: 'core', limit: 60, remaining: 7, resetAt: 0 } },
};
export const Exhausted: Story = {
  args: {
    info: { resource: 'core', limit: 60, remaining: 0, resetAt: Date.now() + 25 * 60 * 1000 },
  },
};
export const Authenticated: Story = {
  args: {
    info: { resource: 'core', limit: 5000, remaining: 4870, resetAt: 0 },
    isAuthenticated: true,
  },
};
