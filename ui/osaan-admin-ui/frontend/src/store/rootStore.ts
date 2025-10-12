import { create } from 'zustand';
import { createSkillSlice, type SkillSlice } from '../skill/store/skillSlice';

type Store = SkillSlice;

export const useStore = create<Store>()((...a) => ({
  ...createSkillSlice(...a),
}));
