import Product from './Product';

interface ProductPage {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default ProductPage;
