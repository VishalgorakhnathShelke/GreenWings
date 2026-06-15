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
        <div className="absolute inset-0 bg-gradient-to-b from-deep/60 to-deep/80" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/80 mb-6">
              {t('heroEyebrow')}
            </div>
            <h1 className="font-serif text-[clamp(32px,6vw,72px)] leading-tight tracking-[-0.045em] mb-6">
              {t('heroTitle')}<br /><em className="text-lime not-italic font-inherit">{t('heroTitleEm')}</em>
            </h1>
            <p className="text-base text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
              {t('heroText')}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/about" className="inline-flex items-center gap-2 bg-green text-white px-6 py-3 text-sm font-bold rounded-sm no-underline hover:bg-green/90 transition-colors">
                <span>{t('discover')}</span><b>↗</b>
              </Link>
              <button onClick={openLogin} className="flex items-center gap-2 bg-transparent border border-white/30 text-white px-6 py-3 text-sm cursor-pointer hover:bg-white/10">
                <span>▶</span><span>{t('watchStory')}</span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-12 lg:gap-20 z-10">
          {[
            { value: '2,400+', label: t('farmersConnected') },
            { value: '18', label: t('villagesReached') },
            { value: '32%', label: t('betterReturns') },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
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
