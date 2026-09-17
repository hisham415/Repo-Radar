import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test/utils';
import { TokenDialog } from './TokenDialog';

describe('TokenDialog', () => {
  it('saves a token and closes', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    renderWithTheme(
      <TokenDialog open currentToken={null} onSave={onSave} onClear={vi.fn()} onClose={onClose} />,
    );
    await userEvent.type(screen.getByLabelText(/personal access token/i), 'github_pat_x');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith('github_pat_x');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('disables save when empty and offers remove only when a token exists', async () => {
    const onClear = vi.fn();
    const { rerender } = renderWithTheme(
      <TokenDialog open currentToken={null} onSave={vi.fn()} onClear={onClear} onClose={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /remove token/i })).not.toBeInTheDocument();

    rerender(
      <TokenDialog open currentToken="abc" onSave={vi.fn()} onClear={onClear} onClose={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /remove token/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
