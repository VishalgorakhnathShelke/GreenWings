import { useReveal } from '../../hooks/useReveal'

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()

  return (
    <div ref={ref} className={`opacity-0 translate-y-[30px] transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0 ${className}`}>
      {children}
    </div>
  )
}
