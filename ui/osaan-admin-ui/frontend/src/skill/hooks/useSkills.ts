import type { Skill } from '@/api/generated/api';
import { skillApi } from '@/api/skillApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSkills = (sort?: string[]) => {
  const qc = useQueryClient();

  const q = useQuery<Skill[]>({
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
      qc.setQueryData<Skill[]>(['skills'], (oldSkills = []) => 
        oldSkills.filter(skill => skill.id !== deletedId)
      );
    },
  });

  return { ...q, create, remove };
};
