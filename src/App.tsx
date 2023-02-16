import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProductProvider } from 'store';
import Root from 'pages/Root';
import Store from 'pages/Store';

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
        path: '/store',
        element: <Store />,
      },
    ],
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
