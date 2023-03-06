import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error = (): JSX.Element => {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/', { replace: true });
  };

  return (
    <Stack gap={2} sx={{ height: '100vh', justifyContent: 'center' }}>
      <Typography textAlign="center" variant="h1" component="div">
        ¯\_(ツ)_/¯
      </Typography>
      <Typography textAlign="center" variant="h4" component="div">
        Oops! Page not found
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" size="large" onClick={handleClick}>
          Home
        </Button>
      </Box>
    </Stack>
  );
};

export default Error;
