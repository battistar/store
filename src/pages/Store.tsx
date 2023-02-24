import { Stack, Container, Grid, Pagination, PaginationItem } from '@mui/material';
import Loader from 'components/Loader';
import ProductCard from 'components/ProductCard';
import { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProduct } from 'providers/store';

const Store = (): JSX.Element => {
  const { data, fetchData, isLoading } = useProduct();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1');

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        <Stack gap={2} alignItems="center">
          <Grid container spacing={2}>
            {data.products.map((product) => {
              return (
                <Grid key={product.id} item xs={12} sm={6} md={4}>
                  <ProductCard product={product} />
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

      {isLoading && <Loader />}
    </>
  );
};

export default Store;
