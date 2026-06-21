import { useEffect, useMemo, useState } from 'react'
import { Reveal } from '../components/shared/Reveal'
import { fetchCompanyContent, type CompanyContent, type CompanyContentSection } from '../services/api'
import { useLanguageStore } from '../stores/languageStore'

const registrationDetails = [
  { label: 'Established', value: '2023' },
  { label: 'CIN / FPO Registration', value: 'U01133MH2023PTC398524' },
  { label: 'PAN', value: 'AAKCG3098B' },
  { label: 'GSTIN', value: '27AAKCG3098B1ZK' },
]

function ContentCard({ item }: { item: CompanyContentSection }) {
  return (
    <article className="border border-line bg-white p-6 h-full">
      <small className="block text-[10px] text-green uppercase tracking-[0.13em] font-bold mb-3">{item.sectionKey.replaceAll('_', ' ')}</small>
      <h3 className="font-serif text-2xl text-ink mb-3">{item.title}</h3>
      {item.subtitle && <strong className="block text-xs text-soil mb-3">{item.subtitle}</strong>}
      <p className="text-sm leading-relaxed text-muted whitespace-pre-line">{item.content}</p>
    </article>
  )
}

export function AboutPage() {
  const lang = useLanguageStore((s) => s.lang)
  const [content, setContent] = useState<CompanyContent | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setError('')
    fetchCompanyContent(lang)
      .then((payload) => {
        if (active) setContent(payload)
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load company content')
      })
    return () => {
      active = false
    }
  }, [lang])

  const sections = content?.contentByKey || {}
  const introduction = sections.company_introduction
  const visionMission = useMemo(
    () => [sections.vision, sections.mission].filter((item): item is CompanyContentSection => Boolean(item)),
    [sections],
  )

  return (
    <>
      <section className="py-24 px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-6">Who we are</div>
          <h1 className="font-serif text-[clamp(30px,4vw,58px)] leading-tight tracking-[-0.045em] mb-6">
            {introduction?.title || 'GreenWings'}<br />
            <em className="text-lime not-italic font-inherit">{introduction?.subtitle || 'Loading company content'}</em>
          </h1>
          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 mb-4">{error}</p>}
          <div className="text-sm leading-relaxed text-muted mb-6 whitespace-pre-line">
            {introduction?.content || 'Company introduction is loading from the GreenWings database.'}
          </div>
        </Reveal>

        <Reveal>
          <div className="relative">
            <img
              src="/assets/greenwings-hero.png"
              alt={introduction?.title || 'GreenWings farming community'}
              className="w-full rounded-sm"
            />
            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-paper border border-line p-6 max-w-xs shadow-lg">
              <span className="font-serif text-4xl text-green leading-none">"</span>
              <p className="text-sm text-muted leading-relaxed mt-2 mb-3 italic">
                {sections.vision?.content || 'Vision content is managed from the database.'}
              </p>
              <small className="text-[10px] text-muted">GreenWings leadership</small>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="py-20 px-[8vw] bg-cream">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {visionMission.map((item) => (
            <Reveal key={item.sectionKey}>
              <ContentCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-deep via-green to-soil text-white py-20 px-[8vw] grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-[7vw] items-center">
        <Reveal>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/80 mb-4">Registered farmer producer company</div>
          <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.045em]">
            Built on trust.<br /><em className="text-lime not-italic font-inherit">Registered for growth.</em>
          </h2>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
            {registrationDetails.map((item) => (
              <div key={item.label} className="bg-deep/70 p-5">
                <small className="block text-white/40 text-[9px] uppercase tracking-[0.13em] mb-2">{item.label}</small>
                <strong className="text-gold text-sm break-all">{item.value}</strong>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-20 px-[8vw] bg-paper">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-3xl mb-10">
              <small className="text-[10px] uppercase tracking-[0.15em] font-bold text-green">Impact statistics</small>
              <h2 className="font-serif text-[clamp(30px,4vw,56px)] text-ink tracking-[-0.045em] mt-3">Progress recorded through GreenWings activities.</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {content?.statistics.map((stat) => (
              <Reveal key={stat.id}>
                <article className="border border-line bg-white p-5 h-full">
                  <strong className="block font-serif text-3xl text-green mb-2">{stat.value}</strong>
                  <span className="block text-xs font-bold text-ink">{stat.label}</span>
                  {stat.description && <p className="text-[11px] text-muted mt-2">{stat.description}</p>}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-[8vw] bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-3xl mb-10">
              <small className="text-[10px] uppercase tracking-[0.15em] font-bold text-green">Company timeline</small>
              <h2 className="font-serif text-[clamp(30px,4vw,56px)] text-ink tracking-[-0.045em] mt-3">Milestones managed from admin.</h2>
            </div>
          </Reveal>
          <div className="grid gap-4">
            {content?.timelines.map((timeline) => (
              <Reveal key={timeline.id}>
                <article className="grid grid-cols-1 md:grid-cols-[120px_1fr_220px] gap-4 border border-line bg-paper p-4 items-center">
                  <strong className="font-serif text-4xl text-green">{timeline.year}</strong>
                  <div>
                    <h3 className="font-serif text-2xl text-ink mb-2">{timeline.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{timeline.description}</p>
                    {timeline.impactMetric && <strong className="block text-xs text-green mt-3">{timeline.impactMetric}</strong>}
                  </div>
                  <div className="h-32 w-full bg-gradient-to-br from-green/20 via-harvest/20 to-sky/20 border border-line grid place-items-center text-center px-4">
                    <span className="text-[10px] uppercase tracking-[0.13em] text-muted">{timeline.impactMetric || 'GreenWings journey'}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-[8vw] bg-cream">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-3xl mb-10">
              <small className="text-[10px] uppercase tracking-[0.15em] font-bold text-green">Leadership module</small>
              <h2 className="font-serif text-[clamp(30px,4vw,56px)] text-ink tracking-[-0.045em] mt-3">The GreenWings leadership team.</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {content?.leadership.map((member) => (
              <Reveal key={member.id}>
                <article className="border border-line bg-white overflow-hidden h-full">
                  <img src={member.imageUrl || member.image || '/assets/greenwings-community.png'} alt={member.fullName} className="h-52 w-full object-cover" />
                  <div className="p-5">
                    <h3 className="font-serif text-2xl text-ink">{member.fullName}</h3>
                    <strong className="block text-xs text-green uppercase tracking-[0.12em] mt-1 mb-3">{member.designation}</strong>
                    <p className="text-sm leading-relaxed text-muted">{member.roleDescription || member.biography || 'Leadership profile can be updated from the admin panel.'}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
