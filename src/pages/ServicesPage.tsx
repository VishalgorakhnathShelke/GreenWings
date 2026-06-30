import { useLanguageStore } from '../stores/languageStore'
import { SectionHeading } from '../components/shared/SectionHeading'
import { Reveal } from '../components/shared/Reveal'

export function ServicesPage() {
  const t = useLanguageStore((s) => s.t)

  const services = [
    { number: '01', icon: '⌁', title: t('service1'), text: t('service1Text'), link: t('service1Link'), featured: true },
    { number: '02', icon: '◫', title: t('service2'), text: t('service2Text'), link: t('service2Link') },
    { number: '03', icon: '◎', title: t('service3'), text: t('service3Text'), link: t('service3Link') },
    { number: '04', icon: '◇', title: t('service4'), text: t('service4Text'), link: t('service4Link') },
    { number: '05', icon: '₹', title: t('service5'), text: t('service5Text'), link: t('service5Link') },
    { number: '06', icon: '⌘', title: t('service6'), text: t('service6Text'), link: t('service6Link') },
  ]

  return (
    <section className="py-24 px-[8vw] bg-gradient-to-b from-paper via-cream to-[#edf4df]">
      <SectionHeading
        eyebrow={t('ourPurpose')}
        title={t('servicesTitle')}
        description={t('servicesText')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {services.map((service, i) => (
          <Reveal key={i}>
            <article className={`border border-line p-8 lg:p-10 relative group hover:shadow-lg transition-shadow ${
              service.featured ? 'bg-gradient-to-br from-leaf via-green to-soil text-white lg:row-span-2 flex flex-col justify-end' : 'bg-white/90'
            } ${i % 3 !== 2 ? 'lg:border-r-0' : ''} ${i < 3 ? 'lg:border-b' : ''}`}>
              <span className="text-[10px] font-bold opacity-40">{service.number}</span>
              <div className="text-2xl my-4">{service.icon}</div>
              <h3 className={`font-serif text-xl mb-3 ${service.featured ? 'text-white' : ''}`}>{service.title}</h3>
              <p className={`text-sm leading-relaxed mb-6 ${service.featured ? 'text-white/70' : 'text-muted'}`}>{service.text}</p>
              <a href="#" className={`text-[10px] uppercase tracking-wider font-bold no-underline ${
                service.featured ? 'text-harvest hover:text-sky' : 'text-green hover:text-harvest'
              }`}>
                {service.link}
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
