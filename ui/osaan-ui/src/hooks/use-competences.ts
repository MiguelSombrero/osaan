'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competenceApi, competenceReadApi } from '@/lib/api-client';
import type { Competence } from '@/types/competence';

function useCompetences(employeeId: string | undefined) {
  return useQuery({
    queryKey: ['competences', employeeId],
    queryFn: () => competenceReadApi.getProfile(employeeId!),
    enabled: !!employeeId,
  });
}

function useSaveCompetences(employeeId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (competences: Omit<Competence, 'id' | 'employeeId'>[]) =>
      competenceApi.createCompetences(employeeId!, competences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences', employeeId] });
    },
  });
}

export { useCompetences, useSaveCompetences };
