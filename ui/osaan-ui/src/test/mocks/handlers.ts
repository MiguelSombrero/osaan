import { http, HttpResponse } from 'msw';
import type { CompetenceProfileData } from '@/types/competence';
import type { GetSkillsResponse } from '@/types/skill';
import type { EmployeeSearchResult } from '@/types/manager';
import { mockCompetenceProfile, mockSkillsResponse, mockEmployeeSearchResults } from './data';

let currentProfile: CompetenceProfileData = structuredClone(mockCompetenceProfile);
let currentSkillsResponse: GetSkillsResponse = structuredClone(mockSkillsResponse);
let currentEmployeeSearchResults: EmployeeSearchResult[] = structuredClone(mockEmployeeSearchResults);

export function setMockProfile(profile: CompetenceProfileData) {
  currentProfile = structuredClone(profile);
}

export function setMockSkillsResponse(response: GetSkillsResponse) {
  currentSkillsResponse = structuredClone(response);
}

export function setMockEmployeeSearchResults(results: EmployeeSearchResult[]) {
  currentEmployeeSearchResults = structuredClone(results);
}

export function resetMocks() {
  currentProfile = structuredClone(mockCompetenceProfile);
  currentSkillsResponse = structuredClone(mockSkillsResponse);
  currentEmployeeSearchResults = structuredClone(mockEmployeeSearchResults);
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

  http.get('*/api/employees/search', ({ request }) => {
    const url = new URL(request.url);
    const skillName = url.searchParams.get('skillName');
    if (!skillName) {
      return HttpResponse.json({ error: 'skillName is required' }, { status: 400 });
    }
    return HttpResponse.json(currentEmployeeSearchResults);
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
