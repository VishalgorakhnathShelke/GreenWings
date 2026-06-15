import { useState } from 'react'
import { useLanguageStore } from '../../stores/languageStore'
import { usePortalStore } from '../../stores/portalStore'
import { useEnquiryStore } from '../../stores/enquiryStore'
import { BrandMark } from '../layout/BrandMark'
import { type Enquiry } from '../../data/content'
import { useAuthStore } from '../../stores/authStore'

function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  return (
    <div className="grid gap-3">
      {enquiries.map((e) => (
        <article key={e.id} className="flex justify-between items-start gap-4 p-4 border border-line bg-white">
          <div>
            <h4 className="text-sm font-bold text-ink">{e.subject}</h4>
            <p className="text-[11px] text-muted">{e.id} · {e.category}</p>
            <small className="text-[10px] text-muted">Updated {e.date}</small>
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

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <small className="text-[10px] text-muted uppercase tracking-wider">{t('memberDashboard')}</small>
          <h2 className="font-serif text-2xl text-ink mt-1">{t('goodMorning')}</h2>
        </div>
        <button onClick={() => setActivePanel('new')} className="bg-green text-white px-4 py-2 text-sm font-bold cursor-pointer border-0">
          + {t('createEnquiry')}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-line p-5 bg-white">
          <span className="text-[10px] text-muted">Open enquiries</span>
          <strong className="block text-2xl text-green font-serif">{enquiries.filter(e => e.status !== 'Resolved').length}</strong>
          <small className="text-[9px] text-muted">One reply received</small>
        </div>
        <div className="border border-line p-5 bg-white">
          <span className="text-[10px] text-muted">Member since</span>
          <strong className="block text-2xl text-green font-serif">2023</strong>
          <small className="text-[9px] text-muted">Verified member</small>
        </div>
        <div className="border border-line p-5 bg-white">
          <span className="text-[10px] text-muted">Documents</span>
          <strong className="block text-2xl text-green font-serif">6</strong>
          <small className="text-[9px] text-muted">All securely stored</small>
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
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Crop advisory')
  const [priority, setPriority] = useState('Normal')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEnquiry(subject, category)
    setSubject('')
    setDescription('')
    setActivePanel('dashboard')
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
          <b className="text-xl text-muted">＋</b>
          <span className="text-sm text-ink">Upload supporting documents</span>
          <small className="text-[10px] text-muted">PDF, JPG, PNG up to 10 MB</small>
          <input type="file" className="hidden" multiple />
        </label>
        <button type="submit" className="bg-green text-white px-6 py-3 text-sm font-bold cursor-pointer border-0 hover:bg-green/90 transition-colors justify-self-start">
          Submit enquiry →
        </button>
      </form>
    </>
  )
}

function DocumentsPanel() {
  return (
    <div className="text-center py-16">
      <span className="text-4xl text-muted">▤</span>
      <h2 className="font-serif text-2xl text-ink mt-4 mb-2">Secure documents</h2>
      <p className="text-sm text-muted mb-6">Your membership and enquiry documents will appear here.</p>
      <button className="bg-green text-white px-6 py-3 text-sm font-bold cursor-pointer border-0">Upload a document</button>
    </div>
  )
}

function ProfilePanel() {
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
        <span className="w-[70px] h-[70px] bg-green text-white grid place-items-center text-xl font-bold rounded-full shrink-0">TS</span>
        <div>
          <small className="text-[10px] text-muted">Verified member</small>
          <h3 className="font-serif text-2xl normal-case tracking-normal text-ink mt-1 mb-1">Tushar Shelke</h3>
          <p className="text-[10px] text-muted">Member since 2023 · Preferred language: English</p>
        </div>
      </div>
    </>
  )
}

function AdminPanel() {
  const modules = ['Pages & multilingual content', 'Members & registrations', 'Enquiries & reports', 'Blogs, galleries & downloads']
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <small className="text-[10px] text-muted uppercase tracking-wider">Role-based access</small>
          <h2 className="font-serif text-2xl text-ink mt-1">Admin management</h2>
        </div>
        <span className="bg-gold text-deep px-3 py-1.5 text-[9px] font-bold uppercase">Preview</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {[
          { value: '42', label: 'Members', desc: 'Registrations and profiles' },
          { value: '8', label: 'Open enquiries', desc: 'Review, respond, and assign' },
          { value: '14', label: 'Draft items', desc: 'Draft → Review → Publish' },
          { value: '3', label: 'Languages', desc: 'English, Hindi, Marathi' },
        ].map((item) => (
          <article key={item.label} className="border border-line bg-white p-4 grid gap-1">
            <b className="font-serif text-2xl text-green">{item.value}</b>
            <span className="text-[11px] font-bold text-ink">{item.label}</span>
            <small className="text-[9px] text-muted leading-relaxed">{item.desc}</small>
          </article>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {modules.map((mod) => (
          <button key={mod} className="font-inherit border border-line bg-white p-4 text-left text-[11px] font-bold cursor-pointer hover:border-green transition-colors flex justify-between items-center">
            <span>{mod}</span><span className="text-green">→</span>
          </button>
        ))}
      </div>
    </>
  )
}

export function PortalModal() {
  const isOpen = usePortalStore((s) => s.isOpen)
  const closePortal = usePortalStore((s) => s.closePortal)
  const activePanel = usePortalStore((s) => s.activePanel)
  const setActivePanel = usePortalStore((s) => s.setActivePanel)
  const t = useLanguageStore((s) => s.t)
  const enquiries = useEnquiryStore((s) => s.enquiries)
  const role = useAuthStore((s) => s.role)
  const logout = useAuthStore((s) => s.logout)

  if (!isOpen) return null

  const panels: Record<string, () => React.ReactNode> = {
    dashboard: DashboardPanel,
    enquiries: EnquiriesPanel,
    new: NewEnquiryPanel,
    documents: DocumentsPanel,
    profile: ProfilePanel,
    admin: AdminPanel,
  }

  const safePanel = activePanel === 'admin' && role !== 'admin' ? 'dashboard' : activePanel
  const ActivePanelComponent = panels[safePanel] ?? DashboardPanel

  return (
    <div className="fixed inset-0 z-[130] flex">
      <div className="absolute inset-0 bg-ink/50" onClick={closePortal} />
      <aside className="relative z-10 ml-auto bg-paper w-full max-w-[640px] flex flex-col overflow-hidden" style={{ animation: 'slide-in-right 0.4s ease-out' }}>
        <button onClick={closePortal} className="absolute right-5 top-5 bg-transparent border-0 text-xl cursor-pointer text-ink z-10" aria-label="Close portal">×</button>

        <div className="border-b border-line p-5 flex items-center gap-3">
          <BrandMark />
          <div>
            <strong className="font-serif block text-lg text-ink">GreenWings</strong>
            <small className="text-[9px] text-muted uppercase tracking-wider">{t('memberPortal')}</small>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-line p-5">
          <span className="w-10 h-10 bg-green text-white grid place-items-center text-sm font-bold rounded-full shrink-0">TS</span>
          <div>
            <small className="text-[10px] text-muted">{t('welcomeBack')}</small>
            <strong className="block text-sm text-ink">Tushar Shelke</strong>
          </div>
          <span className="ml-auto text-lime text-sm">✓</span>
        </div>

        <nav className="flex border-b border-line overflow-x-auto">
          {[
            { id: 'dashboard', icon: '⌂', label: t('dashboard') },
            { id: 'enquiries', icon: '◫', label: t('myEnquiries'), badge: enquiries.length },
            { id: 'new', icon: '＋', label: t('newEnquiry') },
            { id: 'documents', icon: '▤', label: t('documents') },
            { id: 'profile', icon: '○', label: 'My profile' },
            ...(role === 'admin' ? [{ id: 'admin', icon: '⚙', label: 'Admin management' }] : []),
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
              {item.badge && <b className="bg-green text-white text-[9px] w-5 h-5 grid place-items-center rounded-full">{item.badge}</b>}
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
