import React, { createContext, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

import * as auth from '../services/auth';

type AuthContextData = {
  signed: boolean;
  user: object | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStoragedData = async () => {
    const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
    const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

    if (storagedUser && storagedToken) {
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
