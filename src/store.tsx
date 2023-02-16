import { getProducts } from 'http/client';
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
  page: ProductListPage;
  error?: Error;
};

type ProductAction = { type: 'SET_PAGE'; payload: ProductListPage } | { type: 'SET_ERROR'; payload: Error };

const useProductSource = (): { page: ProductListPage; fetchData: (page: number) => Promise<void>; error?: Error } => {
  const [source, dispatch] = useReducer(
    (state: ProductState, action: ProductAction) => {
      switch (action.type) {
        case 'SET_PAGE':
          return { ...state, page: action.payload };
        case 'SET_ERROR':
          return { ...state, error: action.payload };
      }
    },
    {
      page: {
        products: [],
        currentPage: 0,
        totalPages: 0,
      },
    }
  );

  const fetchData = useCallback(async (page = 1): Promise<void> => {
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
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { page: source.page, fetchData: fetchData, error: source.error };
};

const ProductContext = createContext<ReturnType<typeof useProductSource>>({} as ReturnType<typeof useProductSource>);

export const useProduct = (): ReturnType<typeof useProductSource> => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <ProductContext.Provider value={useProductSource()}>{children}</ProductContext.Provider>;
};
