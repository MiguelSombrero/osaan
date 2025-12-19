import { PublicSkillsApi, type GetSkillsResponse, type Skill } from './generated/skills';
import { Configuration } from './generated/skills/configuration';
import { DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_ORDER } from '@/skill/hooks/useSkillSearchParams';

const skillsConfig = new Configuration({
  basePath: '/api',
  baseOptions: { withCredentials: true },
});

export const skillApi = new PublicSkillsApi(skillsConfig);

const DEFAULT_SORT = [`name,${DEFAULT_ORDER}`];

export const skillsApi = {
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

    const res = await skillApi.getSkills(queryParam, pageParam, sizeParam, sortParam);
    return res.data;
  },
};
