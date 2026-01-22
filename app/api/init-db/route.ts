import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

let initCompleted = false

const SQL_SCHEMA = `
-- Categories
CREATE TABLE IF NOT EXISTS \`Category\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL UNIQUE,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`description\` TEXT,
  \`image\` VARCHAR(255),
  \`parentId\` VARCHAR(255),
  \`sortOrder\` INT DEFAULT 0,
  \`isActive\` BOOLEAN DEFAULT TRUE,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS \`Product\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`shortDescription\` TEXT,
  \`longDescription\` TEXT,
  \`categoryId\` VARCHAR(255) NOT NULL,
  \`priceFrom\` FLOAT NOT NULL,
  \`priceType\` VARCHAR(50) DEFAULT 'per_piece',
  \`specs\` JSON,
  \`isFeatured\` BOOLEAN DEFAULT FALSE,
  \`isBestseller\` BOOLEAN DEFAULT FALSE,
  \`isActive\` BOOLEAN DEFAULT TRUE,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`categoryId\`) REFERENCES \`Category\`(\`id\`) ON DELETE CASCADE,
  INDEX idx_categoryId (\`categoryId\`)
);

-- Variants
CREATE TABLE IF NOT EXISTS \`Variant\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`productId\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(255) NOT NULL UNIQUE,
  \`attributes\` JSON,
  \`price\` FLOAT NOT NULL,
  \`stockStatus\` VARCHAR(50) DEFAULT 'in_stock',
  \`stockQty\` INT DEFAULT 9999,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE,
  INDEX idx_productId (\`productId\`)
);

-- Media
CREATE TABLE IF NOT EXISTS \`Media\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`productId\` VARCHAR(255) NOT NULL,
  \`url\` VARCHAR(255) NOT NULL,
  \`alt\` VARCHAR(255),
  \`sortOrder\` INT DEFAULT 0,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE
);

-- CartItem
CREATE TABLE IF NOT EXISTS \`CartItem\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`sessionId\` VARCHAR(255) NOT NULL,
  \`productId\` VARCHAR(255) NOT NULL,
  \`variantId\` VARCHAR(255) NOT NULL,
  \`quantity\` INT DEFAULT 1,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cart (\`sessionId\`, \`productId\`, \`variantId\`),
  FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`variantId\`) REFERENCES \`Variant\`(\`id\`) ON DELETE CASCADE
);

-- Order
CREATE TABLE IF NOT EXISTS \`Order\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`orderNumber\` VARCHAR(255) NOT NULL UNIQUE,
  \`customerName\` VARCHAR(255) NOT NULL,
  \`customerEmail\` VARCHAR(255) NOT NULL,
  \`customerPhone\` VARCHAR(255) NOT NULL,
  \`customerAddress\` VARCHAR(255),
  \`customerCity\` VARCHAR(255),
  \`customerCounty\` VARCHAR(255),
  \`customerPostal\` VARCHAR(20),
  \`message\` TEXT,
  \`estimatedTotal\` FLOAT,
  \`status\` VARCHAR(50) DEFAULT 'pending',
  \`paymentMethod\` VARCHAR(50) DEFAULT 'email_request',
  \`notes\` TEXT,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- OrderItem
CREATE TABLE IF NOT EXISTS \`OrderItem\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`orderId\` VARCHAR(255) NOT NULL,
  \`productId\` VARCHAR(255) NOT NULL,
  \`variantId\` VARCHAR(255) NOT NULL,
  \`quantity\` INT NOT NULL,
  \`price\` FLOAT NOT NULL,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`orderId\`) REFERENCES \`Order\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`),
  FOREIGN KEY (\`variantId\`) REFERENCES \`Variant\`(\`id\`)
);

-- Review
CREATE TABLE IF NOT EXISTS \`Review\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`productId\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255),
  \`rating\` INT DEFAULT 5,
  \`text\` TEXT,
  \`isApproved\` BOOLEAN DEFAULT FALSE,
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE CASCADE
);

-- User
CREATE TABLE IF NOT EXISTS \`User\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(255),
  \`role\` VARCHAR(50) DEFAULT 'admin',
  \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings
CREATE TABLE IF NOT EXISTS \`Settings\` (
  \`id\` VARCHAR(255) PRIMARY KEY,
  \`companyName\` VARCHAR(255) DEFAULT 'Esipca Metalica',
  \`companyAddress\` VARCHAR(255) DEFAULT 'Galati, DN26 Nr 19',
  \`companyPhone\` VARCHAR(255) DEFAULT '+40 (722) 292 519',
  \`companyEmail\` VARCHAR(255) DEFAULT 'office@exprestrading.com',
  \`freeShippingThreshold\` FLOAT DEFAULT 350,
  \`warrantyYears\` INT DEFAULT 30,
  \`deliveryDays\` VARCHAR(50) DEFAULT '1-7',
  \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const secretToken = process.env.INIT_DB_TOKEN || 'change-me-in-production'

  // Security check
  if (token !== secretToken) {
    return NextResponse.json(
      { error: 'Unauthorized - invalid token' },
      { status: 401 }
    )
  }

  // Already completed
  if (initCompleted) {
    return NextResponse.json(
      { message: 'Database already initialized in this process' },
      { status: 200 }
    )
  }

  try {
    console.log('[INIT-DB] Starting database initialization...')

    // Parse DATABASE_URL
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error('DATABASE_URL not set')
    }

    // Connect to MySQL
    const connection = await mysql.createConnection(dbUrl)

    // Create tables
    console.log('[INIT-DB] Creating tables...')
    const statements = SQL_SCHEMA.split(';').filter((s) => s.trim())
    for (const statement of statements) {
      try {
        await connection.execute(statement)
      } catch (err: any) {
        if (!err.message.includes('already exists')) {
          console.error('[INIT-DB] SQL Error:', err.message)
        }
      }
    }

    // Insert category
    console.log('[INIT-DB] Inserting category...')
    try {
      const categoryId = 'cat_sipca_metalica'
      await connection.execute(
        `INSERT INTO Category (id, name, slug, description, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          'Șipcă Metalică',
          'sipca-metalica-galati',
          'Șipcă metalică din oțel zincat DX 51 vopsit în câmp electrostatic. Profile P1-P27 cu diverse culori RAL. Ideală pentru garduri moderne și rezistente.',
          1,
          true,
        ]
      )
    } catch (err: any) {
      console.log('[INIT-DB] Category already exists')
    }

    // Insert products
    console.log('[INIT-DB] Inserting products...')
    const { cuid } = require('@paralleldrive/cuid2')

    const products = [
      { name: 'Șipcă Metalică P1 - 7024 MAT', slug: 'sipca-metalica-p1-7024-mat', price: 2.68, profile: 'P1', color: '7024 Negru', finish: 'Mat', featured: true, bestseller: true },
      { name: 'Șipcă Metalică P2 - Zincat (AL ZN)', slug: 'sipca-metalica-p2-zincat', price: 2.28, profile: 'P2', color: 'Zincat natural', finish: 'Aluminiu-Zinc', featured: false, bestseller: true },
      { name: 'Șipcă Metalică P3 - 8017 MAT', slug: 'sipca-metalica-p3-8017-mat', price: 2.68, profile: 'P3', color: '8017 Maro', finish: 'Mat', featured: false, bestseller: false },
      { name: 'Șipcă Metalică P4 - Stejar (3D)', slug: 'sipca-metalica-p4-stejar', price: 3.23, profile: 'P4', color: 'Stejar (aspect lemn)', finish: '3D Lemn', featured: true, bestseller: false },
      { name: 'Șipcă Metalică P5 - 8019 MAT', slug: 'sipca-metalica-p5-8019-mat', price: 2.68, profile: 'P5', color: '8019 Negru intens', finish: 'Mat', featured: false, bestseller: false },
    ]

    const categoryId = 'cat_sipca_metalica'

    for (const p of products) {
      try {
        const productId = cuid()
        const specs = JSON.stringify({
          profil: p.profile,
          culoare: p.color,
          finisaj: p.finish,
        })

        await connection.execute(
          `INSERT INTO Product (id, name, slug, categoryId, priceFrom, priceType, specs, isFeatured, isBestseller, isActive)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [productId, p.name, p.slug, categoryId, p.price, 'per_piece', specs, p.featured, p.bestseller, true]
        )

        // Insert variant
        const variantId = cuid()
        const attributes = JSON.stringify({
          profil: p.profile,
          culoare: p.color,
          finisaj: p.finish,
        })

        await connection.execute(
          `INSERT INTO Variant (id, productId, sku, attributes, price, stockStatus, stockQty)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [variantId, productId, `${p.slug}-v1`, attributes, p.price, 'in_stock', 9999]
        )
      } catch (err) {
        console.log(`[INIT-DB] Skipped product ${p.slug}`)
      }
    }

    // Insert settings
    console.log('[INIT-DB] Inserting settings...')
    try {
      await connection.execute(
        `INSERT INTO Settings (id, companyName, companyAddress, companyPhone, companyEmail)
         VALUES (?, ?, ?, ?, ?)`,
        ['default', 'Esipca Metalica', 'Galati, DN26 Nr 19', '+40 (722) 292 519', 'office@exprestrading.com']
      )
    } catch (err) {
      console.log('[INIT-DB] Settings already exist')
    }

    await connection.end()

    console.log('[INIT-DB] ✅ Database initialization completed')
    initCompleted = true

    return NextResponse.json(
      {
        success: true,
        message: 'Database initialized successfully with categories and products',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[INIT-DB] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
