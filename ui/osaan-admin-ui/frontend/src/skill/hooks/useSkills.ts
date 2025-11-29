import type { GetSkillsResponse } from '@/api/generated/api';
import { skillApi } from '@/api/skillApi';
import { parseApiError, ApiError } from '@/api/errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSkills = (sort?: string[], query?: string) => {
  const qc = useQueryClient();

  const q = useQuery<GetSkillsResponse, ApiError>({
    queryKey: ['skills', sort, query],
    queryFn: async () => {
      try {
        return await skillApi.getSkills(query, sort);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
  });

  const create = useMutation({
    mutationFn: async (name: string) => {
      try {
        return await skillApi.createSkill({ name });
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      try {
        await skillApi.deleteSkill(id);
        return id;
      } catch (err) {
        throw parseApiError(err);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  return { ...q, create, remove };
};
