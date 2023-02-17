import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProductProvider } from 'store';
import Root from 'pages/Root';
import Store from 'pages/Store';
import Product from 'pages/Product';
import Error from 'pages/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate to="/store" replace />,
      },
      {
        path: 'store',
        element: <Store />,
      },
      {
        path: 'store/product/:id',
        element: <Product />,
      },
    ],
  },
  {
    path: 'error',
    element: <Error />,
  },
  {
    path: '*',
    element: <Navigate to="/error" replace />,
  },
]);

const App = (): JSX.Element => {
  return (
    <ProductProvider>
      <RouterProvider router={router} />
    </ProductProvider>
  );
};

export default App;
