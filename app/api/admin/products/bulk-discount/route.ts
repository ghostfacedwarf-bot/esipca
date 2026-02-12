import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mysql from 'mysql2/promise'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

// POST - Apply bulk discount to all products
export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }

  try {
    const { discountPercent } = await request.json()

    if (discountPercent === undefined || discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json(
        { error: 'Reducerea trebuie să fie între 0 și 100%' },
        { status: 400 }
      )
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL!)

    const [result] = await connection.execute(
      'UPDATE `Product` SET discountPercent = ?',
      [discountPercent]
    ) as any

    await connection.end()

    const updatedCount = result.affectedRows || 0
    console.log(`[Admin] Applied ${discountPercent}% discount to ${updatedCount} products`)

    return NextResponse.json({
      success: true,
      updatedCount,
      discountPercent,
    })
  } catch (error) {
    console.error('Bulk discount error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
