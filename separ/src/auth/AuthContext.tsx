import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMe, login as loginRequest } from '../api/auth';
import { setAccessToken } from '../api/client';
import { tokenStore } from './tokens';
import type { User } from '../types';
import { useQueryClient } from '@tanstack/react-query';

type AuthContextValue = {
  user: User | null;
  isRestoring: boolean;
  now: number;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(() => tokenStore.getAccess() !== null);
  // ساعت زنده برای هدر و محاسبه‌ی «چند روز تا انقضا»
  const [now, setNow] = useState(() => Date.now());
  const queryClient = useQueryClient()

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // بازیابی نشست بعد از رفرش صفحه
  useEffect(() => {
    if (!tokenStore.getAccess()) return;
    fetchMe()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setIsRestoring(false));
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await loginRequest(username, password);
      tokenStore.set(data.accessToken, data.refreshToken);
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate('/');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setAccessToken(null);
    setUser(null);

    queryClient.clear()

    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const onExpired = () => logout();
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isRestoring, now, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
