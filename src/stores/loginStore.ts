import { create } from 'zustand'

interface LoginState {
  isOpen: boolean
  role: 'member' | 'admin'
  step: 'role' | 'form' | 'register'
  openLogin: () => void
  closeLogin: () => void
  setRole: (role: 'member' | 'admin') => void
  showRegister: () => void
  goBack: () => void
}

export const useLoginStore = create<LoginState>((set) => ({
  isOpen: false,
  role: 'member',
  step: 'role',
  openLogin: () => set({ isOpen: true, step: 'role' }),
  closeLogin: () => set({ isOpen: false }),
  setRole: (role) => set({ role, step: 'form' }),
  showRegister: () => set({ role: 'member', step: 'register' }),
  goBack: () => set({ step: 'role' }),
}))
