import { useEffect, useMemo, useState } from 'react'
import {
  createAdminFertilizer,
  deleteAdminFertilizer,
  fetchAdminFertilizers,
  updateAdminFertilizer,
  type Fertilizer,
  type FertilizerKind,
  type FertilizerPayload,
  type FertilizerTranslationPayload,
} from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

const blankPayload: FertilizerPayload = {
  name: '',
  category: '',
  manufacturer: '',
  countryOfOrigin: 'India',
  description: '',
  content: '',
  uses: '',
  applyOnCrops: '',
  doNotApplyOn: '',
  applicationMethod: '',
  recommendedStage: '',
  season: '',
  temperatureRange: '',
  soilType: '',
  benefits: '',
  precautions: '',
  imageUrl: '',
  status: 'active',
  documentUrl: '',
  approvalBody: '',
  regionalRecommendations: '',
  brand: '',
  importCertifications: '',
  internationalSpecifications: '',
  translations: {
    hi: {},
    mr: {},
  },
}

const inputClass = 'border border-line bg-white px-3 py-2 text-xs outline-none focus:border-green'

type TranslationField = keyof FertilizerTranslationPayload

const translationFields: Array<{ field: TranslationField; label: string; multiline?: boolean }> = [
  { field: 'name', label: 'Name' },
  { field: 'category', label: 'Category' },
  { field: 'countryOfOrigin', label: 'Country of origin' },
  { field: 'description', label: 'Description', multiline: true },
  { field: 'content', label: 'Nutrient content', multiline: true },
  { field: 'uses', label: 'Uses', multiline: true },
  { field: 'applyOnCrops', label: 'Suitable crops', multiline: true },
  { field: 'doNotApplyOn', label: 'Unsuitable crops', multiline: true },
  { field: 'applicationMethod', label: 'Application method', multiline: true },
  { field: 'recommendedStage', label: 'Recommended stage' },
  { field: 'season', label: 'Season' },
  { field: 'temperatureRange', label: 'Temperature range' },
  { field: 'soilType', label: 'Soil type' },
  { field: 'benefits', label: 'Benefits', multiline: true },
  { field: 'precautions', label: 'Precautions', multiline: true },
  { field: 'approvalBody', label: 'Government approval', multiline: true },
  { field: 'regionalRecommendations', label: 'Regional recommendations', multiline: true },
  { field: 'brand', label: 'Brand' },
  { field: 'importCertifications', label: 'Import certifications', multiline: true },
  { field: 'internationalSpecifications', label: 'International specifications', multiline: true },
]

function payloadFromFertilizer(fertilizer: Fertilizer): FertilizerPayload {
  return {
    ...blankPayload,
    name: fertilizer.name,
    category: fertilizer.category,
    manufacturer: fertilizer.manufacturer,
    countryOfOrigin: fertilizer.countryOfOrigin,
    description: fertilizer.description,
    content: fertilizer.content,
    uses: fertilizer.uses,
    applyOnCrops: fertilizer.applyOnCrops,
    doNotApplyOn: fertilizer.doNotApplyOn,
    applicationMethod: fertilizer.applicationMethod,
    recommendedStage: fertilizer.recommendedStage,
    season: fertilizer.season,
    temperatureRange: fertilizer.temperatureRange,
    soilType: fertilizer.soilType,
    benefits: fertilizer.benefits,
    precautions: fertilizer.precautions,
    imageUrl: fertilizer.imageUrl || '',
    status: fertilizer.status,
    documentUrl: fertilizer.documentUrl || '',
    approvalBody: fertilizer.approvalBody || '',
    regionalRecommendations: fertilizer.regionalRecommendations || '',
    brand: fertilizer.brand || '',
    importCertifications: fertilizer.importCertifications || '',
    internationalSpecifications: fertilizer.internationalSpecifications || '',
  }
}

export function FertilizerManager({ kind }: { kind: FertilizerKind }) {
  const token = useAuthStore((s) => s.token)
  const [items, setItems] = useState<Fertilizer[]>([])
  const [form, setForm] = useState<FertilizerPayload>({ ...blankPayload, countryOfOrigin: kind === 'local' ? 'India' : '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const title = kind === 'local' ? 'Manage Local Fertilizers' : 'Manage Imported Fertilizers'
  const categories = useMemo(() => [...new Set(items.map((item) => item.category).filter(Boolean))], [items])

  const loadItems = () => {
    if (!token) return
    setLoading(true)
    fetchAdminFertilizers(token, kind, { search, status })
      .then((payload) => setItems(payload.fertilizers))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load fertilizers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, search, status, token])

  const updateField = (field: keyof FertilizerPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateTranslation = (language: 'hi' | 'mr', field: TranslationField, value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        hi: current.translations?.hi || {},
        mr: current.translations?.mr || {},
        [language]: {
          ...(current.translations?.[language] || {}),
          [field]: value,
        },
      },
    }))
  }

  const uploadImage = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('imageUrl', reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({ ...blankPayload, countryOfOrigin: kind === 'local' ? 'India' : '' })
  }

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateAdminFertilizer(token, kind, editingId, form)
        setMessage('Fertilizer updated successfully.')
      } else {
        await createAdminFertilizer(token, kind, form)
        setMessage('Fertilizer added successfully.')
      }
      resetForm()
      loadItems()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save fertilizer')
    }
  }

  const editItem = (fertilizer: Fertilizer) => {
    setEditingId(fertilizer.id)
    setForm(payloadFromFertilizer(fertilizer))
  }

  const removeItem = async (fertilizer: Fertilizer) => {
    if (!token) return
    const confirmed = window.confirm(`Delete ${fertilizer.name}?`)
    if (!confirmed) return
    await deleteAdminFertilizer(token, kind, fertilizer.id)
    setMessage('Fertilizer deleted successfully.')
    loadItems()
  }

  return (
    <section className="border border-line bg-white p-4 grid gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <small className="text-[10px] uppercase tracking-wider text-green font-bold">{kind === 'local' ? 'Indian inputs' : 'Imported inputs'}</small>
          <h3 className="font-serif text-xl text-ink">{title}</h3>
          <p className="text-[11px] text-muted">Add, edit, delete, search, filter, image URLs and multilingual content.</p>
        </div>
        <button onClick={resetForm} className="border border-line bg-cream px-3 py-2 text-xs font-bold cursor-pointer">New record</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, category, manufacturer" className={inputClass} />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">{error}</p>}
      {message && <p className="text-sm text-green bg-green/10 border border-green/20 p-3">{message}</p>}

      <form onSubmit={submitForm} className="grid gap-3 border border-line bg-cream/40 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Name" className={inputClass} required />
          <input value={form.category} onChange={(event) => updateField('category', event.target.value)} placeholder="Category" className={inputClass} required list={`${kind}-categories`} />
          <datalist id={`${kind}-categories`}>{categories.map((category) => <option key={category} value={category} />)}</datalist>
          <input value={form.manufacturer} onChange={(event) => updateField('manufacturer', event.target.value)} placeholder="Manufacturer" className={inputClass} required />
          <input value={form.countryOfOrigin} onChange={(event) => updateField('countryOfOrigin', event.target.value)} placeholder="Country of origin" className={inputClass} required />
          <input value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} placeholder="Image URL / uploaded image path" className={inputClass} />
          <input value={form.documentUrl} onChange={(event) => updateField('documentUrl', event.target.value)} placeholder="Document URL" className={inputClass} />
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className={inputClass}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={form.recommendedStage} onChange={(event) => updateField('recommendedStage', event.target.value)} placeholder="Recommended stage" className={inputClass} />
          <input value={form.season} onChange={(event) => updateField('season', event.target.value)} placeholder="Season" className={inputClass} />
          <input value={form.temperatureRange} onChange={(event) => updateField('temperatureRange', event.target.value)} placeholder="Temperature range" className={inputClass} />
          <input value={form.soilType} onChange={(event) => updateField('soilType', event.target.value)} placeholder="Soil type" className={inputClass} />
        </div>

        {kind === 'local' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.approvalBody} onChange={(event) => updateField('approvalBody', event.target.value)} placeholder="Government approval body" className={inputClass} />
            <input value={form.regionalRecommendations} onChange={(event) => updateField('regionalRecommendations', event.target.value)} placeholder="Regional recommendations" className={inputClass} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={form.brand} onChange={(event) => updateField('brand', event.target.value)} placeholder="Brand" className={inputClass} />
            <input value={form.importCertifications} onChange={(event) => updateField('importCertifications', event.target.value)} placeholder="Import certifications" className={inputClass} />
            <input value={form.internationalSpecifications} onChange={(event) => updateField('internationalSpecifications', event.target.value)} placeholder="International specifications" className={inputClass} />
          </div>
        )}

        {(['description', 'content', 'uses', 'applyOnCrops', 'doNotApplyOn', 'applicationMethod', 'benefits', 'precautions'] as const).map((field) => (
          <textarea
            key={field}
            value={String(form[field] || '')}
            onChange={(event) => updateField(field, event.target.value)}
            placeholder={field}
            className={`${inputClass} min-h-[72px] resize-y`}
            required={field === 'description' || field === 'content'}
          />
        ))}

        <div className="border border-dashed border-line p-4 grid gap-2">
          <strong className="text-xs text-ink">Multilingual content</strong>
          <p className="text-[11px] text-muted">Add Hindi and Marathi versions for public product pages. Empty fields fall back to English.</p>
          {(['hi', 'mr'] as const).map((language) => (
            <div key={language} className="border border-line bg-white/70 p-3 grid gap-2">
              <strong className="text-[11px] text-green">{language === 'hi' ? 'Hindi' : 'Marathi'} translation</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {translationFields.map(({ field, label, multiline }) => {
                  const placeholder = `${language === 'hi' ? 'Hindi' : 'Marathi'} ${label.toLowerCase()}`
                  const value = String(form.translations?.[language]?.[field] || '')
                  return multiline ? (
                    <textarea
                      key={`${language}-${field}`}
                      value={value}
                      onChange={(event) => updateTranslation(language, field, event.target.value)}
                      placeholder={placeholder}
                      className={`${inputClass} min-h-[60px]`}
                    />
                  ) : (
                    <input
                      key={`${language}-${field}`}
                      value={value}
                      onChange={(event) => updateTranslation(language, field, event.target.value)}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <label className="border border-dashed border-line p-4 text-center text-xs text-muted">
          Upload Images - selected image is stored as the product image preview in this dev build.
          <input type="file" className="hidden" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} />
        </label>

        <button className="bg-green text-white px-4 py-3 text-sm font-bold border-0 cursor-pointer justify-self-start">
          {editingId ? 'Update fertilizer' : 'Add fertilizer'}
        </button>
      </form>

      <div className="grid gap-2">
        {loading && <p className="text-sm text-muted">Loading...</p>}
        {items.map((item) => (
          <article key={item.id} className="border border-line p-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <strong className="block text-sm text-ink">{item.name}</strong>
              <small className="text-muted">{item.category} - {item.manufacturer} - {item.status}</small>
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
