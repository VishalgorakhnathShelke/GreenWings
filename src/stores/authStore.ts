import { create } from 'zustand'
import { verifyAuthToken, type AuthUser } from '../services/api'

type UserRole = 'member' | 'admin' | null

interface AuthState {
  role: UserRole
  email: string | null
  token: string | null
  user: AuthUser | null
  setMember: (email: string, token: string, user?: AuthUser) => void
  setAdmin: (email: string, token: string, user?: AuthUser) => void
  logout: () => void
  validateSession: () => Promise<void>
}

const savedRole = localStorage.getItem('greenwingsRole') as UserRole
const savedEmail = localStorage.getItem('greenwingsUserEmail')
const savedToken = localStorage.getItem('greenwingsAuthToken') || localStorage.getItem('greenwingsAdminToken')

export const useAuthStore = create<AuthState>((set) => ({
  role: savedRole === 'member' || savedRole === 'admin' ? savedRole : null,
  email: savedEmail,
  token: savedToken,
  user: null,
  setMember: (email, token, user) => {
    localStorage.setItem('greenwingsRole', 'member')
    localStorage.setItem('greenwingsUserEmail', email)
    localStorage.setItem('greenwingsAuthToken', token)
    localStorage.removeItem('greenwingsAdminToken')
    set({ role: 'member', email, token, user: user ?? { email, role: 'member' } })
  },
  setAdmin: (email, token, user) => {
    localStorage.setItem('greenwingsRole', 'admin')
    localStorage.setItem('greenwingsUserEmail', email)
    localStorage.setItem('greenwingsAuthToken', token)
    localStorage.setItem('greenwingsAdminToken', token)
    set({ role: 'admin', email, token, user: user ?? { email, role: 'admin' } })
  },
  logout: () => {
    localStorage.removeItem('greenwingsRole')
    localStorage.removeItem('greenwingsUserEmail')
    localStorage.removeItem('greenwingsAuthToken')
    localStorage.removeItem('greenwingsAdminToken')
    set({ role: null, email: null, token: null, user: null })
  },
  validateSession: async () => {
    if (!savedToken) return
    try {
      const result = await verifyAuthToken(savedToken)
      const role = result.user.role === 'admin' ? 'admin' : 'member'
      set({ role, email: result.user.email, token: savedToken, user: result.user })
    } catch {
      localStorage.removeItem('greenwingsRole')
      localStorage.removeItem('greenwingsUserEmail')
      localStorage.removeItem('greenwingsAuthToken')
      localStorage.removeItem('greenwingsAdminToken')
      set({ role: null, email: null, token: null, user: null })
    }
  },
}))
