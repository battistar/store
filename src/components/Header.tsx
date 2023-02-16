import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Paid as MoneyIcon } from '@mui/icons-material';

const Header = (): JSX.Element => {
  return (
    <AppBar component="header" position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              STORE
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
