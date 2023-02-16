import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProductProvider } from 'store';
import Root from 'pages/Root';
import Home from 'pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
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
