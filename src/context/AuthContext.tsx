import React, { createContext, useContext, useState } from 'react';
import { User, AuthState } from '../types';
import * as api from '../api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      setToken(response.token);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await api.register(email, password, name);
      setToken(response.token);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}