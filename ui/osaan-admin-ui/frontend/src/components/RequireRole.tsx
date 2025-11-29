import { PropsWithChildren, useEffect } from 'react';
import { login, useAuth } from '../hooks/useAuth';
import { Loading } from './Loading';

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

  if (isLoading) return <Loading />;

  if (data?.authDisabled) {
    return <>{children}</>;
  }

  if (!data?.authenticated || (role && !hasRole)) {
    return null;
  }

  return <>{children}</>;
}
