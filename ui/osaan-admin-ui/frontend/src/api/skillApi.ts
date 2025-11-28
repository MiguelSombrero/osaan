import { AdminSkillsApi, type GetSkillsResponse, type Skill } from './generated/api';
import { Configuration } from './generated/configuration';

const config = new Configuration({
  basePath: '/api',
  baseOptions: { withCredentials: true },
});

export const adminSkillsApi = new AdminSkillsApi(config);

export const skillApi = {
  async getSkills(query?: string, sort?: string[]): Promise<GetSkillsResponse> {
    const res = await adminSkillsApi.getSkills(query, sort);
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
