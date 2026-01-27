'use client'

// Re-export from store for backwards compatibility
export { useRegionStore as useRegion, getRegionalPrice, type Region } from './store'

// Legacy provider - now just passes through children since we use Zustand
export function RegionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
