import { useEffect, useState } from 'react'
import { fetchDatabaseProducts, type DatabaseProduct } from '../../services/api'
import type { Lang } from '../../data/translations'
import { useLanguageStore } from '../../stores/languageStore'

const copy: Record<Lang, {
  eyebrow: string
  title: string
  intro: string
  all: string
  varieties: string
  unavailable: string
  hide: string
  view: string
  varietyInfo: string
}> = {
  en: {
    eyebrow: 'Live database catalogue',
    title: 'Crop species & varieties',
    intro: 'Information is loaded from the backend database with multilingual records and image-link support.',
    all: 'all',
    varieties: 'varieties',
    unavailable: 'Database API is unavailable. Start the backend server to view live produce data.',
    hide: 'Hide details',
    view: 'View database information ->',
    varietyInfo: 'Variety information',
  },
  hi: {
    eyebrow: 'लाइव डेटाबेस कैटलॉग',
    title: 'फसल प्रजातियां और किस्में',
    intro: 'जानकारी backend database से चुनी हुई भाषा, multilingual records और image links के साथ आती है.',
    all: 'सभी',
    varieties: 'किस्में',
    unavailable: 'Database API उपलब्ध नहीं है. Live produce data देखने के लिए backend server शुरू करें.',
    hide: 'विवरण छुपाएं',
    view: 'डेटाबेस जानकारी देखें ->',
    varietyInfo: 'किस्म की जानकारी',
  },
  mr: {
    eyebrow: 'लाइव्ह डेटाबेस कॅटलॉग',
    title: 'पीक प्रजाती आणि जाती',
    intro: 'माहिती backend database मधून निवडलेल्या भाषेत, multilingual records आणि image links सह येते.',
    all: 'सर्व',
    varieties: 'जाती',
    unavailable: 'Database API उपलब्ध नाही. Live produce data पाहण्यासाठी backend server सुरू करा.',
    hide: 'तपशील लपवा',
    view: 'डेटाबेस माहिती पहा ->',
    varietyInfo: 'जातीची माहिती',
  },
}

function imageFor(item: { image_link?: string; imageLink?: string; image_url?: string; image_urls?: string[] }) {
  return item.image_link || item.imageLink || item.image_urls?.[0] || item.image_url || ''
}

export function DatabaseCropCatalogue() {
  const lang = useLanguageStore((state) => state.lang)
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [selectedType, setSelectedType] = useState('all')
  const [openProduct, setOpenProduct] = useState<number | null>(null)
  const [error, setError] = useState('')
  const text = copy[lang]

  useEffect(() => {
    let active = true
    fetchDatabaseProducts(undefined, lang)
      .then((items) => {
        if (!active) return
        setProducts(items)
        setOpenProduct(null)
        setError('')
      })
      .catch(() => {
        if (active) setError(text.unavailable)
      })
    return () => {
      active = false
    }
  }, [lang, text.unavailable])

  const types = [...new Set(products.map((product) => product.type))]
  const visibleProducts = products.filter((product) => selectedType === 'all' || product.type === selectedType)
  const typeLabels = new Map(products.map((product) => [product.type, product.display_type]))

  return (
    <section className="mt-16 border-t border-line pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-3">{text.eyebrow}</div>
          <h2 className="font-serif text-[clamp(26px,4vw,44px)] leading-tight text-ink">{text.title}</h2>
          <p className="text-sm text-muted mt-3 max-w-2xl">{text.intro}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', ...types].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 border text-[10px] uppercase font-bold cursor-pointer ${selectedType === type ? 'bg-green text-white border-green' : 'bg-white text-ink border-line'}`}
            >
              {type === 'all' ? text.all : (typeLabels.get(type) ?? type)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-harvest/20 border border-harvest p-4 text-sm text-ink">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleProducts.map((product) => {
          const productImage = imageFor(product)
          return (
            <article key={product.produce_id} className="bg-white/90 border border-line p-5 shadow-[0_12px_28px_rgba(58,38,20,0.06)]">
              {productImage && <img src={productImage} alt={product.display_name} className="mb-4 h-44 w-full object-cover" />}
              <button onClick={() => setOpenProduct(openProduct === product.produce_id ? null : product.produce_id)} className="w-full text-left bg-transparent border-0 cursor-pointer p-0">
                <span className="text-[9px] uppercase tracking-wider font-bold text-green">
                  {product.display_type} · {product.subtypes.length} {text.varieties}
                </span>
                <h3 className="font-serif text-2xl text-ink mt-2">{product.display_name}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">{product.localized_info}</p>
                <span className="block text-[10px] uppercase font-bold text-green mt-4">
                  {openProduct === product.produce_id ? text.hide : text.view}
                </span>
              </button>
              {openProduct === product.produce_id && (
                <div className="border-t border-line mt-5 pt-5">
                  <p className="whitespace-pre-line text-sm text-muted leading-relaxed">{product.localized_info}</p>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-green mt-6 mb-3">{text.varietyInfo}</h4>
                  <div className="grid gap-3">
                    {product.subtypes.map((subtype) => {
                      const subtypeImage = imageFor(subtype)
                      return (
                        <details key={subtype.subtype_id} className="border border-line p-4">
                          <summary className="cursor-pointer font-bold text-sm text-ink">{subtype.display_name}</summary>
                          {subtypeImage && <img src={subtypeImage} alt={subtype.display_name} className="mt-3 h-32 w-full object-cover" />}
                          <p className="whitespace-pre-line text-xs text-muted leading-relaxed mt-3">{subtype.localized_info}</p>
                        </details>
                      )
                    })}
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
