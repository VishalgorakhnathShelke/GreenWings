import { Link, useParams } from 'react-router-dom'
import { getCategoryProducts } from '../data/catalog'
import { categories } from '../data/categories'
import { Reveal } from '../components/shared/Reveal'
import { useLanguageStore } from '../stores/languageStore'
import { catalogueCopy, localizeCategory, localizeProduct } from '../services/catalogLocalization'

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const lang = useLanguageStore((s) => s.lang)
  const copy = catalogueCopy[lang]
  const rawCategory = categories.find((category) => category.slug === categorySlug)
  const category = rawCategory ? localizeCategory(rawCategory, lang) : undefined
  const products = rawCategory ? getCategoryProducts(rawCategory.slug).map((product) => localizeProduct(product, lang)) : []

  if (!rawCategory || !category) {
    return (
      <div className="py-24 px-[8vw] text-center">
        <h2 className="font-serif text-3xl text-ink mb-4">{copy.categoryNotFound}</h2>
        <Link to="/products" className="text-green font-bold no-underline">{copy.backToCategories}</Link>
      </div>
    )
  }

  return (
    <section className="py-24 px-[8vw] bg-[#eef2e9]">
      <nav className="flex items-center gap-2 text-[11px] text-muted mb-8">
        <Link to="/products" className="text-green no-underline hover:underline">{copy.products}</Link>
        <span>/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 mb-12">
        <div>
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="font-serif text-[clamp(28px,5vw,52px)] leading-tight tracking-[-0.045em] mb-4">{category.name}</h1>
          <p className="text-sm text-muted leading-relaxed">{category.description}</p>
        </div>
        <div className="h-64 lg:h-auto bg-cover bg-center rounded-sm relative" style={{ backgroundImage: `url(${category.heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent rounded-sm" />
          <div className="absolute bottom-4 left-4 bg-deep/80 text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold">
            {copy.productCount(products.length, products.reduce((total, product) => total + product.varieties.length, 0))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <Reveal key={product.id}>
            <Link
              to={`/products/${rawCategory.slug}/${product.slug}`}
              className="group block bg-white border border-line overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,38,28,0.09)] transition-all no-underline text-ink"
            >
              <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url(${product.heroImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              </div>
              <div className="p-5">
                <span className="text-[8px] uppercase tracking-[0.12em] text-green font-bold">{category.name}</span>
                <h3 className="font-serif text-xl mt-1.5 mb-2 text-ink">{product.name}</h3>
                <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{product.overview.slice(0, 140)}...</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
                  <span className="text-[9px] text-muted">{copy.productCount(1, product.varieties.length).split(' · ')[1]}</span>
                  <span className="text-green text-[9px] uppercase tracking-wider font-bold">{copy.viewProfile}</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
