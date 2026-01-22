import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const connection = await mysql.createConnection(dbUrl)

    // Fetch products
    const [rows] = await connection.execute(
      `SELECT id, name, slug, priceFrom as price, isFeatured, isBestseller FROM Product WHERE isActive = true LIMIT 20`
    )

    await connection.end()

    return NextResponse.json(rows, { status: 200 })
  } catch (error: any) {
    console.error('[Products API] Error:', error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
