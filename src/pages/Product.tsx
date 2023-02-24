import { Container } from '@mui/material';
import Loader from 'components/Loader';
import ProductDetailCard from 'components/ProductDetailCard';
import Product from 'models/Product';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useProduct } from 'providers/store';

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
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <ProductDetailCard product={product} />
    </Container>
  );
};

export default CheckProduct;
