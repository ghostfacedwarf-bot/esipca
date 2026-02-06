import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

// Extract profile number from product name (e.g., "Șipcă Metalică P12 - ..." => 12)
function getProfileNumber(name: string): number {
  const match = name.match(/P(\d+)/)
  return match ? parseInt(match[1], 10) : 999
}

// Get all products
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }

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

// Zod schema for product updates - prevents mass assignment
const productUpdateSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  shortDescription: z.string().max(1000).nullable().optional(),
  longDescription: z.string().max(10000).nullable().optional(),
  priceFrom: z.number().min(0).max(100000).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  priceType: z.enum(['per_piece', 'per_meter']).optional(),
  variantPrice: z.number().min(0).max(100000).optional(),
  specs: z.record(z.unknown()).nullable().optional(),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

// Update product
export async function PATCH(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = productUpdateSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const {
      productId,
      name,
      slug,
      shortDescription,
      longDescription,
      priceFrom,
      discountPercent,
      priceType,
      variantPrice,
      specs,
      isFeatured,
      isBestseller,
      isActive,
    } = validated.data

    // Build update data - only allowed fields
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription
    if (longDescription !== undefined) updateData.longDescription = longDescription
    if (priceFrom !== undefined) updateData.priceFrom = priceFrom
    if (discountPercent !== undefined) updateData.discountPercent = discountPercent
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

    // If price changed, update all variant prices
    const newPriceFrom = variantPrice ?? priceFrom
    if (newPriceFrom !== undefined) {
      // Get all variants for this product
      const variants = await prisma.variant.findMany({
        where: { productId },
      })

      // Update each variant's price based on height and paint option
      for (const variant of variants) {
        const attributes = variant.attributes as Record<string, string> | null
        if (!attributes?.inaltime) continue

        // Extract height value (e.g., "1.0 m" -> 1.0)
        const heightMatch = attributes.inaltime.match(/^([\d.]+)/)
        const height = heightMatch ? parseFloat(heightMatch[1]) : 1.0

        // Calculate base price for this height
        let variantBasePrice = newPriceFrom * height

        // Add paint option surcharge if applicable
        const paintOption = attributes.optiune_vopsea || ''
        if (paintOption.includes('mat față / mat spate') || paintOption.includes('mat fata / mat spate')) {
          // MAT double-sided: +0.30 per height meter
          variantBasePrice += 0.30 * height
        } else if (paintOption.includes('ambele părți') || paintOption.includes('ambele parti')) {
          // LUCIOS double-sided: +0.10 per height meter
          variantBasePrice += 0.10 * height
        }

        // Round to 2 decimals
        const newPrice = Math.round(variantBasePrice * 100) / 100
        const newPriceEU = Math.round(newPrice * 2 * 100) / 100

        // Update variant
        await prisma.variant.update({
          where: { id: variant.id },
          data: {
            price: newPrice,
            priceEU: newPriceEU,
          },
        })
      }

      console.log(`[Admin] Updated ${variants.length} variant prices for product ${productId}`)
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
