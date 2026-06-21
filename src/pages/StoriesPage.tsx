import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguageStore } from '../stores/languageStore'
import { SectionHeading } from '../components/shared/SectionHeading'
import { Reveal } from '../components/shared/Reveal'
import {
  fetchSuccessStories,
  fetchSuccessStory,
  type SuccessStory,
} from '../services/api'

const storyCopy = {
  en: {
    loading: 'Loading farmer success stories...',
    empty: 'No published success stories are available yet.',
    keyResult: 'Key Result',
    readFull: 'Read Full Story',
    farmerProfile: 'Farmer Profile',
    crop: 'Crop',
    landArea: 'Land Area',
    location: 'Location',
    phone: 'Phone Number',
    available: 'Available from GreenWings office',
    fullStory: 'Full Farmer Story',
    challenge: 'Challenge',
    solution: 'GreenWings Support / Solution',
    result: 'Results Achieved',
    beforeAfter: 'Before vs After Metrics',
    relatedPhotos: 'Related Photos',
    farmerDetails: 'Farmer Details',
    back: 'Back to stories',
  },
  hi: {
    loading: 'किसान सफलता कहानियाँ लोड हो रही हैं...',
    empty: 'अभी कोई प्रकाशित सफलता कहानी उपलब्ध नहीं है.',
    keyResult: 'मुख्य परिणाम',
    readFull: 'पूरी कहानी पढ़ें',
    farmerProfile: 'किसान प्रोफाइल',
    crop: 'फसल',
    landArea: 'भूमि क्षेत्र',
    location: 'स्थान',
    phone: 'फोन नंबर',
    available: 'ग्रीनविंग्स कार्यालय से उपलब्ध',
    fullStory: 'पूरी किसान कहानी',
    challenge: 'चुनौती',
    solution: 'ग्रीनविंग्स सहयोग / समाधान',
    result: 'प्राप्त परिणाम',
    beforeAfter: 'पहले और बाद के परिणाम',
    relatedPhotos: 'संबंधित फोटो',
    farmerDetails: 'किसान विवरण',
    back: 'कहानियों पर वापस जाएँ',
  },
  mr: {
    loading: 'शेतकरी यशोगाथा लोड होत आहेत...',
    empty: 'अद्याप प्रकाशित यशोगाथा उपलब्ध नाहीत.',
    keyResult: 'मुख्य परिणाम',
    readFull: 'पूर्ण कथा वाचा',
    farmerProfile: 'शेतकरी प्रोफाइल',
    crop: 'पीक',
    landArea: 'जमिनीचे क्षेत्र',
    location: 'स्थान',
    phone: 'फोन नंबर',
    available: 'ग्रीनविंग्स कार्यालयातून उपलब्ध',
    fullStory: 'पूर्ण शेतकरी कथा',
    challenge: 'आव्हान',
    solution: 'ग्रीनविंग्स सहाय्य / उपाय',
    result: 'मिळालेले परिणाम',
    beforeAfter: 'पूर्वी आणि नंतरची तुलना',
    relatedPhotos: 'संबंधित फोटो',
    farmerDetails: 'शेतकरी तपशील',
    back: 'कथांकडे परत',
  },
}

function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function storyImage(story: SuccessStory) {
  return story.coverImage || story.profileImage || story.media[0]?.mediaUrl || '/assets/greenwings-community.png'
}

function keyResult(story: SuccessStory) {
  if (story.yieldBefore && story.yieldAfter) return `${story.yieldBefore} to ${story.yieldAfter}`
  return story.result || story.priceBenefit || story.additionalIncome || story.shortSummary
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line pb-3 last:border-b-0">
      <small className="block text-[9px] uppercase tracking-[0.13em] text-muted mb-1">{label}</small>
      <strong className="text-sm text-ink leading-relaxed">{value || '-'}</strong>
    </div>
  )
}

function StoryBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-line bg-white p-6">
      <h2 className="font-serif text-2xl text-ink mb-4">{title}</h2>
      {children}
    </section>
  )
}

export function StoriesPage() {
  const t = useLanguageStore((s) => s.t)
  const lang = useLanguageStore((s) => s.lang)
  const copy = storyCopy[lang]
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchSuccessStories(lang)
      .then((payload) => {
        if (active) setStories(payload.stories)
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load success stories')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [lang])

  return (
    <section className="py-24 px-[8vw] bg-gradient-to-b from-paper via-cream to-white">
      <SectionHeading
        eyebrow={t('farmerVoices')}
        title={t('storiesTitle')}
      />

      {loading && <p className="text-sm text-muted border border-line bg-white p-5">{copy.loading}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-4">{error}</p>}
      {!loading && !error && !stories.length && <p className="text-sm text-muted border border-line bg-white p-5">{copy.empty}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {stories.map((story) => (
          <Reveal key={`${story.slug}-${story.language}`}>
            <article className="bg-white border border-line overflow-hidden h-full flex flex-col shadow-[0_18px_40px_rgba(58,38,20,0.07)]">
              <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${storyImage(story)})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/15 to-transparent" />
                <span className="absolute left-4 bottom-4 bg-harvest text-deep text-[9px] uppercase tracking-wider font-bold px-3 py-1">
                  {story.storyCategory || 'Success Story'}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <small className="text-[10px] text-muted">{story.storyCategory || 'Farmer journey'} • {story.location || story.village}</small>
                <h3 className="font-serif text-2xl text-ink mt-3 mb-3 leading-tight">"{story.shortQuote || story.title}"</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{story.shortSummary}</p>
                <div className="mt-auto border-t border-line pt-4">
                  <strong className="block text-sm text-ink">{story.farmerName}</strong>
                  <span className="block text-[11px] text-muted mt-1">{story.cropType}</span>
                  <div className="bg-cream/70 border border-line p-3 mt-4">
                    <small className="block text-[9px] uppercase tracking-wider text-green font-bold mb-1">{copy.keyResult}</small>
                    <span className="text-xs text-ink font-bold">{keyResult(story)}</span>
                  </div>
                  <Link to={`/stories/${story.slug}`} className="inline-flex mt-5 bg-green text-white px-4 py-3 text-xs font-bold no-underline hover:bg-deep transition-colors">
                    {copy.readFull}
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function StoryDetailPage() {
  const { storySlug = '' } = useParams()
  const lang = useLanguageStore((s) => s.lang)
  const copy = storyCopy[lang]
  const [story, setStory] = useState<SuccessStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchSuccessStory(storySlug, lang)
      .then((payload) => {
        if (active) setStory(payload.story)
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load success story')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [storySlug, lang])

  if (loading) {
    return <section className="py-24 px-[8vw]"><p className="text-sm text-muted border border-line bg-white p-5">{copy.loading}</p></section>
  }

  if (error || !story) {
    return <section className="py-24 px-[8vw]"><p className="text-sm text-red-700 bg-red-50 border border-red-200 p-4">{error || 'Success story not found.'}</p></section>
  }

  const profileRows = [
    [copy.crop, story.cropType],
    [copy.landArea, story.landArea],
    [copy.location, story.location],
    [copy.phone, story.farmerPhone || copy.available],
    ['Fertilizer', story.fertilizerUsed],
    ['Seed', story.seedUsed],
    ['Market Support', story.marketSupport],
  ]
  const metrics = [
    ['Before', story.yieldBefore],
    ['After', story.yieldAfter],
    ['Price Benefit', story.priceBenefit],
    ['Additional Income', story.additionalIncome],
  ].filter(([, value]) => value)

  return (
    <article className="bg-paper">
      <section className="relative min-h-[55vh] flex items-end px-[8vw] py-16 text-white overflow-hidden">
        <img src={storyImage(story)} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/45 to-deep/10" />
        <Reveal>
          <div className="relative z-10 max-w-4xl">
            <Link to="/stories" className="inline-flex text-[10px] uppercase tracking-wider text-harvest no-underline mb-5">{copy.back}</Link>
            <small className="block text-[10px] uppercase tracking-[0.15em] text-harvest font-bold mb-4">{story.storyCategory} • {story.location}</small>
            <h1 className="font-serif text-[clamp(34px,5vw,66px)] leading-tight tracking-[-0.045em] mb-5">{story.title}</h1>
            <p className="text-lg text-white/84 max-w-2xl leading-relaxed">"{story.shortQuote}"</p>
          </div>
        </Reveal>
      </section>

      <section className="px-[8vw] py-16 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        <aside className="border border-line bg-white p-6 lg:sticky lg:top-24">
          <img src={story.profileImage || story.coverImage || '/assets/greenwings-community.png'} alt={story.farmerName} className="w-full h-56 object-cover mb-5" />
          <small className="block text-[10px] uppercase tracking-[0.15em] text-green font-bold mb-2">{copy.farmerProfile}</small>
          <h2 className="font-serif text-3xl text-ink mb-5">{story.farmerName}</h2>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </div>
        </aside>

        <div className="grid gap-5">
          <StoryBlock title={copy.fullStory}>
            <div className="grid gap-4">
              {paragraphs(story.fullStory).map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-muted">{paragraph}</p>
              ))}
            </div>
          </StoryBlock>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StoryBlock title={copy.challenge}>
              <p className="text-sm leading-relaxed text-muted">{story.challenge}</p>
            </StoryBlock>
            <StoryBlock title={copy.solution}>
              <p className="text-sm leading-relaxed text-muted">{story.solution}</p>
            </StoryBlock>
            <StoryBlock title={copy.result}>
              <p className="text-sm leading-relaxed text-muted">{story.result}</p>
            </StoryBlock>
          </div>

          <StoryBlock title={copy.beforeAfter}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {metrics.map(([label, value]) => (
                <div key={label} className="bg-cream border border-line p-4">
                  <small className="block text-[9px] uppercase tracking-wider text-green font-bold mb-2">{label}</small>
                  <strong className="font-serif text-2xl text-ink leading-tight">{value}</strong>
                </div>
              ))}
            </div>
          </StoryBlock>

          {!!story.media.length && (
            <StoryBlock title={copy.relatedPhotos}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {story.media.map((item) => (
                  <figure key={`${item.mediaUrl}-${item.displayOrder}`} className="border border-line bg-paper">
                    <img src={item.mediaUrl} alt={item.caption || story.title} className="w-full h-56 object-cover" />
                    {item.caption && <figcaption className="p-3 text-xs text-muted">{item.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </StoryBlock>
          )}

          <StoryBlock title={copy.farmerDetails}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Name" value={story.farmerName} />
              <InfoRow label={copy.phone} value={story.farmerPhone || copy.available} />
              <InfoRow label={copy.location} value={story.location} />
              <InfoRow label={copy.crop} value={story.cropType} />
            </div>
          </StoryBlock>
        </div>
      </section>
    </article>
  )
}
