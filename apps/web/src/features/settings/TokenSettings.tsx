import { useState } from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import {
  clearToken,
  selectToken,
  setToken,
  useAppDispatch,
  useAppSelector,
} from '@repo-radar/store';
import { TokenDialog } from '@repo-radar/ui';

export function TokenSettings() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={token ? 'GitHub token configured' : 'Add a GitHub token'}>
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="GitHub token settings"
          color="inherit"
        >
          <Badge variant="dot" color="success" invisible={!token}>
            <KeyRoundedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <TokenDialog
        open={open}
        currentToken={token}
        onSave={(value) => dispatch(setToken(value))}
        onClear={() => dispatch(clearToken())}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
