import type { Rating } from './rating';

export interface EmployeeSearchParams {
  skillId: string;
  minRating: Rating;
}

export interface EmployeeSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matchedSkills: Array<{
    skillId: string;
    skillName: string;
    rating: Rating;
  }>;
}

export interface ManagerSelection {
  employees: EmployeeSearchResult[];
}
