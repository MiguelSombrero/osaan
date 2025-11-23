import { PropsWithChildren, useEffect } from 'react';
import { login, useAuth } from '../hooks/useAuth';

export function RequireAuth({ children }: PropsWithChildren) {
  const { data, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && data && !data.authenticated && !data?.authDisabled) {
      login();
    }
  }, [isLoading, data]);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.authenticated) {
    if (data?.authDisabled) {
      return <>{children}</>;
    }
    return null; // odotetaan redirecttiä
  }

  return <>{children}</>;
}