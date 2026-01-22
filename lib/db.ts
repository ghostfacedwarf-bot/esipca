/**
 * Direct MySQL database helper
 * Replaces Prisma for simpler, more reliable queries on shared hosting
 */

import mysql from 'mysql2/promise'

let connectionPromise: Promise<mysql.Connection> | null = null

async function getConnection() {
  if (!connectionPromise) {
    connectionPromise = mysql.createConnection(process.env.DATABASE_URL || '')
  }
  return connectionPromise
}

export async function getProductBySlug(slug: string) {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL || '')

    // Get product
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

    // Get variants
    const [variants] = await connection.execute(
      `SELECT * FROM Variant WHERE productId = ?`,
      [product.id]
    )

    // Get media
    const [media] = await connection.execute(
      `SELECT * FROM Media WHERE productId = ? ORDER BY sortOrder ASC`,
      [product.id]
    )

    // Get reviews
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
  } catch (error) {
    console.error('[DB] Error fetching product:', error)
    return null
  }
}

export async function getAllProducts() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL || '')

    const [products] = await connection.execute(
      `SELECT p.*, c.name as categoryName
       FROM Product p
       LEFT JOIN Category c ON p.categoryId = c.id
       WHERE p.isActive = true
       ORDER BY p.createdAt DESC`
    )

    await connection.end()

    return (products as any[]).map((p) => ({
      ...p,
      specs: p.specs ? JSON.parse(p.specs) : null,
      category: { name: p.categoryName },
    }))
  } catch (error) {
    console.error('[DB] Error fetching products:', error)
    return []
  }
}

export async function getCategories() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL || '')

    const [categories] = await connection.execute(
      `SELECT * FROM Category WHERE isActive = true ORDER BY sortOrder ASC`
    )

    await connection.end()
    return categories as any[]
  } catch (error) {
    console.error('[DB] Error fetching categories:', error)
    return []
  }
}
