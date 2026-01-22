const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function addProductMedia() {
  console.log('📸 Adding product images...')

  // Path to products folder
  const productsImageDir = path.join(__dirname, '../public/images/products')

  // Check if directory exists
  if (!fs.existsSync(productsImageDir)) {
    console.log('❌ Products folder not found at:', productsImageDir)
    return
  }

  // Read all image files
  const imageFiles = fs.readdirSync(productsImageDir).filter((file) => {
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
  })

  console.log(`Found ${imageFiles.length} images`)

  let addedCount = 0

  for (const imageFile of imageFiles) {
    // Convert image filename to slug format
    // Example: "Sipca Metalica P1 7024 MAT.jpg" -> "sipca-metalica-p1-7024-mat"
    const nameWithoutExt = imageFile.replace(/\.[^/.]+$/, '')
    const slug = nameWithoutExt
      .toLowerCase()
      .replace(/ă/g, 'a')
      .replace(/ș/g, 's')
      .replace(/ț/g, 't')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    console.log(`Processing: ${imageFile} -> ${slug}`)

    // Find product by slug
    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: { media: true },
    })

    if (!product) {
      console.log(`  ⚠️  Product not found for slug: ${slug}`)
      continue
    }

    // Check if media already exists
    const existingMedia = product.media.some((m) => m.url.includes(imageFile))
    if (existingMedia) {
      console.log(`  ℹ️  Media already exists for this product`)
      continue
    }

    // Add media
    const imageUrl = `/images/products/${imageFile}`
    await prisma.media.create({
      data: {
        productId: product.id,
        url: imageUrl,
        alt: product.name,
        sortOrder: product.media.length,
      },
    })

    console.log(`  ✅ Added image: ${imageUrl}`)
    addedCount++
  }

  console.log(`\n✅ COMPLETED! Added ${addedCount} product images`)
}

addProductMedia()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
