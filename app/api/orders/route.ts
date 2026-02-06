import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { sendOrderEmails } from '@/lib/email'
import prisma from '@/lib/prisma'

// Input validation schema
const customerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(4).max(20),
  country: z.string().min(2).max(50).optional().default('RO'),
})

const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  quantity: z.number().int().positive().max(10000),
  price: z.number().positive(),
  attributes: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  sku: z.string().optional(),
  imageUrl: z.string().optional(),
  pricePerMeter: z.number().optional(),
  doubleSidedSurcharge: z.number().optional(),
})

const orderSchema = z.object({
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1).max(100),
  totalPrice: z.number().positive(),
  language: z.string().min(2).max(5).optional().default('ro'),
})

function generateOrderNumber(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `ORD-${dateStr}-${random}`
}

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

    const { customer, items, totalPrice, language } = validatedData.data

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Save to database
    let dbOrder: { id: string; orderNumber: string } | null = null
    try {
      dbOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          customerCity: customer.city,
          customerCounty: '', // Not in form but required field has default
          customerPostal: customer.postalCode,
          customerCountry: customer.country,
          estimatedTotal: totalPrice,
          status: 'pending',
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              quantity: item.quantity,
              price: item.price,
              productName: item.productName,
              variantName: item.variantName || null,
              sku: item.sku || null,
              imageUrl: item.imageUrl || null,
              attributes: item.attributes ? {
                ...item.attributes,
                ...(item.pricePerMeter ? { pricePerMeter: item.pricePerMeter } : {}),
                ...(item.doubleSidedSurcharge ? { doubleSidedSurcharge: item.doubleSidedSurcharge } : {}),
              } : null,
            })),
          },
        },
        select: { id: true, orderNumber: true },
      })
      console.log(`[ORDER] Saved to DB: ${dbOrder.orderNumber}`)
    } catch (dbError) {
      console.error('[ORDER] Failed to save to DB, continuing with email:', dbError)
    }

    const orderId = dbOrder?.orderNumber || orderNumber

    // Log only non-sensitive info
    console.log(`[ORDER] New order ${orderId}: ${items.length} items, ${totalPrice} RON`)

    // Send confirmation emails
    const emailResults = await sendOrderEmails({
      orderId,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country,
      },
      items: items.map((item) => ({
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        price: item.price,
        attributes: item.attributes,
      })),
      totalPrice,
      language: language || 'ro',
    })

    console.log(`[ORDER] Email results - Customer: ${emailResults.customer}, Admin: ${emailResults.admin}`)

    return NextResponse.json(
      {
        message: 'Comandă plasată cu succes!',
        orderId,
        emailSent: emailResults.customer,
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
