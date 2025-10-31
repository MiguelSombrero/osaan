import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const r = await axios.get(`/api/user`, { withCredentials: true });
      return r.data as { authenticated: boolean; user?: any };
    },
    staleTime: 30_000,
  });
}
