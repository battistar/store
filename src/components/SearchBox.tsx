import { IconButton, InputBase, Stack, SxProps, Theme } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';

interface SearchBoxProps {
  onSearch: (text: string) => void;
  sx?: SxProps<Theme>;
}

const SearchBox = ({ onSearch, sx }: SearchBoxProps): JSX.Element => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue(event.target.value);
  }, []);

  const handleClick = useCallback((): void => {
    if (value) {
      onSearch(value);
    }
  }, [value, onSearch]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      if (value && event.key === 'Enter') {
        onSearch(value);
      }
    },
    [value, onSearch]
  );

  return (
    <Stack
      direction="row"
      sx={{
        border: (theme) => `1px solid ${theme.palette.grey[300]}`,
        borderRadius: 20,
        px: 2,
        ...sx,
      }}
    >
      <InputBase
        placeholder="Search..."
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        sx={{ flex: 1, color: (theme) => theme.palette.grey[500] }}
      />
      <IconButton onClick={handleClick} disabled={value === ''}>
        <SearchIcon />
      </IconButton>
    </Stack>
  );
};

export default SearchBox;
