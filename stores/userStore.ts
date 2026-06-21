import { create } from 'zustand'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: 'DRIVER' | 'INSPECTOR' | 'MANAGEMENT'
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
