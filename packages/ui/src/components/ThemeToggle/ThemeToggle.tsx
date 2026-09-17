import { IconButton, Tooltip } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import type { ThemeMode } from '@repo-radar/core';

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  const next = mode === 'light' ? 'dark' : 'light';
  return (
    <Tooltip title={`Switch to ${next} mode`}>
      <IconButton onClick={onToggle} aria-label={`Switch to ${next} mode`} color="inherit">
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}
