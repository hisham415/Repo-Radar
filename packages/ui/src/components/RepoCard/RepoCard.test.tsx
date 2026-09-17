import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme, sampleIdentity, sampleRepo } from '../../test/utils';
import { RepoCard } from './RepoCard';

describe('RepoCard', () => {
  it('renders repo stats', () => {
    renderWithTheme(
      <RepoCard
        identity={sampleIdentity}
        repo={sampleRepo}
        isTracked={false}
        onToggleTrack={vi.fn()}
      />,
    );
    expect(screen.getByRole('link', { name: 'react' })).toHaveAttribute('href', sampleRepo.url);
    expect(screen.getByText('230K')).toBeInTheDocument();
    expect(screen.getByText('912')).toBeInTheDocument();
    expect(screen.getByText('3 hours ago')).toBeInTheDocument();
  });

  it('shows a skeleton while loading without data', () => {
    renderWithTheme(
      <RepoCard identity={sampleIdentity} isTracked={false} isLoading onToggleTrack={vi.fn()} />,
    );
    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('230K')).not.toBeInTheDocument();
  });

  it('keeps stale data visible while refreshing and disables the refresh button', () => {
    renderWithTheme(
      <RepoCard
        identity={sampleIdentity}
        repo={sampleRepo}
        isTracked
        isRefreshing
        onToggleTrack={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );
    expect(screen.getByText('230K')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh facebook\/react/i })).toBeDisabled();
  });

  it('renders an error with retry', async () => {
    const onRetry = vi.fn();
    renderWithTheme(
      <RepoCard
        identity={sampleIdentity}
        isTracked
        errorMessage="Rate limit exceeded"
        onToggleTrack={vi.fn()}
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Rate limit exceeded');
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('toggles tracking and reflects pressed state', async () => {
    const onToggleTrack = vi.fn();
    renderWithTheme(
      <RepoCard
        identity={sampleIdentity}
        repo={sampleRepo}
        isTracked
        onToggleTrack={onToggleTrack}
      />,
    );
    const button = screen.getByRole('button', { name: /untrack facebook\/react/i });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button);
    expect(onToggleTrack).toHaveBeenCalledOnce();
  });
});
