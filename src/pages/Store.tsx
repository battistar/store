import { Stack, Container, Grid, Pagination, PaginationItem, Typography, Box } from '@mui/material';
import Loader from 'components/Loader';
import ProductCard from 'components/ProductCard';
import { ReactNode, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProduct } from 'providers/store';
import { useCart } from 'providers/cart';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import SearchBox from 'components/SearchBox';

const Store = (): JSX.Element => {
  const { data, loadPage, search, isLoading: storeIsLoading } = useProduct();
  const { addToCart, isLoading: cartIsLoading, error: cartError } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get('page') || '1');
  const query = queryParams.get('search') || '';

  useEffect(() => {
    loadPage(page);
  }, [loadPage, page]);

  useEffect(() => {
    search(query);
  }, [search, query]);

  useEffect(() => {
    if (cartError) {
      if (axios.isAxiosError(cartError)) {
        if (cartError.response?.data.message) {
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

  const handleAddToCartClick = useCallback(
    async (id: number): Promise<void> => {
      await addToCart(id);

      enqueueSnackbar('Item added to cart', { variant: 'success' });
    },
    [addToCart, enqueueSnackbar]
  );

  const handleSearch = useCallback(
    (text: string): void => {
      navigate(`/store?search=${text}`);
    },
    [navigate]
  );

  return (
    <>
      {!storeIsLoading && (
        <Container maxWidth="lg" sx={{ height: '100%', py: { xs: 2, sm: 3 } }}>
          <Stack gap={2} alignItems="center" sx={{ height: '100%' }}>
            <SearchBox
              onSearch={handleSearch}
              sx={{ width: '100%', maxWidth: (theme) => theme.breakpoints.values.sm }}
            />
            {data.products.length > 0 ? (
              <Stack gap={2} alignItems="center" sx={{ width: '100%' }}>
                <Grid container spacing={2}>
                  {data.products.map((product) => {
                    return (
                      <Grid key={product.id} item xs={12} sm={6} md={4}>
                        <ProductCard product={product} onClick={handleAddToCartClick} />
                      </Grid>
                    );
                  })}
                </Grid>
                <Pagination
                  count={data.totalPages}
                  page={data.currentPage}
                  renderItem={(item): ReactNode => (
                    <PaginationItem
                      component={Link}
                      to={
                        query
                          ? `/store${item.page === 1 ? `?search=${query}` : `?search=${query}&page=${item.page}`}`
                          : `/store${item.page === 1 ? '' : `?page=${item.page}`}`
                      }
                      {...item}
                    />
                  )}
                />
              </Stack>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body1" component="div" color="text.secondary">
                  Product not found
                </Typography>
              </Box>
            )}
          </Stack>
        </Container>
      )}

      {(storeIsLoading || cartIsLoading) && <Loader />}
    </>
  );
};

export default Store;
