'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Region = 'RO' | 'EU'

interface RegionContextType {
  region: Region
  setRegion: (region: Region) => void
  isLoading: boolean
  countryCode: string | null
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

const REGION_STORAGE_KEY = 'esipca_region'

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>('RO')
  const [isLoading, setIsLoading] = useState(true)
  const [countryCode, setCountryCode] = useState<string | null>(null)

  useEffect(() => {
    const initRegion = async () => {
      // Check localStorage first
      const savedRegion = localStorage.getItem(REGION_STORAGE_KEY) as Region | null
      if (savedRegion && (savedRegion === 'RO' || savedRegion === 'EU')) {
        setRegionState(savedRegion)
        setIsLoading(false)
        return
      }

      // Auto-detect from IP
      try {
        const response = await fetch('/api/geo')
        if (response.ok) {
          const data = await response.json()
          setRegionState(data.region)
          setCountryCode(data.countryCode)
          localStorage.setItem(REGION_STORAGE_KEY, data.region)
        }
      } catch (error) {
        console.error('[Region] Failed to detect region:', error)
        // Default to RO on error
        setRegionState('RO')
      } finally {
        setIsLoading(false)
      }
    }

    initRegion()
  }, [])

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion)
    localStorage.setItem(REGION_STORAGE_KEY, newRegion)
  }

  return (
    <RegionContext.Provider value={{ region, setRegion, isLoading, countryCode }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider')
  }
  return context
}

/**
 * Get the appropriate price based on region
 * @param priceRO - Romania price
 * @param priceEU - EU price (optional)
 * @param region - Current region
 * @returns The appropriate price for the region
 */
export function getRegionalPrice(priceRO: number, priceEU: number | null | undefined, region: Region): number {
  if (region === 'EU' && priceEU != null) {
    return priceEU
  }
  return priceRO
}
