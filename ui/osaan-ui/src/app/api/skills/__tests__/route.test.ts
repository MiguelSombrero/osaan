import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/server-api', () => ({
  fetchWithAuth: vi.fn(),
}));

import { fetchWithAuth } from '@/lib/server-api';
import { GET } from '../route';

function getRequest(query: string) {
  return new NextRequest(`http://localhost/api/skills${query}`);
}

describe('GET /api/skills', () => {
  beforeEach(() => {
    vi.mocked(fetchWithAuth).mockReset();
  });

  it('accepts an empty query (all params optional)', async () => {
    vi.mocked(fetchWithAuth).mockResolvedValue({ skills: [] });
    const response = await GET(getRequest(''));
    expect(response.status).toBe(200);
    expect(fetchWithAuth).toHaveBeenCalledWith(expect.any(String), '/v1/skills');
  });

  it('returns 400 for a negative page', async () => {
    const response = await GET(getRequest('?page=-1'));
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('returns 400 for a non-numeric size', async () => {
    const response = await GET(getRequest('?size=abc'));
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('forwards valid params', async () => {
    vi.mocked(fetchWithAuth).mockResolvedValue({ skills: [] });
    const response = await GET(getRequest('?query=Rust&page=1&size=10'));
    expect(response.status).toBe(200);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('query=Rust')
    );
  });
});
