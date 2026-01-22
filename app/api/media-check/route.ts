import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import mysql from 'mysql2/promise'

export async function GET() {
  const url = process.env.DATABASE_URL || ''
  const isPostgres = url.startsWith('postgresql://') || url.startsWith('postgres://')

  try {
    if (isPostgres) {
      const pool = new Pool({ connectionString: url })
      const result = await pool.query(`SELECT * FROM "Media" LIMIT 10`)
      await pool.end()
      return NextResponse.json({
        database: 'postgresql',
        mediaCount: result.rows.length,
        media: result.rows
      })
    } else {
      const connection = await mysql.createConnection(url)
      const [rows] = await connection.execute(`SELECT * FROM Media LIMIT 10`)
      await connection.end()
      return NextResponse.json({
        database: 'mysql',
        mediaCount: (rows as any[]).length,
        media: rows
      })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
