import { useEffect, useState } from 'react'
import { useLanguageStore } from '../../stores/languageStore'
import { usePortalStore } from '../../stores/portalStore'
import { useEnquiryStore } from '../../stores/enquiryStore'
import { BrandMark } from '../layout/BrandMark'
import { type Enquiry } from '../../data/content'
import { useAuthStore } from '../../stores/authStore'
import { fetchAdminSummary, type AdminSummary } from '../../services/api'
import { FertilizerManager } from '../admin/FertilizerManager'
import { CompanyContentManager } from '../admin/CompanyContentManager'

function initials(name?: string | null, email?: string | null) {
  const source = name || email || 'GW'
  return source
    .split(/[.\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'GW'
}

function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  if (!enquiries.length) {
    return <p className="text-sm text-muted border border-line bg-white p-5">No enquiries yet. Create one and the admin team will see it immediately.</p>
  }

  return (
    <div className="grid gap-3">
      {enquiries.map((e) => (
        <article key={e.id} className="flex justify-between items-start gap-4 p-4 border border-line bg-white">
          <div>
            <h4 className="text-sm font-bold text-ink">{e.subject}</h4>
            <p className="text-[11px] text-muted">{e.id} - {e.category}</p>
            <small className="text-[10px] text-muted">Updated {e.date}</small>
            {e.description && <p className="text-[11px] text-muted mt-2 line-clamp-2">{e.description}</p>}
          </div>
          <span className={`text-[9px] font-bold uppercase px-2 py-1 shrink-0 ${e.status === 'Resolved' ? 'bg-cream text-muted' : 'bg-green/10 text-green'}`}>
            {e.status}
          </span>
        </article>
      ))}
    </div>
  )
}

function DashboardPanel() {
  const t = useLanguageStore((s) => s.t)
  const enquiries = useEnquiryStore((s) => s.enquiries)
  const setActivePanel = usePortalStore((s) => s.setActivePanel)
  const user = useAuthStore((s) => s.user)
  const openCount = enquiries.filter((e) => e.status !== 'Resolved').length

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <small className="text-[10px] text-muted uppercase tracking-wider">{t('memberDashboard')}</small>
          <h2 className="font-serif text-2xl text-ink mt-1">Welcome, {user?.firstName || 'member'}</h2>
        </div>
        <button onClick={() => setActivePanel('new')} className="bg-green text-white px-4 py-2 text-sm font-bold cursor-pointer border-0">
          + {t('createEnquiry')}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-line p-5 bg-white">
          <span className="text-[10px] text-muted">Open enquiries</span>
          <strong className="block text-2xl text-green font-serif">{openCount}</strong>
          <small className="text-[9px] text-muted">Synced with admin dashboard</small>
        </div>
        <div className="border border-line p-5 bg-white">
          <span className="text-[10px] text-muted">Registered email</span>
          <strong className="block text-sm text-green break-all">{user?.email || '-'}</strong>
          <small className="text-[9px] text-muted">Secure login enabled</small>
        </div>
        <div className="border border-line p-5 bg-white">
          <span className="text-[10px] text-muted">Interest</span>
          <strong className="block text-lg text-green font-serif">{user?.interest || 'FPO services'}</strong>
          <small className="text-[9px] text-muted">Saved from registration</small>
        </div>
      </div>
      <h3 className="font-serif text-lg text-ink mb-4">{t('recentEnquiries')}</h3>
      <EnquiryList enquiries={enquiries.slice(0, 3)} />
    </>
  )
}

function EnquiriesPanel() {
  const t = useLanguageStore((s) => s.t)
  const enquiries = useEnquiryStore((s) => s.enquiries)
  const setActivePanel = usePortalStore((s) => s.setActivePanel)

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <small className="text-[10px] text-muted uppercase tracking-wider">Support & services</small>
          <h2 className="font-serif text-2xl text-ink mt-1">{t('myEnquiries')}</h2>
        </div>
        <button onClick={() => setActivePanel('new')} className="bg-green text-white px-4 py-2 text-sm font-bold cursor-pointer border-0">
          + New enquiry
        </button>
      </div>
      <EnquiryList enquiries={enquiries} />
    </>
  )
}

function NewEnquiryPanel() {
  const t = useLanguageStore((s) => s.t)
  const addEnquiry = useEnquiryStore((s) => s.addEnquiry)
  const setActivePanel = usePortalStore((s) => s.setActivePanel)
  const token = useAuthStore((s) => s.token)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Crop advisory')
  const [priority, setPriority] = useState('Normal')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await addEnquiry(subject, category, description, priority, token)
      setSubject('')
      setDescription('')
      setActivePanel('dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to submit enquiry')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-8">
        <small className="text-[10px] text-muted uppercase tracking-wider">We are here to help</small>
        <h2 className="font-serif text-2xl text-ink mt-1">{t('newEnquiry')}</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-2 text-[10px] font-bold">
          <span>Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What can we help with?" className="p-3.5 border border-line bg-white font-inherit" required />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="grid gap-2 text-[10px] font-bold">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3.5 border border-line bg-white font-inherit">
              <option>Crop advisory</option>
              <option>Market access</option>
              <option>Membership</option>
              <option>Finance & schemes</option>
            </select>
          </label>
          <label className="grid gap-2 text-[10px] font-bold">
            <span>Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-3.5 border border-line bg-white font-inherit">
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-[10px] font-bold">
          <span>Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Share the details of your enquiry" className="p-3.5 border border-line bg-white font-inherit min-h-[120px] resize-y" required />
        </label>
        <label className="border border-dashed border-line p-6 text-center cursor-pointer hover:bg-cream/50 transition-colors grid gap-2">
          <b className="text-xl text-muted">+</b>
          <span className="text-sm text-ink">Upload supporting documents</span>
          <small className="text-[10px] text-muted">PDF, JPG, PNG up to 10 MB</small>
          <input type="file" className="hidden" multiple />
        </label>
        <button disabled={submitting} type="submit" className="bg-green text-white px-6 py-3 text-sm font-bold cursor-pointer border-0 hover:bg-green/90 transition-colors justify-self-start disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Submit enquiry ->'}
        </button>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
      </form>
    </>
  )
}

function DocumentsPanel() {
  return (
    <div className="text-center py-16">
      <span className="text-4xl text-muted">[]</span>
      <h2 className="font-serif text-2xl text-ink mt-4 mb-2">Secure documents</h2>
      <p className="text-sm text-muted mb-6">Your membership and enquiry documents will appear here.</p>
      <button className="bg-green text-white px-6 py-3 text-sm font-bold cursor-pointer border-0">Upload a document</button>
    </div>
  )
}

function ProfilePanel() {
  const user = useAuthStore((s) => s.user)
  const lang = useLanguageStore((s) => s.lang)
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <small className="text-[10px] text-muted uppercase tracking-wider">Member account</small>
          <h2 className="font-serif text-2xl text-ink mt-1">My profile</h2>
        </div>
        <button className="bg-green text-white px-4 py-2 text-sm font-bold cursor-pointer border-0">Edit profile</button>
      </div>
      <div className="flex items-center gap-5 border border-line bg-white p-6">
        <span className="w-[70px] h-[70px] bg-green text-white grid place-items-center text-xl font-bold rounded-full shrink-0">{initials(user?.name, user?.email)}</span>
        <div>
          <small className="text-[10px] text-muted">Verified member</small>
          <h3 className="font-serif text-2xl normal-case tracking-normal text-ink mt-1 mb-1">{user?.name || user?.email || 'GreenWings member'}</h3>
          <p className="text-[10px] text-muted">{user?.address || 'Address not available'} - Preferred language: {lang.toUpperCase()}</p>
        </div>
      </div>
    </>
  )
}

function AdminPanel() {
  const token = useAuthStore((s) => s.token)
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetchAdminSummary(token)
      .then(setSummary)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load admin summary'))
  }, [token])

  const cards = summary ? [
    { value: summary.totalUsers, label: 'Registered users', desc: `${summary.newUsersToday} new today` },
    { value: summary.totalEnquiries, label: 'Total enquiries', desc: `${summary.newEnquiries} new/open` },
    { value: summary.totalVisits, label: 'Website visits', desc: `${summary.todayVisits} today` },
    { value: summary.uniqueVisitors, label: 'Unique visitors', desc: 'Tracked without raw IP storage' },
    { value: summary.localFertilizers || 0, label: 'Local fertilizers', desc: 'Indian input catalogue' },
    { value: summary.importedFertilizers || 0, label: 'Imported fertilizers', desc: 'Global input catalogue' },
    { value: summary.companyStories || 0, label: 'Company stories', desc: 'Multilingual website content' },
    { value: summary.companyMilestones || 0, label: 'Timeline milestones', desc: 'Company journey records' },
    { value: summary.leadershipMembers || 0, label: 'Leadership profiles', desc: 'Directors and management' },
  ] : []

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <small className="text-[10px] text-muted uppercase tracking-wider">Role-based access</small>
          <h2 className="font-serif text-2xl text-ink mt-1">Admin management</h2>
        </div>
        <span className="bg-gold text-deep px-3 py-1.5 text-[9px] font-bold uppercase">Live</span>
      </div>
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 mb-4">{error}</p>}
      {!summary && !error && <p className="text-sm text-muted border border-line bg-white p-4 mb-4">Loading dashboard...</p>}
      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
            {cards.map((item) => (
              <article key={item.label} className="border border-line bg-white p-4 grid gap-1">
                <b className="font-serif text-2xl text-green">{item.value}</b>
                <span className="text-[11px] font-bold text-ink">{item.label}</span>
                <small className="text-[9px] text-muted leading-relaxed">{item.desc}</small>
              </article>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section className="border border-line bg-white p-4">
              <h3 className="font-serif text-lg text-ink mb-3">Recent users</h3>
              <div className="grid gap-2">
                {summary.recentUsers.map((user) => (
                  <div key={user.email} className="text-[11px] border-b border-line pb-2 last:border-b-0">
                    <strong className="block text-ink">{user.name || user.email}</strong>
                    <span className="text-muted">{user.mobileNumber || '-'} - {user.interest || 'General'}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="border border-line bg-white p-4">
              <h3 className="font-serif text-lg text-ink mb-3">Most visited pages</h3>
              <div className="grid gap-2">
                {summary.mostVisitedPages.length ? summary.mostVisitedPages.map((page) => (
                  <div key={page.pagePath} className="flex justify-between text-[11px] border-b border-line pb-2 last:border-b-0">
                    <span className="text-muted">{page.pagePath}</span>
                    <strong className="text-green">{page.visits}</strong>
                  </div>
                )) : <p className="text-[11px] text-muted">No visits tracked yet.</p>}
              </div>
            </section>
          </div>
        </>
      )}
    </>
  )
}

function LocalFertilizerAdminPanel() {
  return <FertilizerManager kind="local" />
}

function ImportedFertilizerAdminPanel() {
  return <FertilizerManager kind="imported" />
}

function CompanyStoriesAdminPanel() {
  return <CompanyContentManager section="stories" />
}

function CompanyMilestonesAdminPanel() {
  return <CompanyContentManager section="milestones" />
}

function LeadershipAdminPanel() {
  return <CompanyContentManager section="leadership" />
}

export function PortalModal() {
  const isOpen = usePortalStore((s) => s.isOpen)
  const closePortal = usePortalStore((s) => s.closePortal)
  const activePanel = usePortalStore((s) => s.activePanel)
  const setActivePanel = usePortalStore((s) => s.setActivePanel)
  const t = useLanguageStore((s) => s.t)
  const enquiries = useEnquiryStore((s) => s.enquiries)
  const loadEnquiries = useEnquiryStore((s) => s.loadEnquiries)
  const role = useAuthStore((s) => s.role)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const email = useAuthStore((s) => s.email)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (!isOpen || !token) return
    void loadEnquiries(token).catch(() => undefined)
  }, [isOpen, loadEnquiries, token])

  if (!isOpen) return null

  const panels: Record<string, () => React.ReactNode> = {
    dashboard: DashboardPanel,
    enquiries: EnquiriesPanel,
    new: NewEnquiryPanel,
    documents: DocumentsPanel,
    profile: ProfilePanel,
    admin: AdminPanel,
    localFertilizers: LocalFertilizerAdminPanel,
    importedFertilizers: ImportedFertilizerAdminPanel,
    companyStories: CompanyStoriesAdminPanel,
    companyMilestones: CompanyMilestonesAdminPanel,
    leadershipMembers: LeadershipAdminPanel,
  }

  const adminPanels = ['admin', 'localFertilizers', 'importedFertilizers', 'companyStories', 'companyMilestones', 'leadershipMembers']
  const safePanel = role !== 'admin' && adminPanels.includes(activePanel) ? 'dashboard' : activePanel
  const ActivePanelComponent = panels[safePanel] ?? DashboardPanel

  return (
    <div className="fixed inset-0 z-[130] flex">
      <div className="absolute inset-0 bg-ink/50" onClick={closePortal} />
      <aside className="relative z-10 ml-auto bg-paper w-full max-w-[920px] flex flex-col overflow-hidden" style={{ animation: 'slide-in-right 0.4s ease-out' }}>
        <button onClick={closePortal} className="absolute right-5 top-5 bg-transparent border-0 text-xl cursor-pointer text-ink z-10" aria-label="Close portal">x</button>

        <div className="border-b border-line p-5 flex items-center gap-3">
          <BrandMark />
          <div>
            <strong className="font-serif block text-lg text-ink">GreenWings</strong>
            <small className="text-[9px] text-muted uppercase tracking-wider">{t('memberPortal')}</small>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-line p-5">
          <span className="w-10 h-10 bg-green text-white grid place-items-center text-sm font-bold rounded-full shrink-0">{initials(user?.name, email)}</span>
          <div>
            <small className="text-[10px] text-muted">{role === 'admin' ? 'Admin session' : t('welcomeBack')}</small>
            <strong className="block text-sm text-ink">{user?.name || email || 'GreenWings user'}</strong>
          </div>
          <span className="ml-auto text-lime text-sm">OK</span>
        </div>

        <nav className="flex border-b border-line overflow-x-auto">
          {[
            { id: 'dashboard', icon: 'H', label: t('dashboard') },
            { id: 'enquiries', icon: 'E', label: t('myEnquiries'), badge: enquiries.length },
            { id: 'new', icon: '+', label: t('newEnquiry') },
            { id: 'documents', icon: 'D', label: t('documents') },
            { id: 'profile', icon: 'P', label: 'My profile' },
            ...(role === 'admin' ? [
              { id: 'admin', icon: 'A', label: 'Admin management' },
              { id: 'localFertilizers', icon: 'L', label: 'Manage Local Fertilizers' },
              { id: 'importedFertilizers', icon: 'I', label: 'Manage Imported Fertilizers' },
              { id: 'companyStories', icon: 'S', label: 'Manage Stories' },
              { id: 'companyMilestones', icon: 'M', label: 'Manage Milestones' },
              { id: 'leadershipMembers', icon: 'T', label: 'Manage Leadership' },
            ] : []),
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-colors cursor-pointer bg-transparent ${
                safePanel === item.id ? 'border-green text-ink font-bold' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {!!item.badge && <b className="bg-green text-white text-[9px] w-5 h-5 grid place-items-center rounded-full">{item.badge}</b>}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-6">
          <ActivePanelComponent />
          <button onClick={() => { logout(); closePortal() }} className="mt-8 text-[10px] uppercase tracking-wider font-bold text-muted bg-transparent border-0 cursor-pointer hover:text-ink">Sign out</button>
        </div>
      </aside>
    </div>
  )
}
