"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthUser = {
  id: number;
  email: string;
  username: string;
};

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');
    if (t) setToken(t);
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (_error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  function login(t: string, nextUser: AuthUser) {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(t);
    setUser(nextUser);
    router.push('/');
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/');
  }

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
