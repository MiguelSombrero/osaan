import { PropsWithChildren, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export function RequireAuth({ children }: PropsWithChildren) {
  const { data, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && data && !data.authenticated) {
      window.location.href = '/api/login';
    }
  }, [isLoading, data]);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.authenticated) return null; // odotetaan redirecttiä

  return <>{children}</>;
}
