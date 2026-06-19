import { useLanguageStore } from '../stores/languageStore'
import { useLoginStore } from '../stores/loginStore'
import { Reveal } from '../components/shared/Reveal'
import { Ticker } from '../components/shared/Ticker'
import { CatalogueLaunch } from '../components/shared/CatalogueLaunch'
import { Link } from 'react-router-dom'

export function HomePage() {
  const t = useLanguageStore((s) => s.t)
  const openLogin = useLoginStore((s) => s.openLogin)

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        <img src="/assets/greenwings-community.png" alt="A diverse group of Indian farmers standing together in a field at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-deep/78 via-leaf/50 to-clay/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(239,184,74,0.38),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(139,201,214,0.34),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-harvest/30 via-soil/15 to-transparent" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="bg-deep/52 border border-harvest/25 px-6 py-8 shadow-[0_28px_70px_rgba(8,41,29,0.34)] backdrop-blur-sm">
              <div className="inline-flex text-[9px] uppercase tracking-[0.15em] font-bold text-white/90 mb-6 border border-harvest/40 bg-soil/45 px-4 py-2">
                {t('heroEyebrow')}
              </div>
              <h1 className="font-serif text-[clamp(32px,6vw,72px)] leading-tight tracking-[-0.045em] mb-6 text-white">
                {t('heroTitle')}<br /><em className="text-harvest not-italic font-inherit">{t('heroTitleEm')}</em>
              </h1>
              <p className="text-base text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
                {t('heroText')}
              </p>
              <div className="mx-auto mb-8 grid max-w-xl grid-cols-3 overflow-hidden border border-white/15 bg-paper/10 text-left">
                {[
                  [t('themeRootsLabel'), t('themeRootsText')],
                  [t('themeGrowthLabel'), t('themeGrowthText')],
                  [t('themeNatureLabel'), t('themeNatureText')],
                ].map(([label, text]) => (
                  <div key={label} className="border-r border-white/10 px-4 py-3 last:border-r-0">
                    <strong className="block text-[10px] uppercase tracking-[0.13em] text-harvest">{label}</strong>
                    <span className="text-[11px] leading-snug text-white/80">{text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/about" className="inline-flex items-center gap-2 bg-harvest text-deep px-6 py-3 text-sm font-bold rounded-sm no-underline hover:bg-gold transition-colors shadow-[0_14px_30px_rgba(8,41,29,0.28)]">
                  <span>{t('discover')}</span><b>↗</b>
                </Link>
                <button onClick={openLogin} className="flex items-center gap-2 bg-paper/10 border border-white/30 text-white px-6 py-3 text-sm cursor-pointer hover:bg-white/15 backdrop-blur-sm">
                  <span>▶</span><span>{t('watchStory')}</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-12 lg:gap-20 z-10">
          {[
            { value: '2,400+', label: t('farmersConnected') },
            { value: '18', label: t('villagesReached') },
            { value: '32%', label: t('betterReturns') },
          ].map((stat) => (
            <div key={stat.label} className="text-center border border-white/12 bg-deep/28 px-5 py-3 backdrop-blur-sm">
              <strong className="block font-serif text-2xl lg:text-3xl text-white">{stat.value}</strong>
              <span className="text-[10px] text-white/60 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        <Link to="/about" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 no-underline z-10">
          <span className="w-5 h-8 border border-white/30 rounded-full relative">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
          </span>
          <small className="text-[9px] uppercase tracking-wider">{t('scrollExplore')}</small>
        </Link>
      </section>

      <Ticker />
      <CatalogueLaunch />
    </>
  )
}
