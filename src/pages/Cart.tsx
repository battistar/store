import { Box, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { ShoppingCartCheckout as CheckoutIcon } from '@mui/icons-material';
import axios from 'axios';
import CartCard from 'components/CartCard';
import { useSnackbar } from 'notistack';
import { useCart } from 'providers/cart';
import { useCallback, useEffect } from 'react';
import Loader from 'components/Loader';

const Cart = (): JSX.Element => {
  const { cart, removeFromCart, isLoading, error } = useCart();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          enqueueSnackbar(error.response.data.message, {
            variant: 'error',
          });
        } else {
          enqueueSnackbar(`${error.response?.status} - ${error.response?.statusText}`, {
            variant: 'error',
          });
        }
      } else {
        enqueueSnackbar('Unknown error', { variant: 'error' });
      }
    }
  }, [error, enqueueSnackbar]);

  const handleDelete = useCallback(
    async (id: number): Promise<void> => {
      await removeFromCart(id);

      enqueueSnackbar('Item removed from cart', { variant: 'success' });
    },
    [enqueueSnackbar, removeFromCart]
  );

  return (
    <>
      <Container maxWidth="md" sx={{ height: '100%', py: { xs: 2, sm: 3 } }}>
        {cart && cart.products.length > 0 ? (
          <Paper>
            <Stack>
              {cart.products.map((product) => {
                return (
                  <div key={product.id}>
                    <CartCard onDelete={handleDelete} product={product} />
                    <Divider sx={{ mx: 1 }} />
                  </div>
                );
              })}
            </Stack>
            <Stack alignItems="end" p={2}>
              <Typography variant="h6" component="div">
                Total: {cart.total} $
              </Typography>
              <Typography variant="body1" component="div">
                Total discount:{' '}
                <Box component="span" sx={{ color: 'red' }}>
                  - {cart.discountedTotal}
                </Box>{' '}
                $
              </Typography>
              <Button variant="contained" startIcon={<CheckoutIcon />} sx={{ mt: 2 }}>
                Checkout
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Paper sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body1" component="div">
              The cart is empty
            </Typography>
          </Paper>
        )}
      </Container>

      {isLoading && <Loader />}
    </>
  );
};

export default Cart;
