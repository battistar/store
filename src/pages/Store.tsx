import { Stack, Container, Grid, Pagination, PaginationItem } from '@mui/material';
import ProductCard from 'components/ProductCard';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProduct } from 'store';

const Store = (): JSX.Element => {
  const { page, fetchData, isLoading } = useProduct();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const queryPage = parseInt(query.get('page') || '1');

  if (!isLoading && page.currentPage !== queryPage) {
    fetchData(queryPage);
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Stack gap={2} alignItems="center">
        <Grid container spacing={2}>
          {page.products.map((product) => {
            return (
              <Grid key={product.id} item xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            );
          })}
        </Grid>
        <Pagination
          count={page.totalPages}
          page={page.currentPage}
          renderItem={(item): ReactNode => (
            <PaginationItem component={Link} to={`/store${item.page === 1 ? '' : `?page=${item.page}`}`} {...item} />
          )}
        />
      </Stack>
    </Container>
  );
};

export default Store;
