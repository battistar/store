import axios, { AxiosResponse } from 'axios';
import Product from 'models/Product';
import ProductPage from 'models/ProductPage';
import User from 'models/User';

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

export const login = async (username: string, password: string): Promise<AxiosResponse<User>> => {
  const data = {
    username: username,
    password: password,
  };

  return await httpClient.post<User>('/auth/login', data);
};
