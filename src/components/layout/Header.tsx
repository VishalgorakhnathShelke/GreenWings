import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguageStore } from '../../stores/languageStore'
import { BrandMark } from './BrandMark'
import { useLoginStore } from '../../stores/loginStore'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLanguage } = useLanguageStore()
  const openLogin = useLoginStore((s) => s.openLogin)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: 'navAbout', href: '/about' },
    { label: 'navServices', href: '/services' },
    { label: 'navProducts', href: '/products' },
    { label: 'navImpact', href: '/impact' },
    { label: 'navStories', href: '/stories' },
    { label: 'navResources', href: '/resources' },
    { label: 'navContact', href: '/contact' },
  ]

  const t = useLanguageStore((s) => s.t)

  return (
    <header className={`fixed top-0 left-0 right-0 h-[78px] flex items-center justify-between px-[4vw] z-20 transition-all duration-300 border-b ${
      scrolled || !isHome ? 'h-[68px] bg-paper/96 text-ink shadow-[0_8px_30px_rgba(10,39,27,0.08)] backdrop-blur-16 border-line' : 'text-white border-white/16'
    }`}>
      <Link to="/" className="flex items-center gap-2.5 no-underline text-inherit">
        <BrandMark />
        <span>
          <strong className="font-serif block text-xl leading-none">GreenWings</strong>
          <small className="text-[8px] tracking-[0.13em] uppercase opacity-68">Farmers Producer Company Limited</small>
        </span>
      </Link>

      <nav className="hidden lg:flex gap-[30px]">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-[13px] no-underline opacity-85 hover:opacity-100 text-inherit"
          >
            {t(link.label)}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="text-inherit bg-transparent border-0 cursor-pointer text-sm"
          >
            {lang.toUpperCase()}↓
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-line shadow-lg py-1 min-w-[140px] z-30">
              {(['en', 'hi', 'mr'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLanguage(l); setLangOpen(false) }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-cream text-ink bg-transparent border-0 cursor-pointer"
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={openLogin}
          className="hidden sm:inline-flex text-sm border border-current rounded-sm px-4 py-2 bg-transparent text-inherit cursor-pointer hover:bg-cream/20"
        >
          {t('memberLogin')}
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden bg-transparent border-0 text-inherit text-xl cursor-pointer"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-paper border-b border-line shadow-lg lg:hidden z-30">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="block px-6 py-3 text-ink no-underline border-b border-line/50" onClick={() => setMobileOpen(false)}>
              {t(link.label)}
            </Link>
          ))}
          <button onClick={openLogin} className="block w-full text-left px-6 py-3 text-green font-bold bg-transparent border-0 cursor-pointer">
            {t('memberLogin')}
          </button>
        </div>
      )}
    </header>
  )
}
