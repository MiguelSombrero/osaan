import { AdminSkillsApi, type Skill } from './generated/admin-skills';
import { Configuration } from './generated/admin-skills/configuration';

const adminSkillsConfig = new Configuration({
  basePath: '/api',
  baseOptions: { withCredentials: true },
});

export const adminSkillApi = new AdminSkillsApi(adminSkillsConfig);

export const adminSkillsApi = {
  async createSkill(skill: Skill): Promise<Skill> {
    const res = await adminSkillApi.createSkill(skill);
    return res.data;
  },

  async deleteSkill(skillId: string): Promise<void> {
    await adminSkillApi.deleteSkill(skillId);
  },
};
