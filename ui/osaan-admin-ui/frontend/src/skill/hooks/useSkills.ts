import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillApi } from '@/api/skillApi';
import type { Skill } from '@/api/generated/api';

export const useSkills = () => {
  const qc = useQueryClient();

  const q = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => skillApi.getSkills(),
  });

  const create = useMutation({
    mutationFn: (name: string) => skillApi.createSkill({ name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => skillApi.deleteSkill(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });

  return { ...q, create, remove };
};
