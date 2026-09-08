import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/server-api', () => ({
  fetchWithAuth: vi.fn(),
}));

import { fetchWithAuth } from '@/lib/server-api';
import { GET } from '../route';

function getRequest(query: string) {
  return new NextRequest(`http://localhost/api/employees/search${query}`);
}

describe('GET /api/employees/search', () => {
  beforeEach(() => {
    vi.mocked(fetchWithAuth).mockReset();
  });

  it('returns 400 and does not call the backend when skillName is missing', async () => {
    const response = await GET(getRequest('?minRating=3'));
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe('Validation failed');
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('returns 400 when minRating is out of range', async () => {
    const response = await GET(getRequest('?skillName=Rust&minRating=9'));
    expect(response.status).toBe(400);
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it('forwards valid params to the backend', async () => {
    vi.mocked(fetchWithAuth).mockResolvedValue([]);
    const response = await GET(getRequest('?skillName=Rust&minRating=3'));

    expect(response.status).toBe(200);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('skillName=Rust')
    );
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('rating=3')
    );
  });
});
