import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 requests per minute
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`contact:${clientIp}`, RATE_LIMITS.contact)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Prea multe cereri. Încercați din nou mai târziu.' },
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
    const validatedData = contactSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { name, subject } = validatedData.data

    // Log only non-sensitive info
    console.log(`[CONTACT] New message from "${name}" - Subject: "${subject}"`)

    // TODO: Implement email sending via Nodemailer or SendGrid
    // TODO: Save to database if needed

    return NextResponse.json(
      { success: true, message: 'Mesajul a fost trimis cu succes' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[CONTACT] Error processing contact form')
    return NextResponse.json(
      { error: 'Eroare internă' },
      { status: 500 }
    )
  }
}
