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
  companyStories?: number
  companyContents?: number
  companyMilestones?: number
  companyTimelines?: number
  leadershipMembers?: number
  homepageStatistics?: number
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

export interface CompanyStory {
  id: number
  title: string
  slug: string
  language: Lang
  content: string
  featuredImage: string
  displayOrder: number
  status: 'draft' | 'published' | 'archived' | string
  createdAt: string
  updatedAt: string
}

export interface CompanyContentSection {
  id: number
  sectionKey: string
  title: string
  subtitle: string
  content: string
  language: Lang
  displayOrder: number
  status: 'draft' | 'published' | 'archived' | string
  createdAt: string
  updatedAt: string
}

export interface CompanyMilestone {
  id: number
  year: string
  title: string
  description: string
  baseTitle?: string
  baseDescription?: string
  image: string
  displayOrder: number
  translations?: Record<'hi' | 'mr', { title?: string; description?: string }>
  createdAt: string
  updatedAt: string
}

export interface CompanyTimeline {
  id: number
  year: string
  title: string
  description: string
  impactMetric: string
  language: Lang
  displayOrder: number
  status: 'draft' | 'published' | 'archived' | string
  createdAt: string
  updatedAt: string
}

export interface HomepageStatistic {
  id: number
  label: string
  value: string
  description: string
  displayOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LeadershipMember {
  id: number
  fullName: string
  designation: string
  roleDescription: string
  biography: string
  language?: Lang
  baseDesignation?: string
  baseRoleDescription?: string
  baseBiography?: string
  image: string
  imageUrl: string
  displayOrder: number
  active: boolean
  translations?: Record<'hi' | 'mr', { designation?: string; biography?: string }>
  createdAt: string
  updatedAt: string
}

export interface CompanyContent {
  language: Lang
  contents: CompanyContentSection[]
  contentByKey: Record<string, CompanyContentSection>
  stories: CompanyStory[]
  storiesBySlug: Record<string, CompanyStory>
  timelines: CompanyTimeline[]
  milestones: CompanyMilestone[]
  statistics: HomepageStatistic[]
  leadership: LeadershipMember[]
}

export type CompanyStoryPayload = Omit<CompanyStory, 'id' | 'createdAt' | 'updatedAt'>
export type CompanyContentSectionPayload = Omit<CompanyContentSection, 'id' | 'createdAt' | 'updatedAt'>
export type CompanyMilestonePayload = Omit<CompanyMilestone, 'id' | 'baseTitle' | 'baseDescription' | 'createdAt' | 'updatedAt'>
export type CompanyTimelinePayload = Omit<CompanyTimeline, 'id' | 'createdAt' | 'updatedAt'>
export type HomepageStatisticPayload = Omit<HomepageStatistic, 'id' | 'createdAt' | 'updatedAt'>
export type LeadershipPayload = Omit<LeadershipMember, 'id' | 'baseDesignation' | 'baseRoleDescription' | 'baseBiography' | 'createdAt' | 'updatedAt'>

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
  const text = await response.text()
  let payload: { error?: string; details?: string[] } = {}
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = { error: text }
    }
  }
  if (!response.ok) {
    const details = Array.isArray(payload.details) ? ` ${payload.details.join(' ')}` : ''
    const backendMessage = response.status === 502
      ? 'Backend API is not running. Start it with npm run api, then refresh the page.'
      : 'Request failed'
    throw new Error(`${payload.error || backendMessage}${details}`)
  }
  if (!text) {
    throw new Error('Backend returned an empty response. Please restart npm run api.')
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

export async function fetchCompanyContent(lang: Lang = 'en') {
  return apiRequest<CompanyContent>(`/api/content/about?lang=${lang}`, { cache: 'no-store' })
}

export async function fetchAdminCompanyContents(token: string, filters?: { search?: string; language?: string; status?: string }) {
  const params = new URLSearchParams()
  if (filters?.search) params.set('search', filters.search)
  if (filters?.language) params.set('language', filters.language)
  if (filters?.status) params.set('status', filters.status)
  const query = params.toString() ? `?${params.toString()}` : ''
  return apiRequest<{ contents: CompanyContentSection[] }>(`/api/admin/company-contents${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAdminCompanyContent(token: string, payload: CompanyContentSectionPayload) {
  return apiRequest<{ content: CompanyContentSection }>('/api/admin/company-contents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function updateAdminCompanyContent(token: string, id: number, payload: CompanyContentSectionPayload) {
  return apiRequest<{ content: CompanyContentSection }>(`/api/admin/company-contents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminCompanyContent(token: string, id: number) {
  return apiRequest<{ ok: boolean }>(`/api/admin/company-contents/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchAdminCompanyStories(token: string, filters?: { search?: string; language?: string; status?: string }) {
  const params = new URLSearchParams()
  if (filters?.search) params.set('search', filters.search)
  if (filters?.language) params.set('language', filters.language)
  if (filters?.status) params.set('status', filters.status)
  const query = params.toString() ? `?${params.toString()}` : ''
  return apiRequest<{ stories: CompanyStory[] }>(`/api/admin/company-stories${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAdminCompanyStory(token: string, payload: CompanyStoryPayload) {
  return apiRequest<{ story: CompanyStory }>('/api/admin/company-stories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function updateAdminCompanyStory(token: string, id: number, payload: CompanyStoryPayload) {
  return apiRequest<{ story: CompanyStory }>(`/api/admin/company-stories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminCompanyStory(token: string, id: number) {
  return apiRequest<{ ok: boolean }>(`/api/admin/company-stories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchAdminCompanyMilestones(token: string) {
  return apiRequest<{ milestones: CompanyMilestone[] }>('/api/admin/company-milestones', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAdminCompanyMilestone(token: string, payload: CompanyMilestonePayload) {
  return apiRequest<{ milestone: CompanyMilestone }>('/api/admin/company-milestones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function updateAdminCompanyMilestone(token: string, id: number, payload: CompanyMilestonePayload) {
  return apiRequest<{ milestone: CompanyMilestone }>(`/api/admin/company-milestones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminCompanyMilestone(token: string, id: number) {
  return apiRequest<{ ok: boolean }>(`/api/admin/company-milestones/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchAdminCompanyTimelines(token: string, filters?: { search?: string; language?: string; status?: string }) {
  const params = new URLSearchParams()
  if (filters?.search) params.set('search', filters.search)
  if (filters?.language) params.set('language', filters.language)
  if (filters?.status) params.set('status', filters.status)
  const query = params.toString() ? `?${params.toString()}` : ''
  return apiRequest<{ timelines: CompanyTimeline[] }>(`/api/admin/company-timelines${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAdminCompanyTimeline(token: string, payload: CompanyTimelinePayload) {
  return apiRequest<{ timeline: CompanyTimeline }>('/api/admin/company-timelines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function updateAdminCompanyTimeline(token: string, id: number, payload: CompanyTimelinePayload) {
  return apiRequest<{ timeline: CompanyTimeline }>(`/api/admin/company-timelines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminCompanyTimeline(token: string, id: number) {
  return apiRequest<{ ok: boolean }>(`/api/admin/company-timelines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchAdminHomepageStatistics(token: string) {
  return apiRequest<{ statistics: HomepageStatistic[] }>('/api/admin/homepage-statistics', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAdminHomepageStatistic(token: string, payload: HomepageStatisticPayload) {
  return apiRequest<{ statistic: HomepageStatistic }>('/api/admin/homepage-statistics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function updateAdminHomepageStatistic(token: string, id: number, payload: HomepageStatisticPayload) {
  return apiRequest<{ statistic: HomepageStatistic }>(`/api/admin/homepage-statistics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminHomepageStatistic(token: string, id: number) {
  return apiRequest<{ ok: boolean }>(`/api/admin/homepage-statistics/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchAdminLeadershipMembers(token: string) {
  return apiRequest<{ leadership: LeadershipMember[] }>('/api/admin/leadership-members', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createAdminLeadershipMember(token: string, payload: LeadershipPayload) {
  return apiRequest<{ member: LeadershipMember }>('/api/admin/leadership-members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function updateAdminLeadershipMember(token: string, id: number, payload: LeadershipPayload) {
  return apiRequest<{ member: LeadershipMember }>(`/api/admin/leadership-members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminLeadershipMember(token: string, id: number) {
  return apiRequest<{ ok: boolean }>(`/api/admin/leadership-members/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
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
