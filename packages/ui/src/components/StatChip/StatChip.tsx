import { Chip, type ChipProps } from '@mui/material';
import type { ReactElement } from 'react';

interface StatChipProps {
  icon: ReactElement;
  label: string;
  title?: string;
  color?: ChipProps['color'];
}

export function StatChip({ icon, label, title, color = 'default' }: StatChipProps) {
  return (
    <Chip size="small" variant="outlined" icon={icon} label={label} title={title} color={color} />
  );
}
