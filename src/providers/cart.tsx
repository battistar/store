import { getCart, updateCart } from 'http/client';
import Cart from 'models/Cart';
import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { useUser } from './user';

type CartState = {
  cart: Cart | null;
  isLoading: boolean;
  error?: Error;
};

type CartAction =
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_ERROR'; payload?: Error }
  | { type: 'SET_IS_LOADING'; payload: boolean };

const useCartSource = (): {
  cart: Cart | null;
  addToCart: (productID: number) => Promise<void>;
  removeFromCart: (productID: number) => Promise<void>;
  isLoading: boolean;
  error?: Error;
} => {
  const { user } = useUser();
  const [data, dispatch] = useReducer(
    (state: CartState, action: CartAction) => {
      switch (action.type) {
        case 'SET_CART':
          return { ...state, cart: action.payload };
        case 'SET_IS_LOADING':
          return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
          return { ...state, error: action.payload };
      }
    },
    {
      cart: null,
      isLoading: true,
    }
  );

  const fetchData = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: undefined });

    if (!user) {
      dispatch({ type: 'SET_CART', payload: null });
      dispatch({ type: 'SET_IS_LOADING', payload: false });

      return;
    }

    try {
      const response = await getCart(user.id);

      dispatch({ type: 'SET_CART', payload: response.data.carts[0] });
    } catch (e) {
      console.error(e);

      dispatch({ type: 'SET_ERROR', payload: e as Error });
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [user, fetchData]);

  const addToCart = useCallback(
    async (productID: number): Promise<void> => {
      dispatch({ type: 'SET_IS_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: undefined });

      if (!data.cart) {
        dispatch({ type: 'SET_IS_LOADING', payload: false });

        return;
      }

      try {
        await updateCart(data.cart.id, productID);
        await fetchData();
      } catch (e) {
        console.error(e);

        dispatch({ type: 'SET_ERROR', payload: e as Error });
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }
    },
    [data.cart, fetchData]
  );

  const removeFromCart = useCallback(
    async (productID: number): Promise<void> => {
      dispatch({ type: 'SET_IS_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: undefined });

      if (!data.cart) {
        dispatch({ type: 'SET_IS_LOADING', payload: false });

        return;
      }

      try {
        await updateCart(data.cart.id, productID, false);
        await fetchData();
      } catch (e) {
        console.error(e);

        dispatch({ type: 'SET_ERROR', payload: e as Error });
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }
    },
    [data.cart, fetchData]
  );

  return {
    cart: data.cart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    isLoading: data.isLoading,
    error: data.error,
  };
};

const CartContext = createContext<ReturnType<typeof useCartSource>>({} as ReturnType<typeof useCartSource>);

export const useCart = (): ReturnType<typeof useCartSource> => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <CartContext.Provider value={useCartSource()}>{children}</CartContext.Provider>;
};
