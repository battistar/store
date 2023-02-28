import { Stack, Container, Grid, Pagination, PaginationItem } from '@mui/material';
import Loader from 'components/Loader';
import ProductCard from 'components/ProductCard';
import { ReactNode, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProduct } from 'providers/store';
import { useCart } from 'providers/cart';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Store = (): JSX.Element => {
  const { data, loadPage, isLoading: storeIsLoading } = useProduct();
  const { addToCart, isLoading: cartIsLoading, error: cartError } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1');

  useEffect(() => {
    loadPage(page);
  }, [loadPage, page]);

  useEffect(() => {
    if (cartError) {
      if (axios.isAxiosError(cartError)) {
        if (cartError.response?.status === 400) {
          enqueueSnackbar(cartError.response.data.message, {
            variant: 'error',
          });
        } else {
          enqueueSnackbar(`${cartError.response?.status} - ${cartError.response?.statusText}`, {
            variant: 'error',
          });
        }
      } else {
        enqueueSnackbar('Unknown error', { variant: 'error' });
      }
    }
  }, [cartError, enqueueSnackbar]);

  const handleClick = useCallback(
    async (id: number): Promise<void> => {
      addToCart(id);
    },
    [addToCart]
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        <Stack gap={2} alignItems="center">
          <Grid container spacing={2}>
            {data.products.map((product) => {
              return (
                <Grid key={product.id} item xs={12} sm={6} md={4}>
                  <ProductCard product={product} onClick={handleClick} />
                </Grid>
              );
            })}
          </Grid>
          <Pagination
            count={data.totalPages}
            page={data.currentPage}
            renderItem={(item): ReactNode => (
              <PaginationItem component={Link} to={`/store${item.page === 1 ? '' : `?page=${item.page}`}`} {...item} />
            )}
          />
        </Stack>
      </Container>

      {(storeIsLoading || cartIsLoading) && <Loader />}
    </>
  );
};

export default Store;
