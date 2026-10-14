import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isRestoring } = useAuth();
  if (isRestoring) return <p className="status">در حال بررسی نشست...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
