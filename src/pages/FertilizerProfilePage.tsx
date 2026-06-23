import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguageStore } from '../stores/languageStore'
import { fetchFertilizer, type Fertilizer, type FertilizerKind } from '../services/api'
import type { Lang } from '../data/translations'

const copyByLanguage: Record<Lang, {
  back: string
  imported: string
  local: string
  manufacturer: string
  origin: string
  season: string
  loading: string
  unableToLoad: string
  recommendedStage: string
  temperature: string
  soil: string
  downloadCta: string
  documentPending: string
  sections: {
    overview: string
    content: string
    benefits: string
    suitable: string
    unsuitable: string
    application: string
    seasonal: string
    safety: string
    regional: string
    approval: string
    brand: string
    certifications: string
    specifications: string
    documents: string
  }
}> = {
  en: {
    back: 'Back to Agricultural Inputs',
    imported: 'Imported Fertilizer',
    local: 'Local Fertilizer',
    manufacturer: 'Manufacturer',
    origin: 'Origin',
    season: 'Season',
    loading: 'Loading fertilizer product...',
    unableToLoad: 'Unable to load fertilizer',
    recommendedStage: 'Recommended stage',
    temperature: 'Temperature',
    soil: 'Soil',
    downloadCta: 'Download product document',
    documentPending: 'Product document will be available after admin upload.',
    sections: {
      overview: 'Product Overview',
      content: 'Nutrient Content',
      benefits: 'Benefits',
      suitable: 'Suitable Crops',
      unsuitable: 'Unsuitable Crops',
      application: 'Application Instructions',
      seasonal: 'Seasonal Recommendations',
      safety: 'Safety Precautions',
      regional: 'Regional Recommendations',
      approval: 'Government Approval',
      brand: 'Brand Information',
      certifications: 'Import Certifications',
      specifications: 'International Specifications',
      documents: 'Downloadable Product Documents',
    },
  },
  hi: {
    back: 'कृषि इनपुट पर वापस जाएं',
    imported: 'आयातित उर्वरक',
    local: 'स्थानीय उर्वरक',
    manufacturer: 'निर्माता',
    origin: 'मूल देश',
    season: 'मौसम',
    loading: 'उर्वरक उत्पाद लोड हो रहा है...',
    unableToLoad: 'उर्वरक लोड नहीं हो सका',
    recommendedStage: 'अनुशंसित अवस्था',
    temperature: 'तापमान',
    soil: 'मिट्टी',
    downloadCta: 'उत्पाद दस्तावेज डाउनलोड करें',
    documentPending: 'उत्पाद दस्तावेज admin upload के बाद उपलब्ध होगा।',
    sections: {
      overview: 'उत्पाद परिचय',
      content: 'पोषक तत्व सामग्री',
      benefits: 'लाभ',
      suitable: 'उपयुक्त फसलें',
      unsuitable: 'अनुपयुक्त फसलें',
      application: 'उपयोग निर्देश',
      seasonal: 'मौसमी सिफारिशें',
      safety: 'सुरक्षा सावधानियां',
      regional: 'क्षेत्रीय सिफारिशें',
      approval: 'सरकारी अनुमोदन',
      brand: 'ब्रांड जानकारी',
      certifications: 'आयात प्रमाणन',
      specifications: 'अंतरराष्ट्रीय विनिर्देश',
      documents: 'डाउनलोड योग्य उत्पाद दस्तावेज',
    },
  },
  mr: {
    back: 'कृषी इनपुटकडे परत जा',
    imported: 'आयातित खत',
    local: 'स्थानिक खत',
    manufacturer: 'उत्पादक',
    origin: 'मूळ देश',
    season: 'हंगाम',
    loading: 'खत उत्पादन लोड होत आहे...',
    unableToLoad: 'खत लोड करता आले नाही',
    recommendedStage: 'शिफारस केलेली अवस्था',
    temperature: 'तापमान',
    soil: 'माती',
    downloadCta: 'उत्पादन दस्तऐवज डाउनलोड करा',
    documentPending: 'उत्पादन दस्तऐवज admin upload नंतर उपलब्ध होईल.',
    sections: {
      overview: 'उत्पादन परिचय',
      content: 'पोषक घटक',
      benefits: 'फायदे',
      suitable: 'योग्य पिके',
      unsuitable: 'अयोग्य पिके',
      application: 'वापर सूचना',
      seasonal: 'हंगामी शिफारसी',
      safety: 'सुरक्षा सूचना',
      regional: 'प्रादेशिक शिफारसी',
      approval: 'शासकीय मान्यता',
      brand: 'ब्रँड माहिती',
      certifications: 'आयात प्रमाणपत्रे',
      specifications: 'आंतरराष्ट्रीय तपशील',
      documents: 'डाउनलोड करण्यायोग्य उत्पादन दस्तऐवज',
    },
  },
}

function DetailBlock({ title, body }: { title: string; body?: string }) {
  if (!body) return null
  return (
    <section className="border border-line bg-white p-6">
      <h2 className="font-serif text-2xl text-ink mb-3">{title}</h2>
      <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{body}</p>
    </section>
  )
}

export function FertilizerProfilePage() {
  const { kind, id } = useParams()
  const lang = useLanguageStore((s) => s.lang)
  const copy = copyByLanguage[lang]
  const [fertilizer, setFertilizer] = useState<Fertilizer | null>(null)
  const [error, setError] = useState('')
  const safeKind = kind === 'imported' ? 'imported' : 'local'

  useEffect(() => {
    if (!id) return
    setError('')
    fetchFertilizer(safeKind as FertilizerKind, id, lang)
      .then((payload) => setFertilizer(payload.fertilizer))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : copy.unableToLoad))
  }, [copy.unableToLoad, id, lang, safeKind])

  if (error) {
    return (
      <section className="px-[8vw] py-24 bg-cream min-h-[70vh]">
        <Link to="/agricultural-inputs" className="text-green font-bold no-underline">{copy.back}</Link>
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 p-4">{error}</p>
      </section>
    )
  }

  if (!fertilizer) {
    return <section className="px-[8vw] py-24 bg-cream min-h-[70vh] text-muted">{copy.loading}</section>
  }

  const isImported = fertilizer.kind === 'imported'

  return (
    <article className="bg-gradient-to-b from-paper via-cream to-[#edf4df] min-h-screen">
      <section className="px-[8vw] py-20 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center">
        <div>
          <Link to="/agricultural-inputs" className="text-green font-bold no-underline text-sm">{copy.back}</Link>
          <small className="block mt-10 text-[10px] uppercase tracking-[0.18em] text-green font-bold">
            {isImported ? copy.imported : copy.local} - {fertilizer.displayCategory}
          </small>
          <h1 className="font-serif text-[clamp(42px,7vw,86px)] leading-none text-ink mt-3 mb-6">{fertilizer.displayName}</h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">{fertilizer.localizedDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <div className="border border-line bg-white p-4">
              <small className="text-[10px] text-muted uppercase">{copy.manufacturer}</small>
              <b className="block text-sm text-ink">{fertilizer.manufacturer}</b>
            </div>
            <div className="border border-line bg-white p-4">
              <small className="text-[10px] text-muted uppercase">{copy.origin}</small>
              <b className="block text-sm text-ink">{fertilizer.countryOfOrigin}</b>
            </div>
            <div className="border border-line bg-white p-4">
              <small className="text-[10px] text-muted uppercase">{copy.season}</small>
              <b className="block text-sm text-ink">{fertilizer.season}</b>
            </div>
          </div>
        </div>
        <div className="border border-line bg-white p-4 shadow-lg">
          <div className="aspect-[4/3] bg-cream grid place-items-center overflow-hidden">
            {fertilizer.imageUrl ? (
              <img src={fertilizer.imageUrl} alt={fertilizer.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-3xl text-green">GreenWings</span>
            )}
          </div>
        </div>
      </section>

      <section className="px-[8vw] pb-24 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DetailBlock title={copy.sections.overview} body={fertilizer.localizedDescription} />
        <DetailBlock title={copy.sections.content} body={fertilizer.localizedContent} />
        <DetailBlock title={copy.sections.benefits} body={fertilizer.localizedBenefits} />
        <DetailBlock title={copy.sections.suitable} body={fertilizer.applyOnCrops} />
        <DetailBlock title={copy.sections.unsuitable} body={fertilizer.doNotApplyOn} />
        <DetailBlock title={copy.sections.application} body={fertilizer.applicationMethod} />
        <DetailBlock title={copy.sections.seasonal} body={`${fertilizer.season}\n${copy.recommendedStage}: ${fertilizer.recommendedStage}\n${copy.temperature}: ${fertilizer.temperatureRange}\n${copy.soil}: ${fertilizer.soilType}`} />
        <DetailBlock title={copy.sections.safety} body={fertilizer.localizedPrecautions} />
        {!isImported && <DetailBlock title={copy.sections.regional} body={fertilizer.regionalRecommendations} />}
        {!isImported && <DetailBlock title={copy.sections.approval} body={fertilizer.approvalBody} />}
        {isImported && <DetailBlock title={copy.sections.brand} body={fertilizer.brand} />}
        {isImported && <DetailBlock title={copy.sections.certifications} body={fertilizer.importCertifications} />}
        {isImported && <DetailBlock title={copy.sections.specifications} body={fertilizer.internationalSpecifications} />}
        <section className="border border-line bg-white p-6 lg:col-span-2">
          <h2 className="font-serif text-2xl text-ink mb-3">{copy.sections.documents}</h2>
          {fertilizer.documentUrl ? (
            <a href={fertilizer.documentUrl} className="inline-flex bg-green text-white px-5 py-3 text-sm font-bold no-underline">{copy.downloadCta}</a>
          ) : (
            <p className="text-sm text-muted">{copy.documentPending}</p>
          )}
        </section>
      </section>
    </article>
  )
}
