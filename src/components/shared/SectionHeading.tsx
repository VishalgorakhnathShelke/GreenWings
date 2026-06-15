export function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow?: string; title: React.ReactNode; description?: string; light?: boolean }) {
  return (
    <div className="mb-12 lg:mb-16">
      <div>
        {eyebrow && (
          <div className={`text-[9px] uppercase tracking-[0.15em] font-bold mb-4 ${light ? 'text-white/80' : 'text-green'}`}>
            {eyebrow}
          </div>
        )}
        <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.045em] text-inherit">
          {title}
        </h2>
      </div>
      {description && <p className={`text-sm leading-relaxed mt-4 max-w-xl ${light ? 'text-white/70' : 'text-muted'}`}>{description}</p>}
    </div>
  )
}
