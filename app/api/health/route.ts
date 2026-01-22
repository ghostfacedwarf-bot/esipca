import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  const status: any = {
    timestamp: new Date().toISOString(),
    app: 'running',
    database: 'checking...',
    errors: [],
  }

  try {
    // Check environment
    if (!process.env.DATABASE_URL) {
      status.errors.push('DATABASE_URL not set')
      return NextResponse.json(status, { status: 500 })
    }

    // Try to connect to database
    try {
      const connection = await mysql.createConnection(process.env.DATABASE_URL)

      // Check if products table exists and has data
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Product')
      const count = (rows as any[])[0]?.count || 0

      status.database = {
        connected: true,
        productsCount: count,
        tables: {
          product: count > 0 ? '✅' : '⚠️ (empty)',
        },
      }

      await connection.end()
    } catch (dbError: any) {
      status.database = {
        connected: false,
        error: dbError.message,
      }
      status.errors.push(`Database error: ${dbError.message}`)
    }

    return NextResponse.json(status, { status: 200 })
  } catch (error: any) {
    status.errors.push(error.message)
    return NextResponse.json(status, { status: 500 })
  }
}
