import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import prisma from '@/lib/prisma'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

// GET - List all reviews with stats
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: {
          select: { name: true, slug: true },
        },
      },
      orderBy: [
        { isApproved: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    const total = reviews.length
    const pending = reviews.filter((r) => !r.isApproved).length
    const approved = reviews.filter((r) => r.isApproved).length
    const avgRating =
      total > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10
          ) / 10
        : 0

    return NextResponse.json({
      reviews,
      stats: { total, pending, approved, avgRating },
    })
  } catch (error) {
    console.error('[ADMIN REVIEWS] Error fetching reviews:', error)
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

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
      include: {
        product: { select: { name: true, slug: true } },
      },
    })

    console.log(`[ADMIN REVIEWS] Review ${reviewId} ${isApproved ? 'approved' : 'rejected'}`)

    return NextResponse.json({ review: updated })
  } catch (error) {
    console.error('[ADMIN REVIEWS] Error updating review:', error)
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

    await prisma.review.delete({
      where: { id: reviewId },
    })

    console.log(`[ADMIN REVIEWS] Review ${reviewId} deleted`)

    return NextResponse.json({ message: 'Recenzia a fost stearsa' })
  } catch (error) {
    console.error('[ADMIN REVIEWS] Error deleting review:', error)
    return NextResponse.json(
      { message: 'Eroare la stergerea recenziei' },
      { status: 500 }
    )
  }
}
