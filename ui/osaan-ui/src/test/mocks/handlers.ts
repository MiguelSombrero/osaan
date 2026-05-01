import { http, HttpResponse } from 'msw';
import type { CompetenceProfileData } from '@/types/competence';
import type { GetSkillsResponse } from '@/types/skill';
import { mockCompetenceProfile, mockSkillsResponse } from './data';

let currentProfile: CompetenceProfileData = structuredClone(mockCompetenceProfile);
let currentSkillsResponse: GetSkillsResponse = structuredClone(mockSkillsResponse);

export function setMockProfile(profile: CompetenceProfileData) {
  currentProfile = structuredClone(profile);
}

export function setMockSkillsResponse(response: GetSkillsResponse) {
  currentSkillsResponse = structuredClone(response);
}

export function resetMocks() {
  currentProfile = structuredClone(mockCompetenceProfile);
  currentSkillsResponse = structuredClone(mockSkillsResponse);
}

export const handlers = [
  http.get('*/api/competences/:employeeId', () => {
    return HttpResponse.json(currentProfile);
  }),

  http.post('*/api/competences/:employeeId', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body, { status: 201 });
  }),

  http.delete('*/api/competences/:employeeId/:competenceId', ({ params }) => {
    const { competenceId } = params as { competenceId: string };
    currentProfile = {
      ...currentProfile,
      competences: currentProfile.competences.filter((c) => c.id !== competenceId),
    };
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('*/api/competences/:employeeId/:competenceId', async ({ params, request }) => {
    const { competenceId } = params as { competenceId: string };
    const { rating } = (await request.json()) as { rating: number };
    currentProfile = {
      ...currentProfile,
      competences: currentProfile.competences.map((c) =>
        c.id === competenceId ? { ...c, rating } : c
      ),
    };
    const updated = currentProfile.competences.find((c) => c.id === competenceId);
    return HttpResponse.json(updated);
  }),

  http.get('*/api/skills', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.toLowerCase();
    if (query) {
      const filtered = {
        ...currentSkillsResponse,
        skills: currentSkillsResponse.skills.filter((s) =>
          s.name.toLowerCase().includes(query)
        ),
      };
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(currentSkillsResponse);
  }),
];

// Per-test error overrides
export const competenceProfileErrorHandler = (status: number) =>
  http.get('*/api/competences/:employeeId', () =>
    HttpResponse.json({ error: 'Failed' }, { status })
  );

export const deleteCompetenceErrorHandler = (status: number) =>
  http.delete('*/api/competences/:employeeId/:competenceId', () =>
    HttpResponse.json({ error: 'Failed' }, { status })
  );

export const updateRatingErrorHandler = (status: number) =>
  http.patch('*/api/competences/:employeeId/:competenceId', () =>
    HttpResponse.json({ error: 'Failed' }, { status })
  );
