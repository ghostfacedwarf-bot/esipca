import { NextRequest, NextResponse } from 'next/server'

interface GeoResponse {
  region: 'RO' | 'EU'
  countryCode: string
  language: string
  detected: boolean
}

// Romania country code
const ROMANIA_CODE = 'RO'

// Map country codes to preferred languages
const countryToLanguage: Record<string, string> = {
  RO: 'ro', // Romania -> Romanian
  MD: 'ro', // Moldova -> Romanian
  GB: 'en', // UK -> English
  US: 'en', // USA -> English
  AU: 'en', // Australia -> English
  CA: 'en', // Canada -> English (could be fr too)
  IE: 'en', // Ireland -> English
  NZ: 'en', // New Zealand -> English
  DE: 'de', // Germany -> German
  AT: 'de', // Austria -> German
  CH: 'de', // Switzerland -> German (simplified)
  LI: 'de', // Liechtenstein -> German
  FR: 'fr', // France -> French
  BE: 'fr', // Belgium -> French (simplified)
  LU: 'fr', // Luxembourg -> French
  MC: 'fr', // Monaco -> French
  ES: 'es', // Spain -> Spanish
  MX: 'es', // Mexico -> Spanish
  AR: 'es', // Argentina -> Spanish
  IT: 'it', // Italy -> Italian
  SM: 'it', // San Marino -> Italian
  HU: 'hu', // Hungary -> Hungarian
  PL: 'pl', // Poland -> Polish
  BG: 'bg', // Bulgaria -> Bulgarian
  NL: 'nl', // Netherlands -> Dutch
  PT: 'pt', // Portugal -> Portuguese
  BR: 'pt', // Brazil -> Portuguese
  RU: 'ru', // Russia -> Russian
  BY: 'ru', // Belarus -> Russian
  UA: 'ru', // Ukraine -> Russian (or Ukrainian, but we don't have it)
}

function getLanguageForCountry(countryCode: string): string {
  return countryToLanguage[countryCode] || 'en' // Default to English for unknown countries
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Debug: allow forcing a country code via query param (dev only)
    const forceCountry = searchParams.get('country')
    if (forceCountry) {
      const upperCountry = forceCountry.toUpperCase()
      const region = upperCountry === ROMANIA_CODE ? 'RO' : 'EU'
      return NextResponse.json({
        region,
        countryCode: upperCountry,
        language: getLanguageForCountry(upperCountry),
        detected: true,
        debug: true,
      } as GeoResponse & { debug: boolean })
    }

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
        language: getLanguageForCountry(vercelCountry),
        detected: true,
      } as GeoResponse)
    }

    // Localhost/private IP - try to detect via external service
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      // In development, try to get the real public IP
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        if (ipResponse.ok) {
          const { ip: publicIp } = await ipResponse.json()
          const geoResponse = await fetch(`http://ip-api.com/json/${publicIp}?fields=countryCode`)
          if (geoResponse.ok) {
            const geoData = await geoResponse.json()
            const countryCode = geoData.countryCode || 'RO'
            const region = countryCode === ROMANIA_CODE ? 'RO' : 'EU'
            return NextResponse.json({
              region,
              countryCode,
              language: getLanguageForCountry(countryCode),
              detected: true,
              publicIp,
            } as GeoResponse & { publicIp: string })
          }
        }
      } catch (e) {
        // Fallback to RO if external detection fails
      }

      return NextResponse.json({
        region: 'RO',
        countryCode: 'RO',
        language: 'ro',
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
      language: getLanguageForCountry(countryCode),
      detected: true,
    } as GeoResponse)
  } catch (error) {
    console.error('[Geo API] Error:', error)
    // Default to RO on error
    return NextResponse.json({
      region: 'RO',
      countryCode: 'RO',
      language: 'ro',
      detected: false,
    } as GeoResponse)
  }
}
