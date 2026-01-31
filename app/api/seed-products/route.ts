import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { v4 as uuid } from 'uuid'

const ALL_PRODUCTS = [
  { name: 'Șipcă Metalică P1 - 7024 MAT', slug: 'sipca-metalica-p1-7024-mat', price: 2.68, profile: 'P1', color: '7024 Negru', finish: 'Mat', featured: true, bestseller: true },
  { name: 'Șipcă Metalică P10 - 7024 MAT', slug: 'sipca-metalica-p10-7024-mat', price: 3.18, profile: 'P10', color: '7024 Negru', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P11 - 5010 LUCIOS', slug: 'sipca-metalica-p11-5010-lucios', price: 2.93, profile: 'P11', color: '5010 Albastru', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P12 - 8017 MAT', slug: 'sipca-metalica-p12-8017-mat', price: 3.18, profile: 'P12', color: '8017 Maro', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P14 - 8019 MAT', slug: 'sipca-metalica-p14-8019-mat', price: 3.33, profile: 'P14', color: '8019 Negru intens', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P15 - 3011 LUCIOS', slug: 'sipca-metalica-p15-3011-lucios', price: 2.88, profile: 'P15', color: '3011 Roșu-maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P16 - 8017 LUCIOS', slug: 'sipca-metalica-p16-8017-lucios', price: 2.88, profile: 'P16', color: '8017 Maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P17 - 8004 MAT', slug: 'sipca-metalica-p17-8004-mat', price: 3.18, profile: 'P17', color: '8004 Negru pur', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P18 - 9005 MAT', slug: 'sipca-metalica-p18-9005-mat', price: 3.18, profile: 'P18', color: '9005 Negru profund', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P19 - 7024 MAT', slug: 'sipca-metalica-p19-7024-mat', price: 2.78, profile: 'P19', color: '7024 Negru', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P2 - Zincat (AL ZN)', slug: 'sipca-metalica-p2-zincat', price: 2.28, profile: 'P2', color: 'Zincat natural', finish: 'Aluminiu-Zinc', featured: false, bestseller: true },
  { name: 'Șipcă Metalică P20 - Zincat (AL ZN)', slug: 'sipca-metalica-p20-zincat', price: 2.38, profile: 'P20', color: 'Zincat natural', finish: 'Aluminiu-Zinc', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P3 - 8017 MAT', slug: 'sipca-metalica-p3-8017-mat', price: 2.68, profile: 'P3', color: '8017 Maro', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P5 - 8019 MAT', slug: 'sipca-metalica-p5-8019-mat', price: 2.68, profile: 'P5', color: '8019 Negru intens', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P6 - 3011 LUCIOS', slug: 'sipca-metalica-p6-3011-lucios', price: 2.43, profile: 'P6', color: '3011 Roșu-maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P7 - 8017 LUCIOS', slug: 'sipca-metalica-p7-8017-lucios', price: 2.43, profile: 'P7', color: '8017 Maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P8 - 8004 MAT', slug: 'sipca-metalica-p8-8004-mat', price: 2.68, profile: 'P8', color: '8004 Negru pur', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P9 - 9005 MAT', slug: 'sipca-metalica-p9-9005-mat', price: 2.68, profile: 'P9', color: '9005 Negru profund', finish: 'Mat', featured: true, bestseller: false },
  { name: 'Șipcă Metalică P21 - 8017 MAT', slug: 'sipca-metalica-p21-8017-mat', price: 2.78, profile: 'P21', color: '8017 Maro', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P23 - 8019 MAT', slug: 'sipca-metalica-p23-8019-mat', price: 2.93, profile: 'P23', color: '8019 Negru intens', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P24 - 3011 LUCIOS', slug: 'sipca-metalica-p24-3011-lucios', price: 2.53, profile: 'P24', color: '3011 Roșu-maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P25 - 8017 LUCIOS', slug: 'sipca-metalica-p25-8017-lucios', price: 2.53, profile: 'P25', color: '8017 Maro', finish: 'Lucios', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P26 - 8004 MAT', slug: 'sipca-metalica-p26-8004-mat', price: 2.78, profile: 'P26', color: '8004 Negru pur', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P27 - 9005 MAT', slug: 'sipca-metalica-p27-9005-mat', price: 2.93, profile: 'P27', color: '9005 Negru profund', finish: 'Mat', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P4 - Stejar (3D)', slug: 'sipca-metalica-p4-stejar', price: 3.23, profile: 'P4', color: 'Stejar (aspect lemn)', finish: '3D Lemn', featured: true, bestseller: false },
  { name: 'Șipcă Metalică P13 - Stejar (3D)', slug: 'sipca-metalica-p13-stejar', price: 3.58, profile: 'P13', color: 'Stejar (aspect lemn)', finish: '3D Lemn', featured: false, bestseller: false },
  { name: 'Șipcă Metalică P22 - Stejar (3D)', slug: 'sipca-metalica-p22-stejar', price: 3.33, profile: 'P22', color: 'Stejar (aspect lemn)', finish: '3D Lemn', featured: false, bestseller: false },
]

export async function GET(request: NextRequest) {
  // Security: Only allow with valid token from environment
  const token = request.nextUrl.searchParams.get('token')
  const seedToken = process.env.SEED_PRODUCTS_TOKEN

  if (!seedToken || token !== seedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Security: Only allow in development or with explicit production override
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED_IN_PRODUCTION !== 'true') {
    return NextResponse.json({ error: 'Seed disabled in production' }, { status: 403 })
  }

  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL || '')

    // Get category ID
    const [categories] = await connection.execute(`SELECT id FROM Category LIMIT 1`)
    let categoryId = (categories as any[])[0]?.id

    if (!categoryId) {
      // Create category
      categoryId = uuid()
      await connection.execute(
        `INSERT INTO Category (id, name, slug, description, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?)`,
        [categoryId, 'Șipcă Metalică', 'sipca-metalica-galati', 'Șipcă metalică din oțel zincat', 1, true]
      )
    }

    let added = 0
    let skipped = 0

    for (const p of ALL_PRODUCTS) {
      try {
        const productId = uuid()
        const shortDesc = `${p.profile} - Culoare ${p.color} - Finisaj ${p.finish}`
        const specs = JSON.stringify({ profil: p.profile, culoare: p.color, finisaj: p.finish })

        await connection.execute(
          `INSERT INTO Product (id, name, slug, shortDescription, categoryId, priceFrom, priceType, specs, isFeatured, isBestseller, isActive)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [productId, p.name, p.slug, shortDesc, categoryId, p.price, 'per_meter', specs, p.featured, p.bestseller, true]
        )

        // Add variant
        const variantId = uuid()
        await connection.execute(
          `INSERT INTO Variant (id, productId, sku, attributes, price, stockStatus, stockQty)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [variantId, productId, `${p.slug}-v1`, specs, p.price, 'in_stock', 9999]
        )

        added++
      } catch (err: any) {
        if (err.message.includes('Duplicate')) {
          skipped++
        } else {
          console.error(`Error adding ${p.slug}:`, err.message)
        }
      }
    }

    await connection.end()

    return NextResponse.json({
      success: true,
      added,
      skipped,
      total: ALL_PRODUCTS.length,
      message: `Added ${added} products, skipped ${skipped} (already exist)`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
