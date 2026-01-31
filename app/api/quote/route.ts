import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

const quoteSchema = z.object({
  productId: z.string().max(100),
  productName: z.string().max(255),
  variantId: z.string().max(100),
  sku: z.string().max(100),
  quantity: z.number().int().min(1).max(100000),
  price: z.number().min(0).max(1000000),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 requests per minute
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`quote:${clientIp}`, RATE_LIMITS.quote)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Prea multe cereri. Încercați din nou mai târziu.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
          },
        }
      )
    }

    const body = await request.json()
    const validatedData = quoteSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: 'Datele introduse nu sunt valide' },
        { status: 400 }
      )
    }

    const { productName, quantity, price } = validatedData.data

    // Log only non-sensitive summary
    console.log(`[QUOTE] Request: ${productName} x${quantity} @ ${price} RON`)

    // TODO: Send email notification to admin
    // TODO: Store quote request in database

    return NextResponse.json(
      {
        success: true,
        message: 'Cererea de ofertă a fost înregistrată cu succes!',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[QUOTE] Error processing request')
    return NextResponse.json(
      { success: false, error: 'Eroare la procesarea cererii' },
      { status: 500 }
    )
  }
}
