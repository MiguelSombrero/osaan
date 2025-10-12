import { StateCreator } from 'zustand';

export interface Skill {
  id: string;
  name: string;
}

export interface SkillSlice {
  skills: Skill[];
  setSkills: (s: Skill[]) => void;
  addSkill: (s: Skill) => void;
  removeSkill: (id: string) => void;
}

export const createSkillSlice: StateCreator<SkillSlice> = set => ({
  skills: [],
  setSkills: s => set({ skills: s }),
  addSkill: s => set(st => ({ skills: [s, ...st.skills] })),
  removeSkill: id => set(st => ({ skills: st.skills.filter(x => x.id !== id) })),
});
