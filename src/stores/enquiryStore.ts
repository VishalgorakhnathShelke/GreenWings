import { create } from 'zustand'
import { baseEnquiries, type Enquiry } from '../data/content'
import { createEnquiry, fetchEnquiries, type EnquiryRecord } from '../services/api'

interface EnquiryState {
  enquiries: Enquiry[]
  toastMessage: string
  toastVisible: boolean
  loadEnquiries: (token: string) => Promise<void>
  addEnquiry: (subject: string, category: string, description: string, priority: string, token?: string | null) => Promise<void>
  hideToast: () => void
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function mapServerEnquiry(enquiry: EnquiryRecord): Enquiry {
  return {
    id: enquiry.enquiryId,
    subject: enquiry.subject,
    category: enquiry.category,
    status: enquiry.status === 'NEW' ? 'Submitted' : enquiry.status,
    date: formatDate(enquiry.updatedAt || enquiry.createdAt),
    description: enquiry.description,
    priority: enquiry.priority,
  }
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
  loadEnquiries: async (token: string) => {
    const result = await fetchEnquiries(token)
    const enquiries = result.enquiries.map(mapServerEnquiry)
    localStorage.setItem('greenwingsEnquiries', JSON.stringify(enquiries))
    set({ enquiries })
  },
  addEnquiry: async (subject: string, category: string, description: string, priority: string, token?: string | null) => {
    let newEnquiry: Enquiry
    if (token) {
      const result = await createEnquiry(token, { subject, category, description, priority })
      newEnquiry = mapServerEnquiry(result.enquiry)
    } else {
      const id = `GW-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
      newEnquiry = { id, subject, category, status: 'Submitted', date: 'Just now', description, priority }
    }
    set((state) => {
      const enquiries = [newEnquiry, ...state.enquiries]
      localStorage.setItem('greenwingsEnquiries', JSON.stringify(enquiries))
      return { enquiries, toastMessage: `Your reference ID is ${newEnquiry.id}`, toastVisible: true }
    })
    setTimeout(() => set({ toastVisible: false }), 4500)
  },
  hideToast: () => set({ toastVisible: false }),
}))
