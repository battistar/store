import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Paid as MoneyIcon, Login as LoginIcon } from '@mui/icons-material';
import { useUser } from 'providers/user';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const Header = (): JSX.Element => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleLoginClick = (): void => {
    setAnchorEl(null);

    navigate('/login');
  };

  const handleLogoutClick = (): void => {
    setAnchorEl(null);

    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar component="header" position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Avatar sx={{ opacity: 0, display: { xs: 'none', md: 'flex' } }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            <IconButton onClick={handleAvatarClick}>
              {user ? (
                <Avatar
                  src={user.image}
                  alt={user.username}
                  sx={{ bgcolor: 'white', width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                />
              ) : (
                <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }} />
              )}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {user ? (
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem>{`Hi ${user.firstName} ${user.lastName}`}</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      ) : (
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem onClick={handleLoginClick}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Login</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default Header;
