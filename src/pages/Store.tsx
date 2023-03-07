import {
  Stack,
  Container,
  Grid,
  Pagination,
  PaginationItem,
  InputBase,
  IconButton,
  SxProps,
  Theme,
  Typography,
  Box,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Loader from 'components/Loader';
import ProductCard from 'components/ProductCard';
import { ChangeEvent, KeyboardEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProduct } from 'providers/store';
import { useCart } from 'providers/cart';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface SearchBoxProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick: () => void;
  sx?: SxProps<Theme>;
}

const SearchBox = ({ value, onChange, onClick, sx }: SearchBoxProps): JSX.Element => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      onChange(event);
    },
    [onChange]
  );

  const handleClick = useCallback((): void => {
    if (value) {
      onClick();
    }
  }, [value, onClick]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      if (value && event.key === 'Enter') {
        onClick();
      }
    },
    [value, onClick]
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

const Store = (): JSX.Element => {
  const [searchText, setSearchText] = useState('');
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

  const handleClick = useCallback(
    async (id: number): Promise<void> => {
      await addToCart(id);

      enqueueSnackbar('Item added to cart', { variant: 'success' });
    },
    [addToCart, enqueueSnackbar]
  );

  const onSearchChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSearchText(event.target.value);
  }, []);

  const onSearchClick = useCallback((): void => {
    navigate(`/store?search=${searchText}`);
  }, [searchText, navigate]);

  return (
    <>
      {!storeIsLoading && (
        <Container maxWidth="lg" sx={{ height: '100%', py: { xs: 2, sm: 3 } }}>
          <Stack gap={2} alignItems="center" sx={{ height: '100%' }}>
            <SearchBox
              value={searchText}
              onChange={onSearchChange}
              onClick={onSearchClick}
              sx={{ width: '100%', maxWidth: (theme) => theme.breakpoints.values.sm }}
            />
            {data.products.length > 0 ? (
              <Stack gap={2} alignItems="center" sx={{ width: '100%' }}>
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
                    <PaginationItem
                      component={Link}
                      to={
                        query
                          ? `/store${
                              item.page === 1 ? `?search=${searchText}` : `?search=${searchText}&page=${item.page}`
                            }`
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
