import { Container, Grid, Pagination } from '@mui/material';
import { Stack } from '@mui/system';
import ProductCard from 'components/ProductCard';
import { useCallback } from 'react';
import { useProduct } from 'store';

const Home = (): JSX.Element => {
  const { page, fetchData } = useProduct();

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      fetchData(value);
    },
    [fetchData]
  );

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
        <Pagination count={page.totalPages} page={page.currentPage} onChange={handlePageChange} />
      </Stack>
    </Container>
  );
};

export default Home;
