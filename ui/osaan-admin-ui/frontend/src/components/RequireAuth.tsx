import { PropsWithChildren } from 'react';
import { RequireRole } from './RequireRole';

export function RequireAuth({ children }: PropsWithChildren) {
  return <RequireRole role={undefined}>{children}</RequireRole>;
}
