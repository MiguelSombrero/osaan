import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/server-api', () => ({
  fetchWithAuth: vi.fn(),
}));

import { fetchWithAuth } from '@/lib/server-api';
import { POST } from '../route';

function postRequest(body: unknown) {
  return new NextRequest('http://localhost/api/competences/e1', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

const ctx = { params: Promise.resolve({ employeeId: 'e1' }) };

describe('POST /api/competences/[employeeId]', () => {
  beforeEach(() => {
    vi.mocked(fetchWithAuth).mockReset();
  });

  it('returns 400 for an invalid rating in the array', async () => {
    const response = await POST(postRequest([{ skillId: 's1', rating: 0 }]), ctx);
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('forwards a valid array body and returns 201', async () => {
    vi.mocked(fetchWithAuth).mockResolvedValue([]);
    const response = await POST(postRequest([{ skillId: 's1', rating: 3 }]), ctx);
    expect(response.status).toBe(201);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      '/v1/competences',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
