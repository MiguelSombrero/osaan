import type { AuthState } from '@/hooks/useAuth';
import type { Skill, GetSkillsResponse } from '@/api/generated/api';

export const mockAdminUser: AuthState = {
  authenticated: true,
  roles: ['ADMIN', 'USER'],
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
  },
};

export const mockRegularUser: AuthState = {
  authenticated: true,
  roles: ['USER'],
  user: {
    name: 'Regular User',
    email: 'user@example.com',
    username: 'user',
    firstName: 'Regular',
    lastName: 'User',
  },
};

export const mockUnauthenticated: AuthState = {
  authenticated: false,
};

// Auth disabled state (for local development without Keycloak)
export const mockAuthDisabled: AuthState = {
  authenticated: false,
  authDisabled: true,
};

// Mock skills data
export const mockSkills: Skill[] = [
  { id: '1', name: 'TypeScript' },
  { id: '2', name: 'React' },
  { id: '3', name: 'Java' },
  { id: '4', name: 'Spring Boot' },
  { id: '5', name: 'Kubernetes' },
  { id: '6', name: 'PostgreSQL' },
];

export function createMockSkillsResponse(skills: Skill[] = mockSkills): GetSkillsResponse {
  return { skills };
}

// Factory for creating custom auth states
export function createAuthState(overrides: Partial<AuthState>): AuthState {
  return {
    ...mockAdminUser,
    ...overrides,
  };
}

// Factory for creating skills
export function createSkill(overrides: Partial<Skill> = {}): Skill {
  return {
    id: crypto.randomUUID(),
    name: 'New Skill',
    ...overrides,
  };
}
