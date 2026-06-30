import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductBySlug } from '../data/catalog'
import { fetchDatabaseProducts, type DatabaseProduct } from '../services/api'
import { categories } from '../data/categories'
import { useProductStore } from '../stores/productStore'
import { useLoginStore } from '../stores/loginStore'
import { useLanguageStore } from '../stores/languageStore'
import { catalogueCopy, localizeCategory, localizeProduct } from '../services/catalogLocalization'
import type { Variety } from '../data/types'
import type { Lang } from '../data/translations'

function VarietyAccordion({
  variety,
  isOpen,
  onToggle,
  lang,
  imageUrls,
}: {
  variety: Variety
  isOpen: boolean
  onToggle: () => void
  lang: Lang
  imageUrls?: string[]
}) {
  const copy = catalogueCopy[lang]

  return (
    <div className="border border-line bg-white/90 overflow-hidden shadow-[0_10px_26px_rgba(58,38,20,0.06)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-transparent border-0 cursor-pointer hover:bg-cream/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className={`w-8 h-8 grid place-items-center border-2 transition-all text-sm ${isOpen ? 'border-green text-green rotate-45' : 'border-line text-muted'}`}>+</span>
          <h3 className="font-serif text-xl text-ink">{variety.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-green uppercase tracking-wider font-bold hidden sm:block">{variety.applications.slice(0, 3).join(' · ')}</span>
          <span className="text-[9px] text-muted">{isOpen ? copy.collapse : copy.expand}</span>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-line p-6 lg:p-8" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
            <div>
              {imageUrls && imageUrls.length > 0 ? (
                <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-3 mb-6 rounded-sm pb-2">
                  {imageUrls.map((url, i) => (
                    <img key={i} src={url} alt={`${variety.name} ${i + 1}`} className="h-52 min-w-full object-cover snap-center shadow-sm border border-line rounded-sm" />
                  ))}
                </div>
              ) : (
                <div className="h-52 bg-gradient-to-br from-sky/20 via-cream to-harvest/20 border border-dashed border-line flex items-center justify-center text-center text-muted text-[10px] uppercase tracking-wider p-6 rounded-sm mb-6">
                  {variety.imagePlaceholder}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {variety.applications.map((app) => (
                  <span key={app} className="bg-cream text-ink text-[9px] uppercase tracking-wider font-bold px-3 py-1">{app}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted leading-[1.8] whitespace-pre-line">{variety.overview}</p>

              <h4 className="text-[10px] uppercase tracking-[0.15em] text-green font-bold mt-6 mb-3">{copy.keyCharacteristics}</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(variety.characteristics).map(([key, value]) => (
                  <div key={key} className="border border-line p-3">
                    <small className="block text-[8px] uppercase tracking-wider text-muted">{key}</small>
                    <span className="text-sm text-ink font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-soil text-white p-4">
                  <small className="block text-[8px] uppercase tracking-wider text-white/50">{copy.shelfLife}</small>
                  <span className="text-sm text-harvest font-medium">{variety.shelfLife}</span>
                </div>
                <div className="bg-green text-white p-4">
                  <small className="block text-[8px] uppercase tracking-wider text-white/60">{copy.exportSuitability}</small>
                  <span className="text-sm text-lime font-medium">{variety.exportSuitability}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProductProfilePage() {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>()
  const lang = useLanguageStore((s) => s.lang)
  const copy = catalogueCopy[lang]
  const rawCategory = categories.find((c) => c.slug === categorySlug)
  const rawProduct = productSlug ? getProductBySlug(categorySlug ?? '', productSlug) : undefined
  const category = rawCategory ? localizeCategory(rawCategory, lang) : undefined
  const product = rawProduct ? localizeProduct(rawProduct, lang) : undefined
  const { openAccordion, toggleAccordion } = useProductStore()
  const openLogin = useLoginStore((s) => s.openLogin)
  
  const [dbProduct, setDbProduct] = useState<DatabaseProduct | null>(null)
  
  useEffect(() => {
    if (rawProduct) {
      fetchDatabaseProducts(undefined, lang)
        .then(products => {
          const target = (rawProduct.name || '').toLowerCase()
          const match = products.find(p => (p.name || '').toLowerCase() === target || (p.english_name || '').toLowerCase() === target)
          if (match) setDbProduct(match)
        })
        .catch(() => {})
    }
  }, [rawProduct, lang])
  
  const getImagesForVariety = (varietyName: string): string[] => {
    if (!dbProduct) return []
    const subtype = dbProduct.subtypes.find(s => {
      const vName = (s.variety_name || '').toLowerCase()
      const dName = (s.display_name || '').toLowerCase()
      const target = (varietyName || '').toLowerCase()
      if (!target) return false
      
      if (vName && target.includes(vName)) return true
      if (vName && vName.includes(target)) return true
      if (dName && dName.includes(target)) return true
      return false
    })
    if (!subtype) return []
    
    if (subtype.image_url) {
      try {
        const parsed = JSON.parse(subtype.image_url)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch (e) {
        // Not JSON, return as single item array if it's a valid string
        if (typeof subtype.image_url === 'string' && subtype.image_url.trim() !== '') {
          return [subtype.image_url]
        }
      }
    }
    
    if (subtype.image_urls && subtype.image_urls.length > 0) return subtype.image_urls
    if (subtype.image_link) return [subtype.image_link]
    if (subtype.imageLink) return [subtype.imageLink]
    return []
  }

  if (!rawCategory || !category || !product) {
    return (
      <div className="py-24 px-[8vw] text-center">
        <h2 className="font-serif text-3xl text-ink mb-4">{copy.productNotFound}</h2>
        <Link to="/products" className="text-green font-bold no-underline">{copy.backToCategories}</Link>
      </div>
    )
  }

  return (
    <section className="py-16 px-[8vw] bg-gradient-to-b from-paper via-cream to-[#edf4df]">
      <nav className="flex items-center gap-2 text-[11px] text-muted mb-8 flex-wrap">
        <Link to="/products" className="text-green no-underline hover:underline">{copy.products}</Link>
        <span>/</span>
        <Link to={`/products/${rawCategory.slug}`} className="text-green no-underline hover:underline">{category.name}</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 mb-12">
        <div>
          <h1 className="font-serif text-[clamp(28px,5vw,56px)] leading-tight tracking-[-0.045em] mb-6">{product.name}</h1>
          <p className="text-sm text-muted leading-[1.8] mb-6">{product.overview}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.keyBenefits.map((benefit) => (
              <span key={benefit} className="bg-green/10 text-green text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 border border-green/20">{benefit}</span>
            ))}
          </div>

          <button onClick={openLogin} className="bg-harvest text-deep px-5 py-3 text-[10px] font-bold uppercase cursor-pointer border-0 hover:bg-gold transition-colors">
            {copy.requestSpecs}
          </button>
        </div>

        <div className="h-72 lg:h-auto min-h-[320px] bg-cover bg-center rounded-sm relative" style={{ backgroundImage: `url(${product.heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent rounded-sm" />
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            {product.growingRegions.map((region) => (
              <span key={region} className="bg-deep/80 text-white text-[9px] uppercase tracking-wider font-bold px-3 py-1">{region}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
        {[
          { label: copy.harvestSeason, value: product.harvestSeason },
          { label: copy.exportStatus, value: product.exportAvailability, highlight: true },
          { label: copy.storage, value: product.storageInfo },
          ...product.nutritionalHighlights.slice(0, 3).map((highlight) => ({ label: copy.nutrition, value: highlight })),
        ].map((item, index) => (
          <div key={index} className={`${item.highlight ? 'bg-green text-white' : 'bg-paper'} border border-line p-4`}>
            <small className="block text-[8px] uppercase tracking-wider text-muted mb-1">{item.label}</small>
            <span className={`text-sm font-medium ${item.highlight ? 'text-lime' : 'text-ink'}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.15em] text-green font-bold mb-4">{copy.nutritionalHighlights}</h3>
          <ul className="grid gap-2">
            {product.nutritionalHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-lime mt-0.5">•</span> {highlight}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.15em] text-green font-bold mb-4">{copy.marketApplications}</h3>
          <ul className="grid gap-2">
            {product.marketApplications.map((application) => (
              <li key={application} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-lime mt-0.5">•</span> {application}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-serif text-[clamp(24px,4vw,42px)] leading-tight tracking-[-0.045em] mb-2">
          {product.varieties.length} {product.name} {copy.varieties}
        </h2>
        <p className="text-sm text-muted">{copy.varietyIntro}</p>
      </div>

      <div className="grid gap-3">
        {product.varieties.map((variety) => (
          <VarietyAccordion
            key={variety.slug}
            variety={variety}
            isOpen={openAccordion === variety.slug}
            onToggle={() => toggleAccordion(variety.slug)}
            lang={lang}
            imageUrls={getImagesForVariety(variety.name)}
          />
        ))}
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-deep via-green to-soil text-white flex flex-wrap items-center justify-between gap-4 rounded-sm">
        <div>
          <h3 className="font-serif text-lg mb-1">{copy.interested(product.name)}</h3>
          <p className="text-sm text-white/60">{copy.enquiryText}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openLogin} className="bg-harvest text-deep px-5 py-3 text-[10px] font-bold uppercase cursor-pointer border-0 hover:bg-gold">
            {copy.submitEnquiry}
          </button>
          <Link to={`/products/${rawCategory.slug}`} className="border border-white/30 text-white px-5 py-3 text-[10px] font-bold uppercase no-underline hover:bg-white/10">
            {copy.backTo(category.name)}
          </Link>
        </div>
      </div>
    </section>
  )
}
