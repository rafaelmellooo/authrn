import React, { createContext, useState, useEffect, useContext } from 'react';
import { AsyncStorage } from 'react-native';

import api from '../services/api';
import * as auth from '../services/auth';

type User = {
  name: string;
  email: string;
};

type AuthContextData = {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStoragedData = async () => {
    const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
    const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

    if (storagedUser && storagedToken) {
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;

      setUser(JSON.parse(storagedUser));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStoragedData();
  }, []);

  const signIn = async () => {
    const response = await auth.signIn();

    setUser(response.user);

    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@RNAuth:token', response.token);
  };

  const signOut = () => {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
