import { useLanguageStore } from '../stores/languageStore'
import { Reveal } from '../components/shared/Reveal'
import { SectionHeading } from '../components/shared/SectionHeading'
import { projects } from '../data/content'

export function ImpactPage() {
  const t = useLanguageStore((s) => s.t)

  return (
    <>
      <section className="py-24 px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative min-h-[400px] bg-gradient-to-br from-green to-deep rounded-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-deep/50 to-transparent" />
        </div>

        <Reveal>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/80 mb-4">{t('growingImpact')}</div>
          <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.045em] text-ink mb-4">
            {t('impactTitle')}<br /><em className="text-lime not-italic font-inherit">{t('impactTitleEm1')} {t('impactTitleEm2')}</em>
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-8">{t('impactText')}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '₹4.8Cr', label: t('farmerTrade') },
              { value: '1,100+', label: t('trained') },
              { value: '620 acres', label: t('sustainable') },
              { value: '14', label: t('buyerLinks') },
            ].map((stat) => (
              <div key={stat.label}>
                <strong className="block font-serif text-2xl text-green">{stat.value}</strong>
                <span className="text-[10px] text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-24 px-[8vw]">
        <SectionHeading eyebrow="Projects & activities" title="Ideas taking root." description="Programs that connect sustainable practice, stronger infrastructure, and direct opportunity for farmers." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Reveal key={project.title}>
              <article className="bg-white border border-line p-8 relative">
                <span className={`absolute top-5 right-5 text-[9px] font-bold uppercase px-2 py-1 ${
                  project.status === 'Active' ? 'bg-[#dcebdc] text-green' : 'bg-[#fff0cb] text-[#8b6208]'
                }`}>
                  {project.status}
                </span>
                <small className="text-[9px] text-muted uppercase tracking-wider">{project.location}</small>
                <h3 className="font-serif text-[22px] mt-8 mb-3">{project.title}</h3>
                <p className="text-[12px] text-muted leading-relaxed min-h-[80px]">{project.description}</p>
                <div className="border-t border-line pt-4 mt-4">
                  <b className="block font-serif text-xl text-green">{project.metric}</b>
                  <span className="text-[9px] text-muted uppercase">{project.metricLabel}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
