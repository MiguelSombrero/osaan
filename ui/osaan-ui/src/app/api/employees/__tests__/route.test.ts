import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/server-api', () => ({
  fetchWithAuth: vi.fn(),
}));

import { fetchWithAuth } from '@/lib/server-api';
import { POST } from '../route';

function postRequest(body: unknown) {
  return new NextRequest('http://localhost/api/employees', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/employees', () => {
  beforeEach(() => {
    vi.mocked(fetchWithAuth).mockReset();
  });

  it('returns 400 for a missing email', async () => {
    const response = await POST(postRequest({ firstName: 'Ada', lastName: 'Lovelace' }));
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid email format', async () => {
    const response = await POST(
      postRequest({ firstName: 'Ada', lastName: 'Lovelace', email: 'not-an-email' })
    );
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('forwards a valid employee and returns 201', async () => {
    vi.mocked(fetchWithAuth).mockResolvedValue({
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
    const response = await POST(
      postRequest({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' })
    );
    expect(response.status).toBe(201);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      '/v1/admin/employees',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
