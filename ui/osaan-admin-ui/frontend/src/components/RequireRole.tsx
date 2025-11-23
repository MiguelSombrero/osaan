import { PropsWithChildren, useEffect } from 'react';
import { login, useAuth } from '../hooks/useAuth';

interface RequireRoleProps extends PropsWithChildren {
  role: string;
}

export function RequireRole({ children, role }: RequireRoleProps) {
  const { data, isLoading } = useAuth();
  const hasRole = data?.roles?.includes(role) ?? false;

  useEffect(() => {
    if (!isLoading && data && !data.authenticated && !data?.authDisabled) {
      login();
    }
  }, [isLoading, data]);

  if (isLoading) return <div>Loading...</div>;

  // Allow dev/test when auth is disabled
  if (data?.authDisabled) {
    return <>{children}</>;
  }

  if (!data?.authenticated) {
    return null; // Waiting for redirect
  }

  if (!hasRole) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#d32f2f' }}>Access Denied</h2>
        <p>You do not have the required permissions ({role}) to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}