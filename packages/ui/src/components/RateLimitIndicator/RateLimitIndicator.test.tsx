import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test/utils';
import { RateLimitIndicator } from './RateLimitIndicator';

describe('RateLimitIndicator', () => {
  it('renders a placeholder before any request', () => {
    renderWithTheme(<RateLimitIndicator info={null} />);
    expect(screen.getByText('API —')).toBeInTheDocument();
  });

  it('shows remaining budget', () => {
    renderWithTheme(
      <RateLimitIndicator info={{ resource: 'core', limit: 60, remaining: 42, resetAt: 0 }} />,
    );
    expect(screen.getByText('API 42/60')).toBeInTheDocument();
  });

  it('switches to a reset countdown when exhausted', () => {
    const resetAt = Date.now() + 90_000;
    renderWithTheme(
      <RateLimitIndicator info={{ resource: 'core', limit: 60, remaining: 0, resetAt }} />,
    );
    expect(screen.getByText(/Resets in 1:\d{2}/)).toBeInTheDocument();
  });
});
