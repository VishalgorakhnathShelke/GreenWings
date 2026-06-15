import { create } from 'zustand'
import { verifyAdminToken } from '../services/api'

type UserRole = 'member' | 'admin' | null

interface AuthState {
  role: UserRole
  email: string | null
  token: string | null
  setMember: (email: string) => void
  setAdmin: (email: string, token: string) => void
  logout: () => void
  validateSession: () => Promise<void>
}

const savedRole = localStorage.getItem('greenwingsRole') as UserRole
const savedEmail = localStorage.getItem('greenwingsUserEmail')
const savedToken = localStorage.getItem('greenwingsAdminToken')

export const useAuthStore = create<AuthState>((set) => ({
  role: savedRole === 'member' ? 'member' : null,
  email: savedEmail,
  token: savedToken,
  setMember: (email) => {
    localStorage.setItem('greenwingsRole', 'member')
    localStorage.setItem('greenwingsUserEmail', email)
    localStorage.removeItem('greenwingsAdminToken')
    set({ role: 'member', email, token: null })
  },
  setAdmin: (email, token) => {
    localStorage.setItem('greenwingsRole', 'admin')
    localStorage.setItem('greenwingsUserEmail', email)
    localStorage.setItem('greenwingsAdminToken', token)
    set({ role: 'admin', email, token })
  },
  logout: () => {
    localStorage.removeItem('greenwingsRole')
    localStorage.removeItem('greenwingsUserEmail')
    localStorage.removeItem('greenwingsAdminToken')
    set({ role: null, email: null, token: null })
  },
  validateSession: async () => {
    if (!savedToken) return
    try {
      const result = await verifyAdminToken(savedToken)
      set({ role: 'admin', email: result.user.email, token: savedToken })
    } catch {
      localStorage.removeItem('greenwingsRole')
      localStorage.removeItem('greenwingsUserEmail')
      localStorage.removeItem('greenwingsAdminToken')
      set({ role: null, email: null, token: null })
    }
  },
}))
