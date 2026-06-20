import type { GetSkillsParams, GetSkillsResponse } from '@/types/skill';
import type { Competence, CompetenceProfileData } from '@/types/competence';
import type { Employee } from '@/types/employee';
import type { EmployeeSearchParams, EmployeeSearchResult } from '@/types/manager';
import type { Subscription, SubscriptionDraft } from '@/types/subscription';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch wrapper for API requests
 * Authentication is handled server-side via session cookies
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `API error: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

export const skillApi = {
  getSkills: (params?: GetSkillsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.page !== undefined)
      searchParams.set('page', params.page.toString());
    if (params?.size) searchParams.set('size', params.size.toString());
    if (params?.sort) searchParams.set('sort', params.sort);

    const queryString = searchParams.toString();
    return fetchApi<GetSkillsResponse>(
      `/skills${queryString ? `?${queryString}` : ''}`
    );
  },
};

export const competenceApi = {
  createCompetences: (
    employeeId: string,
    competences: Omit<Competence, 'id' | 'employeeId'>[]
  ) =>
    fetchApi<Competence[]>(`/competences/${employeeId}`, {
      method: 'POST',
      body: JSON.stringify(competences),
    }),

  deleteCompetence: (employeeId: string, competenceId: string) =>
    fetchApi<void>(`/competences/${employeeId}/${competenceId}`, {
      method: 'DELETE',
    }),

  updateCompetenceRating: (employeeId: string, competenceId: string, rating: number) =>
    fetchApi<Competence>(`/competences/${employeeId}/${competenceId}`, {
      method: 'PATCH',
      body: JSON.stringify({ rating }),
    }),
};

export const employeeApi = {
  createEmployee: (employee: Omit<Employee, 'id'>) =>
    fetchApi<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    }),
  searchEmployees: (params: EmployeeSearchParams) => {
    const searchParams = new URLSearchParams();
    searchParams.set('skillName', params.skillName);
    searchParams.set('minRating', params.minRating.toString());
    return fetchApi<EmployeeSearchResult[]>(`/employees/search?${searchParams.toString()}`);
  },
};

export const competenceReadApi = {
  getProfile: (employeeId: string) =>
    fetchApi<CompetenceProfileData>(`/competences/${employeeId}`),
};

export const subscriptionApi = {
  getSubscriptions: () => fetchApi<Subscription[]>('/subscriptions'),

  createSubscription: (draft: SubscriptionDraft) =>
    fetchApi<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(draft),
    }),

  deleteSubscription: (id: string) =>
    fetchApi<void>(`/subscriptions/${id}`, { method: 'DELETE' }),
};
