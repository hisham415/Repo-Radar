import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TextField,
  useMediaQuery,
  type Theme,
} from '@mui/material';

interface TokenDialogProps {
  open: boolean;
  currentToken: string | null;
  onSave: (token: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function TokenDialog({ open, currentToken, onSave, onClear, onClose }: TokenDialogProps) {
  const [value, setValue] = useState('');
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) setValue(currentToken ?? '');
  }, [open, currentToken]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      aria-labelledby="token-dialog-title"
    >
      <DialogTitle id="token-dialog-title">GitHub access token</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Unauthenticated requests are limited to 60 per hour. Add a{' '}
          <Link
            href="https://github.com/settings/tokens?type=beta"
            target="_blank"
            rel="noopener noreferrer"
          >
            fine-grained personal access token
          </Link>{' '}
          with no extra scopes to raise the limit to 5,000 per hour.
        </DialogContentText>
        <TextField
          fullWidth
          autoFocus
          type="password"
          label="Personal access token"
          placeholder="github_pat_…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
        />
        <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
          The token is stored only in this browser's localStorage and sent directly to
          api.github.com. It is never sent anywhere else.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1, px: 3, pb: 2 }}>
        {currentToken && (
          <Button
            color="error"
            onClick={() => {
              onClear();
              onClose();
            }}
            sx={{ mr: 'auto' }}
          >
            Remove token
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={value.trim() === ''}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
