import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BookmarksRoundedIcon from '@mui/icons-material/BookmarksRounded';
import { BottomNavBar } from './BottomNavBar';

const meta = {
  title: 'Components/BottomNavBar',
  component: BottomNavBar,
  parameters: { viewport: { defaultViewport: 'mobile1' }, layout: 'fullscreen' },
  args: {
    onChange: fn(),
    value: 'search',
    items: [
      { value: 'search', label: 'Search', icon: <SearchRoundedIcon /> },
      { value: 'tracked', label: 'Tracked', icon: <BookmarksRoundedIcon />, badgeContent: 3 },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 240, position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchActive: Story = {};
export const TrackedActive: Story = { args: { value: 'tracked' } };
