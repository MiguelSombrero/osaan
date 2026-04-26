export interface Competence {
  id?: string;
  employeeId: string;
  skillId: string;
  rating: number; // 1-5
}

export interface CreateCompetencesRequest {
  employeeId: string;
  competences: Omit<Competence, "id" | "employeeId">[];
}

export interface CompetenceDetail {
  id: string;
  skillName: string;
  rating: number; // 1-5
}

export interface CompetenceProfileData {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  competences: CompetenceDetail[];
}
