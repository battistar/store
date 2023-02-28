import { Container } from '@mui/material';
import Loader from 'components/Loader';
import ProductDetailCard from 'components/ProductDetailCard';
import Product from 'models/Product';
import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useProduct } from 'providers/store';
import { useCart } from 'providers/cart';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const CheckProduct = (): JSX.Element => {
  const [data, setData] = useState<Product | null>(null);
  const { id } = useParams();
  const { fetchProduct, isLoading, error } = useProduct();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const product = await fetchProduct(Number(id));
      setData(product);
    };

    fetchData();
  }, [fetchProduct, id]);

  return (
    <>
      {data && <ProductPage product={data} />}
      {error && <Navigate to="/error" replace />}
      {isLoading && <Loader />}
    </>
  );
};

const ProductPage = ({ product }: { product: Product }): JSX.Element => {
  const { addToCart, isLoading, error } = useCart();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
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

  const handleClick = useCallback(
    async (id: number): Promise<void> => {
      await addToCart(id);
    },
    [addToCart]
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        <ProductDetailCard product={product} onClick={handleClick} />
      </Container>

      {isLoading && <Loader />}
    </>
  );
};

export default CheckProduct;
