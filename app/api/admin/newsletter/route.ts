import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mysql from 'mysql2/promise'
import { sendNewsletter } from '@/lib/email'

async function getConnection() {
  return mysql.createConnection(process.env.DATABASE_URL || '')
}

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

// GET - List all subscribers
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection: mysql.Connection | null = null

  try {
    connection = await getConnection()

    const [subscribers] = await connection.execute(
      'SELECT id, email, name, isActive, subscribedAt, unsubscribedAt FROM NewsletterSubscriber ORDER BY subscribedAt DESC'
    )

    await connection.end()

    const rows = subscribers as any[]

    return NextResponse.json({
      subscribers: rows,
      total: rows.length,
      active: rows.filter((r: any) => r.isActive).length,
    })
  } catch (error) {
    console.error('[ADMIN NEWSLETTER] Error fetching subscribers:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return NextResponse.json(
      { message: 'Eroare la incarcarea abonalilor' },
      { status: 500 }
    )
  }
}

// DELETE - Unsubscribe a subscriber
export async function DELETE(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection: mysql.Connection | null = null

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ message: 'ID abonat lipseste' }, { status: 400 })
    }

    connection = await getConnection()

    await connection.execute(
      'UPDATE NewsletterSubscriber SET isActive = false, unsubscribedAt = NOW() WHERE id = ?',
      [id]
    )

    await connection.end()

    console.log(`[ADMIN NEWSLETTER] Subscriber ${id} unsubscribed manually`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN NEWSLETTER] Error unsubscribing:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return NextResponse.json(
      { message: 'Eroare la dezabonare' },
      { status: 500 }
    )
  }
}

// POST - Send newsletter to all active subscribers
export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection: mysql.Connection | null = null

  try {
    const { subject, content, design } = await request.json()

    if (!subject?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: 'Subiectul si continutul sunt obligatorii' },
        { status: 400 }
      )
    }

    connection = await getConnection()

    const [subscribers] = await connection.execute(
      'SELECT email, name FROM NewsletterSubscriber WHERE isActive = true'
    )

    await connection.end()

    const rows = subscribers as any[]

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Nu exista abonati activi' },
        { status: 400 }
      )
    }

    const result = await sendNewsletter(subject.trim(), content.trim(), rows, design)

    console.log(`[ADMIN NEWSLETTER] Newsletter sent: ${result.sent}/${result.total} successful`)

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      total: result.total,
    })
  } catch (error) {
    console.error('[ADMIN NEWSLETTER] Error sending newsletter:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return NextResponse.json(
      { message: 'Eroare la trimiterea newsletter-ului' },
      { status: 500 }
    )
  }
}
