import { useLanguageStore } from '../../stores/languageStore'
import { Link } from 'react-router-dom'

export function CatalogueLaunch() {
  const t = useLanguageStore((s) => s.t)
  return (
    <Link to="/products" className="grid grid-cols-[auto_1fr_auto] items-center gap-6 bg-gradient-to-r from-harvest via-gold to-sky/80 text-deep px-[8vw] py-5 no-underline hover:brightness-105 transition-all">
      <span className="text-[9px] uppercase tracking-[0.12em] font-bold bg-deep text-harvest px-3 py-1.5">
        {t('catalogueLaunchTag')}
      </span>
      <strong className="font-serif text-xl text-deep">{t('catalogueLaunchTitle')}</strong>
      <span className="text-[10px] uppercase font-bold text-deep">{t('catalogueLaunchCta')}</span>
    </Link>
  )
}
