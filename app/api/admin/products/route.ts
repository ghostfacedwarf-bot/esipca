import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Extract profile number from product name (e.g., "Șipcă Metalică P12 - ..." => 12)
function getProfileNumber(name: string): number {
  const match = name.match(/P(\d+)/)
  return match ? parseInt(match[1], 10) : 999
}

// Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { id: true, name: true },
        },
        variants: true,
        media: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    })

    // Sort by profile number (P1, P2, ... P27)
    products.sort((a, b) => getProfileNumber(a.name) - getProfileNumber(b.name))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Update product
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      name,
      slug,
      shortDescription,
      longDescription,
      priceFrom,
      priceType,
      variantPrice,
      specs,
      isFeatured,
      isBestseller,
      isActive,
    } = body

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
    }

    // Build update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription
    if (longDescription !== undefined) updateData.longDescription = longDescription
    if (priceFrom !== undefined) updateData.priceFrom = priceFrom
    if (priceType !== undefined) updateData.priceType = priceType
    if (specs !== undefined) updateData.specs = specs
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (isBestseller !== undefined) updateData.isBestseller = isBestseller
    if (isActive !== undefined) updateData.isActive = isActive

    // Update priceFrom if variantPrice is provided (this is the main display price)
    if (variantPrice !== undefined) {
      updateData.priceFrom = variantPrice
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
