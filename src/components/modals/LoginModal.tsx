import { useState } from 'react'
import { useLanguageStore } from '../../stores/languageStore'
import { useLoginStore } from '../../stores/loginStore'
import { usePortalStore } from '../../stores/portalStore'
import { BrandMark } from '../layout/BrandMark'
import { useAuthStore } from '../../stores/authStore'
import { loginAdmin } from '../../services/api'

export function LoginModal() {
  const isOpen = useLoginStore((s) => s.isOpen)
  const closeLogin = useLoginStore((s) => s.closeLogin)
  const role = useLoginStore((s) => s.role)
  const setRole = useLoginStore((s) => s.setRole)
  const goBack = useLoginStore((s) => s.goBack)
  const step = useLoginStore((s) => s.step)
  const openPortal = usePortalStore((s) => s.openPortal)
  const setActivePanel = usePortalStore((s) => s.setActivePanel)
  const t = useLanguageStore((s) => s.t)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const setMember = useAuthStore((s) => s.setMember)
  const setAdmin = useAuthStore((s) => s.setAdmin)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (role === 'admin') {
        const result = await loginAdmin(email, password)
        setAdmin(result.user.email, result.token)
        setActivePanel('admin')
      } else {
        setMember(email)
        setActivePanel('dashboard')
      }
      closeLogin()
      openPortal()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[140] flex">
      <div className="absolute inset-0 bg-ink/50" onClick={closeLogin} />
      <div className="relative z-10 ml-auto bg-paper w-full max-w-[530px] p-16 overflow-auto" style={{ animation: 'slide-in-right 0.4s ease-out' }}>
        <button onClick={closeLogin} className="absolute right-5 top-5 bg-transparent border-0 text-xl cursor-pointer text-ink" aria-label="Close login">×</button>

        <div className="flex items-center gap-2.5 mb-16">
          <BrandMark />
          <div>
            <strong className="font-serif block text-lg text-ink">GreenWings</strong>
            <small className="text-[9px] text-muted uppercase tracking-wider">Secure access</small>
          </div>
        </div>

        {step === 'role' ? (
          <>
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-3">Choose access</div>
            <h2 className="font-serif text-[clamp(28px,5vw,44px)] leading-tight mb-4 text-ink">{t('loginTitle')}</h2>
            <p className="text-sm text-muted leading-relaxed mb-8">{t('loginIntro')}</p>
            <div className="grid gap-2.5">
              <button
                onClick={() => setRole('member')}
                className="font-inherit border border-line bg-white p-5 flex items-center gap-4 text-left cursor-pointer hover:border-green transition-colors"
              >
                <b className="w-10 h-10 bg-cream grid place-items-center text-green text-lg shrink-0">○</b>
                <span className="flex flex-col gap-1">
                  <strong className="text-sm text-ink">{t('memberAccess')}</strong>
                  <small className="text-muted">{t('memberAccessText')}</small>
                </span>
                <i className="not-italic ml-auto text-green">→</i>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <button type="button" onClick={goBack} className="bg-transparent border-0 text-green font-bold text-left cursor-pointer p-0">
              ← {t('back')}
            </button>
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green">
              {role === 'admin' ? 'Admin login' : 'Member login'}
            </div>
            <h2 className="font-serif text-[clamp(28px,5vw,44px)] leading-tight text-ink">{t('signIn')}</h2>
            <label className="grid gap-2 text-[10px] font-bold">
              <span>{t('emailMobile')}</span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="+91 or email address"
                className="p-3.5 border border-line bg-white font-inherit"
                required
              />
            </label>
            <label className="grid gap-2 text-[10px] font-bold">
              <span>{t('password')}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="p-3.5 border border-line bg-white font-inherit"
                required
              />
            </label>
            <div className="flex justify-between items-center text-[10px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('rememberMe')}</span>
              </label>
              <a href="#" className="text-green no-underline">{t('forgotPassword')}</a>
            </div>
            <button type="submit" className="bg-green text-white px-6 py-3 text-sm font-bold cursor-pointer border-0 hover:bg-green/90 transition-colors">
              {submitting ? 'Signing in...' : `${t('signIn')} →`}
            </button>
            {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
            <p className="text-sm text-muted">
              {t('noAccount')} <a href="#" className="text-green no-underline">{t('registerAccount')}</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
