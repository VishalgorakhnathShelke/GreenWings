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

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options)
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || 'Request failed')
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
  return apiRequest<{ token: string; user: { email: string; role: 'admin' } }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function verifyAdminToken(token: string) {
  return apiRequest<{ user: { email: string; role: 'admin' } }>('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
