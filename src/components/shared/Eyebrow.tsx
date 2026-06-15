export function Eyebrow({ light = false, children }: { light?: boolean; children: React.ReactNode }) {
  return (
    <div className={`text-[9px] uppercase tracking-[0.15em] font-bold ${light ? 'text-white/80' : 'text-green'}`}>
      {children}
    </div>
  )
}
