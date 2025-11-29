import { Order } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SkillState {
  order: Order;
  setOrder: (order: Order) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useSkillStore = create<SkillState>()(
  persist(
    set => ({
      order: 'asc',
      setOrder: order => set({ order }),
      searchTerm: '',
      setSearchTerm: searchTerm => set({ searchTerm }),
    }),
    {
      name: 'skill-list-storage',
    }
  )
);
