import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RepoPagination } from './RepoPagination';

const meta = {
  title: 'Components/RepoPagination',
  component: RepoPagination,
  args: { onChange: fn(), total: 1000, pageCount: 84, from: 49, to: 60, page: 5 },
} satisfies Meta<typeof RepoPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const FirstPage: Story = { args: { page: 1, from: 1, to: 12 } };
export const LastPage: Story = { args: { page: 84, from: 997, to: 1000 } };
export const Disabled: Story = { args: { disabled: true } };
export const SinglePage: Story = { args: { pageCount: 1, total: 8, from: 1, to: 8, page: 1 } };
