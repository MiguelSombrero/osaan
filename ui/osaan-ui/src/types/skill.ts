export interface Skill {
  id: string;
  name: string;
}

export interface GetSkillsResponse {
  skills: Skill[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface GetSkillsParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
}
