import { Box, Stack } from '@mui/material';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { Outlet } from 'react-router-dom';

const Root = (): JSX.Element => {
  return (
    <Stack sx={{ height: '100vh' }}>
      <Header />
      <Box component="main" flex={1}>
        <Outlet />
      </Box>
      <Footer />
    </Stack>
  );
};

export default Root;
