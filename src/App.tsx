import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProductProvider } from 'providers/store';
import { UserProvider } from 'providers/user';
import Root from 'pages/Root';
import Store from 'pages/Store';
import Product from 'pages/Product';
import Login from 'pages/Login';
import Error from 'pages/Error';
import { SnackbarProvider } from 'notistack';

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
    path: 'login',
    element: <Login />,
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
      <UserProvider>
        <SnackbarProvider preventDuplicate anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </UserProvider>
    </ProductProvider>
  );
};

export default App;
