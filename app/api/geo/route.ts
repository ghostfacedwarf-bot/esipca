import { NextRequest, NextResponse } from 'next/server'

interface GeoResponse {
  region: 'RO' | 'EU'
  countryCode: string
  detected: boolean
}

// Romania country code
const ROMANIA_CODE = 'RO'

export async function GET(request: NextRequest) {
  try {
    // Get IP from headers (works with proxies/Vercel)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || null

    // Check for Vercel's geo headers (available on Vercel Edge)
    const vercelCountry = request.headers.get('x-vercel-ip-country')
    if (vercelCountry) {
      const region = vercelCountry === ROMANIA_CODE ? 'RO' : 'EU'
      return NextResponse.json({
        region,
        countryCode: vercelCountry,
        detected: true,
      } as GeoResponse)
    }

    // Localhost/private IP - default to RO
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return NextResponse.json({
        region: 'RO',
        countryCode: 'RO',
        detected: false,
      } as GeoResponse)
    }

    // Use ip-api.com for geolocation (free, non-commercial)
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!geoResponse.ok) {
      throw new Error('Failed to fetch geo data')
    }

    const geoData = await geoResponse.json()
    const countryCode = geoData.countryCode || 'RO'
    const region = countryCode === ROMANIA_CODE ? 'RO' : 'EU'

    return NextResponse.json({
      region,
      countryCode,
      detected: true,
    } as GeoResponse)
  } catch (error) {
    console.error('[Geo API] Error:', error)
    // Default to RO on error
    return NextResponse.json({
      region: 'RO',
      countryCode: 'RO',
      detected: false,
    } as GeoResponse)
  }
}
