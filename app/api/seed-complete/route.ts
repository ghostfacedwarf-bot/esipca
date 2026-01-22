import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { v4 as uuid } from 'uuid'

// Template description for all sipca products
const sipcaDescription = `Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Disponibilă în profile variate, culori RAL diverse (mat/lucios/3D lemn). Garanție 30 ani, transport gratuit, retur 30 zile.`

const ALL_PRODUCTS = [
  // PAGE 1 - Products 1-12
  { name: 'Șipcă Metalică P1 - 7024 MAT', slug: 'sipca-metalica-p1-7024-mat', price: 2.68, originalPrice: 2.83, profile: 'P1', color: '7024 Negru', finish: 'Mat', featured: true, bestseller: true },
  { name: 'Șipcă Metalică P10 - 7024 MAT', slug: 'sipca-metalica-p10-7024-mat', price: 3.18, originalPrice: 3.33, profile: 'P10', color: '7024 Negru', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P11 - 5010 LUCIOS', slug: 'sipca-metalica-p11-5010-lucios', price: 2.93, originalPrice: 3.08, profile: 'P11', color: '5010 Albastru', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P12 - 8017 MAT', slug: 'sipca-metalica-p12-8017-mat', price: 3.18, originalPrice: 3.33, profile: 'P12', color: '8017 Maro', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P14 - 8019 MAT', slug: 'sipca-metalica-p14-8019-mat', price: 3.33, originalPrice: 3.48, profile: 'P14', color: '8019 Negru intens', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P15 - 3011 LUCIOS', slug: 'sipca-metalica-p15-3011-lucios', price: 2.88, originalPrice: 3.03, profile: 'P15', color: '3011 Roșu-maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P16 - 8017 LUCIOS', slug: 'sipca-metalica-p16-8017-lucios', price: 2.88, originalPrice: 3.03, profile: 'P16', color: '8017 Maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P17 - 8004 MAT', slug: 'sipca-metalica-p17-8004-mat', price: 3.18, originalPrice: 3.33, profile: 'P17', color: '8004 Negru pur', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P18 - 9005 MAT', slug: 'sipca-metalica-p18-9005-mat', price: 3.18, originalPrice: 3.33, profile: 'P18', color: '9005 Negru profund', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P19 - 7024 MAT', slug: 'sipca-metalica-p19-7024-mat', price: 2.78, originalPrice: 2.93, profile: 'P19', color: '7024 Negru', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P2 - Zincat (AL ZN)', slug: 'sipca-metalica-p2-zincat', price: 2.28, originalPrice: 2.43, profile: 'P2', color: 'Zincat natural', finish: 'Aluminiu-Zinc', featured: false, bestseller: true },
  { name: 'Șipcă Metalică P20 - Zincat (AL ZN)', slug: 'sipca-metalica-p20-zincat', price: 2.38, originalPrice: 2.53, profile: 'P20', color: 'Zincat natural', finish: 'Aluminiu-Zinc', featured: false, bestseller: false },
  // PAGE 2 - Products 13-24
  { name: 'Șipcă Metalică P3 - 8017 MAT', slug: 'sipca-metalica-p3-8017-mat', price: 2.68, originalPrice: 2.83, profile: 'P3', color: '8017 Maro', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P5 - 8019 MAT', slug: 'sipca-metalica-p5-8019-mat', price: 2.68, originalPrice: 2.83, profile: 'P5', color: '8019 Negru intens', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P6 - 3011 LUCIOS', slug: 'sipca-metalica-p6-3011-lucios', price: 2.43, originalPrice: 2.58, profile: 'P6', color: '3011 Roșu-maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P7 - 8017 LUCIOS', slug: 'sipca-metalica-p7-8017-lucios', price: 2.43, originalPrice: 2.58, profile: 'P7', color: '8017 Maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P8 - 8004 MAT', slug: 'sipca-metalica-p8-8004-mat', price: 2.68, originalPrice: 2.83, profile: 'P8', color: '8004 Negru pur', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P9 - 9005 MAT', slug: 'sipca-metalica-p9-9005-mat', price: 2.68, originalPrice: 2.83, profile: 'P9', color: '9005 Negru profund', finish: 'Mat', featured: true, bestseller: false },
  { name: 'Șipcă Metalică P21 - 8017 MAT', slug: 'sipca-metalica-p21-8017-mat', price: 2.78, originalPrice: 2.93, profile: 'P21', color: '8017 Maro', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P23 - 8019 MAT', slug: 'sipca-metalica-p23-8019-mat', price: 2.93, originalPrice: 3.08, profile: 'P23', color: '8019 Negru intens', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P24 - 3011 LUCIOS', slug: 'sipca-metalica-p24-3011-lucios', price: 2.53, originalPrice: 2.68, profile: 'P24', color: '3011 Roșu-maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P25 - 8017 LUCIOS', slug: 'sipca-metalica-p25-8017-lucios', price: 2.53, originalPrice: 2.68, profile: 'P25', color: '8017 Maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P26 - 8004 MAT', slug: 'sipca-metalica-p26-8004-mat', price: 2.78, originalPrice: 2.93, profile: 'P26', color: '8004 Negru pur', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P27 - 9005 MAT', slug: 'sipca-metalica-p27-9005-mat', price: 2.93, originalPrice: 3.08, profile: 'P27', color: '9005 Negru profund', finish: 'Mat', featured: false, bestseller: false },
  // PAGE 3 - 3D Wood Imitation Products 25-27
  { name: 'Șipcă Metalică P4 - Stejar (3D)', slug: 'sipca-metalica-p4-stejar', price: 3.23, originalPrice: 3.38, profile: 'P4', color: 'Stejar (aspect lemn)', finish: '3D Lemn', featured: true, bestseller: false },
  { name: 'Șipcă Metalică P13 - Stejar (3D)', slug: 'sipca-metalica-p13-stejar', price: 3.58, originalPrice: 3.73, profile: 'P13', color: 'Stejar (aspect lemn)', finish: '3D Lemn', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P22 - Stejar (3D)', slug: 'sipca-metalica-p22-stejar', price: 3.33, originalPrice: 3.48, profile: 'P22', color: 'Stejar (aspect lemn)', finish: '3D Lemn', featured: false, bestseller: false },
]

// Heights for Șipcă Metalică - 0.6m to 3.0m with 0.1m increments (25 heights)
const HEIGHTS = [
  '0.6 m', '0.7 m', '0.8 m', '0.9 m', '1.0 m',
  '1.1 m', '1.2 m', '1.3 m', '1.4 m', '1.5 m',
  '1.6 m', '1.7 m', '1.8 m', '1.9 m', '2.0 m',
  '2.1 m', '2.2 m', '2.3 m', '2.4 m', '2.5 m',
  '2.6 m', '2.7 m', '2.8 m', '2.9 m', '3.0 m'
]
const HEIGHT_MULTIPLIERS: Record<string, number> = {
  '0.6 m': 0.6, '0.7 m': 0.7, '0.8 m': 0.8, '0.9 m': 0.9, '1.0 m': 1.0,
  '1.1 m': 1.1, '1.2 m': 1.2, '1.3 m': 1.3, '1.4 m': 1.4, '1.5 m': 1.5,
  '1.6 m': 1.6, '1.7 m': 1.7, '1.8 m': 1.8, '1.9 m': 1.9, '2.0 m': 2.0,
  '2.1 m': 2.1, '2.2 m': 2.2, '2.3 m': 2.3, '2.4 m': 2.4, '2.5 m': 2.5,
  '2.6 m': 2.6, '2.7 m': 2.7, '2.8 m': 2.8, '2.9 m': 2.9, '3.0 m': 3.0,
}

// Product images mapping (slug -> image filename)
const PRODUCT_IMAGES: Record<string, string> = {
  'sipca-metalica-p1-7024-mat': 'Sipca Metalica P1 7024 MAT.jpg',
  'sipca-metalica-p2-zincat': 'Sipca Metalica P2 Zincat.jpg',
  'sipca-metalica-p3-8017-mat': 'Sipca Metalica P3 8017 MAT.jpg',
  'sipca-metalica-p4-stejar': 'Sipca Metalica P4 Stejar.jpg',
  'sipca-metalica-p5-8019-mat': 'Sipca Metalica P5 8019 MAT.jpg',
  'sipca-metalica-p6-3011-lucios': 'Sipca Metalica P6 3011 LUCIOS.jpg',
  'sipca-metalica-p7-8017-lucios': 'Sipca Metalica P7 8017 LUCIOS.jpg',
  'sipca-metalica-p8-8004-mat': 'Sipca Metalica P8 8004 MAT.jpg',
  'sipca-metalica-p9-9005-mat': 'Sipca Metalica P9 9005 MAT.jpg',
  'sipca-metalica-p10-7024-mat': 'Sipca Metalica P10 7024 MAT.jpg',
  'sipca-metalica-p11-5010-lucios': 'Sipca Metalica P11 5010 LUCIOS.jpg',
  'sipca-metalica-p12-8017-mat': 'Sipca Metalica P12 8017 MAT.jpg',
  'sipca-metalica-p13-stejar': 'Sipca Metalica P13 Stejar.jpg',
  'sipca-metalica-p14-8019-mat': 'Sipca Metalica P14 8019 MAT.jpg',
  'sipca-metalica-p15-3011-lucios': 'Sipca Metalica P15 3011 LUCIOS.jpg',
  'sipca-metalica-p16-8017-lucios': 'Sipca Metalica P16 8017 LUCIOS.jpg',
  'sipca-metalica-p17-8004-mat': 'Sipca Metalica P17 8004 MAT.jpg',
  'sipca-metalica-p18-9005-mat': 'Sipca Metalica P18 9005 MAT.jpg',
  'sipca-metalica-p19-7024-mat': 'Sipca Metalica P19 7024 MAT.jpg',
  'sipca-metalica-p20-zincat': 'Sipca Metalica P20 Zincat.jpg',
  'sipca-metalica-p21-8017-mat': 'Sipca Metalica P21 8017 MAT.jpg',
  'sipca-metalica-p22-stejar': 'Sipca Metalica P22 Stejar.jpg',
  'sipca-metalica-p23-8019-mat': 'Sipca Metalica P23 8019 MAT.jpg',
  'sipca-metalica-p24-3011-lucios': 'Sipca Metalica P24 3011 LUCIOS.jpg',
  'sipca-metalica-p25-8017-lucios': 'Sipca Metalica P25 8017 LUCIOS.jpg',
  'sipca-metalica-p26-8004-mat': 'Sipca Metalica P26 8004 MAT.jpg',
  'sipca-metalica-p27-9005-mat': 'Sipca Metalica P27 9005 MAT.jpg',
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (token !== 'seed-complete-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL || '')

    // Step 1: Delete existing data in correct order (foreign key constraints)
    console.log('Deleting existing data...')
    await connection.execute(`DELETE FROM Review`)
    await connection.execute(`DELETE FROM Variant`)
    await connection.execute(`DELETE FROM Media`)
    await connection.execute(`DELETE FROM Product`)

    // Step 2: Get or create category
    const [categories] = await connection.execute(`SELECT id FROM Category WHERE slug = 'sipca-metalica-galati' LIMIT 1`)
    let categoryId = (categories as any[])[0]?.id

    if (!categoryId) {
      categoryId = uuid()
      await connection.execute(
        `INSERT INTO Category (id, name, slug, description, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          'Șipcă Metalică',
          'sipca-metalica-galati',
          'Șipcă metalică din oțel zincat DX 51 vopsit în câmp electrostatic. Profile P1-P27 cu diverse culori RAL. Ideală pentru garduri moderne și rezistente.',
          1,
          true
        ]
      )
    }

    let productsAdded = 0
    let variantsAdded = 0
    let reviewsAdded = 0
    let mediaAdded = 0
    const productIds: string[] = []
    const productSlugToId: Record<string, string> = {}

    // Step 3: Add all products with complete data
    for (const p of ALL_PRODUCTS) {
      const productId = uuid()
      productIds.push(productId)
      productSlugToId[p.slug] = productId

      const shortDesc = `${p.profile} - Culoare ${p.color} - Finisaj ${p.finish}`
      const longDesc = sipcaDescription.replace('Culoare RAL', `Culoare: ${p.color} - Finisaj: ${p.finish}`)

      // Complete specs matching seed-final.ts
      const specs = JSON.stringify({
        material: 'Tablă zincată DX 51',
        profil: p.profile,
        culoare: p.color,
        grosime: '0.45 mm',
        latime: '9 cm',
        finisaj: p.finish,
        bucinPerMetru: '10',
      })

      await connection.execute(
        `INSERT INTO Product (id, name, slug, shortDescription, longDescription, categoryId, priceFrom, priceType, specs, isFeatured, isBestseller, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [productId, p.name, p.slug, shortDesc, longDesc, categoryId, p.price, 'per_meter', specs, p.featured, p.bestseller, true]
      )
      productsAdded++

      // Step 4: Add 9 height variants for each product
      for (const height of HEIGHTS) {
        const variantId = uuid()
        const multiplier = HEIGHT_MULTIPLIERS[height] || 1.0
        const variantPrice = parseFloat((p.price * multiplier).toFixed(2))
        const variantAttributes = JSON.stringify({ inaltime: height })

        await connection.execute(
          `INSERT INTO Variant (id, productId, sku, attributes, price, stockStatus, stockQty)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [variantId, productId, `${p.slug}-${height.replace(' ', '')}`, variantAttributes, variantPrice, 'in_stock', 9999]
        )
        variantsAdded++
      }
    }

    // Step 5: Add media for each product
    for (const [slug, filename] of Object.entries(PRODUCT_IMAGES)) {
      const productId = productSlugToId[slug]
      if (productId) {
        const mediaId = uuid()
        const product = ALL_PRODUCTS.find(p => p.slug === slug)
        await connection.execute(
          `INSERT INTO Media (id, productId, url, alt, sortOrder) VALUES (?, ?, ?, ?, ?)`,
          [mediaId, productId, `/images/products/${filename}`, product?.name || slug, 0]
        )
        mediaAdded++
      }
    }

    // Step 6: Add reviews (to first and 9th product like in seed-final.ts)
    if (productIds.length > 0) {
      const reviewId1 = uuid()
      await connection.execute(
        `INSERT INTO Review (id, productId, name, email, rating, text, isApproved)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [reviewId1, productIds[0], 'Ion Popescu', 'ion@exemplu.ro', 5, 'Șipcă de foarte bună calitate! Perfect pentru gardul meu. Recomand cu încredere!', true]
      )
      reviewsAdded++
    }

    if (productIds.length > 8) {
      const reviewId2 = uuid()
      await connection.execute(
        `INSERT INTO Review (id, productId, name, email, rating, text, isApproved)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [reviewId2, productIds[8], 'Gheorghe Mărgărit', 'gheorghe@exemplu.ro', 5, 'Livrare rapidă, produsul corespunde perfect descrisului. Mulțumesc pentru profesionalism!', true]
      )
      reviewsAdded++
    }

    await connection.end()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with complete data!',
      summary: {
        products: productsAdded,
        variants: variantsAdded,
        media: mediaAdded,
        reviews: reviewsAdded,
        variantsPerProduct: HEIGHTS.length,
        heights: HEIGHTS,
      },
    })
  } catch (error: any) {
    if (connection) {
      await connection.end()
    }
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
