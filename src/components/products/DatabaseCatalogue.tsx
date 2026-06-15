import { useEffect, useState } from 'react'
import { fetchDatabaseProducts, type DatabaseProduct } from '../../services/api'

export function DatabaseCatalogue() {
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [selectedType, setSelectedType] = useState('all')
  const [openProduct, setOpenProduct] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDatabaseProducts()
      .then(setProducts)
      .catch(() => setError('Database API is unavailable. Start the backend server to view live produce data.'))
  }, [])

  const types = [...new Set(products.map((product) => product.type))]
  const visibleProducts = products.filter((product) => selectedType === 'all' || product.type === selectedType)

  return (
    <section className="mt-16 border-t border-line pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-green mb-3">Live database catalogue</div>
          <h2 className="font-serif text-[clamp(26px,4vw,44px)] leading-tight text-ink">Maharashtra species & subtypes</h2>
          <p className="text-sm text-muted mt-3">Information is loaded from the backend database and its new <code>info</code> field.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', ...types].map((type) => (
            <button key={type} onClick={() => setSelectedType(type)} className={`px-3 py-2 border text-[10px] uppercase font-bold cursor-pointer ${selectedType === type ? 'bg-green text-white border-green' : 'bg-white text-ink border-line'}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-gold/20 border border-gold p-4 text-sm text-ink">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleProducts.map((product) => (
          <article key={product.produce_id} className="bg-white border border-line p-5">
            <button onClick={() => setOpenProduct(openProduct === product.produce_id ? null : product.produce_id)} className="w-full text-left bg-transparent border-0 cursor-pointer p-0">
              <span className="text-[9px] uppercase tracking-wider font-bold text-green">{product.type} · {product.subtypes.length} subtypes</span>
              <h3 className="font-serif text-2xl text-ink mt-2">{product.name}</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">{product.info}</p>
              <span className="block text-[10px] uppercase font-bold text-green mt-4">{openProduct === product.produce_id ? 'Hide details' : 'View database information →'}</span>
            </button>
            {openProduct === product.produce_id && (
              <div className="border-t border-line mt-5 pt-5">
                <p className="whitespace-pre-line text-sm text-muted leading-relaxed">{product.info}</p>
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-green mt-6 mb-3">Species / subtype information</h4>
                <div className="grid gap-3">
                  {product.subtypes.map((subtype) => (
                    <details key={subtype.subtype_id} className="border border-line p-4">
                      <summary className="cursor-pointer font-bold text-sm text-ink">{subtype.subtype_name}</summary>
                      <p className="whitespace-pre-line text-xs text-muted leading-relaxed mt-3">{subtype.info}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
