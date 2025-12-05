import { Order } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SkillState {
  order: Order;
  setOrder: (order: Order) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  page: number;
  setPage: (page: number) => void;
  size: number;
  setSize: (size: number) => void;
}

export const useSkillStore = create<SkillState>()(
  persist(
    set => ({
      order: 'asc',
      setOrder: order => set({ order }),
      searchTerm: '',
      setSearchTerm: searchTerm => set({ searchTerm }),
      page: 0,
      setPage: page => set({ page }),
      size: 20,
      setSize: size => set({ size }),
    }),
    {
      name: 'skill-list-storage',
    }
  )
);
