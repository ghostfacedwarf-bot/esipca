import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

// GET - Fetch approved reviews for a product
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json(
      { message: 'productId este obligatoriu' },
      { status: 400 }
    )
  }

  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const totalCount = reviews.length
    const averageRating =
      totalCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
        : 0

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalCount,
    })
  } catch (error) {
    console.error('[REVIEWS] Error fetching reviews:', error)
    return NextResponse.json(
      { message: 'Eroare la incarcarea recenziilor' },
      { status: 500 }
    )
  }
}

// POST - Submit a new review (pending moderation)
const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, 'Numele trebuie sa aiba cel putin 2 caractere'),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(5, 'Recenzia trebuie sa aiba cel putin 5 caractere'),
  email: z.string().email('Email invalid').optional().or(z.literal('')),
})

export async function POST(request: NextRequest) {
  // Rate limit
  const ip = getClientIp(request)
  const rateLimitResult = rateLimit(`reviews:${ip}`, RATE_LIMITS.reviews)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Prea multe recenzii trimise. Incercati din nou mai tarziu.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const validated = reviewSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { productId, name, rating, text, email } = validated.data

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produsul nu a fost gasit' },
        { status: 404 }
      )
    }

    await prisma.review.create({
      data: {
        productId,
        name,
        rating,
        text,
        email: email || null,
        isApproved: false,
      },
    })

    return NextResponse.json({
      message: 'Recenzia a fost trimisa cu succes si va fi afisata dupa aprobare.',
    })
  } catch (error) {
    console.error('[REVIEWS] Error creating review:', error)
    return NextResponse.json(
      { message: 'Eroare la trimiterea recenziei' },
      { status: 500 }
    )
  }
}
