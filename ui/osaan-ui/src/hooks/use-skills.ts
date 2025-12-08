import { useQuery } from '@tanstack/react-query';
import { skillApi } from '@/lib/api-client';
import type { GetSkillsParams } from '@/types/skill';

export function useSkills(params?: GetSkillsParams) {
  return useQuery({
    queryKey: ['skills', params],
    queryFn: () => skillApi.getSkills(params),
  });
}
