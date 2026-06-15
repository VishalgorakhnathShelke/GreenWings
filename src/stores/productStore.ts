import { create } from 'zustand'

interface ProductState {
  selectedCategory: string | null
  openAccordion: string | null
  setSelectedCategory: (slug: string | null) => void
  toggleAccordion: (slug: string) => void
  closeAccordion: () => void
}

export const useProductStore = create<ProductState>((set) => ({
  selectedCategory: null,
  openAccordion: null,
  setSelectedCategory: (slug) => set({ selectedCategory: slug }),
  toggleAccordion: (slug) => set((s) => ({ openAccordion: s.openAccordion === slug ? null : slug })),
  closeAccordion: () => set({ openAccordion: null }),
}))
