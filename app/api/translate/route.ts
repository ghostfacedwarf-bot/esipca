import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

const translateSchema = z.object({
  text: z.string().min(1).max(10000),
  targetLang: z.string().min(2).max(5),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 100 requests per minute (more lenient for translations)
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`translate:${clientIp}`, RATE_LIMITS.api)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
          },
        }
      )
    }

    const body = await request.json()
    const validatedData = translateSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { text, targetLang } = validatedData.data

    const apiKey = process.env.DEEPL_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Translation service not configured' },
        { status: 500 }
      )
    }

    // Determine if using free or pro API
    const apiUrl = apiKey.includes(':fx')
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase(),
        source_lang: 'RO',
      }),
    })

    if (!response.ok) {
      console.error('[TRANSLATE] DeepL API error:', response.status)
      return NextResponse.json(
        { error: 'Translation failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const translatedText = data.translations[0].text

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('[TRANSLATE] Error')
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
