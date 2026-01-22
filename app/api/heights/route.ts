import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    const result = await pool.query(
      `SELECT DISTINCT attributes->>'inaltime' as height
       FROM "Variant"
       WHERE attributes->>'inaltime' IS NOT NULL
       ORDER BY (attributes->>'inaltime')::text`
    )

    await pool.end()

    const heights = result.rows.map((r: any) => r.height).filter(Boolean)

    return NextResponse.json({
      count: heights.length,
      heights: heights,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
