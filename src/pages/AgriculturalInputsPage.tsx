import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/shared/SectionHeading'
import { useLanguageStore } from '../stores/languageStore'
import { fetchFertilizers, type Fertilizer, type FertilizerKind } from '../services/api'
import type { Lang } from '../data/translations'

type InputsCopy = {
  pageEyebrow: string
  pageTitle: string
  pageDescription: string
  localCardTitle: string
  localCardText: string
  importedCardTitle: string
  importedCardText: string
  labels: {
    manufacturer: string
    origin: string
    viewDetails: string
    allCategories: string
    product: string
    products: string
    loading: string
    fallbackImage: string
    unableToLoad: string
    searchPrefix: string
  }
  sections: Record<FertilizerKind, { title: string; eyebrow: string; text: string }>
}

const copyByLanguage: Record<Lang, InputsCopy> = {
  en: {
    pageEyebrow: 'Agricultural Inputs',
    pageTitle: 'Fertilizer support for modern and traditional farms.',
    pageDescription: 'Explore separate local and imported fertilizer catalogues with crop suitability, application guidance, safety notes and product documentation.',
    localCardTitle: 'Local Fertilizers',
    localCardText: 'Indian manufacturers, government-approved products, organic and chemical options.',
    importedCardTitle: 'Imported Fertilizers',
    importedCardText: 'Import certifications, global brands and premium nutrient formulations.',
    labels: {
      manufacturer: 'Manufacturer',
      origin: 'Origin',
      viewDetails: 'View product details ->',
      allCategories: 'All categories',
      product: 'product',
      products: 'products',
      loading: 'Loading fertilizer products...',
      fallbackImage: 'GreenWings Input',
      unableToLoad: 'Unable to load fertilizers',
      searchPrefix: 'Search',
    },
    sections: {
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
    },
  },
  hi: {
    pageEyebrow: 'कृषि इनपुट',
    pageTitle: 'आधुनिक और पारंपरिक खेती के लिए उर्वरक सहयोग।',
    pageDescription: 'फसल उपयुक्तता, उपयोग विधि, सुरक्षा निर्देश और उत्पाद दस्तावेजों के साथ स्थानीय और आयातित उर्वरक कैटलॉग देखें।',
    localCardTitle: 'स्थानीय उर्वरक',
    localCardText: 'भारतीय निर्माता, सरकारी अनुमोदित उत्पाद, जैविक और रासायनिक विकल्प।',
    importedCardTitle: 'आयातित उर्वरक',
    importedCardText: 'आयात प्रमाणन, वैश्विक ब्रांड और प्रीमियम पोषक फॉर्मुलेशन।',
    labels: {
      manufacturer: 'निर्माता',
      origin: 'मूल देश',
      viewDetails: 'उत्पाद विवरण देखें ->',
      allCategories: 'सभी श्रेणियां',
      product: 'उत्पाद',
      products: 'उत्पाद',
      loading: 'उर्वरक उत्पाद लोड हो रहे हैं...',
      fallbackImage: 'ग्रीनविंग्स इनपुट',
      unableToLoad: 'उर्वरक लोड नहीं हो सके',
      searchPrefix: 'खोजें',
    },
    sections: {
      local: {
        eyebrow: 'भारतीय कृषि इनपुट',
        title: 'स्थानीय उर्वरक',
        text: 'महाराष्ट्र की खेती के लिए उपयुक्त सरकारी अनुमोदित भारतीय उत्पाद, क्षेत्रीय सिफारिशें, जैविक और रासायनिक उर्वरक विकल्प।',
      },
      imported: {
        eyebrow: 'प्रीमियम वैश्विक पोषण',
        title: 'आयातित उर्वरक',
        text: 'उच्च-मूल्य फसलों और प्रिसिजन खेती के लिए अंतरराष्ट्रीय ब्रांड, आयात देश जानकारी, प्रमाणन और प्रीमियम पोषक फॉर्मुलेशन।',
      },
    },
  },
  mr: {
    pageEyebrow: 'कृषी इनपुट',
    pageTitle: 'आधुनिक आणि पारंपरिक शेतीसाठी खत सहाय्य.',
    pageDescription: 'पीक उपयुक्तता, वापर पद्धत, सुरक्षा सूचना आणि उत्पादन कागदपत्रांसह स्थानिक व आयातित खतांचे स्वतंत्र कॅटलॉग पहा.',
    localCardTitle: 'स्थानिक खते',
    localCardText: 'भारतीय उत्पादक, शासनमान्य उत्पादने, सेंद्रिय आणि रासायनिक पर्याय.',
    importedCardTitle: 'आयातित खते',
    importedCardText: 'आयात प्रमाणपत्रे, जागतिक ब्रँड आणि प्रीमियम पोषक फॉर्म्युलेशन.',
    labels: {
      manufacturer: 'उत्पादक',
      origin: 'मूळ देश',
      viewDetails: 'उत्पादन तपशील पहा ->',
      allCategories: 'सर्व श्रेणी',
      product: 'उत्पादन',
      products: 'उत्पादने',
      loading: 'खत उत्पादने लोड होत आहेत...',
      fallbackImage: 'ग्रीनविंग्स इनपुट',
      unableToLoad: 'खते लोड करता आली नाहीत',
      searchPrefix: 'शोधा',
    },
    sections: {
      local: {
        eyebrow: 'भारतीय कृषी इनपुट',
        title: 'स्थानिक खते',
        text: 'महाराष्ट्रातील शेतीसाठी उपयुक्त शासनमान्य भारतीय उत्पादने, प्रादेशिक शिफारसी, सेंद्रिय आणि रासायनिक खत पर्याय.',
      },
      imported: {
        eyebrow: 'प्रीमियम जागतिक पोषण',
        title: 'आयातित खते',
        text: 'उच्च-मूल्य पिके आणि अचूक शेतीसाठी आंतरराष्ट्रीय ब्रँड, आयात देश माहिती, प्रमाणपत्रे आणि प्रीमियम पोषक फॉर्म्युलेशन.',
      },
    },
  },
}

function FertilizerCard({ fertilizer, copy }: { fertilizer: Fertilizer; copy: InputsCopy }) {
  const path = `/agricultural-inputs/${fertilizer.kind}/${fertilizer.id}`
  return (
    <article className="border border-line bg-white p-5 grid gap-4 hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-cream border border-line overflow-hidden grid place-items-center">
        {fertilizer.imageUrl ? (
          <img src={fertilizer.imageUrl} alt={fertilizer.displayName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-green text-sm font-bold">{copy.labels.fallbackImage}</span>
        )}
      </div>
      <div>
        <small className="text-[10px] uppercase tracking-wider text-green font-bold">{fertilizer.displayCategory}</small>
        <h3 className="font-serif text-2xl text-ink mt-1 mb-2">{fertilizer.displayName}</h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-3">{fertilizer.localizedDescription}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-[11px] text-muted">
        <span><b className="block text-ink">{copy.labels.manufacturer}</b>{fertilizer.manufacturer}</span>
        <span><b className="block text-ink">{copy.labels.origin}</b>{fertilizer.countryOfOrigin}</span>
      </div>
      <Link to={path} className="text-[10px] uppercase tracking-wider font-bold text-green no-underline hover:text-harvest">
        {copy.labels.viewDetails}
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
  const copy = copyByLanguage[lang]
  const section = copy.sections[kind]

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchFertilizers(kind, lang, { search, category })
      .then((payload) => {
        setFertilizers(payload.fertilizers)
        setCategories(payload.categories)
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : copy.labels.unableToLoad))
      .finally(() => setLoading(false))
  }, [category, copy.labels.unableToLoad, kind, lang, search])

  const countLabel = useMemo(
    () => `${fertilizers.length} ${fertilizers.length === 1 ? copy.labels.product : copy.labels.products}`,
    [copy.labels.product, copy.labels.products, fertilizers.length],
  )

  return (
    <section className="py-16 border-t border-line">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <small className="text-[10px] uppercase tracking-[0.18em] text-green font-bold">{section.eyebrow}</small>
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] text-ink mt-2">{section.title}</h2>
          <p className="text-muted leading-relaxed mt-3">{section.text}</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted">{countLabel}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3 mb-8">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`${copy.labels.searchPrefix} ${section.title}`}
          className="border border-line bg-white px-4 py-3 text-sm outline-none focus:border-green"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="border border-line bg-white px-4 py-3 text-sm outline-none focus:border-green">
          <option value="">{copy.labels.allCategories}</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {loading && <p className="text-sm text-muted">{copy.labels.loading}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-4">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {fertilizers.map((fertilizer) => <FertilizerCard key={`${kind}-${fertilizer.id}`} fertilizer={fertilizer} copy={copy} />)}
        </div>
      )}
    </section>
  )
}

export function AgriculturalInputsPage() {
  const lang = useLanguageStore((s) => s.lang)
  const copy = copyByLanguage[lang]

  return (
    <main className="bg-gradient-to-b from-paper via-cream to-[#edf4df]">
      <section className="px-[8vw] pt-24 pb-10">
        <SectionHeading
          eyebrow={copy.pageEyebrow}
          title={copy.pageTitle}
          description={copy.pageDescription}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <a href="#local-fertilizers" className="border border-line bg-white p-6 no-underline text-ink hover:border-green">
            <small className="text-[10px] uppercase tracking-wider text-green font-bold">{copy.localCardTitle}</small>
            <p className="text-sm text-muted mt-2">{copy.localCardText}</p>
          </a>
          <a href="#imported-fertilizers" className="border border-line bg-white p-6 no-underline text-ink hover:border-green">
            <small className="text-[10px] uppercase tracking-wider text-green font-bold">{copy.importedCardTitle}</small>
            <p className="text-sm text-muted mt-2">{copy.importedCardText}</p>
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
