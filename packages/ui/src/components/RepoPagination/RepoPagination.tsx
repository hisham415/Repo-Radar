import { Pagination, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

interface RepoPaginationProps {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  disabled?: boolean;
  onChange: (page: number) => void;
}

export function RepoPagination({
  page,
  pageCount,
  from,
  to,
  total,
  disabled = false,
  onChange,
}: RepoPaginationProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('sm'));

  if (pageCount <= 1) return null;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="space-between"
      spacing={1.5}
      sx={{ pt: 1 }}
    >
      <Typography variant="body2" color="text.secondary" aria-live="polite">
        Showing {from.toLocaleString()}–{to.toLocaleString()} of {total.toLocaleString()}
      </Typography>
      <Pagination
        page={page}
        count={pageCount}
        onChange={(_event, next) => onChange(next)}
        disabled={disabled}
        color="primary"
        shape="rounded"
        size={compact ? 'medium' : 'large'}
        siblingCount={compact ? 0 : 1}
        boundaryCount={1}
        showFirstButton={!compact}
        showLastButton={!compact}
      />
    </Stack>
  );
}
