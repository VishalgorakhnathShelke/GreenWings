import { Link } from 'react-router-dom'
import { useLanguageStore } from '../stores/languageStore'
import { categories } from '../data/categories'
import { Reveal } from '../components/shared/Reveal'
import { DatabaseCatalogue } from '../components/products/DatabaseCatalogue'
import { catalogueCopy, localizeCategory } from '../services/catalogLocalization'

export function ProductsPage() {
  const t = useLanguageStore((state) => state.t)
  const lang = useLanguageStore((state) => state.lang)
  const copy = catalogueCopy[lang]
  const localizedCategories = categories.map((category) => localizeCategory(category, lang))

  return (
    <section className="bg-[#eef2e9]">
      <div className="text-[9px] uppercase tracking-[0.12em] font-bold bg-deep text-lime inline-block px-3 py-2">
        Catalogue update · 13 June 2026 · Interactive edition
      </div>

      <div className="py-24 px-[8vw]">
        <div className="mb-12 lg:mb-16">
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-4">{t('produceEyebrow')}</div>
          <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.045em] mb-4">
            {t('produceTitle')}<br /><em className="text-lime not-italic font-inherit">{t('produceTitleEm')}</em>
          </h2>
          <p className="text-sm text-muted leading-relaxed max-w-xl">{t('produceText')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {localizedCategories.map((cat, index) => (
            <Reveal key={cat.id}>
              <Link
                to={`/products/${categories[index].slug}`}
                className="group block bg-white border border-line overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,38,28,0.09)] transition-all no-underline text-ink"
              >
                <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${cat.heroImage})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-gold/90 text-deep text-[9px] uppercase tracking-wider font-bold px-3 py-1">
                    {copy.explore}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl mb-2 text-ink">{cat.name}</h3>
                  <p className="text-[11px] text-muted leading-relaxed line-clamp-3">{cat.tagline}</p>
                  <p className="text-[10px] text-green font-bold mt-3 uppercase tracking-wider">
                    {copy.viewAllProducts}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="text-[10px] text-muted leading-relaxed mt-8">{t('catalogueNote')}</p>
        <DatabaseCatalogue />
      </div>
    </section>
  )
}
