import { http, HttpResponse } from 'msw';
import type { CompetenceProfileData } from '@/types/competence';
import type { GetSkillsResponse } from '@/types/skill';
import type { EmployeeSearchResult } from '@/types/manager';
import type { Subscription } from '@/types/subscription';
import type { Rating } from '@/types/rating';
import { mockCompetenceProfile, mockSkillsResponse, mockEmployeeSearchResults } from './data';

let currentProfile: CompetenceProfileData = structuredClone(mockCompetenceProfile);
let currentSkillsResponse: GetSkillsResponse = structuredClone(mockSkillsResponse);
let currentEmployeeSearchResults: EmployeeSearchResult[] = structuredClone(mockEmployeeSearchResults);
let currentSubscriptions: Subscription[] = [];

export function setMockProfile(profile: CompetenceProfileData) {
  currentProfile = structuredClone(profile);
}

export function setMockSkillsResponse(response: GetSkillsResponse) {
  currentSkillsResponse = structuredClone(response);
}

export function setMockEmployeeSearchResults(results: EmployeeSearchResult[]) {
  currentEmployeeSearchResults = structuredClone(results);
}

export function setMockSubscriptions(subs: Subscription[]) {
  currentSubscriptions = structuredClone(subs);
}

export function resetMocks() {
  currentProfile = structuredClone(mockCompetenceProfile);
  currentSkillsResponse = structuredClone(mockSkillsResponse);
  currentEmployeeSearchResults = structuredClone(mockEmployeeSearchResults);
  currentSubscriptions = [];
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
    const { rating } = (await request.json()) as { rating: Rating };
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

  http.get('*/api/subscriptions', () => {
    return HttpResponse.json(currentSubscriptions);
  }),

  http.post('*/api/subscriptions', async ({ request }) => {
    const body = (await request.json()) as { skill: string; rating: number };
    const created: Subscription = {
      id: `sub-${currentSubscriptions.length + 1}`,
      userId: 'test-user',
      email: 'test@example.com',
      skill: body.skill,
      rating: body.rating as Subscription['rating'],
      createdAt: new Date().toISOString(),
    };
    currentSubscriptions = [created, ...currentSubscriptions];
    return HttpResponse.json(created, { status: 201 });
  }),

  http.delete('*/api/subscriptions/:id', ({ params }) => {
    const { id } = params as { id: string };
    const existed = currentSubscriptions.some((s) => s.id === id);
    if (!existed) {
      return new HttpResponse(null, { status: 404 });
    }
    currentSubscriptions = currentSubscriptions.filter((s) => s.id !== id);
    return new HttpResponse(null, { status: 204 });
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

export const subscriptionsGetErrorHandler = (status: number) =>
  http.get('*/api/subscriptions', () =>
    HttpResponse.json({ error: 'Failed' }, { status })
  );

export const createSubscriptionErrorHandler = (status: number) =>
  http.post('*/api/subscriptions', () =>
    HttpResponse.json({ error: 'Failed' }, { status })
  );

export const deleteSubscriptionErrorHandler = (status: number) =>
  http.delete('*/api/subscriptions/:id', () =>
    HttpResponse.json({ error: 'Failed' }, { status })
  );
