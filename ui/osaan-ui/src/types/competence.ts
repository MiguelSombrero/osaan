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
