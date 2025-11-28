import { PropsWithChildren, useEffect } from 'react';
import { login, useAuth } from '../hooks/useAuth';

interface RequireRoleProps extends PropsWithChildren {
  role?: string;
}

export function RequireRole({ children, role }: RequireRoleProps) {
  const { data, isLoading } = useAuth();
  const hasRole = role ? (data?.roles?.includes(role) ?? false) : true;

  useEffect(() => {
    if (!isLoading && data && !data.authenticated && !data?.authDisabled) {
      login();
    }
  }, [isLoading, data]);

  if (isLoading) return <div>Loading...</div>;

  if (data?.authDisabled) {
    return <>{children}</>;
  }

  if (!data?.authenticated || (role && !hasRole)) {
    return;
  }

  return <>{children}</>;
}
