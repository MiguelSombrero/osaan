import type { GetSkillsResponse } from '@/api/generated/api';
import { skillApi } from '@/api/skillApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSkills = (sort?: string[]) => {
  const qc = useQueryClient();

  const q = useQuery<GetSkillsResponse>({
    queryKey: ['skills', sort],
    queryFn: () => skillApi.getSkills(sort),
  });

  const create = useMutation({
    mutationFn: (name: string) => skillApi.createSkill({ name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => skillApi.deleteSkill(id).then(() => id),
    onSuccess: (deletedId) => {
      qc.setQueryData<GetSkillsResponse>(['skills'], (oldData) => {
        if (!oldData || !oldData.skills) return oldData;
        return {
          ...oldData,
          skills: oldData.skills.filter((skill) => skill.id !== deletedId),
        };
      });
    },
  });

  return { ...q, create, remove };
};
