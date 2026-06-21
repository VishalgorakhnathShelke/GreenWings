import { useEffect, useState, type FormEvent } from 'react'
import {
  createAdminSuccessStory,
  deleteAdminSuccessStory,
  fetchAdminSuccessStories,
  updateAdminSuccessStory,
  type SuccessStory,
  type SuccessStoryMedia,
  type SuccessStoryPayload,
} from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

const inputClass = 'border border-line bg-white px-3 py-2 text-xs outline-none focus:border-green'

const blankStory: SuccessStoryPayload = {
  farmerName: '',
  farmerPhone: '',
  title: '',
  slug: '',
  location: '',
  village: '',
  district: '',
  cropType: '',
  landArea: '',
  storyCategory: 'Market Access',
  shortQuote: '',
  shortSummary: '',
  fullStory: '',
  challenge: '',
  solution: '',
  result: '',
  yieldBefore: '',
  yieldAfter: '',
  priceBenefit: '',
  additionalIncome: '',
  fertilizerUsed: '',
  seedUsed: '',
  marketSupport: '',
  profileImage: '',
  coverImage: '',
  language: 'en',
  displayOrder: 0,
  featured: true,
  status: 'published',
  media: [],
}

function readImage(file: File | undefined, callback: (value: string) => void) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') callback(reader.result)
  }
  reader.readAsDataURL(file)
}

function readImages(files: FileList | null, callback: (items: SuccessStoryMedia[]) => void) {
  if (!files?.length) return
  const readers = Array.from(files).map((file, index) => new Promise<SuccessStoryMedia>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        mediaType: 'image',
        mediaUrl: typeof reader.result === 'string' ? reader.result : '',
        caption: file.name,
        displayOrder: index + 1,
      })
    }
    reader.readAsDataURL(file)
  }))
  void Promise.all(readers).then((items) => callback(items.filter((item) => item.mediaUrl)))
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function SuccessStoryManager() {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<SuccessStory[]>([])
  const [form, setForm] = useState<SuccessStoryPayload>(blankStory)
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
    fetchAdminSuccessStories(token, { search, language, status })
      .then((payload) => setItems(payload.stories))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load success stories'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search, language, status])

  const updateField = (field: keyof SuccessStoryPayload, value: string | number | boolean | SuccessStoryMedia[]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateTitle = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: current.slug || slugify(value),
    }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(blankStory)
  }

  const editItem = (story: SuccessStory) => {
    setEditingId(story.id)
    setForm({
      farmerName: story.farmerName,
      farmerPhone: story.farmerPhone || '',
      title: story.title,
      slug: story.slug,
      location: story.location || '',
      village: story.village || '',
      district: story.district || '',
      cropType: story.cropType || '',
      landArea: story.landArea || '',
      storyCategory: story.storyCategory || '',
      shortQuote: story.shortQuote || '',
      shortSummary: story.shortSummary || '',
      fullStory: story.fullStory || '',
      challenge: story.challenge || '',
      solution: story.solution || '',
      result: story.result || '',
      yieldBefore: story.yieldBefore || '',
      yieldAfter: story.yieldAfter || '',
      priceBenefit: story.priceBenefit || '',
      additionalIncome: story.additionalIncome || '',
      fertilizerUsed: story.fertilizerUsed || '',
      seedUsed: story.seedUsed || '',
      marketSupport: story.marketSupport || '',
      profileImage: story.profileImage || '',
      coverImage: story.coverImage || '',
      language: story.language,
      displayOrder: story.displayOrder,
      featured: story.featured,
      status: story.status,
      media: story.media || [],
    })
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) return
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateAdminSuccessStory(token, editingId, form)
        setMessage('Success story updated.')
      } else {
        await createAdminSuccessStory(token, form)
        setMessage('Success story created.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save success story')
    }
  }

  const removeItem = async (story: SuccessStory) => {
    if (!token || !window.confirm(`Delete ${story.title}?`)) return
    await deleteAdminSuccessStory(token, story.id)
    setMessage('Success story deleted.')
    loadItems()
  }

  const updateMedia = (index: number, field: keyof SuccessStoryMedia, value: string | number) => {
    updateField('media', form.media.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )))
  }

  const addBlankMedia = () => {
    updateField('media', [
      ...form.media,
      { mediaType: 'image', mediaUrl: '', caption: '', displayOrder: form.media.length + 1 },
    ])
  }

  const removeMedia = (index: number) => {
    updateField('media', form.media.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <small className="text-[10px] uppercase tracking-wider text-green font-bold">Farmer case studies</small>
          <h3 className="font-serif text-xl text-ink">Manage Success Stories</h3>
          <p className="text-[11px] text-muted">Add, edit, translate, publish, feature, and manage farmer story media.</p>
        </div>
        <button onClick={resetForm} className="border border-line bg-cream px-3 py-2 text-xs font-bold cursor-pointer">New story</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px_150px] gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search farmer, crop, location" className={inputClass} />
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
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
      {message && <p className="text-sm text-green bg-green/10 border border-green/20 p-3">{message}</p>}

      <form onSubmit={submitForm} className="grid gap-4 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={form.farmerName} onChange={(event) => updateField('farmerName', event.target.value)} placeholder="Farmer name" className={inputClass} required />
          <input value={form.farmerPhone} onChange={(event) => updateField('farmerPhone', event.target.value)} placeholder="Farmer phone" className={inputClass} />
          <input value={form.title} onChange={(event) => updateTitle(event.target.value)} placeholder="Story title" className={inputClass} required />
          <input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder="Story slug" className={inputClass} required />
          <input value={form.storyCategory} onChange={(event) => updateField('storyCategory', event.target.value)} placeholder="Story category" className={inputClass} />
          <select value={form.language} onChange={(event) => updateField('language', event.target.value)} className={inputClass}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
          <input value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Location" className={inputClass} />
          <input value={form.village} onChange={(event) => updateField('village', event.target.value)} placeholder="Village" className={inputClass} />
          <input value={form.district} onChange={(event) => updateField('district', event.target.value)} placeholder="District" className={inputClass} />
          <input value={form.cropType} onChange={(event) => updateField('cropType', event.target.value)} placeholder="Crop type" className={inputClass} />
          <input value={form.landArea} onChange={(event) => updateField('landArea', event.target.value)} placeholder="Land area" className={inputClass} />
          <input type="number" value={form.displayOrder} onChange={(event) => updateField('displayOrder', Number(event.target.value))} placeholder="Display order" className={inputClass} />
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className={inputClass}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <label className="border border-line bg-white px-3 py-2 text-xs flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(event) => updateField('featured', event.target.checked)} />
            Featured story
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <textarea value={form.shortQuote} onChange={(event) => updateField('shortQuote', event.target.value)} placeholder="Short quote" className={`${inputClass} min-h-[80px]`} />
          <textarea value={form.shortSummary} onChange={(event) => updateField('shortSummary', event.target.value)} placeholder="Short summary" className={`${inputClass} min-h-[80px]`} />
        </div>

        <textarea value={form.fullStory} onChange={(event) => updateField('fullStory', event.target.value)} placeholder="Full farmer story" className={`${inputClass} min-h-[160px]`} required />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <textarea value={form.challenge} onChange={(event) => updateField('challenge', event.target.value)} placeholder="Challenge" className={`${inputClass} min-h-[100px]`} />
          <textarea value={form.solution} onChange={(event) => updateField('solution', event.target.value)} placeholder="GreenWings solution" className={`${inputClass} min-h-[100px]`} />
          <textarea value={form.result} onChange={(event) => updateField('result', event.target.value)} placeholder="Result" className={`${inputClass} min-h-[100px]`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={form.yieldBefore} onChange={(event) => updateField('yieldBefore', event.target.value)} placeholder="Yield before" className={inputClass} />
          <input value={form.yieldAfter} onChange={(event) => updateField('yieldAfter', event.target.value)} placeholder="Yield after" className={inputClass} />
          <input value={form.priceBenefit} onChange={(event) => updateField('priceBenefit', event.target.value)} placeholder="Price benefit" className={inputClass} />
          <input value={form.additionalIncome} onChange={(event) => updateField('additionalIncome', event.target.value)} placeholder="Additional income" className={inputClass} />
          <input value={form.fertilizerUsed} onChange={(event) => updateField('fertilizerUsed', event.target.value)} placeholder="Fertilizer used" className={inputClass} />
          <input value={form.seedUsed} onChange={(event) => updateField('seedUsed', event.target.value)} placeholder="Seed used" className={inputClass} />
          <input value={form.marketSupport} onChange={(event) => updateField('marketSupport', event.target.value)} placeholder="Market support" className={`${inputClass} sm:col-span-2`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="grid gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Profile image</span>
            <input value={form.profileImage} onChange={(event) => updateField('profileImage', event.target.value)} placeholder="Profile image URL" className={inputClass} />
            <label className="border border-dashed border-line p-3 text-center text-xs text-muted cursor-pointer">
              Upload profile image
              <input type="file" className="hidden" accept="image/*" onChange={(event) => readImage(event.target.files?.[0], (value) => updateField('profileImage', value))} />
            </label>
          </label>
          <label className="grid gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Cover image</span>
            <input value={form.coverImage} onChange={(event) => updateField('coverImage', event.target.value)} placeholder="Cover image URL" className={inputClass} />
            <label className="border border-dashed border-line p-3 text-center text-xs text-muted cursor-pointer">
              Upload cover image
              <input type="file" className="hidden" accept="image/*" onChange={(event) => readImage(event.target.files?.[0], (value) => updateField('coverImage', value))} />
            </label>
          </label>
        </div>

        <section className="border border-dashed border-line p-4 grid gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <strong className="text-sm text-ink">Related story images</strong>
              <p className="text-[11px] text-muted">Add URLs or upload multiple images for this story.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={addBlankMedia} className="border border-line bg-white px-3 py-2 text-xs cursor-pointer">Add image URL</button>
              <label className="border border-line bg-white px-3 py-2 text-xs cursor-pointer">
                Upload images
                <input type="file" className="hidden" accept="image/*" multiple onChange={(event) => readImages(event.target.files, (newItems) => updateField('media', [...form.media, ...newItems]))} />
              </label>
            </div>
          </div>
          <div className="grid gap-2">
            {form.media.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_90px_70px] gap-2">
                <input value={item.mediaUrl} onChange={(event) => updateMedia(index, 'mediaUrl', event.target.value)} placeholder="Media URL" className={inputClass} />
                <input value={item.caption} onChange={(event) => updateMedia(index, 'caption', event.target.value)} placeholder="Caption" className={inputClass} />
                <input type="number" value={item.displayOrder} onChange={(event) => updateMedia(index, 'displayOrder', Number(event.target.value))} placeholder="Order" className={inputClass} />
                <button type="button" onClick={() => removeMedia(index)} className="border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs cursor-pointer">Remove</button>
              </div>
            ))}
          </div>
        </section>

        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update success story' : 'Create success story'}
        </button>
      </form>

      <div className="grid gap-2">
        {loading && <p className="text-sm text-muted">Loading...</p>}
        {items.map((item) => (
          <article key={item.id} className="border border-line p-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <strong className="block text-sm text-ink">{item.title} ({item.language.toUpperCase()})</strong>
              <small className="text-muted line-clamp-2">{item.farmerName} - {item.cropType || item.storyCategory} - {item.status}</small>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editItem(item)} className="border border-line bg-white px-3 py-2 text-xs cursor-pointer">Edit</button>
              <button onClick={() => void removeItem(item)} className="border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs cursor-pointer">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
