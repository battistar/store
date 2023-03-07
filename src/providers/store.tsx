import { getProduct, getProducts, searchProduct } from 'http/client';
import Product from 'models/Product';
import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

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
  page?: number;
  query?: string;
  isLoading: boolean;
  error?: Error;
};

type ProductAction =
  | { type: 'SET_DATA'; payload: ProductListPage }
  | { type: 'SET_PAGE'; payload?: number }
  | { type: 'SET_QUERY'; payload?: string }
  | { type: 'SET_ERROR'; payload?: Error }
  | { type: 'SET_IS_LOADING'; payload: boolean };

const useProductSource = (): {
  data: ProductListPage;
  loadPage: (page: number) => void;
  search: (query: string) => void;
  fetchProduct: (id: number) => Promise<Product | null>;
  isLoading: boolean;
  error?: Error;
} => {
  const [source, dispatch] = useReducer(
    (state: ProductState, action: ProductAction) => {
      switch (action.type) {
        case 'SET_DATA':
          return { ...state, data: action.payload };
        case 'SET_PAGE':
          return { ...state, page: action.payload };
        case 'SET_QUERY':
          return { ...state, query: action.payload };
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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!source.page) {
        return;
      }

      dispatch({ type: 'SET_IS_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: undefined });

      try {
        const skip = (source.page - 1) * DEFAULT_PAGE_SIZE;

        let response;
        if (source.query) {
          response = await searchProduct(source.query, skip);
        } else {
          response = await getProducts(skip);
        }

        const productPage = {
          products: response.data.products,
          currentPage: currentPage(response.data.skip),
          totalPages: totalPages(response.data.total),
        };

        dispatch({ type: 'SET_DATA', payload: productPage });
      } catch (e) {
        console.error(e);

        dispatch({ type: 'SET_ERROR', payload: e as Error });
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }
    };

    fetchData();
  }, [source.page, source.query]);

  const loadPage = useCallback((page = 1): void => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const search = useCallback((query: string): void => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, []);

  const fetchProduct = useCallback(
    async (id: number): Promise<Product | null> => {
      dispatch({ type: 'SET_IS_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: undefined });

      const result = source.data.products.find((product) => product.id === id);
      if (result) {
        dispatch({ type: 'SET_IS_LOADING', payload: false });

        return result;
      }

      try {
        const response = await getProduct(id);

        return response.data;
      } catch (e) {
        console.error(e);

        dispatch({ type: 'SET_ERROR', payload: e as Error });
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      }

      return null;
    },
    [source.data.products]
  );

  return {
    data: source.data,
    loadPage: loadPage,
    search: search,
    fetchProduct: fetchProduct,
    isLoading: source.isLoading,
    error: source.error,
  };
};

const ProductContext = createContext<ReturnType<typeof useProductSource>>({} as ReturnType<typeof useProductSource>);

export const useProduct = (): ReturnType<typeof useProductSource> => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <ProductContext.Provider value={useProductSource()}>{children}</ProductContext.Provider>;
};
