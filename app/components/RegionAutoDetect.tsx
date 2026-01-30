'use client'

import { useEffect, useState } from 'react'
import { useRegionStore } from '@/lib/store'

const REGION_DETECTED_KEY = 'esipca_region_detected'

export default function RegionAutoDetect() {
  const { setRegion, setLoading, region } = useRegionStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const detectRegion = async () => {
      console.log('[RegionAutoDetect] Starting detection...')

      // Check if we already detected region before
      let alreadyDetected = false
      try {
        alreadyDetected = !!localStorage.getItem(REGION_DETECTED_KEY)
        console.log('[RegionAutoDetect] Already detected:', alreadyDetected)
      } catch (e) {
        console.error('[RegionAutoDetect] localStorage error:', e)
      }

      if (alreadyDetected) {
        console.log('[RegionAutoDetect] Skipping detection, using stored region:', region)
        setLoading(false)
        return
      }

      try {
        console.log('[RegionAutoDetect] Fetching /api/geo...')
        const response = await fetch('/api/geo')
        console.log('[RegionAutoDetect] Response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          console.log('[RegionAutoDetect] Detected:', data)
          setRegion(data.region)
          // Mark as detected so we don't override user's manual selection
          try {
            localStorage.setItem(REGION_DETECTED_KEY, 'true')
          } catch (e) {
            console.error('[RegionAutoDetect] Failed to save to localStorage:', e)
          }
        } else {
          console.error('[RegionAutoDetect] API error:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('[RegionAutoDetect] Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    detectRegion()
  }, [mounted, setRegion, setLoading, region])

  return null // This component doesn't render anything
}
