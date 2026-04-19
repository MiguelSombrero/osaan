import type { GetSkillsParams, GetSkillsResponse } from '@/types/skill';
import type { Competence } from '@/types/competence';
import type { Employee } from '@/types/employee';
import type { EmployeeSearchParams, EmployeeSearchResult } from '@/types/manager';

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
};

export const employeeApi = {
  createEmployee: (employee: Omit<Employee, 'id'>) =>
    fetchApi<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    }),
  searchEmployees: (params: EmployeeSearchParams) => {
    const searchParams = new URLSearchParams();
    searchParams.set('skillId', params.skillId);
    searchParams.set('minRating', params.minRating.toString());
    return fetchApi<EmployeeSearchResult[]>(`/employees/search?${searchParams.toString()}`);
  },
};

export const competenceReadApi = {
  getCompetences: (employeeId: string) =>
    fetchApi<Competence[]>(`/competences/${employeeId}`),
};
