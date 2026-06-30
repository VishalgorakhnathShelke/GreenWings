import { useLanguageStore } from '../stores/languageStore'
import { Reveal } from '../components/shared/Reveal'

export function AboutPage() {
  const t = useLanguageStore((s) => s.t)

  return (
    <>
      <section className="py-24 px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-6">{t('whoWeAre')}</div>
          <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.045em] mb-6">
            {t('introTitle')}<br /><em className="text-lime not-italic font-inherit">{t('introTitleEm')}</em>
          </h2>
          <p className="text-sm leading-relaxed text-muted mb-4 font-medium">{t('introText')}</p>
          <p className="text-sm leading-relaxed text-muted mb-6">{t('introBody')}</p>
          <a href="/services" className="text-green text-sm font-bold no-underline hover:text-lime">
            {t('ourApproach')} →
          </a>
        </Reveal>

        <Reveal>
          <div className="relative">
            <img src="https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/ui-assets/farmers/4_farmers_discussing.png" alt="Indian farming community learning together" className="w-full rounded-sm" />
            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-paper border border-line p-6 max-w-xs shadow-lg">
              <span className="font-serif text-4xl text-green leading-none">"</span>
              <p className="text-sm text-muted leading-relaxed mt-2 mb-3 italic">{t('quote')}</p>
              <small className="text-[10px] text-muted">{t('ceoName')}</small>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-deep text-white py-20 px-[8vw] grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-[7vw] items-center">
        <Reveal>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/80 mb-4">Registered farmer producer company</div>
          <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.045em]">
            Built on trust.<br /><em className="text-lime not-italic font-inherit">Registered for growth.</em>
          </h2>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
            {[
              { label: 'Established', value: '2023' },
              { label: 'CIN / FPO Registration', value: 'U01133MH2023PTC398524' },
              { label: 'PAN', value: 'AAKCG3098B' },
              { label: 'GSTIN', value: '27AAKCG3098B1ZK' },
            ].map((item) => (
              <div key={item.label} className="bg-deep p-5">
                <small className="block text-white/40 text-[9px] uppercase tracking-[0.13em] mb-2">{item.label}</small>
                <strong className="text-gold text-sm break-all">{item.value}</strong>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  )
}
