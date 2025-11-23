import { PropsWithChildren, useEffect } from 'react';
import { login, useAuth } from '../hooks/useAuth';

export function RequireAuth({ children }: PropsWithChildren) {
  const { data, isLoading } = useAuth();
  const isAuthenticated = data?.authenticated;
  const isAuthDisabled = data?.authDisabled;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthDisabled) {
      login();
    }
  }, [isLoading, isAuthenticated, isAuthDisabled]);

  if (isLoading) return <div>Loading...</div>;

  if (isAuthDisabled) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null; // Waiting for redirect
  }

  return <>{children}</>;
}