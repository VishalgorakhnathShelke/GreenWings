import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  createAdminCompanyContent,
  createAdminCompanyTimeline,
  createAdminHomepageStatistic,
  createAdminLeadershipMember,
  deleteAdminCompanyContent,
  deleteAdminCompanyTimeline,
  deleteAdminHomepageStatistic,
  deleteAdminLeadershipMember,
  fetchAdminCompanyContents,
  fetchAdminCompanyTimelines,
  fetchAdminHomepageStatistics,
  fetchAdminLeadershipMembers,
  updateAdminCompanyContent,
  updateAdminCompanyTimeline,
  updateAdminHomepageStatistic,
  updateAdminLeadershipMember,
  type CompanyContentSection,
  type CompanyContentSectionPayload,
  type CompanyTimeline,
  type CompanyTimelinePayload,
  type HomepageStatistic,
  type HomepageStatisticPayload,
  type LeadershipMember,
  type LeadershipPayload,
} from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

type ProfileSection = 'content' | 'timeline' | 'statistics' | 'leadership'

const inputClass = 'border border-line bg-white px-3 py-2 text-xs outline-none focus:border-green'

const blankContent: CompanyContentSectionPayload = {
  sectionKey: '',
  title: '',
  subtitle: '',
  content: '',
  language: 'en',
  displayOrder: 0,
  status: 'published',
}

const blankTimeline: CompanyTimelinePayload = {
  year: '',
  title: '',
  description: '',
  impactMetric: '',
  language: 'en',
  displayOrder: 0,
  status: 'published',
}

const blankStatistic: HomepageStatisticPayload = {
  label: '',
  value: '',
  description: '',
  displayOrder: 0,
  active: true,
}

const blankLeadership: LeadershipPayload = {
  fullName: '',
  designation: '',
  roleDescription: '',
  biography: '',
  image: '',
  imageUrl: '',
  displayOrder: 0,
  active: true,
  translations: { hi: {}, mr: {} },
}

function readImage(file: File | undefined, callback: (value: string) => void) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') callback(reader.result)
  }
  reader.readAsDataURL(file)
}

export function CompanyProfileManager({ section }: { section: ProfileSection }) {
  if (section === 'content') return <ContentManager />
  if (section === 'timeline') return <TimelineManager />
  if (section === 'statistics') return <StatisticsManager />
  return <LeadershipProfileManager />
}

function ContentManager() {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<CompanyContentSection[]>([])
  const [form, setForm] = useState<CompanyContentSectionPayload>(blankContent)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadItems = () => {
    if (!token) return
    setLoading(true)
    fetchAdminCompanyContents(token, { search, language, status })
      .then((payload) => setItems(payload.contents))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load company content'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search, language, status])

  const updateField = (field: keyof CompanyContentSectionPayload, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(blankContent)
  }

  const editItem = (item: CompanyContentSection) => {
    setEditingId(item.id)
    setForm({
      sectionKey: item.sectionKey,
      title: item.title,
      subtitle: item.subtitle || '',
      content: item.content,
      language: item.language,
      displayOrder: item.displayOrder,
      status: item.status,
    })
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) return
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateAdminCompanyContent(token, editingId, form)
        setMessage('Company content updated.')
      } else {
        await createAdminCompanyContent(token, form)
        setMessage('Company content created.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save company content')
    }
  }

  const removeItem = async (item: CompanyContentSection) => {
    if (!token || !window.confirm(`Delete ${item.title}?`)) return
    await deleteAdminCompanyContent(token, item.id)
    setMessage('Company content deleted.')
    loadItems()
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <ManagerHeader eyebrow="About page" title="Manage Company Content" text="Edit introduction, vision, mission, and future language versions." onNew={resetForm} />
      <Filters search={search} setSearch={setSearch}>
        <LanguageSelect value={language} onChange={setLanguage} allowAll />
        <StatusSelect value={status} onChange={setStatus} allowAll />
      </Filters>
      <Alerts error={error} message={message} />

      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={form.sectionKey} onChange={(event) => updateField('sectionKey', event.target.value)} placeholder="sectionKey, e.g. company_introduction" className={inputClass} required />
          <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Title" className={inputClass} required />
          <input value={form.subtitle} onChange={(event) => updateField('subtitle', event.target.value)} placeholder="Subtitle" className={inputClass} />
          <LanguageSelect value={form.language} onChange={(value) => updateField('language', value)} />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Display order" className={inputClass} />
          <StatusSelect value={form.status} onChange={(value) => updateField('status', value)} />
        </div>
        <textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} placeholder="Content" className={`${inputClass} min-h-[160px]`} required />
        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update content' : 'Create content'}
        </button>
      </form>

      <ItemList loading={loading}>
        {items.map((item) => (
          <AdminListItem key={item.id} title={`${item.title} (${item.language.toUpperCase()})`} meta={`${item.sectionKey} - ${item.status}`} onEdit={() => editItem(item)} onDelete={() => void removeItem(item)} />
        ))}
      </ItemList>
    </section>
  )
}

function TimelineManager() {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<CompanyTimeline[]>([])
  const [form, setForm] = useState<CompanyTimelinePayload>(blankTimeline)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadItems = () => {
    if (!token) return
    setLoading(true)
    fetchAdminCompanyTimelines(token, { search, language, status })
      .then((payload) => setItems(payload.timelines))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load timeline'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search, language, status])

  const updateField = (field: keyof CompanyTimelinePayload, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(blankTimeline)
  }

  const editItem = (item: CompanyTimeline) => {
    setEditingId(item.id)
    setForm({
      year: item.year,
      title: item.title,
      description: item.description,
      impactMetric: item.impactMetric,
      language: item.language,
      displayOrder: item.displayOrder,
      status: item.status,
    })
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) return
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateAdminCompanyTimeline(token, editingId, form)
        setMessage('Timeline record updated.')
      } else {
        await createAdminCompanyTimeline(token, form)
        setMessage('Timeline record created.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save timeline record')
    }
  }

  const removeItem = async (item: CompanyTimeline) => {
    if (!token || !window.confirm(`Delete ${item.title}?`)) return
    await deleteAdminCompanyTimeline(token, item.id)
    setMessage('Timeline record deleted.')
    loadItems()
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <ManagerHeader eyebrow="Journey timeline" title="Manage Timeline Records" text="Add, edit, delete, search, filter, and prepare multilingual journey records." onNew={resetForm} />
      <Filters search={search} setSearch={setSearch}>
        <LanguageSelect value={language} onChange={setLanguage} allowAll />
        <StatusSelect value={status} onChange={setStatus} allowAll />
      </Filters>
      <Alerts error={error} message={message} />

      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={form.year} onChange={(event) => updateField('year', event.target.value)} placeholder="Year" className={inputClass} required />
          <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Title" className={`${inputClass} sm:col-span-2`} required />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Order" className={inputClass} />
          <LanguageSelect value={form.language} onChange={(value) => updateField('language', value)} />
          <StatusSelect value={form.status} onChange={(value) => updateField('status', value)} />
          <input value={form.impactMetric} onChange={(event) => updateField('impactMetric', event.target.value)} placeholder="Impact metric" className={`${inputClass} sm:col-span-2`} />
        </div>
        <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Description" className={`${inputClass} min-h-[110px]`} required />
        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update timeline' : 'Create timeline'}
        </button>
      </form>

      <ItemList loading={loading}>
        {items.map((item) => (
          <AdminListItem key={item.id} title={`${item.year} - ${item.title}`} meta={item.impactMetric || item.description} onEdit={() => editItem(item)} onDelete={() => void removeItem(item)} />
        ))}
      </ItemList>
    </section>
  )
}

function StatisticsManager() {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<HomepageStatistic[]>([])
  const [form, setForm] = useState<HomepageStatisticPayload>(blankStatistic)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadItems = () => {
    if (!token) return
    setLoading(true)
    fetchAdminHomepageStatistics(token)
      .then((payload) => setItems(payload.statistics))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load homepage statistics'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const updateField = (field: keyof HomepageStatisticPayload, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(blankStatistic)
  }

  const editItem = (item: HomepageStatistic) => {
    setEditingId(item.id)
    setForm({
      label: item.label,
      value: item.value,
      description: item.description || '',
      displayOrder: item.displayOrder,
      active: item.active,
    })
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) return
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateAdminHomepageStatistic(token, editingId, form)
        setMessage('Homepage statistic updated.')
      } else {
        await createAdminHomepageStatistic(token, form)
        setMessage('Homepage statistic created.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save homepage statistic')
    }
  }

  const removeItem = async (item: HomepageStatistic) => {
    if (!token || !window.confirm(`Delete ${item.label}?`)) return
    await deleteAdminHomepageStatistic(token, item.id)
    setMessage('Homepage statistic deleted.')
    loadItems()
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <ManagerHeader eyebrow="Homepage impact" title="Manage Homepage Statistics" text="Update the impact statistics shown on public pages." onNew={resetForm} />
      <Alerts error={error} message={message} />

      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={form.label} onChange={(event) => updateField('label', event.target.value)} placeholder="Label" className={inputClass} required />
          <input value={form.value} onChange={(event) => updateField('value', event.target.value)} placeholder="Value" className={inputClass} required />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Order" className={inputClass} />
          <label className="border border-line bg-white px-3 py-2 text-xs flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(event) => updateField('active', event.target.checked)} />
            Active
          </label>
        </div>
        <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Description" className={`${inputClass} min-h-[70px]`} />
        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update statistic' : 'Create statistic'}
        </button>
      </form>

      <ItemList loading={loading}>
        {items.map((item) => (
          <AdminListItem key={item.id} title={`${item.label}: ${item.value}`} meta={item.active ? 'Active' : 'Inactive'} onEdit={() => editItem(item)} onDelete={() => void removeItem(item)} />
        ))}
      </ItemList>
    </section>
  )
}

function LeadershipProfileManager() {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<LeadershipMember[]>([])
  const [form, setForm] = useState<LeadershipPayload>(blankLeadership)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadItems = () => {
    if (!token) return
    setLoading(true)
    fetchAdminLeadershipMembers(token)
      .then((payload) => setItems(payload.leadership))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load leadership'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const updateField = (field: keyof LeadershipPayload, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(blankLeadership)
  }

  const editItem = (member: LeadershipMember) => {
    setEditingId(member.id)
    setForm({
      fullName: member.fullName,
      designation: member.baseDesignation || member.designation,
      roleDescription: member.baseRoleDescription || member.roleDescription || '',
      biography: member.baseBiography || member.biography || '',
      image: member.image || '',
      imageUrl: member.imageUrl || member.image || '',
      displayOrder: member.displayOrder,
      active: member.active,
      translations: {
        hi: member.translations?.hi || {},
        mr: member.translations?.mr || {},
      },
    })
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) return
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateAdminLeadershipMember(token, editingId, form)
        setMessage('Leadership profile updated.')
      } else {
        await createAdminLeadershipMember(token, form)
        setMessage('Leadership profile created.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save leadership profile')
    }
  }

  const removeItem = async (member: LeadershipMember) => {
    if (!token || !window.confirm(`Delete ${member.fullName}?`)) return
    await deleteAdminLeadershipMember(token, member.id)
    setMessage('Leadership profile deleted.')
    loadItems()
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <ManagerHeader eyebrow="Leadership module" title="Manage Leadership Members" text="Maintain directors, designations, role descriptions, biographies, photos, and active status." onNew={resetForm} />
      <Alerts error={error} message={message} />

      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="Full name" className={inputClass} required />
          <input value={form.designation} onChange={(event) => updateField('designation', event.target.value)} placeholder="Designation" className={inputClass} required />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Order" className={inputClass} />
          <input value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} placeholder="Image URL" className={`${inputClass} sm:col-span-2`} />
          <label className="border border-line bg-white px-3 py-2 text-xs flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(event) => updateField('active', event.target.checked)} />
            Active profile
          </label>
        </div>
        <textarea value={form.roleDescription} onChange={(event) => updateField('roleDescription', event.target.value)} placeholder="Role description" className={`${inputClass} min-h-[80px]`} />
        <textarea value={form.biography} onChange={(event) => updateField('biography', event.target.value)} placeholder="Biography" className={`${inputClass} min-h-[100px]`} />
        <ImageUpload onUpload={(value) => { updateField('imageUrl', value); updateField('image', value) }} />
        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update member' : 'Create member'}
        </button>
      </form>

      <ItemList loading={loading}>
        {items.map((item) => (
          <AdminListItem key={item.id} title={item.fullName} meta={`${item.designation} - ${item.active ? 'Active' : 'Inactive'}`} onEdit={() => editItem(item)} onDelete={() => void removeItem(item)} />
        ))}
      </ItemList>
    </section>
  )
}

function ManagerHeader({ eyebrow, title, text, onNew }: { eyebrow: string; title: string; text: string; onNew: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <small className="text-[10px] uppercase tracking-wider text-green font-bold">{eyebrow}</small>
        <h3 className="font-serif text-xl text-ink">{title}</h3>
        <p className="text-[11px] text-muted">{text}</p>
      </div>
      <button onClick={onNew} className="border border-line bg-cream px-3 py-2 text-xs font-bold cursor-pointer">New record</button>
    </div>
  )
}

function Filters({ search, setSearch, children }: { search: string; setSearch: (value: string) => void; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px_150px] gap-2">
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className={inputClass} />
      {children}
    </div>
  )
}

function LanguageSelect({ value, onChange, allowAll = false }: { value: string; onChange: (value: string) => void; allowAll?: boolean }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
      {allowAll && <option value="">All languages</option>}
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="mr">Marathi</option>
    </select>
  )
}

function StatusSelect({ value, onChange, allowAll = false }: { value: string; onChange: (value: string) => void; allowAll?: boolean }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
      {allowAll && <option value="">All statuses</option>}
      <option value="published">Published</option>
      <option value="draft">Draft</option>
      <option value="archived">Archived</option>
    </select>
  )
}

function Alerts({ error, message }: { error: string; message: string }) {
  return (
    <>
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
      {message && <p className="text-sm text-green bg-green/10 border border-green/20 p-3">{message}</p>}
    </>
  )
}

function ImageUpload({ onUpload }: { onUpload: (value: string) => void }) {
  return (
    <label className="border border-dashed border-line p-4 text-center text-xs text-muted">
      Upload Images - selected image is stored as the image preview in this dev build.
      <input type="file" className="hidden" accept="image/*" onChange={(event) => readImage(event.target.files?.[0], onUpload)} />
    </label>
  )
}

function ItemList({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      {loading && <p className="text-sm text-muted">Loading...</p>}
      {children}
    </div>
  )
}

function AdminListItem({ title, meta, onEdit, onDelete }: { title: string; meta: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <article className="border border-line p-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div>
        <strong className="block text-sm text-ink">{title}</strong>
        <small className="text-muted line-clamp-2">{meta}</small>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="border border-line bg-white px-3 py-2 text-xs cursor-pointer">Edit</button>
        <button onClick={onDelete} className="border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs cursor-pointer">Delete</button>
      </div>
    </article>
  )
}
