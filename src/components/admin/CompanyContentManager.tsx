import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  createAdminCompanyMilestone,
  createAdminCompanyStory,
  createAdminLeadershipMember,
  deleteAdminCompanyMilestone,
  deleteAdminCompanyStory,
  deleteAdminLeadershipMember,
  fetchAdminCompanyMilestones,
  fetchAdminCompanyStories,
  fetchAdminLeadershipMembers,
  updateAdminCompanyMilestone,
  updateAdminCompanyStory,
  updateAdminLeadershipMember,
  type CompanyMilestone,
  type CompanyMilestonePayload,
  type CompanyStory,
  type CompanyStoryPayload,
  type LeadershipMember,
  type LeadershipPayload,
} from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

type ContentSection = 'stories' | 'milestones' | 'leadership'

const inputClass = 'border border-line bg-white px-3 py-2 text-xs outline-none focus:border-green'

const blankStory: CompanyStoryPayload = {
  title: '',
  slug: '',
  language: 'en',
  content: '',
  featuredImage: '',
  displayOrder: 0,
  status: 'published',
}

const blankMilestone: CompanyMilestonePayload = {
  year: '',
  title: '',
  description: '',
  image: '',
  displayOrder: 0,
  translations: { hi: {}, mr: {} },
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

export function CompanyContentManager({ section }: { section: ContentSection }) {
  if (section === 'stories') return <StoryManager />
  if (section === 'milestones') return <MilestoneManager />
  return <LeadershipManager />
}

function StoryManager() {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<CompanyStory[]>([])
  const [form, setForm] = useState<CompanyStoryPayload>(blankStory)
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
    fetchAdminCompanyStories(token, { search, language, status })
      .then((payload) => setItems(payload.stories))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load stories'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search, language, status])

  const updateField = (field: keyof CompanyStoryPayload, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(blankStory)
  }

  const editItem = (story: CompanyStory) => {
    setEditingId(story.id)
    setForm({
      title: story.title,
      slug: story.slug,
      language: story.language,
      content: story.content,
      featuredImage: story.featuredImage || '',
      displayOrder: story.displayOrder,
      status: story.status,
    })
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) return
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateAdminCompanyStory(token, editingId, form)
        setMessage('Company story updated.')
      } else {
        await createAdminCompanyStory(token, form)
        setMessage('Company story created.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save story')
    }
  }

  const removeItem = async (story: CompanyStory) => {
    if (!token || !window.confirm(`Delete ${story.title}?`)) return
    await deleteAdminCompanyStory(token, story.id)
    setMessage('Company story deleted.')
    loadItems()
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <ManagerHeader eyebrow="Website content" title="Manage Company Stories" text="Create stories for English, Hindi, and Marathi using the same slug per content section." onNew={resetForm} />
      <Filters search={search} setSearch={setSearch}>
        <select value={language} onChange={(event) => setLanguage(event.target.value)} className={inputClass}>
          <option value="">All languages</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </Filters>
      <Alerts error={error} message={message} />

      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Title" className={inputClass} required />
          <input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="Slug, e.g. vision" className={inputClass} required />
          <select value={form.language} onChange={(event) => updateField('language', event.target.value)} className={inputClass}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
          <input value={form.featuredImage} onChange={(event) => updateField('featuredImage', event.target.value)} placeholder="Featured image URL" className={inputClass} />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Display order" className={inputClass} />
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className={inputClass}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} placeholder="Story content" className={`${inputClass} min-h-[120px]`} required />
        <ImageUpload onUpload={(value) => updateField('featuredImage', value)} />
        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update story' : 'Create story'}
        </button>
      </form>

      <ItemList loading={loading}>
        {items.map((item) => (
          <AdminListItem key={item.id} title={`${item.title} (${item.language.toUpperCase()})`} meta={`${item.slug} - ${item.status}`} onEdit={() => editItem(item)} onDelete={() => void removeItem(item)} />
        ))}
      </ItemList>
    </section>
  )
}

function MilestoneManager() {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<CompanyMilestone[]>([])
  const [form, setForm] = useState<CompanyMilestonePayload>(blankMilestone)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadItems = () => {
    if (!token) return
    setLoading(true)
    fetchAdminCompanyMilestones(token)
      .then((payload) => setItems(payload.milestones))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load milestones'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const updateField = (field: keyof CompanyMilestonePayload, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateTranslation = (language: 'hi' | 'mr', field: 'title' | 'description', value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        hi: current.translations?.hi || {},
        mr: current.translations?.mr || {},
        [language]: { ...(current.translations?.[language] || {}), [field]: value },
      },
    }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(blankMilestone)
  }

  const editItem = (milestone: CompanyMilestone) => {
    setEditingId(milestone.id)
    setForm({
      year: milestone.year,
      title: milestone.baseTitle || milestone.title,
      description: milestone.baseDescription || milestone.description,
      image: milestone.image || '',
      displayOrder: milestone.displayOrder,
      translations: {
        hi: milestone.translations?.hi || {},
        mr: milestone.translations?.mr || {},
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
        await updateAdminCompanyMilestone(token, editingId, form)
        setMessage('Milestone updated.')
      } else {
        await createAdminCompanyMilestone(token, form)
        setMessage('Milestone created.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save milestone')
    }
  }

  const removeItem = async (milestone: CompanyMilestone) => {
    if (!token || !window.confirm(`Delete ${milestone.title}?`)) return
    await deleteAdminCompanyMilestone(token, milestone.id)
    setMessage('Milestone deleted.')
    loadItems()
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <ManagerHeader eyebrow="Company timeline" title="Manage Milestones" text="Create timeline records and maintain Hindi/Marathi translations." onNew={resetForm} />
      <Alerts error={error} message={message} />
      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={form.year} onChange={(event) => updateField('year', event.target.value)} placeholder="Year" className={inputClass} required />
          <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Title" className={`${inputClass} sm:col-span-2`} required />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Display order" className={inputClass} />
        </div>
        <input value={form.image} onChange={(event) => updateField('image', event.target.value)} placeholder="Image URL" className={inputClass} />
        <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Description" className={`${inputClass} min-h-[90px]`} required />
        <TranslationBlock
          firstTitle="Hindi milestone"
          secondTitle="Marathi milestone"
          firstName={form.translations?.hi?.title || ''}
          secondName={form.translations?.mr?.title || ''}
          firstBody={form.translations?.hi?.description || ''}
          secondBody={form.translations?.mr?.description || ''}
          nameLabel="title"
          bodyLabel="description"
          onFirstName={(value) => updateTranslation('hi', 'title', value)}
          onSecondName={(value) => updateTranslation('mr', 'title', value)}
          onFirstBody={(value) => updateTranslation('hi', 'description', value)}
          onSecondBody={(value) => updateTranslation('mr', 'description', value)}
        />
        <ImageUpload onUpload={(value) => updateField('image', value)} />
        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update milestone' : 'Create milestone'}
        </button>
      </form>
      <ItemList loading={loading}>
        {items.map((item) => (
          <AdminListItem key={item.id} title={`${item.year} - ${item.title}`} meta={item.description} onEdit={() => editItem(item)} onDelete={() => void removeItem(item)} />
        ))}
      </ItemList>
    </section>
  )
}

function LeadershipManager() {
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

  const updateTranslation = (language: 'hi' | 'mr', field: 'designation' | 'biography', value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        hi: current.translations?.hi || {},
        mr: current.translations?.mr || {},
        [language]: { ...(current.translations?.[language] || {}), [field]: value },
      },
    }))
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
      biography: member.baseBiography || member.biography,
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
      <ManagerHeader eyebrow="Leadership module" title="Manage Leadership Profiles" text="Maintain directors, designations, biographies, photos, status, and translations." onNew={resetForm} />
      <Alerts error={error} message={message} />
      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="Full name" className={inputClass} required />
          <input value={form.designation} onChange={(event) => updateField('designation', event.target.value)} placeholder="Designation" className={inputClass} required />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Display order" className={inputClass} />
          <input value={form.image} onChange={(event) => updateField('image', event.target.value)} placeholder="Image URL" className={`${inputClass} sm:col-span-2`} />
          <label className="border border-line bg-white px-3 py-2 text-xs flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(event) => updateField('active', event.target.checked)} />
            Active profile
          </label>
        </div>
        <textarea value={form.biography} onChange={(event) => updateField('biography', event.target.value)} placeholder="Biography" className={`${inputClass} min-h-[90px]`} required />
        <TranslationBlock
          firstTitle="Hindi leadership"
          secondTitle="Marathi leadership"
          firstName={form.translations?.hi?.designation || ''}
          secondName={form.translations?.mr?.designation || ''}
          firstBody={form.translations?.hi?.biography || ''}
          secondBody={form.translations?.mr?.biography || ''}
          nameLabel="designation"
          bodyLabel="biography"
          onFirstName={(value) => updateTranslation('hi', 'designation', value)}
          onSecondName={(value) => updateTranslation('mr', 'designation', value)}
          onFirstBody={(value) => updateTranslation('hi', 'biography', value)}
          onSecondBody={(value) => updateTranslation('mr', 'biography', value)}
        />
        <ImageUpload onUpload={(value) => updateField('image', value)} />
        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update profile' : 'Create profile'}
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
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_160px] gap-2">
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search content" className={inputClass} />
      {children}
    </div>
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

function TranslationBlock({
  firstTitle,
  secondTitle,
  firstName,
  secondName,
  firstBody,
  secondBody,
  nameLabel,
  bodyLabel,
  onFirstName,
  onSecondName,
  onFirstBody,
  onSecondBody,
}: {
  firstTitle: string
  secondTitle: string
  firstName: string
  secondName: string
  firstBody: string
  secondBody: string
  nameLabel: string
  bodyLabel: string
  onFirstName: (value: string) => void
  onSecondName: (value: string) => void
  onFirstBody: (value: string) => void
  onSecondBody: (value: string) => void
}) {
  return (
    <div className="border border-dashed border-line p-4 grid gap-3">
      <strong className="text-xs text-ink">Manage multilingual content</strong>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="grid gap-2">
          <span className="text-[10px] text-green uppercase tracking-wider font-bold">{firstTitle}</span>
          <input value={firstName} onChange={(event) => onFirstName(event.target.value)} placeholder={`Hindi ${nameLabel}`} className={inputClass} />
          <textarea value={firstBody} onChange={(event) => onFirstBody(event.target.value)} placeholder={`Hindi ${bodyLabel}`} className={`${inputClass} min-h-[72px]`} />
        </div>
        <div className="grid gap-2">
          <span className="text-[10px] text-green uppercase tracking-wider font-bold">{secondTitle}</span>
          <input value={secondName} onChange={(event) => onSecondName(event.target.value)} placeholder={`Marathi ${nameLabel}`} className={inputClass} />
          <textarea value={secondBody} onChange={(event) => onSecondBody(event.target.value)} placeholder={`Marathi ${bodyLabel}`} className={`${inputClass} min-h-[72px]`} />
        </div>
      </div>
    </div>
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
