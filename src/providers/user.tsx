import { useEffect, useReducer, createContext, useContext, useCallback } from 'react';
import User from 'models/User';
import { login as httpLogin } from 'http/client';

const LOCAL_STORAGE_USER_DATA = 'user-data';

type UserState = {
  user: User | null;
  isLoading: boolean;
  error?: Error;
};

type UserAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload?: Error }
  | { type: 'SET_IS_LOADING'; payload: boolean };

const useUserSource = (): {
  user: User | null;
  login: (usernma: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error?: Error;
} => {
  const [data, dispatch] = useReducer(
    (state: UserState, action: UserAction) => {
      switch (action.type) {
        case 'SET_USER':
          return { ...state, user: action.payload };
        case 'SET_IS_LOADING':
          return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
          return { ...state, error: action.payload };
      }
    },
    {
      user: null,
      isLoading: false,
    }
  );

  useEffect(() => {
    const localStorageUserData = localStorage.getItem(LOCAL_STORAGE_USER_DATA);
    if (localStorageUserData) {
      const user = JSON.parse(localStorageUserData);

      dispatch({ type: 'SET_USER', payload: user });
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: undefined });

    try {
      const response = await httpLogin(username, password);

      localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(response.data));

      dispatch({ type: 'SET_USER', payload: response.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err as Error });
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem(LOCAL_STORAGE_USER_DATA);

    dispatch({ type: 'SET_USER', payload: null });
  }, []);

  return { user: data.user, login: login, logout: logout, isLoading: data.isLoading, error: data.error };
};

const UserContext = createContext<ReturnType<typeof useUserSource>>({} as ReturnType<typeof useUserSource>);

export const useUser = (): ReturnType<typeof useUserSource> => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <UserContext.Provider value={useUserSource()}>{children}</UserContext.Provider>;
};
