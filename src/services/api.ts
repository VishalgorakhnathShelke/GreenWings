import type { Lang } from '../data/translations'

export interface DatabaseSubtype {
  subtype_id: number
  subtype_name: string
  display_name: string
  language: Lang
  scientific_name: string | null
  marathi_name: string | null
  origin_state: string | null
  localized_origin_state?: string
  taste_profile: string | null
  localized_taste_profile?: string
  description: string | null
  localized_description: string | null
  info: string
  localized_info: string
}

export interface DatabaseProduct {
  produce_id: number
  type: string
  display_type: string
  name: string
  display_name: string
  language: Lang
  scientific_name: string | null
  category: string | null
  localized_category?: string
  season: string | null
  localized_season?: string
  marathi_name: string | null
  hindi_name: string | null
  english_name: string | null
  description: string | null
  localized_description: string | null
  info: string
  localized_info: string
  subtypes: DatabaseSubtype[]
}

export interface AuthUser {
  id?: number
  firstName?: string
  lastName?: string
  name?: string
  mobileNumber?: string
  email: string
  role: 'member' | 'admin'
  interest?: string
  enquiryQuestion?: string
  address?: string
  state?: string
  country?: string
  emailVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface EnquiryRecord {
  id: number
  enquiryId: string
  userId: number
  subject: string
  category: string
  description: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  userName?: string
  userEmail?: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  password: string
  interest: string
  enquiryQuestion: string
  address: string
  state: string
  country: string
}

export interface AdminSummary {
  role: 'admin'
  produce: number
  subtypes: number
  totalUsers: number
  newUsersToday: number
  totalEnquiries: number
  newEnquiries: number
  totalVisits: number
  uniqueVisitors: number
  todayVisits: number
  recentUsers: AuthUser[]
  recentEnquiries: EnquiryRecord[]
  mostVisitedPages: Array<{ pagePath: string; visits: number }>
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options)
  const payload = await response.json()
  if (!response.ok) {
    const details = Array.isArray(payload.details) ? ` ${payload.details.join(' ')}` : ''
    throw new Error(`${payload.error || 'Request failed'}${details}`)
  }
  return payload as T
}

export async function fetchDatabaseProducts(type?: string, lang: Lang = 'en'): Promise<DatabaseProduct[]> {
  const params = new URLSearchParams({ lang })
  if (type) params.set('type', type)
  const query = `?${params.toString()}`
  const payload = await apiRequest<{ products: DatabaseProduct[] }>(`/api/products${query}`)
  return payload.products
}

export async function loginAdmin(email: string, password: string) {
  return apiRequest<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function loginUser(email: string, password: string) {
  return apiRequest<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(payload: RegisterPayload) {
  return apiRequest<{ token: string; user: AuthUser; enquiry: EnquiryRecord }>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function verifyAuthToken(token: string) {
  return apiRequest<{ user: AuthUser }>('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function verifyAdminToken(token: string) {
  return verifyAuthToken(token)
}

export async function fetchEnquiries(token: string) {
  return apiRequest<{ enquiries: EnquiryRecord[] }>('/api/enquiries', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createEnquiry(
  token: string,
  payload: { subject: string; category: string; description: string; priority: string },
) {
  return apiRequest<{ enquiry: EnquiryRecord }>('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function fetchAdminSummary(token: string) {
  return apiRequest<AdminSummary>('/api/admin/summary', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function trackWebsiteVisit(payload: {
  pagePath: string
  referrer?: string
  visitorId: string
  sessionId: string
}) {
  try {
    await fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Analytics should never interrupt the visitor experience.
  }
}
