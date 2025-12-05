import { AdminSkillsApi, type GetSkillsResponse, type Skill } from './generated/api';
import { Configuration } from './generated/configuration';
import { DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_ORDER } from '@/skill/hooks/useSkillSearchParams';

const config = new Configuration({
  basePath: '/api',
  baseOptions: { withCredentials: true },
});

export const adminSkillsApi = new AdminSkillsApi(config);

const DEFAULT_SORT = [`name,${DEFAULT_ORDER}`];

export const skillApi = {
  async getSkills(
    query?: string,
    sort?: string[],
    page?: number,
    size?: number
  ): Promise<GetSkillsResponse> {
    // Only send params that differ from backend defaults (cleaner API requests)
    // Defaults imported from hook - single source of truth
    const queryParam = query && query.trim() !== '' ? query : undefined;
    const pageParam = page !== undefined && page !== DEFAULT_PAGE ? page : undefined;
    const sizeParam = size !== undefined && size !== DEFAULT_SIZE ? size : undefined;
    const sortParam =
      sort && JSON.stringify(sort) !== JSON.stringify(DEFAULT_SORT) ? sort : undefined;

    const res = await adminSkillsApi.getSkills(queryParam, pageParam, sizeParam, sortParam);
    return res.data;
  },

  async createSkill(skill: Skill): Promise<Skill> {
    const res = await adminSkillsApi.createSkill(skill);
    return res.data;
  },

  async deleteSkill(skillId: string): Promise<void> {
    await adminSkillsApi.deleteSkill(skillId);
  },
};
