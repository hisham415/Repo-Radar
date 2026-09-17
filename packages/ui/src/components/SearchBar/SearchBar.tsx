import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  isLoading = false,
  placeholder = 'Search GitHub repositories…',
  autoFocus = false,
}: SearchBarProps) {
  return (
    <TextField
      fullWidth
      type="search"
      value={value}
      autoFocus={autoFocus}
      placeholder={placeholder}
      inputProps={{ 'aria-label': 'Search repositories' }}
      onChange={(event) => onChange(event.target.value)}
      sx={{ '& input[type=search]::-webkit-search-cancel-button': { display: 'none' } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {isLoading ? (
              <CircularProgress size={20} aria-label="Searching" />
            ) : value ? (
              <IconButton size="small" aria-label="Clear search" onClick={() => onChange('')}>
                <ClearRoundedIcon fontSize="small" />
              </IconButton>
            ) : null}
          </InputAdornment>
        ),
      }}
    />
  );
}
