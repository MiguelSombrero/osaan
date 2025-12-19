import { http, HttpResponse } from 'msw';
import type { AuthState } from '@/hooks/useAuth';
import type { Skill } from '@/api/generated/skills/api';
import { mockAdminUser, mockSkills, createMockSkillsResponse } from './data';

// Mutable state for tests to override
let currentAuthState: AuthState = mockAdminUser;
let currentSkills: Skill[] = [...mockSkills];

export function setMockAuthState(state: AuthState) {
  currentAuthState = state;
}

export function setMockSkills(skills: Skill[]) {
  currentSkills = [...skills];
}

export function resetMocks() {
  currentAuthState = mockAdminUser;
  currentSkills = [...mockSkills];
}

export const handlers = [
  // Auth endpoint - match both relative and absolute URLs
  http.get('*/api/user', () => {
    return HttpResponse.json(currentAuthState);
  }),

  // Get skills - matches /api/v1/skills (public endpoint)
  http.get('*/v1/skills', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.toLowerCase();
    const sortParam = url.searchParams.getAll('sort');

    let filteredSkills = [...currentSkills];

    // Filter by search query
    if (query) {
      filteredSkills = filteredSkills.filter(skill => skill.name?.toLowerCase().includes(query));
    }

    // Sort by name (default: name,asc when no sort param provided)
    const sortString = sortParam.length > 0 ? sortParam[0] : 'name,asc';
    const [field, direction] = sortString.split(',');

    if (field === 'name') {
      filteredSkills.sort((a, b) => {
        const comparison = (a.name ?? '').localeCompare(b.name ?? '');
        return direction === 'desc' ? -comparison : comparison;
      });
    }

    return HttpResponse.json(createMockSkillsResponse(filteredSkills));
  }),

  // Create skill
  http.post('*/v1/admin/skills', async ({ request }) => {
    const skill = (await request.json()) as Skill;
    const newSkill: Skill = {
      ...skill,
      id: crypto.randomUUID(),
    };
    currentSkills.push(newSkill);
    return HttpResponse.json(newSkill, { status: 201 });
  }),

  // Delete skill
  http.delete('*/v1/admin/skills/:id', ({ params }) => {
    const { id } = params;
    const index = currentSkills.findIndex(s => s.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404, detail: `Skill with id ${id} not found` },
        { status: 404 }
      );
    }
    currentSkills.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];

// Handler factories for per-test overrides
export const authHandler = (state: AuthState) =>
  http.get('*/api/user', () => HttpResponse.json(state));

export const skillsErrorHandler = (status: number, detail: string) =>
  http.get('*/v1/skills', () => HttpResponse.json({ title: 'Error', status, detail }, { status }));

export const createSkillErrorHandler = (status: number, detail: string) =>
  http.post('*/v1/admin/skills', () =>
    HttpResponse.json({ title: 'Error', status, detail }, { status })
  );

export const deleteSkillErrorHandler = (status: number, detail: string) =>
  http.delete('*/v1/admin/skills/:id', () =>
    HttpResponse.json({ title: 'Error', status, detail }, { status })
  );
