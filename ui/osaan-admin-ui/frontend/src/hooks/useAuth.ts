import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AUTH_QUERY_KEY = ['auth', 'me'] as const;
const AUTH_ENDPOINT = '/api/user';
const LOGIN_ENDPOINT = '/api/login';
const LOGOUT_ENDPOINT = '/api/logout';

export interface UserProfile {
  name: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  authenticated: boolean;
  user?: UserProfile;
  roles?: string[];
  authDisabled?: boolean;
}

export function login() {
  window.location.assign(LOGIN_ENDPOINT);
}

export function logout() {
  window.location.assign(LOGOUT_ENDPOINT);
}

export function useAuth() {
  return useQuery<AuthState>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const response = await axios.get<AuthState>(AUTH_ENDPOINT, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 30_000,
  });
}

export function useHasRole(role: string): boolean {
  const { data } = useAuth();
  return data?.roles?.includes(role) ?? false;
}

export { AUTH_QUERY_KEY };
