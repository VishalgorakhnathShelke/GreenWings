import { useEffect, useMemo, useState } from 'react'
import { useLanguageStore } from '../stores/languageStore'
import { useLoginStore } from '../stores/loginStore'
import { Reveal } from '../components/shared/Reveal'
import { Ticker } from '../components/shared/Ticker'
import { CatalogueLaunch } from '../components/shared/CatalogueLaunch'
import { Link } from 'react-router-dom'
import { fetchCompanyContent, type CompanyContent } from '../services/api'

export function HomePage() {
  const t = useLanguageStore((s) => s.t)
  const lang = useLanguageStore((s) => s.lang)
  const openLogin = useLoginStore((s) => s.openLogin)
  const [content, setContent] = useState<CompanyContent | null>(null)

  useEffect(() => {
    let active = true
    fetchCompanyContent(lang)
      .then((payload) => {
        if (active) setContent(payload)
      })
      .catch(() => {
        if (active) setContent(null)
      })
    return () => {
      active = false
    }
  }, [lang])

  const farmerStat = content?.storiesBySlug['home-stat-farmers']
  const communityStories = useMemo(
    () => content?.stories.filter((story) => story.slug.startsWith('community-')) || [],
    [content],
  )
  const heroMetrics = [
    { value: '600+', label: t('farmersConnected') },
    { value: '₹2 Cr+', label: t('firstYearTurnover') },
    { value: '9,314+', label: t('quintalsProcured') },
  ]

  return (
    <>
      <section id="home" className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center text-white overflow-hidden py-12 sm:py-16">
        <img src="/assets/greenwings-community.png" alt="A diverse group of Indian farmers standing together in a field at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-deep/78 via-leaf/50 to-clay/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(239,184,74,0.38),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(139,201,214,0.34),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-harvest/30 via-soil/15 to-transparent" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="bg-deep/54 border border-harvest/25 px-5 py-6 sm:px-8 sm:py-8 shadow-[0_28px_70px_rgba(8,41,29,0.34)] backdrop-blur-sm max-w-2xl mx-auto">
              <div className="inline-flex text-[9px] uppercase tracking-[0.16em] font-bold text-harvest mb-4 border border-harvest/35 bg-paper/10 px-3 py-1.5">
                {t('heroEyebrow')}
              </div>
              <h1 className="font-serif text-[clamp(32px,5vw,54px)] leading-[0.98] tracking-[-0.045em] mb-5 text-white">
                {t('heroTitle')}<br />
                <em className="text-harvest not-italic font-inherit">{t('heroTitleEm')}</em>
              </h1>
              <p className="text-sm sm:text-base text-white/84 mb-6 max-w-xl mx-auto leading-relaxed">
                {t('heroText')}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/products" className="inline-flex items-center gap-2 bg-harvest text-deep px-6 py-3 text-sm font-bold rounded-sm no-underline hover:bg-gold transition-colors shadow-[0_14px_30px_rgba(8,41,29,0.28)]">
                  <span>{t('discover')}</span><b>↗</b>
                </Link>
                <button onClick={openLogin} className="flex items-center gap-2 bg-paper/10 border border-white/30 text-white px-6 py-3 text-sm cursor-pointer hover:bg-white/15 backdrop-blur-sm">
                  <span>{t('becomeMember')}</span>
                </button>
              </div>
              <div className="mx-auto mt-7 grid max-w-xl grid-cols-1 sm:grid-cols-3 overflow-hidden border border-white/15 bg-paper/10">
                {heroMetrics.map((stat) => (
                  <div key={stat.label} className="border-b border-white/10 px-4 py-3 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                    <strong className="block font-serif text-2xl text-white">{stat.value}</strong>
                    <span className="text-[10px] text-white/62 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Link to="/about" className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-white/50 no-underline z-10">
          <span className="w-5 h-8 border border-white/30 rounded-full relative">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
          </span>
          <small className="text-[9px] uppercase tracking-wider">{t('scrollExplore')}</small>
        </Link>
      </section>

      <Ticker />
      <CatalogueLaunch />

      <section className="py-24 px-[8vw] bg-paper">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-3xl mb-10">
              <small className="text-[10px] uppercase tracking-[0.15em] font-bold text-green">Community knowledge network</small>
              <h2 className="font-serif text-[clamp(30px,4vw,56px)] leading-tight tracking-[-0.045em] mt-3 mb-4 text-ink">
                Farmers learning, collaborating, and sharing better ways to grow.
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {farmerStat?.content || 'Community content is managed from the GreenWings database and shown in the visitor selected language.'}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {communityStories.map((story) => (
              <Reveal key={story.slug}>
                <article className="border border-line bg-white overflow-hidden h-full">
                  <div
                    className="h-44 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${story.featuredImage || '/assets/greenwings-community.png'})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-deep/65 to-transparent" />
                    <span className="absolute left-4 bottom-4 text-[10px] uppercase tracking-[0.13em] text-harvest font-bold">
                      Farmer community
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-2xl text-ink mb-3">{story.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{story.content}</p>
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
