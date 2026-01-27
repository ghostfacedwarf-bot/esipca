'use client'

import { useState, useEffect } from 'react'

interface ExchangeRateData {
  rate: number
  isLoading: boolean
  error: string | null
}

// Global cache to avoid refetching on every component mount
let globalCache: { rate: number; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export function useExchangeRate(): ExchangeRateData {
  const [rate, setRate] = useState<number>(4.97) // Default fallback rate
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRate = async () => {
      // Check global cache first
      const now = Date.now()
      if (globalCache && (now - globalCache.timestamp) < CACHE_DURATION) {
        setRate(globalCache.rate)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/exchange-rate')
        const data = await response.json()

        if (data.rate) {
          setRate(data.rate)
          globalCache = { rate: data.rate, timestamp: now }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate:', err)
        setError('Failed to fetch exchange rate')
        // Keep using default rate
      } finally {
        setIsLoading(false)
      }
    }

    fetchRate()
  }, [])

  return { rate, isLoading, error }
}

// Helper function to convert RON to EUR
export function ronToEur(ronAmount: number, rate: number): number {
  return ronAmount / rate
}

// Helper function to format EUR amount
export function formatEur(amount: number): string {
  return amount.toFixed(2)
}
