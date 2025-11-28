import type { GetSkillsResponse } from '@/api/generated/api';
import { skillApi } from '@/api/skillApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSkills = (sort?: string[], query?: string) => {
  const qc = useQueryClient();

  const q = useQuery<GetSkillsResponse>({
    queryKey: ['skills', sort, query],
    queryFn: () => skillApi.getSkills(query, sort),
  });

  const create = useMutation({
    mutationFn: (name: string) => skillApi.createSkill({ name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => skillApi.deleteSkill(id).then(() => id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  return { ...q, create, remove };
};
