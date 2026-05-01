import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import {
  useCompetences,
  useDeleteCompetence,
  useUpdateCompetenceRating,
  useSaveCompetences,
} from '@/hooks/use-competences';
import { createTestQueryClient } from '@/test/renderWithProviders';
import { mockCompetenceProfile, MOCK_EMPLOYEE_ID } from '@/test/mocks/data';
import { server } from '@/test/mocks/server';
import { deleteCompetenceErrorHandler, updateRatingErrorHandler } from '@/test/mocks/handlers';

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useCompetences', () => {
  it('fetches and returns the competence profile', async () => {
    const { result } = renderHook(() => useCompetences(MOCK_EMPLOYEE_ID), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.competences).toHaveLength(2);
    expect(result.current.data?.competences[0].skillName).toBe('Java');
    expect(result.current.data?.employee.id).toBe(MOCK_EMPLOYEE_ID);
  });

  it('does not fetch when employeeId is undefined', () => {
    const { result } = renderHook(() => useCompetences(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });
});

describe('useDeleteCompetence', () => {
  it('deletes a competence successfully', async () => {
    const { result } = renderHook(() => useDeleteCompetence(MOCK_EMPLOYEE_ID), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCompetenceProfile.competences[0].id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('reports error when DELETE fails', async () => {
    server.use(deleteCompetenceErrorHandler(500));

    const { result } = renderHook(() => useDeleteCompetence(MOCK_EMPLOYEE_ID), {
      wrapper: createWrapper(),
    });

    result.current.mutate('non-existent-id');

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpdateCompetenceRating', () => {
  it('updates a competence rating successfully', async () => {
    const { result } = renderHook(() => useUpdateCompetenceRating(MOCK_EMPLOYEE_ID), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      competenceId: mockCompetenceProfile.competences[0].id,
      rating: 5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('reports error when PATCH fails', async () => {
    server.use(updateRatingErrorHandler(500));

    const { result } = renderHook(() => useUpdateCompetenceRating(MOCK_EMPLOYEE_ID), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ competenceId: 'c1', rating: 2 });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useSaveCompetences', () => {
  it('creates competences successfully', async () => {
    const { result } = renderHook(() => useSaveCompetences(MOCK_EMPLOYEE_ID), {
      wrapper: createWrapper(),
    });

    result.current.mutate([{ skillId: 's1', rating: 3 }]);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
