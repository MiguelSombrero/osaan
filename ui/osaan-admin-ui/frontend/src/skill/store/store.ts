import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Order = 'asc' | 'desc'

interface SkillState {
  order: Order
  setOrder: (order: Order) => void
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set) => ({
      order: 'asc',
      setOrder: (order) => set({ order }),
    }),
    {
      name: 'skill-list-storage',
    }
  )
)
