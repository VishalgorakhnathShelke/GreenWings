import { create } from 'zustand'

interface LoginState {
  isOpen: boolean
  role: 'member' | 'admin'
  step: 'role' | 'form'
  openLogin: () => void
  closeLogin: () => void
  setRole: (role: 'member' | 'admin') => void
  goBack: () => void
}

export const useLoginStore = create<LoginState>((set) => ({
  isOpen: false,
  role: 'member',
  step: 'role',
  openLogin: () => set({ isOpen: true, step: 'role' }),
  closeLogin: () => set({ isOpen: false }),
  setRole: (role) => set({ role, step: 'form' }),
  goBack: () => set({ step: 'role' }),
}))
