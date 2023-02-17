import axios, { AxiosResponse } from 'axios';
import Product from 'models/Product';
import ProductPage from 'models/ProductPage';

const httpClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async (skip = 0): Promise<AxiosResponse<ProductPage>> => {
  const params = {
    skip: skip,
  };

  return await httpClient.get<ProductPage>('/products', { params: params });
};

export const getProduct = async (id: number): Promise<AxiosResponse<Product>> => {
  return await httpClient.get<Product>(`/products/${id}`);
};
