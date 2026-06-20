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
  localFertilizers?: number
  importedFertilizers?: number
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

export type FertilizerKind = 'local' | 'imported'

export interface Fertilizer {
  id: number
  kind: FertilizerKind
  language: Lang
  name: string
  displayName: string
  category: string
  displayCategory: string
  manufacturer: string
  countryOfOrigin: string
  description: string
  localizedDescription: string
  content: string
  localizedContent: string
  uses: string
  localizedUses: string
  applyOnCrops: string
  doNotApplyOn: string
  applicationMethod: string
  recommendedStage: string
  season: string
  temperatureRange: string
  soilType: string
  benefits: string
  localizedBenefits: string
  precautions: string
  localizedPrecautions: string
  imageUrl?: string
  status: 'active' | 'draft' | 'inactive' | string
  documentUrl?: string
  approvalBody?: string
  regionalRecommendations?: string
  brand?: string
  importCertifications?: string
  internationalSpecifications?: string
  createdAt: string
  updatedAt: string
}

export type FertilizerPayload = Omit<Fertilizer, 'id' | 'kind' | 'language' | 'displayName' | 'displayCategory' | 'localizedDescription' | 'localizedContent' | 'localizedUses' | 'localizedBenefits' | 'localizedPrecautions' | 'createdAt' | 'updatedAt'> & {
  translations?: Record<'hi' | 'mr', Partial<Pick<Fertilizer, 'name' | 'category' | 'description' | 'content' | 'uses' | 'benefits' | 'precautions'>>>
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

export async function fetchFertilizers(kind: FertilizerKind, lang: Lang = 'en', filters?: { search?: string; category?: string }) {
  const params = new URLSearchParams({ kind, lang })
  if (filters?.search) params.set('search', filters.search)
  if (filters?.category) params.set('category', filters.category)
  return apiRequest<{ kind: FertilizerKind; language: Lang; categories: string[]; fertilizers: Fertilizer[] }>(`/api/fertilizers?${params.toString()}`)
}

export async function fetchFertilizer(kind: FertilizerKind, id: string | number, lang: Lang = 'en') {
  return apiRequest<{ fertilizer: Fertilizer }>(`/api/fertilizers/${kind}/${id}?lang=${lang}`)
}

export async function fetchAdminFertilizers(token: string, kind: FertilizerKind, filters?: { search?: string; category?: string; status?: string }) {
  const params = new URLSearchParams({ kind })
  if (filters?.search) params.set('search', filters.search)
  if (filters?.category) params.set('category', filters.category)
  if (filters?.status) params.set('status', filters.status)
  return apiRequest<{ kind: FertilizerKind; fertilizers: Fertilizer[] }>(`/api/admin/fertilizers?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAdminFertilizer(token: string, kind: FertilizerKind, payload: FertilizerPayload) {
  return apiRequest<{ fertilizer: Fertilizer }>(`/api/admin/fertilizers?kind=${kind}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function updateAdminFertilizer(token: string, kind: FertilizerKind, id: number, payload: FertilizerPayload) {
  return apiRequest<{ fertilizer: Fertilizer }>(`/api/admin/fertilizers/${kind}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminFertilizer(token: string, kind: FertilizerKind, id: number) {
  return apiRequest<{ ok: boolean }>(`/api/admin/fertilizers/${kind}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
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
