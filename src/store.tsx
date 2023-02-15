import { getProducts } from 'http/client';
import Product from 'models/Product';
import { createContext, useContext, useEffect, useReducer } from 'react';

const DEFAULT_PAGE_SIZE = 30;

const currentPage = (limit: number, skip = DEFAULT_PAGE_SIZE): number => {
  return Math.ceil(skip / limit) + 1;
};

const totalPages = (total: number, skip = DEFAULT_PAGE_SIZE): number => {
  return Math.ceil(total / skip);
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

const useProductSource = (): { page: ProductListPage; error?: Error } => {
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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await getProducts();

        const productPage = {
          products: response.data.products,
          currentPage: currentPage(response.data.limit),
          totalPages: totalPages(response.data.total),
        };
        dispatch({ type: 'SET_PAGE', payload: productPage });
      } catch (e) {
        console.error(e);

        dispatch({ type: 'SET_ERROR', payload: e as Error });
      }
    };

    fetchData();
  }, []);

  return { page: source.page, error: source.error };
};

const ProductContext = createContext<ReturnType<typeof useProductSource>>({} as ReturnType<typeof useProductSource>);

export const useProduct = (): ProductState => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <ProductContext.Provider value={useProductSource()}>{children}</ProductContext.Provider>;
};
