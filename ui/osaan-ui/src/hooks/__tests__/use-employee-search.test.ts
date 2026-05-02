import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { useEmployeeSearch } from '@/hooks/use-employee-search';
import { createTestQueryClient } from '@/test/renderWithProviders';
import { mockEmployeeSearchResults } from '@/test/mocks/data';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useEmployeeSearch', () => {
  it('does not fetch before search is called', () => {
    const { result } = renderHook(() => useEmployeeSearch(), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
    expect(result.current.hasSearched).toBe(false);
  });

  it('fetches employees when search is called with skillName and minRating', async () => {
    const { result } = renderHook(() => useEmployeeSearch(), { wrapper: createWrapper() });

    act(() => {
      result.current.search({ skillName: 'Java', minRating: 3 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasSearched).toBe(true);
    expect(result.current.data).toHaveLength(mockEmployeeSearchResults.length);
    expect(result.current.data![0].firstName).toBe('Jane');
  });

  it('sends skillName as the query parameter', async () => {
    let capturedUrl: string | undefined;
    server.use(
      http.get('*/api/employees/search', ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );

    const { result } = renderHook(() => useEmployeeSearch(), { wrapper: createWrapper() });

    act(() => {
      result.current.search({ skillName: 'TypeScript', minRating: 2 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(capturedUrl).toContain('skillName=TypeScript');
    expect(capturedUrl).toContain('minRating=2');
    expect(capturedUrl).not.toContain('skillId=');
  });

  it('reports error when the search request fails', async () => {
    server.use(
      http.get('*/api/employees/search', () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    );

    const { result } = renderHook(() => useEmployeeSearch(), { wrapper: createWrapper() });

    act(() => {
      result.current.search({ skillName: 'Java', minRating: 1 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
