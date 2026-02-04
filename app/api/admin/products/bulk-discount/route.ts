import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Apply bulk discount to all products
export async function POST(request: NextRequest) {
  try {
    const { discountPercent } = await request.json()

    if (discountPercent === undefined || discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json(
        { error: 'Reducerea trebuie să fie între 0 și 100%' },
        { status: 400 }
      )
    }

    // Update all products with the new discount
    const result = await prisma.product.updateMany({
      data: {
        discountPercent: discountPercent,
      },
    })

    console.log(`[Admin] Applied ${discountPercent}% discount to ${result.count} products`)

    return NextResponse.json({
      success: true,
      updatedCount: result.count,
      discountPercent,
    })
  } catch (error) {
    console.error('Bulk discount error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
