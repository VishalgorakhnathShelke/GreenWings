import { useLanguageStore } from '../stores/languageStore'
import { SectionHeading } from '../components/shared/SectionHeading'
import { Reveal } from '../components/shared/Reveal'

export function StoriesPage() {
  const t = useLanguageStore((s) => s.t)

  return (
    <section className="py-24 px-[8vw]">
      <SectionHeading
        eyebrow={t('farmerVoices')}
        title={t('storiesTitle')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Reveal>
          <article className="bg-white border border-line overflow-hidden row-span-1 md:row-span-2">
            <img src="/assets/greenwings-hero.png" alt="Farmers sharing knowledge" className="w-full h-60 object-cover" />
            <div className="p-6">
              <span className="text-[10px] text-muted">{t('story1Tag')}</span>
              <h3 className="font-serif text-xl mt-3 mb-3 leading-snug">{t('story1')}</h3>
              <p className="text-[12px] text-muted">{t('story1Author')}</p>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="bg-white border border-line overflow-hidden">
            <div className="bg-gold/15 h-32 flex flex-col items-center justify-center p-6">
              <b className="font-serif text-4xl text-deep">{t('story2') ? '42%' : '42%'}</b>
              <span className="text-[10px] text-deep uppercase tracking-wider mt-1">{t('waterSaved')}</span>
            </div>
            <div className="p-6">
              <span className="text-[10px] text-muted">{t('story2Tag')}</span>
              <h3 className="font-serif text-xl mt-3 mb-2 leading-snug">{t('story2')}</h3>
              <p className="text-[12px] text-green font-bold">{t('story2Author')}</p>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="bg-white border border-line overflow-hidden">
            <div className="bg-green/15 h-32 flex flex-col items-center justify-center p-6">
              <b className="font-serif text-4xl text-deep">3×</b>
              <span className="text-[10px] text-deep uppercase tracking-wider mt-1">{t('womenMembers')}</span>
            </div>
            <div className="p-6">
              <span className="text-[10px] text-muted">{t('story3Tag')}</span>
              <h3 className="font-serif text-xl mt-3 mb-2 leading-snug">{t('story3')}</h3>
              <p className="text-[12px] text-green font-bold">{t('story3Author')}</p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
