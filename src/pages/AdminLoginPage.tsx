import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { loginAdmin } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { usePortalStore } from '../stores/portalStore'

export function AdminLoginPage() {
  const role = useAuthStore((state) => state.role)
  const setAdmin = useAuthStore((state) => state.setAdmin)
  const openPortal = usePortalStore((state) => state.openPortal)
  const setActivePanel = usePortalStore((state) => state.setActivePanel)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (role === 'admin') return <Navigate to="/" replace />

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const result = await loginAdmin(email, password)
      setAdmin(result.user.email, result.token)
      setActivePanel('admin')
      openPortal()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-78px)] bg-cream px-6 py-20 grid place-items-center">
      <form onSubmit={submit} className="bg-white border border-line p-8 w-full max-w-md grid gap-5 shadow-lg">
        <div>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-3">Restricted access</div>
          <h1 className="font-serif text-4xl text-ink">Admin sign in</h1>
          <p className="text-sm text-muted mt-3">Authorized GreenWings administrators only.</p>
        </div>
        <label className="grid gap-2 text-[10px] font-bold">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="p-3.5 border border-line" />
        </label>
        <label className="grid gap-2 text-[10px] font-bold">
          <span>Password</span>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="p-3.5 border border-line" />
        </label>
        <button disabled={submitting} className="bg-green text-white px-6 py-3 font-bold border-0 cursor-pointer disabled:opacity-60">
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
      </form>
    </section>
  )
}
