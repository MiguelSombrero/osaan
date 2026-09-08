import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/server-api', () => ({
  fetchWithAuth: vi.fn(),
}));

import { fetchWithAuth } from '@/lib/server-api';
import { PATCH } from '../route';

function patchRequest(body: unknown) {
  return new NextRequest('http://localhost/api/competences/e1/c1', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

const ctx = { params: Promise.resolve({ employeeId: 'e1', competenceId: 'c1' }) };

describe('PATCH /api/competences/[employeeId]/[competenceId]', () => {
  beforeEach(() => {
    vi.mocked(fetchWithAuth).mockReset();
  });

  it('returns 400 for a missing rating', async () => {
    const response = await PATCH(patchRequest({}), ctx);
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('returns 400 for an out-of-range rating', async () => {
    const response = await PATCH(patchRequest({ rating: 6 }), ctx);
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('forwards a valid rating update', async () => {
    vi.mocked(fetchWithAuth).mockResolvedValue({ id: 'c1', skillName: 'Rust', rating: 4 });
    const response = await PATCH(patchRequest({ rating: 4 }), ctx);
    expect(response.status).toBe(200);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      '/v1/competences/c1',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ rating: 4 }) })
    );
  });
});
