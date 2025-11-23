import { PropsWithChildren } from 'react';
import { RequireRole } from './RequireRole';

export function RequireAdmin({ children }: PropsWithChildren) {
  return <RequireRole role="ADMIN">{children}</RequireRole>;
}
