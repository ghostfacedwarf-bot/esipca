import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch prices for configurator from database
export async function GET() {
  try {
    // Get representative products for each profile range
    const [p1, p10, p19] = await Promise.all([
      prisma.product.findFirst({
        where: { name: { contains: 'P1 ' } },
        select: { priceFrom: true, discountPercent: true }
      }),
      prisma.product.findFirst({
        where: { name: { contains: 'P10 ' } },
        select: { priceFrom: true, discountPercent: true }
      }),
      prisma.product.findFirst({
        where: { name: { contains: 'P19 ' } },
        select: { priceFrom: true, discountPercent: true }
      }),
    ])

    // Calculate prices with discount applied
    const applyDiscount = (price: number, discount: number) => {
      return Math.round(price * (1 - discount / 100) * 100) / 100
    }

    const prices = {
      'P1-P9': p1 ? applyDiscount(p1.priceFrom, p1.discountPercent) : 5.36,
      'P10-P18': p10 ? applyDiscount(p10.priceFrom, p10.discountPercent) : 6.36,
      'P19-P27': p19 ? applyDiscount(p19.priceFrom, p19.discountPercent) : 5.56,
    }

    return NextResponse.json({ prices })
  } catch (error) {
    console.error('Configurator prices error:', error)
    // Return fallback prices on error
    return NextResponse.json({
      prices: {
        'P1-P9': 5.36,
        'P10-P18': 6.36,
        'P19-P27': 5.56,
      }
    })
  }
}
