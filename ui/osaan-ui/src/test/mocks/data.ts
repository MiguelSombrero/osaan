import type { CompetenceProfileData } from '@/types/competence';
import type { GetSkillsResponse } from '@/types/skill';

export const MOCK_EMPLOYEE_ID = 'aaaaaaaa-0000-0000-0000-000000000001';

export const mockCompetenceProfile: CompetenceProfileData = {
  employee: {
    id: MOCK_EMPLOYEE_ID,
    firstName: 'Matti',
    lastName: 'Meikäläinen',
    email: 'matti@example.com',
  },
  competences: [
    { id: 'c1', skillName: 'Java', rating: 4 },
    { id: 'c2', skillName: 'TypeScript', rating: 3 },
  ],
};

export const mockSkillsResponse: GetSkillsResponse = {
  skills: [
    { id: 's1', name: 'Java' },
    { id: 's2', name: 'TypeScript' },
    { id: 's3', name: 'React' },
    { id: 's4', name: 'Spring Boot' },
    { id: 's5', name: 'Kubernetes' },
  ],
  page: 0,
  size: 12,
  totalElements: 5,
  totalPages: 1,
  first: true,
  last: true,
};
