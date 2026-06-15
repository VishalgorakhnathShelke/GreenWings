export interface DatabaseSubtype {
  subtype_id: number
  subtype_name: string
  scientific_name: string | null
  marathi_name: string | null
  origin_state: string | null
  taste_profile: string | null
  description: string | null
  info: string
}

export interface DatabaseProduct {
  produce_id: number
  type: string
  name: string
  scientific_name: string | null
  category: string | null
  season: string | null
  marathi_name: string | null
  hindi_name: string | null
  english_name: string | null
  description: string | null
  info: string
  subtypes: DatabaseSubtype[]
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options)
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || 'Request failed')
  return payload as T
}

export async function fetchDatabaseProducts(type?: string): Promise<DatabaseProduct[]> {
  const query = type ? `?type=${encodeURIComponent(type)}` : ''
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
