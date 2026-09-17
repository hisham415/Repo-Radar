import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test/utils';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('propagates typed input', async () => {
    const onChange = vi.fn();
    renderWithTheme(<SearchBar value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox', { name: /search repositories/i }), 'r');
    expect(onChange).toHaveBeenCalledWith('r');
  });

  it('clears the value', async () => {
    const onChange = vi.fn();
    renderWithTheme(<SearchBar value="react" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('shows a spinner instead of the clear button while loading', () => {
    renderWithTheme(<SearchBar value="react" onChange={vi.fn()} isLoading />);
    expect(screen.getByLabelText('Searching')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });
});
