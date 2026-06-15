import { create } from 'zustand'
import { baseEnquiries, type Enquiry } from '../data/content'

interface EnquiryState {
  enquiries: Enquiry[]
  toastMessage: string
  toastVisible: boolean
  addEnquiry: (subject: string, category: string) => void
  hideToast: () => void
}

function loadSavedEnquiries(): Enquiry[] | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = JSON.parse(localStorage.getItem('greenwingsEnquiries') || 'null')
    return Array.isArray(saved) ? saved as Enquiry[] : null
  } catch {
    localStorage.removeItem('greenwingsEnquiries')
    return null
  }
}

const savedEnquiries = loadSavedEnquiries()

export const useEnquiryStore = create<EnquiryState>((set) => ({
  enquiries: savedEnquiries ?? baseEnquiries,
  toastMessage: '',
  toastVisible: false,
  addEnquiry: (subject: string, category: string) => {
    const id = `GW-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
    const newEnquiry: Enquiry = { id, subject, category, status: 'Submitted', date: 'Just now' }
    set((state) => {
      const enquiries = [newEnquiry, ...state.enquiries]
      localStorage.setItem('greenwingsEnquiries', JSON.stringify(enquiries))
      return { enquiries, toastMessage: `Your reference ID is ${id}`, toastVisible: true }
    })
    setTimeout(() => set({ toastVisible: false }), 4500)
  },
  hideToast: () => set({ toastVisible: false }),
}))
