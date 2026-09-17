import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TokenDialog } from './TokenDialog';

const meta = {
  title: 'Components/TokenDialog',
  component: TokenDialog,
  args: { open: true, onSave: fn(), onClear: fn(), onClose: fn() },
} satisfies Meta<typeof TokenDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoToken: Story = { args: { currentToken: null } };
export const ExistingToken: Story = { args: { currentToken: 'github_pat_example' } };
