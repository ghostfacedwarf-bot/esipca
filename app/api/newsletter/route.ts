import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import mysql from 'mysql2/promise'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

const subscribeSchema = z.object({
  email: z.string().email('Email invalid'),
  name: z.string().max(100).optional(),
})

async function getConnection() {
  return mysql.createConnection(process.env.DATABASE_URL || '')
}

export async function POST(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`newsletter:${clientIp}`, RATE_LIMITS.contact)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { message: 'Prea multe cereri. Încercați din nou mai târziu.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = subscribeSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { message: 'Email invalid', errors: validatedData.error.flatten() },
        { status: 400 }
      )
    }

    const { email, name } = validatedData.data

    connection = await getConnection()

    // Check if already subscribed
    const [existing] = await connection.execute(
      'SELECT id, isActive FROM NewsletterSubscriber WHERE email = ?',
      [email]
    )

    const existingRows = existing as any[]

    if (existingRows.length > 0) {
      const subscriber = existingRows[0]

      if (subscriber.isActive) {
        await connection.end()
        return NextResponse.json(
          { message: 'Acest email este deja abonat la newsletter.' },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        await connection.execute(
          'UPDATE NewsletterSubscriber SET isActive = true, unsubscribedAt = NULL, subscribedAt = NOW() WHERE email = ?',
          [email]
        )
        await connection.end()
        return NextResponse.json({
          message: 'Te-ai reabonat cu succes la newsletter!',
          resubscribed: true,
        })
      }
    }

    // Create new subscriber
    const id = crypto.randomUUID()
    await connection.execute(
      'INSERT INTO NewsletterSubscriber (id, email, name, isActive, subscribedAt) VALUES (?, ?, ?, true, NOW())',
      [id, email, name || null]
    )

    await connection.end()

    console.log(`[NEWSLETTER] New subscriber: ${email}`)

    return NextResponse.json({
      message: 'Te-ai abonat cu succes la newsletter!',
    })
  } catch (error) {
    console.error('[NEWSLETTER] Error:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return NextResponse.json(
      { message: 'Eroare la abonare. Încearcă din nou.' },
      { status: 500 }
    )
  }
}

// Get all subscribers (admin only)
export async function GET(request: NextRequest) {
  // Auth check - only admin can list subscribers
  const { cookies: getCookies } = await import('next/headers')
  const cookieStore = await getCookies()
  const session = cookieStore.get('admin_session')
  if (!session) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection: mysql.Connection | null = null

  try {
    connection = await getConnection()

    const [subscribers] = await connection.execute(
      'SELECT email, name, subscribedAt FROM NewsletterSubscriber WHERE isActive = true ORDER BY subscribedAt DESC'
    )

    await connection.end()

    const rows = subscribers as any[]

    return NextResponse.json({
      count: rows.length,
      subscribers: rows,
    })
  } catch (error) {
    console.error('[NEWSLETTER] Error fetching subscribers:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return NextResponse.json(
      { message: 'Eroare la încărcarea abonaților' },
      { status: 500 }
    )
  }
}
