import Cart from './Cart';

interface CartPage {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

export default CartPage;
