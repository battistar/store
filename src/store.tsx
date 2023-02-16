import { getProducts } from 'http/client';
import Product from 'models/Product';
import { createContext, useCallback, useContext, useReducer } from 'react';

const DEFAULT_PAGE_SIZE = 30;

const currentPage = (skip: number, limit = DEFAULT_PAGE_SIZE): number => {
  return Math.ceil(skip / limit) + 1;
};

const totalPages = (total: number, limit = DEFAULT_PAGE_SIZE): number => {
  return Math.ceil(total / limit);
};

interface ProductListPage {
  products: Product[];
  currentPage: number;
  totalPages: number;
}

type ProductState = {
  data: ProductListPage;
  isLoading: boolean;
  error?: Error;
};

type ProductAction =
  | { type: 'SET_PAGE'; payload: ProductListPage }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'SET_IS_LOADING'; payload: boolean };

const useProductSource = (): {
  data: ProductListPage;
  fetchData: (page: number) => Promise<void>;
  isLoading: boolean;
  error?: Error;
} => {
  const [source, dispatch] = useReducer(
    (state: ProductState, action: ProductAction) => {
      switch (action.type) {
        case 'SET_PAGE':
          return { ...state, data: action.payload };
        case 'SET_IS_LOADING':
          return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
          return { ...state, error: action.payload };
      }
    },
    {
      data: {
        products: [],
        currentPage: 0,
        totalPages: 0,
      },
      isLoading: true,
    }
  );

  const fetchData = useCallback(async (page = 1): Promise<void> => {
    dispatch({ type: 'SET_IS_LOADING', payload: true });

    try {
      const skip = (page - 1) * DEFAULT_PAGE_SIZE;
      const response = await getProducts(skip);

      const productPage = {
        products: response.data.products,
        currentPage: currentPage(response.data.skip),
        totalPages: totalPages(response.data.total),
      };
      dispatch({ type: 'SET_PAGE', payload: productPage });
    } catch (e) {
      console.error(e);

      dispatch({ type: 'SET_ERROR', payload: e as Error });
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  }, []);

  return { data: source.data, fetchData: fetchData, isLoading: source.isLoading, error: source.error };
};

const ProductContext = createContext<ReturnType<typeof useProductSource>>({} as ReturnType<typeof useProductSource>);

export const useProduct = (): ReturnType<typeof useProductSource> => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <ProductContext.Provider value={useProductSource()}>{children}</ProductContext.Provider>;
};
