import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useCreateSubscription,
  useDeleteSubscription,
  useSubscriptions,
} from '@/hooks/use-subscriptions';
import { createTestQueryClient } from '@/test/renderWithProviders';
import { server } from '@/test/mocks/server';
import {
  createSubscriptionErrorHandler,
  deleteSubscriptionErrorHandler,
  resetMocks,
  setMockSubscriptions,
  subscriptionsGetErrorHandler,
} from '@/test/mocks/handlers';
import type { Subscription } from '@/types/subscription';

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

const SAMPLE: Subscription = {
  id: 'sub-1',
  userId: 'user-1',
  email: 'anna@example.com',
  skill: 'python',
  rating: 3,
  createdAt: '2026-06-19T10:00:00Z',
};

beforeEach(() => {
  resetMocks();
});

describe('useSubscriptions', () => {
  it('fetches and returns the subscription list', async () => {
    setMockSubscriptions([SAMPLE]);

    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].skill).toBe('python');
  });

  it('reports error when GET fails', async () => {
    server.use(subscriptionsGetErrorHandler(500));

    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCreateSubscription', () => {
  it('creates a subscription successfully', async () => {
    const { result } = renderHook(() => useCreateSubscription(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ skill: 'go', rating: 4 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.skill).toBe('go');
  });

  it('reports error when POST fails', async () => {
    server.use(createSubscriptionErrorHandler(500));

    const { result } = renderHook(() => useCreateSubscription(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ skill: 'rust', rating: 2 });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useDeleteSubscription', () => {
  it('deletes a subscription successfully', async () => {
    setMockSubscriptions([SAMPLE]);

    const { result } = renderHook(() => useDeleteSubscription(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(SAMPLE.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('reports error when DELETE fails', async () => {
    server.use(deleteSubscriptionErrorHandler(500));

    const { result } = renderHook(() => useDeleteSubscription(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('any-id');

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
