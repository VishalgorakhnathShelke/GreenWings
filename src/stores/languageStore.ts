import { create } from 'zustand'
import { translations, type Lang } from '../data/translations'

interface LanguageState {
  lang: Lang
  t: (key: string) => string
  setLanguage: (lang: Lang) => void
}

const savedLang = (typeof window !== 'undefined' ? (localStorage.getItem('greenwingsLang') as Lang) : null) || 'en'

export const useLanguageStore = create<LanguageState>((set, get) => ({
  lang: savedLang,
  t: (key: string) => {
    return translations[get().lang]?.[key] ?? key
  },
  setLanguage: (lang: Lang) => {
    localStorage.setItem('greenwingsLang', lang)
    set({ lang })
  },
}))
