import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/server-api', () => ({
  fetchWithAuth: vi.fn(),
}));

import { fetchWithAuth } from '@/lib/server-api';
import { POST } from '../route';

function postRequest(body: unknown) {
  return new NextRequest('http://localhost/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/subscriptions', () => {
  beforeEach(() => {
    vi.mocked(fetchWithAuth).mockReset();
  });

  it('returns 400 with a validation error and does not call the backend when the body is invalid', async () => {
    const response = await POST(postRequest({ skill: '', rating: 3 }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe('Validation failed');
    expect(json.details).toBeDefined();
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('rejects an out-of-range rating', async () => {
    const response = await POST(postRequest({ skill: 'Rust', rating: 9 }));
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('forwards a valid body to the backend and returns 201', async () => {
    vi.mocked(fetchWithAuth).mockResolvedValue({
      id: '1',
      userId: 'u1',
      email: 'ada@example.com',
      skill: 'Rust',
      rating: 3,
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    const response = await POST(postRequest({ skill: 'Rust', rating: 3 }));

    expect(response.status).toBe(201);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      '/v1/subscriptions',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ skill: 'Rust', rating: 3 }),
      })
    );
  });
});
