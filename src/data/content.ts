export interface Enquiry {
  id: string
  subject: string
  category: string
  status: string
  date: string
  description?: string
  priority?: string
}

export const baseEnquiries: Enquiry[] = [
  { id: 'GW-2026-0182', subject: 'Drip irrigation subsidy guidance', category: 'Finance & schemes', status: 'In review', date: '12 Jun 2026' },
  { id: 'GW-2026-0156', subject: 'Onion harvest buyer connection', category: 'Market access', status: 'Resolved', date: '28 May 2026' },
]

export interface Project {
  status: string
  location: string
  title: string
  description: string
  metric: string
  metricLabel: string
}

export const projects: Project[] = [
  { status: 'Active', location: 'Yeola · 2026', title: 'Precision Irrigation Adoption', description: 'Helping farmers improve water efficiency through field assessment, training, and technology adoption.', metric: '620 acres', metricLabel: 'Target coverage' },
  { status: 'Active', location: 'Nashik District · 2026', title: 'Market-Ready Produce Program', description: 'Improving grading, traceability, packaging, and buyer readiness for member produce.', metric: '800 farmers', metricLabel: 'Planned impact' },
  { status: 'Planning', location: 'Jalgaon Neur · 2026–27', title: 'Women Farmer Enterprise Network', description: 'Building skills, leadership, and shared enterprise opportunities for women farmers.', metric: '12 groups', metricLabel: 'Planned network' },
]

export interface Resource {
  label: string
  description: string
  action: string
}

export const resources: Resource[] = [
  { label: 'Annual reports', description: 'Company performance and impact reports', action: 'PDF ↓' },
  { label: 'Farmer guides', description: 'Practical cultivation and post-harvest guides', action: 'PDF ↓' },
  { label: 'Government schemes', description: 'Current opportunities and application guidance', action: 'View →' },
  { label: 'Forms', description: 'Membership and service request forms', action: 'PDF ↓' },
]
