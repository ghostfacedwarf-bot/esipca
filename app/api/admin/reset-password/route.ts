import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import { createId } from '@paralleldrive/cuid2'

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const secretToken = process.env.INIT_DB_TOKEN

  if (!secretToken || token !== secretToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD not set in env' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    const connection = await mysql.createConnection(process.env.DATABASE_URL!)

    // Check if user exists
    const [rows] = await connection.execute(
      'SELECT id FROM `User` WHERE email = ? LIMIT 1',
      [adminEmail]
    )
    const users = rows as Array<{ id: string }>

    if (users.length > 0) {
      await connection.execute(
        'UPDATE `User` SET password = ? WHERE id = ?',
        [hashedPassword, users[0].id]
      )
      await connection.end()
      return NextResponse.json({ success: true, message: `Password reset for ${adminEmail}` })
    }

    // Create user if not exists
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await connection.execute(
      'INSERT INTO `User` (id, email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [createId(), adminEmail, hashedPassword, 'Administrator', 'admin', now, now]
    )
    await connection.end()

    return NextResponse.json({ success: true, message: `User created: ${adminEmail}` })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
