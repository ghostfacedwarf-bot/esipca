import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

async function getConnection() {
  return mysql.createConnection(process.env.DATABASE_URL || '')
}

// GET - Unsubscribe via link in email (one-click)
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return new NextResponse(
      '<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h1>Link invalid</h1><p>Emailul lipseste din link.</p></body></html>',
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  let connection: mysql.Connection | null = null

  try {
    connection = await getConnection()

    await connection.execute(
      'UPDATE NewsletterSubscriber SET isActive = false, unsubscribedAt = NOW() WHERE email = ? AND isActive = true',
      [email]
    )

    await connection.end()

    console.log(`[NEWSLETTER] Unsubscribed via link: ${email}`)

    return new NextResponse(
      `<html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="font-family:'Segoe UI',sans-serif;text-align:center;padding:60px 20px;background:#f3f4f6">
        <div style="max-width:400px;margin:0 auto;background:white;border-radius:12px;padding:40px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
          <h1 style="color:#1f2937;font-size:24px">Dezabonare reusita</h1>
          <p style="color:#6b7280;font-size:15px">Adresa <strong>${email}</strong> a fost dezabonata de la newsletter.</p>
          <p style="color:#9ca3af;font-size:13px;margin-top:20px">Ne pare rau ca pleci. Poti reveni oricand pe site-ul nostru.</p>
          <a href="/" style="display:inline-block;margin-top:20px;padding:10px 24px;background:#C0392B;color:white;border-radius:8px;text-decoration:none;font-weight:600">Inapoi la site</a>
        </div>
      </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  } catch (error) {
    console.error('[NEWSLETTER] Unsubscribe error:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return new NextResponse(
      '<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h1>Eroare</h1><p>A aparut o eroare. Incercati din nou.</p></body></html>',
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}
