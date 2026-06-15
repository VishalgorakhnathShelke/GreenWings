import { useLanguageStore } from '../stores/languageStore'
import { useLoginStore } from '../stores/loginStore'
import { Reveal } from '../components/shared/Reveal'

export function ContactPage() {
  const t = useLanguageStore((s) => s.t)
  const openLogin = useLoginStore((s) => s.openLogin)

  return (
    <section className="py-24 px-[8vw] bg-deep text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <div className="absolute top-10 right-10 w-40 h-40 border-2 border-lime rounded-[100%_0_100%_0] rotate-12" />
        <div className="absolute top-32 right-32 w-60 h-60 border border-lime rounded-full" />
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-lime/20 rounded-full" />
      </div>

      <Reveal>
        <div className="relative z-10 max-w-2xl">
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/80 mb-6">{t('growTogether')}</div>
          <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.045em] mb-4">
            {t('ctaTitle')}<br /><em className="text-lime not-italic font-inherit">{t('ctaTitleEm')}</em>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mb-8">{t('ctaText')}</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openLogin}
              className="bg-gold text-deep px-6 py-3 text-sm font-bold cursor-pointer border-0 hover:bg-gold/90 transition-colors"
            >
              {t('becomeMember')}
            </button>
            <a
              href="tel:+919921155128"
              className="inline-flex items-center border border-white/40 text-white px-6 py-3 text-sm font-bold no-underline hover:bg-white/10 transition-colors"
            >
              {t('talkTeam')}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
