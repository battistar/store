import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { Paid as MoneyIcon, Login as LoginIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import { useUser } from 'providers/user';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from 'providers/cart';

const Header = (): JSX.Element => {
  const { user, logout } = useUser();
  const { cart } = useCart();
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

  const handleCartClick = (): void => {
    setAnchorEl(null);

    navigate('/store/cart');
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
          <MenuItem disabled sx={{ opacity: '1 !important' }}>{`Hi! ${user.firstName} ${user.lastName}`}</MenuItem>
          <Divider />
          <MenuItem onClick={handleCartClick}>
            <ListItemIcon>
              <Badge badgeContent={cart ? cart.totalProducts : 0} color="primary">
                <CartIcon fontSize="small" />
              </Badge>
            </ListItemIcon>
            <ListItemText>Cart</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
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
