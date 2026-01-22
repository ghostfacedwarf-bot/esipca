/**
 * Database helper that supports both PostgreSQL (local) and MySQL (Hostinger)
 * Automatically detects which database to use based on DATABASE_URL
 */

import mysql from 'mysql2/promise'

// Detect database type from URL
function getDatabaseType(): 'postgresql' | 'mysql' {
  const url = process.env.DATABASE_URL || ''
  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    return 'postgresql'
  }
  return 'mysql'
}

// PostgreSQL pool (reused across requests) - lazy loaded
let pgPool: any = null

async function getPgPool() {
  if (!pgPool) {
    // Dynamic import to avoid loading pg on MySQL environments
    const { Pool } = await import('pg')
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  return pgPool
}

// MySQL connection
async function getMysqlConnection() {
  return mysql.createConnection(process.env.DATABASE_URL || '')
}

export async function getProductBySlug(slug: string) {
  const dbType = getDatabaseType()

  try {
    if (dbType === 'postgresql') {
      const pool = await getPgPool()

      // Get product
      const productResult = await pool.query(
        `SELECT p.*, c.name as "categoryName", c.slug as "categorySlug"
         FROM "Product" p
         LEFT JOIN "Category" c ON p."categoryId" = c.id
         WHERE p.slug = $1 AND p."isActive" = true`,
        [slug]
      )

      const product = productResult.rows[0]
      if (!product) return null

      // Get variants
      const variantsResult = await pool.query(
        `SELECT * FROM "Variant" WHERE "productId" = $1`,
        [product.id]
      )

      // Get media
      const mediaResult = await pool.query(
        `SELECT * FROM "Media" WHERE "productId" = $1 ORDER BY "sortOrder" ASC`,
        [product.id]
      )

      // Get reviews
      const reviewsResult = await pool.query(
        `SELECT * FROM "Review" WHERE "productId" = $1 AND "isApproved" = true`,
        [product.id]
      )

      return {
        ...product,
        specs: product.specs || null,
        category: {
          id: product.categoryId,
          name: product.categoryName,
          slug: product.categorySlug,
        },
        variants: variantsResult.rows.map((v: any) => ({
          ...v,
          attributes: v.attributes || null,
        })),
        media: mediaResult.rows,
        reviews: reviewsResult.rows,
      }
    } else {
      // MySQL
      const connection = await getMysqlConnection()

      const [products] = await connection.execute(
        `SELECT p.*, c.name as categoryName, c.slug as categorySlug
         FROM Product p
         LEFT JOIN Category c ON p.categoryId = c.id
         WHERE p.slug = ? AND p.isActive = true`,
        [slug]
      )

      const product = (products as any[])[0]
      if (!product) {
        await connection.end()
        return null
      }

      const [variants] = await connection.execute(
        `SELECT * FROM Variant WHERE productId = ?`,
        [product.id]
      )

      const [media] = await connection.execute(
        `SELECT * FROM Media WHERE productId = ? ORDER BY sortOrder ASC`,
        [product.id]
      )

      const [reviews] = await connection.execute(
        `SELECT * FROM Review WHERE productId = ? AND isApproved = true`,
        [product.id]
      )

      await connection.end()

      return {
        ...product,
        specs: product.specs ? JSON.parse(product.specs) : null,
        category: {
          id: product.categoryId,
          name: product.categoryName,
          slug: product.categorySlug,
        },
        variants: (variants as any[]).map((v) => ({
          ...v,
          attributes: v.attributes ? JSON.parse(v.attributes) : null,
        })),
        media: media as any[],
        reviews: reviews as any[],
      }
    }
  } catch (error) {
    console.error('[DB] Error fetching product:', error)
    return null
  }
}

export async function getAllProducts() {
  const dbType = getDatabaseType()

  try {
    if (dbType === 'postgresql') {
      const pool = await getPgPool()

      const result = await pool.query(
        `SELECT p.*, c.name as "categoryName",
         (SELECT json_agg(sub) FROM (SELECT * FROM "Media" m WHERE m."productId" = p.id ORDER BY m."sortOrder") sub) as media
         FROM "Product" p
         LEFT JOIN "Category" c ON p."categoryId" = c.id
         WHERE p."isActive" = true
         ORDER BY p."createdAt" DESC`
      )

      return result.rows.map((p: any) => ({
        ...p,
        specs: p.specs || null,
        category: { name: p.categoryName },
        media: p.media || [],
      }))
    } else {
      // MySQL
      const connection = await getMysqlConnection()

      const [products] = await connection.execute(
        `SELECT p.*, c.name as categoryName
         FROM Product p
         LEFT JOIN Category c ON p.categoryId = c.id
         WHERE p.isActive = true
         ORDER BY p.createdAt DESC`
      )

      // Get media for all products
      const productIds = (products as any[]).map(p => p.id)
      let mediaMap: Record<string, any[]> = {}

      if (productIds.length > 0) {
        const [allMedia] = await connection.execute(
          `SELECT * FROM Media WHERE productId IN (${productIds.map(() => '?').join(',')}) ORDER BY sortOrder ASC`,
          productIds
        )

        for (const m of allMedia as any[]) {
          if (!mediaMap[m.productId]) mediaMap[m.productId] = []
          mediaMap[m.productId].push(m)
        }
      }

      await connection.end()

      return (products as any[]).map((p) => ({
        ...p,
        specs: p.specs ? JSON.parse(p.specs) : null,
        category: { name: p.categoryName },
        media: mediaMap[p.id] || [],
      }))
    }
  } catch (error) {
    console.error('[DB] Error fetching products:', error)
    return []
  }
}

export async function getCategories() {
  const dbType = getDatabaseType()

  try {
    if (dbType === 'postgresql') {
      const pool = await getPgPool()

      const result = await pool.query(
        `SELECT * FROM "Category" WHERE "isActive" = true ORDER BY "sortOrder" ASC`
      )

      return result.rows
    } else {
      // MySQL
      const connection = await getMysqlConnection()

      const [categories] = await connection.execute(
        `SELECT * FROM Category WHERE isActive = true ORDER BY sortOrder ASC`
      )

      await connection.end()
      return categories as any[]
    }
  } catch (error) {
    console.error('[DB] Error fetching categories:', error)
    return []
  }
}
