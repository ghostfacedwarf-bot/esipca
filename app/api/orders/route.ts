import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

// Input validation schema
const customerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(4).max(20),
})

const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  quantity: z.number().int().positive().max(10000),
  price: z.number().positive(),
})

const orderSchema = z.object({
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1).max(100),
  totalPrice: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`orders:${clientIp}`, RATE_LIMITS.orders)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { message: 'Prea multe cereri. Încercați din nou mai târziu.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = orderSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { message: 'Datele comenzii sunt invalide', errors: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { customer, items, totalPrice } = validatedData.data

    // Create order (without logging PII)
    const order = {
      id: `ORD-${Date.now()}`,
      itemCount: items.length,
      totalPrice,
      status: 'pending',
      createdAt: new Date(),
    }

    // Log only non-sensitive info
    console.log(`[ORDER] New order ${order.id}: ${order.itemCount} items, ${order.totalPrice} RON`)

    // TODO: Save to database
    // TODO: Send confirmation email

    return NextResponse.json(
      {
        message: 'Comandă plasată cu succes!',
        orderId: order.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[ORDER] Error processing order')
    return NextResponse.json(
      { message: 'Eroare la procesarea comenzii' },
      { status: 500 }
    )
  }
}
