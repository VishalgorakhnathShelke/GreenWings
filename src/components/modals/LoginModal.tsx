import { useState } from 'react'
import { useLanguageStore } from '../../stores/languageStore'
import { useLoginStore } from '../../stores/loginStore'
import { usePortalStore } from '../../stores/portalStore'
import { BrandMark } from '../layout/BrandMark'
import { useAuthStore } from '../../stores/authStore'
import { loginAdmin, loginUser, registerUser, type RegisterPayload } from '../../services/api'
import { useEnquiryStore } from '../../stores/enquiryStore'
import {
  defaultPhoneCountry,
  formatInternationalPhone,
  getPhoneCountryByIso,
  onlyPhoneDigits,
  phoneCountries,
  phoneLengthHint,
  validateNationalPhone,
} from '../../data/phoneCountries'

const initialRegistration: RegisterPayload = {
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  password: '',
  interest: 'Market access',
  enquiryQuestion: '',
  address: '',
  state: 'Maharashtra',
  country: 'India',
}

const inputClass = 'p-3.5 border border-line bg-white font-inherit outline-none focus:border-green'

export function LoginModal() {
  const isOpen = useLoginStore((s) => s.isOpen)
  const closeLogin = useLoginStore((s) => s.closeLogin)
  const role = useLoginStore((s) => s.role)
  const setRole = useLoginStore((s) => s.setRole)
  const showRegister = useLoginStore((s) => s.showRegister)
  const goBack = useLoginStore((s) => s.goBack)
  const step = useLoginStore((s) => s.step)
  const openPortal = usePortalStore((s) => s.openPortal)
  const setActivePanel = usePortalStore((s) => s.setActivePanel)
  const t = useLanguageStore((s) => s.t)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registration, setRegistration] = useState<RegisterPayload>(initialRegistration)
  const [phoneCountryIso, setPhoneCountryIso] = useState(defaultPhoneCountry.iso2)
  const [nationalPhone, setNationalPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const setMember = useAuthStore((s) => s.setMember)
  const setAdmin = useAuthStore((s) => s.setAdmin)
  const loadEnquiries = useEnquiryStore((s) => s.loadEnquiries)
  const selectedPhoneCountry = getPhoneCountryByIso(phoneCountryIso)
  const phoneHint = phoneLengthHint(selectedPhoneCountry)

  if (!isOpen) return null

  const openSignedInPortal = async (token: string, userRole: 'member' | 'admin') => {
    if (userRole === 'member') {
      await loadEnquiries(token)
      setActivePanel('dashboard')
    } else {
      setActivePanel('admin')
    }
    closeLogin()
    openPortal()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const result = role === 'admin' ? await loginAdmin(email, password) : await loginUser(email, password)
      if (result.user.role === 'admin') {
        setAdmin(result.user.email, result.token, result.user)
        await openSignedInPortal(result.token, 'admin')
      } else {
        setMember(result.user.email, result.token, result.user)
        await openSignedInPortal(result.token, 'member')
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const phoneError = validateNationalPhone(selectedPhoneCountry, nationalPhone)
      if (phoneError) {
        setError(phoneError)
        return
      }
      const payload = {
        ...registration,
        country: selectedPhoneCountry.name,
        mobileNumber: formatInternationalPhone(selectedPhoneCountry, nationalPhone),
      }
      const result = await registerUser(payload)
      setMember(result.user.email, result.token, result.user)
      await openSignedInPortal(result.token, 'member')
      setRegistration(initialRegistration)
      setPhoneCountryIso(defaultPhoneCountry.iso2)
      setNationalPhone('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create account')
    } finally {
      setSubmitting(false)
    }
  }

  const updateRegistration = (field: keyof RegisterPayload, value: string) => {
    setRegistration((current) => ({ ...current, [field]: value }))
  }

  const updatePhoneCountry = (iso2: string) => {
    const country = getPhoneCountryByIso(iso2)
    setPhoneCountryIso(country.iso2)
    setNationalPhone((current) => onlyPhoneDigits(current).slice(0, country.maxLength))
    setRegistration((current) => ({ ...current, country: country.name }))
  }

  const updateNationalPhone = (value: string) => {
    setNationalPhone(onlyPhoneDigits(value).slice(0, selectedPhoneCountry.maxLength))
  }

  return (
    <div className="fixed inset-0 z-[140] flex">
      <div className="absolute inset-0 bg-ink/50" onClick={closeLogin} />
      <div className="relative z-10 ml-auto bg-paper w-full max-w-[560px] p-8 sm:p-12 overflow-auto" style={{ animation: 'slide-in-right 0.4s ease-out' }}>
        <button onClick={closeLogin} className="absolute right-5 top-5 bg-transparent border-0 text-xl cursor-pointer text-ink" aria-label="Close login">x</button>

        <div className="flex items-center gap-2.5 mb-10">
          <BrandMark />
          <div>
            <strong className="font-serif block text-lg text-ink">GreenWings</strong>
            <small className="text-[9px] text-muted uppercase tracking-wider">Secure member access</small>
          </div>
        </div>

        {step === 'role' && (
          <>
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-3">Choose access</div>
            <h2 className="font-serif text-[clamp(28px,5vw,44px)] leading-tight mb-4 text-ink">{t('loginTitle')}</h2>
            <p className="text-sm text-muted leading-relaxed mb-8">{t('loginIntro')}</p>
            <div className="grid gap-3">
              <button
                onClick={() => setRole('member')}
                className="font-inherit border border-line bg-white p-5 flex items-center gap-4 text-left cursor-pointer hover:border-green transition-colors"
              >
                <b className="w-10 h-10 bg-cream grid place-items-center text-green text-lg shrink-0">1</b>
                <span className="flex flex-col gap-1">
                  <strong className="text-sm text-ink">Existing user login</strong>
                  <small className="text-muted">Login with your registered email and password.</small>
                </span>
                <i className="not-italic ml-auto text-green">-&gt;</i>
              </button>

              <button
                onClick={showRegister}
                className="font-inherit border border-green/30 bg-green/5 p-5 flex items-center gap-4 text-left cursor-pointer hover:border-green transition-colors"
              >
                <b className="w-10 h-10 bg-green text-white grid place-items-center text-lg shrink-0">+</b>
                <span className="flex flex-col gap-1">
                  <strong className="text-sm text-ink">New user / Register</strong>
                  <small className="text-muted">Create a member account and submit your first enquiry.</small>
                </span>
                <i className="not-italic ml-auto text-green">-&gt;</i>
              </button>
            </div>

            <button onClick={() => setRole('admin')} className="mt-8 text-[10px] uppercase tracking-wider text-muted bg-transparent border-0 cursor-pointer hover:text-green">
              Admin staff login
            </button>
          </>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <button type="button" onClick={goBack} className="bg-transparent border-0 text-green font-bold text-left cursor-pointer p-0">
              &lt;- Back
            </button>
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green">
              {role === 'admin' ? 'Admin login' : 'Member login'}
            </div>
            <h2 className="font-serif text-[clamp(28px,5vw,44px)] leading-tight text-ink">{t('signIn')}</h2>
            <label className="grid gap-2 text-[10px] font-bold">
              <span>Email address</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputClass} required />
            </label>
            <label className="grid gap-2 text-[10px] font-bold">
              <span>{t('password')}</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" className={inputClass} required />
            </label>
            <div className="flex justify-between items-center text-[10px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span>{t('rememberMe')}</span>
              </label>
              <span className="text-green">{t('forgotPassword')}</span>
            </div>
            <button type="submit" className="bg-green text-white px-6 py-3 text-sm font-bold cursor-pointer border-0 hover:bg-green/90 transition-colors">
              {submitting ? 'Signing in...' : `${t('signIn')} ->`}
            </button>
            {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
            {role === 'member' && (
              <p className="text-sm text-muted">
                {t('noAccount')}{' '}
                <button type="button" onClick={showRegister} className="text-green bg-transparent border-0 p-0 cursor-pointer font-bold">
                  {t('registerAccount')}
                </button>
              </p>
            )}
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleRegister} className="grid gap-4">
            <button type="button" onClick={goBack} className="bg-transparent border-0 text-green font-bold text-left cursor-pointer p-0">
              &lt;- Back
            </button>
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green">New member registration</div>
            <h2 className="font-serif text-[clamp(28px,5vw,42px)] leading-tight text-ink">Create your GreenWings account</h2>
            <p className="text-sm text-muted">Your first question will be saved as an enquiry and visible to the admin team.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="grid gap-2 text-[10px] font-bold">
                <span>First name</span>
                <input value={registration.firstName} onChange={(e) => updateRegistration('firstName', e.target.value)} className={inputClass} required />
              </label>
              <label className="grid gap-2 text-[10px] font-bold">
                <span>Last name</span>
                <input value={registration.lastName} onChange={(e) => updateRegistration('lastName', e.target.value)} className={inputClass} required />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="grid gap-2 text-[10px] font-bold">
                <span>Phone country</span>
                <select value={phoneCountryIso} onChange={(e) => updatePhoneCountry(e.target.value)} className={inputClass} required>
                  {phoneCountries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name} ({country.dialCode})
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-[10px] font-bold">
                <span>Email</span>
                <input type="email" value={registration.email} onChange={(e) => updateRegistration('email', e.target.value)} className={inputClass} required />
              </label>
            </div>

            <label className="grid gap-2 text-[10px] font-bold">
              <span>Mobile number</span>
              <div className="grid grid-cols-[92px_1fr]">
                <span className="p-3.5 border border-line border-r-0 bg-cream text-ink font-bold">{selectedPhoneCountry.dialCode}</span>
                <input
                  value={nationalPhone}
                  onChange={(e) => updateNationalPhone(e.target.value)}
                  placeholder={selectedPhoneCountry.example}
                  className={inputClass}
                  inputMode="numeric"
                  maxLength={selectedPhoneCountry.maxLength}
                  pattern="[0-9]*"
                  required
                />
              </div>
              <small className="text-[10px] text-muted font-normal">{phoneHint}</small>
            </label>

            <label className="grid gap-2 text-[10px] font-bold">
              <span>Password</span>
              <input type="password" value={registration.password} onChange={(e) => updateRegistration('password', e.target.value)} className={inputClass} minLength={8} required />
            </label>

            <label className="grid gap-2 text-[10px] font-bold">
              <span>Interest</span>
              <select value={registration.interest} onChange={(e) => updateRegistration('interest', e.target.value)} className={inputClass}>
                <option>Market access</option>
                <option>Crop advisory</option>
                <option>Input supply</option>
                <option>Export support</option>
                <option>Finance and schemes</option>
                <option>Training program</option>
              </select>
            </label>

            <label className="grid gap-2 text-[10px] font-bold">
              <span>Your question / enquiry</span>
              <textarea value={registration.enquiryQuestion} onChange={(e) => updateRegistration('enquiryQuestion', e.target.value)} className={`${inputClass} min-h-[110px] resize-y`} required />
            </label>

            <label className="grid gap-2 text-[10px] font-bold">
              <span>Address</span>
              <textarea value={registration.address} onChange={(e) => updateRegistration('address', e.target.value)} className={`${inputClass} min-h-[80px] resize-y`} required />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="grid gap-2 text-[10px] font-bold">
                <span>State</span>
                <input value={registration.state} onChange={(e) => updateRegistration('state', e.target.value)} className={inputClass} required />
              </label>
              <label className="grid gap-2 text-[10px] font-bold">
                <span>Country</span>
                <input value={selectedPhoneCountry.name} readOnly className={`${inputClass} bg-cream`} required />
              </label>
            </div>

            <button type="submit" className="bg-green text-white px-6 py-3 text-sm font-bold cursor-pointer border-0 hover:bg-green/90 transition-colors">
              {submitting ? 'Creating account...' : 'Create account ->'}
            </button>
            {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
