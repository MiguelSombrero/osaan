import type { Skill } from '@/api/generated/api';
import { skillApi } from '@/api/skillApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSkills = () => {
  const qc = useQueryClient();

  const q = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => skillApi.getSkills(),
  });

  const create = useMutation({
    mutationFn: (name: string) => skillApi.createSkill({ name }),
    onSuccess: (newSkill) => {
      qc.setQueryData<Skill[]>(['skills'], (oldSkills = []) => [...oldSkills, newSkill]);
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
