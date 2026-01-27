'use client'

import { useEffect } from 'react'
import { useRegionStore } from '@/lib/store'

const REGION_DETECTED_KEY = 'esipca_region_detected'

export default function RegionAutoDetect() {
  const { setRegion, setLoading } = useRegionStore()

  useEffect(() => {
    const detectRegion = async () => {
      // Check if we already detected region before
      const alreadyDetected = localStorage.getItem(REGION_DETECTED_KEY)
      if (alreadyDetected) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/geo')
        if (response.ok) {
          const data = await response.json()
          console.log('[RegionAutoDetect] Detected:', data)
          setRegion(data.region)
          // Mark as detected so we don't override user's manual selection
          localStorage.setItem(REGION_DETECTED_KEY, 'true')
        }
      } catch (error) {
        console.error('[RegionAutoDetect] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    detectRegion()
  }, [setRegion, setLoading])

  return null // This component doesn't render anything
}
