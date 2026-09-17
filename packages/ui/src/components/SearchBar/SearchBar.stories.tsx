import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  args: { value: '', onChange: fn() },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithValue: Story = { args: { value: 'react' } };
export const Loading: Story = { args: { value: 'react', isLoading: true } };
