import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguageStore } from '../stores/languageStore'
import { fetchFertilizer, type Fertilizer, type FertilizerKind } from '../services/api'

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
  const [fertilizer, setFertilizer] = useState<Fertilizer | null>(null)
  const [error, setError] = useState('')
  const safeKind = kind === 'imported' ? 'imported' : 'local'

  useEffect(() => {
    if (!id) return
    setError('')
    fetchFertilizer(safeKind as FertilizerKind, id, lang)
      .then((payload) => setFertilizer(payload.fertilizer))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load fertilizer'))
  }, [id, lang, safeKind])

  if (error) {
    return (
      <section className="px-[8vw] py-24 bg-cream min-h-[70vh]">
        <Link to="/agricultural-inputs" className="text-green font-bold no-underline">Back to Agricultural Inputs</Link>
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 p-4">{error}</p>
      </section>
    )
  }

  if (!fertilizer) {
    return <section className="px-[8vw] py-24 bg-cream min-h-[70vh] text-muted">Loading fertilizer product...</section>
  }

  const isImported = fertilizer.kind === 'imported'

  return (
    <article className="bg-gradient-to-b from-paper via-cream to-[#edf4df] min-h-screen">
      <section className="px-[8vw] py-20 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-center">
        <div>
          <Link to="/agricultural-inputs" className="text-green font-bold no-underline text-sm">Back to Agricultural Inputs</Link>
          <small className="block mt-10 text-[10px] uppercase tracking-[0.18em] text-green font-bold">
            {isImported ? 'Imported Fertilizer' : 'Local Fertilizer'} - {fertilizer.displayCategory}
          </small>
          <h1 className="font-serif text-[clamp(42px,7vw,86px)] leading-none text-ink mt-3 mb-6">{fertilizer.displayName}</h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">{fertilizer.localizedDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <div className="border border-line bg-white p-4">
              <small className="text-[10px] text-muted uppercase">Manufacturer</small>
              <b className="block text-sm text-ink">{fertilizer.manufacturer}</b>
            </div>
            <div className="border border-line bg-white p-4">
              <small className="text-[10px] text-muted uppercase">Origin</small>
              <b className="block text-sm text-ink">{fertilizer.countryOfOrigin}</b>
            </div>
            <div className="border border-line bg-white p-4">
              <small className="text-[10px] text-muted uppercase">Season</small>
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
        <DetailBlock title="Product Overview" body={fertilizer.localizedDescription} />
        <DetailBlock title="Nutrient Content" body={fertilizer.localizedContent} />
        <DetailBlock title="Benefits" body={fertilizer.localizedBenefits} />
        <DetailBlock title="Suitable Crops" body={fertilizer.applyOnCrops} />
        <DetailBlock title="Unsuitable Crops" body={fertilizer.doNotApplyOn} />
        <DetailBlock title="Application Instructions" body={fertilizer.applicationMethod} />
        <DetailBlock title="Seasonal Recommendations" body={`${fertilizer.season}\nRecommended stage: ${fertilizer.recommendedStage}\nTemperature: ${fertilizer.temperatureRange}\nSoil: ${fertilizer.soilType}`} />
        <DetailBlock title="Safety Precautions" body={fertilizer.localizedPrecautions} />
        {!isImported && <DetailBlock title="Regional Recommendations" body={fertilizer.regionalRecommendations} />}
        {!isImported && <DetailBlock title="Government Approval" body={fertilizer.approvalBody} />}
        {isImported && <DetailBlock title="Brand Information" body={fertilizer.brand} />}
        {isImported && <DetailBlock title="Import Certifications" body={fertilizer.importCertifications} />}
        {isImported && <DetailBlock title="International Specifications" body={fertilizer.internationalSpecifications} />}
        <section className="border border-line bg-white p-6 lg:col-span-2">
          <h2 className="font-serif text-2xl text-ink mb-3">Downloadable Product Documents</h2>
          {fertilizer.documentUrl ? (
            <a href={fertilizer.documentUrl} className="inline-flex bg-green text-white px-5 py-3 text-sm font-bold no-underline">Download product document</a>
          ) : (
            <p className="text-sm text-muted">Product document will be available after admin upload.</p>
          )}
        </section>
      </section>
    </article>
  )
}
