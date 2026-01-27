const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixMediaUrls() {
  console.log('Fixing P16 and P17 media URLs...')

  // Fix P16
  const p16Product = await prisma.product.findUnique({
    where: { slug: 'sipca-metalica-p16-8017-lucios' },
    include: { media: true }
  })

  if (p16Product) {
    // Delete existing media for P16
    await prisma.media.deleteMany({
      where: { productId: p16Product.id }
    })

    // Add correct media
    await prisma.media.create({
      data: {
        productId: p16Product.id,
        url: '/images/products/Sipca Metalica P16 8017 LUCIOS.jpg',
        alt: p16Product.name,
        sortOrder: 0
      }
    })
    console.log('✅ Fixed P16 media URL')
  } else {
    console.log('⚠️ P16 product not found')
  }

  // Fix P17
  const p17Product = await prisma.product.findUnique({
    where: { slug: 'sipca-metalica-p17-8004-mat' },
    include: { media: true }
  })

  if (p17Product) {
    // Delete existing media for P17
    await prisma.media.deleteMany({
      where: { productId: p17Product.id }
    })

    // Add correct media
    await prisma.media.create({
      data: {
        productId: p17Product.id,
        url: '/images/products/Sipca Metalica P17 8004 MAT.jpg',
        alt: p17Product.name,
        sortOrder: 0
      }
    })
    console.log('✅ Fixed P17 media URL')
  } else {
    console.log('⚠️ P17 product not found')
  }

  console.log('\n✅ Done!')
}

fixMediaUrls()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
