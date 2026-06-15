import type { Product } from '../types'
import { fruitsProducts } from './fruits'
import { grainsProducts } from './grains'
import { milletsProducts } from './millets'
import { pulsesProducts } from './pulses'
import { vegetablesProducts } from './vegetables'
import { oilseedsProducts } from './oilseeds'
import { exportProduce } from './export-produce'

export const catalogData: Record<string, Product[]> = {
  fruits: fruitsProducts,
  grains: grainsProducts,
  millets: milletsProducts,
  pulses: pulsesProducts,
  vegetables: vegetablesProducts,
  oilseeds: oilseedsProducts,
  'export-produce': exportProduce,
}

export function getProductBySlug(categorySlug: string, productSlug: string): Product | undefined {
  return catalogData[categorySlug]?.find((p) => p.slug === productSlug)
}

export function getCategoryProducts(categorySlug: string): Product[] {
  return catalogData[categorySlug] ?? []
}
