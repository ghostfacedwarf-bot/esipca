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
    const connection = await getDbConnection()

    // Fetch products with category
    const [productRows] = await connection.execute(`
      SELECT p.*, c.id as catId, c.name as catName
      FROM \`Product\` p
      LEFT JOIN \`Category\` c ON p.categoryId = c.id
      ORDER BY p.createdAt DESC
    `)
    const products = productRows as any[]

    // Fetch all variants
    const [variantRows] = await connection.execute(`
      SELECT * FROM \`Variant\` ORDER BY productId, sku
    `)
    const variants = variantRows as any[]

    // Fetch first media for each product (ordered by sortOrder)
    const [mediaRows] = await connection.execute(`
      SELECT m1.* FROM \`Media\` m1
      INNER JOIN (
        SELECT productId, MIN(sortOrder) as minSort
        FROM \`Media\`
        GROUP BY productId
      ) m2 ON m1.productId = m2.productId AND m1.sortOrder = m2.minSort
    `)
    const mediaList = mediaRows as any[]

    // Also fetch ALL media for each product (for the editor modal)
    const [allMediaRows] = await connection.execute(`
      SELECT * FROM \`Media\` ORDER BY productId, sortOrder ASC
    `)
    const allMedia = allMediaRows as any[]

    await connection.end()

    // Build media maps
    const firstMediaMap: Record<string, any> = {}
    for (const m of mediaList) {
      firstMediaMap[m.productId] = m
    }

    const allMediaMap: Record<string, any[]> = {}
    for (const m of allMedia) {
      if (!allMediaMap[m.productId]) allMediaMap[m.productId] = []
      allMediaMap[m.productId].push(m)
    }

    // Build variants map
    const variantsMap: Record<string, any[]> = {}
    for (const v of variants) {
      if (!variantsMap[v.productId]) variantsMap[v.productId] = []
      // Parse JSON attributes
      let attributes = v.attributes
      if (typeof attributes === 'string') {
        try { attributes = JSON.parse(attributes) } catch { attributes = {} }
      }
      variantsMap[v.productId].push({ ...v, attributes })
    }

    // Assemble products
    const result = products.map((p) => {
      // Parse JSON specs
      let specs = p.specs
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs) } catch { specs = {} }
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        priceFrom: p.priceFrom,
        discountPercent: p.discountPercent || 0,
        priceType: p.priceType,
        specs,
        isFeatured: !!p.isFeatured,
        isBestseller: !!p.isBestseller,
        isActive: !!p.isActive,
        category: { id: p.catId, name: p.catName },
        variants: variantsMap[p.id] || [],
        media: allMediaMap[p.id] || [],
      }
    })

    // Sort by profile number (P1, P2, ... P27)
    result.sort((a, b) => getProfileNumber(a.name) - getProfileNumber(b.name))

    return NextResponse.json({ products: result })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Zod schema for product updates
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

    const connection = await getDbConnection()

    // Build SET clause dynamically
    const setClauses: string[] = []
    const params: any[] = []

    if (name !== undefined) { setClauses.push('name = ?'); params.push(name) }
    if (slug !== undefined) { setClauses.push('slug = ?'); params.push(slug) }
    if (shortDescription !== undefined) { setClauses.push('shortDescription = ?'); params.push(shortDescription) }
    if (longDescription !== undefined) { setClauses.push('longDescription = ?'); params.push(longDescription) }
    if (discountPercent !== undefined) { setClauses.push('discountPercent = ?'); params.push(discountPercent) }
    if (priceType !== undefined) { setClauses.push('priceType = ?'); params.push(priceType) }
    if (specs !== undefined) { setClauses.push('specs = ?'); params.push(JSON.stringify(specs)) }
    if (isFeatured !== undefined) { setClauses.push('isFeatured = ?'); params.push(isFeatured) }
    if (isBestseller !== undefined) { setClauses.push('isBestseller = ?'); params.push(isBestseller) }
    if (isActive !== undefined) { setClauses.push('isActive = ?'); params.push(isActive) }

    // Update priceFrom
    const newPriceFrom = variantPrice ?? priceFrom
    if (newPriceFrom !== undefined) {
      setClauses.push('priceFrom = ?')
      params.push(newPriceFrom)
    }

    if (setClauses.length > 0) {
      params.push(productId)
      await connection.execute(
        `UPDATE \`Product\` SET ${setClauses.join(', ')} WHERE id = ?`,
        params
      )
    }

    // If price changed, update all variant prices
    if (newPriceFrom !== undefined) {
      const [variantRows] = await connection.execute(
        'SELECT id, attributes FROM `Variant` WHERE productId = ?',
        [productId]
      )
      const variants = variantRows as any[]

      for (const variant of variants) {
        let attributes = variant.attributes
        if (typeof attributes === 'string') {
          try { attributes = JSON.parse(attributes) } catch { attributes = {} }
        }
        if (!attributes?.inaltime) continue

        // Extract height value (e.g., "1.0 m" -> 1.0)
        const heightMatch = attributes.inaltime.match(/^([\d.]+)/)
        const height = heightMatch ? parseFloat(heightMatch[1]) : 1.0

        // Calculate base price for this height
        let variantBasePrice = newPriceFrom * height

        // Add paint option surcharge
        const paintOption = attributes.optiune_vopsea || ''
        if (paintOption.includes('mat față / mat spate') || paintOption.includes('mat fata / mat spate')) {
          variantBasePrice += 0.30 * height
        } else if (paintOption.includes('ambele părți') || paintOption.includes('ambele parti')) {
          variantBasePrice += 0.10 * height
        }

        const newPrice = Math.round(variantBasePrice * 100) / 100
        const newPriceEU = Math.round(newPrice * 2 * 100) / 100

        await connection.execute(
          'UPDATE `Variant` SET price = ?, priceEU = ? WHERE id = ?',
          [newPrice, newPriceEU, variant.id]
        )
      }

      console.log(`[Admin] Updated ${variants.length} variant prices for product ${productId}`)
    }

    await connection.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
