import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test/utils';
import { RepoPagination } from './RepoPagination';

const base = { total: 1000, pageCount: 84, from: 49, to: 60, page: 5 };

describe('RepoPagination', () => {
  it('shows the visible range and emits the chosen page', async () => {
    const onChange = vi.fn();
    renderWithTheme(<RepoPagination {...base} onChange={onChange} />);

    expect(screen.getByText('Showing 49–60 of 1,000')).toBeInTheDocument();
    const nav = screen.getByRole('navigation');
    await userEvent.click(within(nav).getByRole('button', { name: 'Go to page 6' }));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('marks the current page and disables everything when asked', () => {
    renderWithTheme(<RepoPagination {...base} disabled onChange={vi.fn()} />);
    const current = screen.getByRole('button', { name: 'page 5' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('renders nothing for a single page', () => {
    const { container } = renderWithTheme(
      <RepoPagination {...base} pageCount={1} onChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
