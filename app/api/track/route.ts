import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import mysql from 'mysql2/promise'

// Simple rate limiter: 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

const trackSchema = z.object({
  orderNumber: z.string().min(1, 'Numarul comenzii este obligatoriu'),
  email: z.string().email('Email invalid'),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: 'Prea multe cereri. Incercati din nou in cateva minute.' },
      { status: 429 }
    )
  }

  let connection
  try {
    const body = await request.json()
    const validated = trackSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { orderNumber, email } = validated.data
    connection = await mysql.createConnection(process.env.DATABASE_URL!)

    // Find order matching both number and email
    const [orderRows] = await connection.execute(
      `SELECT id, orderNumber, customerName, status, trackingNumber, courierName,
              statusHistory, estimatedTotal, createdAt, updatedAt
       FROM \`Order\`
       WHERE orderNumber = ? AND customerEmail = ?
       LIMIT 1`,
      [orderNumber, email]
    )

    const order = (orderRows as any[])[0]
    if (!order) {
      await connection.end()
      return NextResponse.json(
        { message: 'Comanda nu a fost gasita. Verificati numarul comenzii si adresa de email.' },
        { status: 404 }
      )
    }

    // Fetch items for this order
    const [itemRows] = await connection.execute(
      `SELECT productName, variantName, quantity, price FROM OrderItem WHERE orderId = ?`,
      [order.id]
    )

    await connection.end()

    // Parse statusHistory
    let statusHistory = []
    try {
      if (order.statusHistory) {
        statusHistory = typeof order.statusHistory === 'string'
          ? JSON.parse(order.statusHistory)
          : order.statusHistory
      }
    } catch {}

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
        trackingNumber: order.trackingNumber,
        courierName: order.courierName,
        statusHistory,
        estimatedTotal: order.estimatedTotal,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: (itemRows as any[]).map((item) => ({
          productName: item.productName,
          variantName: item.variantName,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    })
  } catch (error) {
    console.error('[TRACK] Error tracking order:', error)
    if (connection) await connection.end().catch(() => {})
    return NextResponse.json(
      { message: 'Eroare la cautarea comenzii' },
      { status: 500 }
    )
  }
}
