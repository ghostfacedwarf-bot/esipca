import { NextResponse } from 'next/server'

// Cache the exchange rate for 1 hour
let cachedRate: { rate: number; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

async function fetchBNRRate(): Promise<number> {
  try {
    // BNR XML feed for exchange rates
    const response = await fetch('https://www.bnr.ro/nbrfxrates.xml', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch BNR rates')
    }

    const xml = await response.text()

    // Parse EUR rate from XML
    // Format: <Rate currency="EUR">4.9770</Rate>
    const eurMatch = xml.match(/<Rate currency="EUR">([0-9.]+)<\/Rate>/)

    if (eurMatch && eurMatch[1]) {
      return parseFloat(eurMatch[1])
    }

    throw new Error('EUR rate not found in BNR response')
  } catch (error) {
    console.error('Error fetching BNR rate:', error)
    // Fallback rate if BNR is unavailable
    return 4.97
  }
}

export async function GET() {
  try {
    const now = Date.now()

    // Return cached rate if still valid
    if (cachedRate && (now - cachedRate.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        rate: cachedRate.rate,
        source: 'BNR',
        cached: true
      })
    }

    // Fetch fresh rate
    const rate = await fetchBNRRate()

    // Update cache
    cachedRate = { rate, timestamp: now }

    return NextResponse.json({
      rate,
      source: 'BNR',
      cached: false
    })
  } catch (error) {
    console.error('Exchange rate API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exchange rate', rate: 4.97 },
      { status: 500 }
    )
  }
}
