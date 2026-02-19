import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Temporary data export endpoint - protected by INIT_DB_TOKEN
// DELETE THIS FILE AFTER MIGRATION

const TABLES = [
  'User',
  'Category',
  'Product',
  'Variant',
  'Media',
  'CartItem',
  '`Order`',
  'OrderItem',
  'Review',
  'Settings',
  'Chat',
  'ChatMessage',
  'NewsletterSubscriber',
]

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (token !== process.env.INIT_DB_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const table = request.nextUrl.searchParams.get('table')
  if (!table || !TABLES.includes(table)) {
    return NextResponse.json({ tables: TABLES })
  }

  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!)
    const [rows] = await conn.execute(`SELECT * FROM ${table}`)
    await conn.end()
    return NextResponse.json({ table, count: (rows as unknown[]).length, data: rows })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
