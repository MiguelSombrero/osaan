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

function useDeleteCompetence(employeeId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (competenceId: string) =>
      competenceApi.deleteCompetence(employeeId!, competenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences', employeeId] });
    },
  });
}

function useUpdateCompetenceRating(employeeId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ competenceId, rating }: { competenceId: string; rating: number }) =>
      competenceApi.updateCompetenceRating(employeeId!, competenceId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences', employeeId] });
    },
  });
}

export { useCompetences, useSaveCompetences, useDeleteCompetence, useUpdateCompetenceRating };
