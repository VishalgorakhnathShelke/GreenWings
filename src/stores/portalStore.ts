import { create } from 'zustand'

interface PortalState {
  isOpen: boolean
  activePanel: string
  openPortal: () => void
  closePortal: () => void
  setActivePanel: (panel: string) => void
}

export const usePortalStore = create<PortalState>((set) => ({
  isOpen: false,
  activePanel: 'dashboard',
  openPortal: () => set({ isOpen: true }),
  closePortal: () => set({ isOpen: false }),
  setActivePanel: (panel: string) => set({ activePanel: panel }),
}))
