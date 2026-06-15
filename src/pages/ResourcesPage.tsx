import { SectionHeading } from '../components/shared/SectionHeading'
import { Reveal } from '../components/shared/Reveal'
import { resources } from '../data/content'

export function ResourcesPage() {
  return (
    <section className="py-24 px-[8vw] bg-cream">
      <SectionHeading
        eyebrow="Knowledge centre"
        title={<>Useful information.<br /><em className="text-lime not-italic font-inherit">Ready when farmers need it.</em></>}
        description="Updates, practical guides, reports, forms, and government scheme information in one trusted place."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Reveal>
          <article className="bg-green text-white p-10 min-h-[390px] flex flex-col justify-end relative overflow-hidden">
            <div className="absolute w-[280px] h-[500px] border-2 border-lime rounded-[100%_0_100%_0] -right-20 -top-40 opacity-15 rotate-[-25deg]" />
            <span className="text-[9px] text-gold uppercase tracking-[0.12em]">GreenWings News · 08 Jun 2026</span>
            <h3 className="font-serif text-[28px] leading-tight mt-4 mb-3 text-white">Farmer training series focuses on market readiness and sustainable crop planning</h3>
            <p className="text-[12px] text-white/60 leading-relaxed mb-4">GreenWings brings members and agricultural specialists together for practical, field-led learning.</p>
            <a href="#" className="text-lime text-[10px] uppercase tracking-wider font-bold no-underline hover:text-gold">Read update →</a>
          </article>
        </Reveal>
        <Reveal>
          <div className="bg-white border border-line">
            {resources.map((resource) => (
              <a key={resource.label} href="#" className="block px-6 py-5 border-b border-line no-underline text-ink last:border-b-0 hover:bg-cream/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.1em] text-green font-bold shrink-0">{resource.label}</span>
                  <b className="text-[12px] flex-1 text-left">{resource.description}</b>
                  <i className="text-gold text-[10px] font-bold not-italic shrink-0">{resource.action}</i>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
