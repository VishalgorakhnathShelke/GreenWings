import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/shared/SectionHeading'
import { useLanguageStore } from '../stores/languageStore'
import { fetchFertilizers, type Fertilizer, type FertilizerKind } from '../services/api'

const sectionCopy: Record<FertilizerKind, { title: string; eyebrow: string; text: string }> = {
  local: {
    eyebrow: 'Indian agricultural inputs',
    title: 'Local Fertilizers',
    text: 'Government-approved Indian products, regional recommendations, organic options and chemical fertilizers suited to Maharashtra farming conditions.',
  },
  imported: {
    eyebrow: 'Premium global nutrition',
    title: 'Imported Fertilizers',
    text: 'International brands, import country information, certifications and premium nutrient formulations for high-value crops and precision farming.',
  },
}

function FertilizerCard({ fertilizer }: { fertilizer: Fertilizer }) {
  const path = `/agricultural-inputs/${fertilizer.kind}/${fertilizer.id}`
  return (
    <article className="border border-line bg-white p-5 grid gap-4 hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-cream border border-line overflow-hidden grid place-items-center">
        {fertilizer.imageUrl ? (
          <img src={fertilizer.imageUrl} alt={fertilizer.displayName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-green text-sm font-bold">GreenWings Input</span>
        )}
      </div>
      <div>
        <small className="text-[10px] uppercase tracking-wider text-green font-bold">{fertilizer.displayCategory}</small>
        <h3 className="font-serif text-2xl text-ink mt-1 mb-2">{fertilizer.displayName}</h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-3">{fertilizer.localizedDescription}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-[11px] text-muted">
        <span><b className="block text-ink">Manufacturer</b>{fertilizer.manufacturer}</span>
        <span><b className="block text-ink">Origin</b>{fertilizer.countryOfOrigin}</span>
      </div>
      <Link to={path} className="text-[10px] uppercase tracking-wider font-bold text-green no-underline hover:text-harvest">
        View product details -&gt;
      </Link>
    </article>
  )
}

function FertilizerSection({ kind }: { kind: FertilizerKind }) {
  const lang = useLanguageStore((s) => s.lang)
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchFertilizers(kind, lang, { search, category })
      .then((payload) => {
        setFertilizers(payload.fertilizers)
        setCategories(payload.categories)
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load fertilizers'))
      .finally(() => setLoading(false))
  }, [category, kind, lang, search])

  const copy = sectionCopy[kind]
  const countLabel = useMemo(() => `${fertilizers.length} ${fertilizers.length === 1 ? 'product' : 'products'}`, [fertilizers.length])

  return (
    <section className="py-16 border-t border-line">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <small className="text-[10px] uppercase tracking-[0.18em] text-green font-bold">{copy.eyebrow}</small>
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] text-ink mt-2">{copy.title}</h2>
          <p className="text-muted leading-relaxed mt-3">{copy.text}</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted">{countLabel}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3 mb-8">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${copy.title.toLowerCase()}`}
          className="border border-line bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="border border-line bg-white px-4 py-3 text-sm outline-none focus:border-green">
          <option value="">All categories</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {loading && <p className="text-sm text-muted">Loading fertilizer products...</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-4">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {fertilizers.map((fertilizer) => <FertilizerCard key={`${kind}-${fertilizer.id}`} fertilizer={fertilizer} />)}
        </div>
      )}
    </section>
  )
}

export function AgriculturalInputsPage() {
  return (
    <main className="bg-gradient-to-b from-paper via-cream to-[#edf4df]">
      <section className="px-[8vw] pt-24 pb-10">
        <SectionHeading
          eyebrow="Agricultural Inputs"
          title="Fertilizer support for modern and traditional farms."
          description="Explore separate local and imported fertilizer catalogues with crop suitability, application guidance, safety notes and product documentation."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <a href="#local-fertilizers" className="border border-line bg-white p-6 no-underline text-ink hover:border-green">
            <small className="text-[10px] uppercase tracking-wider text-green font-bold">Local Fertilizers</small>
            <p className="text-sm text-muted mt-2">Indian manufacturers, government-approved products, organic and chemical options.</p>
          </a>
          <a href="#imported-fertilizers" className="border border-line bg-white p-6 no-underline text-ink hover:border-green">
            <small className="text-[10px] uppercase tracking-wider text-green font-bold">Imported Fertilizers</small>
            <p className="text-sm text-muted mt-2">Import certifications, global brands and premium nutrient formulations.</p>
          </a>
        </div>
      </section>

      <div className="px-[8vw] pb-20">
        <div id="local-fertilizers">
          <FertilizerSection kind="local" />
        </div>
        <div id="imported-fertilizers">
          <FertilizerSection kind="imported" />
        </div>
      </div>
    </main>
  )
}
