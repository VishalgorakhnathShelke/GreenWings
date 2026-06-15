export function Ticker() {
  const items = ['Collective strength', 'Sustainable agriculture', 'Market access', 'Farmer-first innovation']
  return (
    <section className="py-3 overflow-hidden bg-deep text-white" aria-label="GreenWings focus areas">
      <div className="flex whitespace-nowrap" style={{ animation: 'ticker-scroll 20s linear infinite' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-sm text-white/90 mx-4">
            {item} <span className="text-gold mx-4">✦</span>
          </span>
        ))}
      </div>
    </section>
  )
}
