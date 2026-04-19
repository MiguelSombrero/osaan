'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

const MANAGER_ROLES = ['manager', 'osaan_manager'];

export interface AppSession {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  isManager: boolean;
  signIn: (callbackUrl?: string) => void;
  signOut: () => void;
}

export function useAppSession(): AppSession {
  const { data: session, status } = useSession();

  const roles: string[] = session?.user?.roles ?? [];
  const isManager = roles.some((r) => MANAGER_ROLES.includes(r.toLowerCase()));

  return {
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    userId: session?.user?.id ?? null,
    userName: session?.user?.name ?? null,
    userEmail: session?.user?.email ?? null,
    isManager,
    signIn: (callbackUrl = '/competences') => signIn('keycloak', { callbackUrl }),
    signOut: () => signOut(),
  };
}
