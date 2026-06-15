export interface VarietyCharacteristic {
  color: string
  shape: string
  averageSize: string
  taste: string
  aroma: string
  storage: string
}

export interface Variety {
  name: string
  slug: string
  imagePlaceholder: string
  overview: string
  characteristics: VarietyCharacteristic
  applications: string[]
  shelfLife: string
  exportSuitability: string
}

export interface Product {
  id: string
  name: string
  slug: string
  heroImage: string
  overview: string
  keyBenefits: string[]
  growingRegions: string[]
  harvestSeason: string
  exportAvailability: string
  storageInfo: string
  nutritionalHighlights: string[]
  marketApplications: string[]
  varieties: Variety[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  heroImage: string
  icon: string
  tagline: string
}
