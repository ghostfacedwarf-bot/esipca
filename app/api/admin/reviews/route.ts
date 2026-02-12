import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import mysql from 'mysql2/promise'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

async function getDbConnection() {
  return mysql.createConnection(process.env.DATABASE_URL!)
}

// GET - List all reviews with stats
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    connection = await getDbConnection()

    const [rows] = await connection.execute(`
      SELECT r.*, p.name AS productName, p.slug AS productSlug
      FROM \`Review\` r
      LEFT JOIN \`Product\` p ON r.productId = p.id
      ORDER BY r.isApproved ASC, r.createdAt DESC
    `)
    const reviewRows = rows as any[]

    // Map rows to match the previous Prisma response shape
    const reviews = reviewRows.map((row) => ({
      id: row.id,
      productId: row.productId,
      name: row.name,
      email: row.email,
      rating: row.rating,
      text: row.text,
      isApproved: !!row.isApproved,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      product: {
        name: row.productName,
        slug: row.productSlug,
      },
    }))

    const total = reviews.length
    const pending = reviews.filter((r) => !r.isApproved).length
    const approved = reviews.filter((r) => r.isApproved).length
    const avgRating =
      total > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10
          ) / 10
        : 0

    await connection.end()

    return NextResponse.json({
      reviews,
      stats: { total, pending, approved, avgRating },
    })
  } catch (error) {
    console.error('[ADMIN REVIEWS] Error fetching reviews:', error)
    if (connection) {
      await connection.end().catch(() => {})
    }
    return NextResponse.json(
      { message: 'Eroare la incarcarea recenziilor' },
      { status: 500 }
    )
  }
}

// PATCH - Approve or reject a review
const patchSchema = z.object({
  reviewId: z.string().min(1),
  isApproved: z.boolean(),
})

export async function PATCH(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    const body = await request.json()
    const validated = patchSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { reviewId, isApproved } = validated.data

    connection = await getDbConnection()

    await connection.execute(
      `UPDATE \`Review\` SET isApproved = ?, updatedAt = NOW() WHERE id = ?`,
      [isApproved ? 1 : 0, reviewId]
    )

    // Fetch the updated review with product info
    const [rows] = await connection.execute(
      `SELECT r.*, p.name AS productName, p.slug AS productSlug
       FROM \`Review\` r
       LEFT JOIN \`Product\` p ON r.productId = p.id
       WHERE r.id = ?`,
      [reviewId]
    )
    const updatedRows = rows as any[]

    await connection.end()

    if (updatedRows.length === 0) {
      return NextResponse.json(
        { message: 'Recenzia nu a fost gasita' },
        { status: 404 }
      )
    }

    const row = updatedRows[0]
    const updated = {
      id: row.id,
      productId: row.productId,
      name: row.name,
      email: row.email,
      rating: row.rating,
      text: row.text,
      isApproved: !!row.isApproved,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      product: {
        name: row.productName,
        slug: row.productSlug,
      },
    }

    console.log(`[ADMIN REVIEWS] Review ${reviewId} ${isApproved ? 'approved' : 'rejected'}`)

    return NextResponse.json({ review: updated })
  } catch (error) {
    console.error('[ADMIN REVIEWS] Error updating review:', error)
    if (connection) {
      await connection.end().catch(() => {})
    }
    return NextResponse.json(
      { message: 'Eroare la actualizarea recenziei' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a review
const deleteSchema = z.object({
  reviewId: z.string().min(1),
})

export async function DELETE(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    const body = await request.json()
    const validated = deleteSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { reviewId } = validated.data

    connection = await getDbConnection()

    await connection.execute(
      `DELETE FROM \`Review\` WHERE id = ?`,
      [reviewId]
    )

    await connection.end()

    console.log(`[ADMIN REVIEWS] Review ${reviewId} deleted`)

    return NextResponse.json({ message: 'Recenzia a fost stearsa' })
  } catch (error) {
    console.error('[ADMIN REVIEWS] Error deleting review:', error)
    if (connection) {
      await connection.end().catch(() => {})
    }
    return NextResponse.json(
      { message: 'Eroare la stergerea recenziei' },
      { status: 500 }
    )
  }
}
