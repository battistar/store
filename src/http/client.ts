import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import Product from 'models/Product';
import User from 'models/User';
import ProductPage from 'models/ProductPage';
import CartPage from 'models/CartPage';

const BASE_URL = 'https://dummyjson.com';

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authClient.interceptors.request.use((config) => {
  const userData = localStorage.getItem('user-data');

  if (userData) {
    const user = JSON.parse(userData) as User;

    config.headers = config.headers as AxiosHeaders;
    config.headers.set('Authorization', `Bearer ${user.token}`);
  }

  return config;
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

export const getCart = async (userID: number): Promise<AxiosResponse<CartPage>> => {
  return await authClient.get<CartPage>(`/carts/user/${userID}`);
};

export const updateCart = async (cartID: number, productID: number, add = true): Promise<AxiosResponse<CartPage>> => {
  const data = {
    merge: true,
    products: [
      {
        id: productID,
        quantity: add ? 1 : 0,
      },
    ],
  };

  return await authClient.put(`/carts/${cartID}`, data);
};
