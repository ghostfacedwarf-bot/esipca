const { PrismaClient } = require('@prisma/client')
const bcryptjs = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting FINAL database seed with ALL products from production...')

  // Clear existing data
  await prisma.cartItem.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.media.deleteMany({})
  await prisma.variant.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.settings.deleteMany({})

  // Create admin user
  const hashedPassword = await bcryptjs.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@esipcametalica.ro',
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin',
    },
  })
  console.log('✓ Admin user created')

  // Create settings
  await prisma.settings.create({
    data: {
      id: 'default',
      companyName: 'Esipca Metalica',
      companyAddress: 'Galati, DN26 Nr 19',
      companyPhone: '+40 (722) 292 519',
      companyEmail: 'clienti@metalfence.ro',
      freeShippingThreshold: 350,
      warrantyYears: 30,
      deliveryDays: '1-7',
    },
  })
  console.log('✓ Settings created')

  // Create categories - ONLY SIPCA METALICA
  const cat_sipca = await prisma.category.create({
    data: {
      name: 'Șipcă Metalică',
      slug: 'sipca-metalica-galati',
      description: 'Șipcă metalică din oțel zincat DX 51 vopsit în câmp electrostatic. Profile P1-P27 cu diverse culori RAL. Ideală pentru garduri moderne și rezistente.',
      sortOrder: 1,
      isActive: true,
    },
  })
  console.log('✓ 1 Category created (Șipcă Metalică)')

  // ========== SIPCA METALICA - ALL 27 PRODUCTS ==========
  // Template description for all sipca products
  const sipcaDescription = `Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Disponibilă în profile variate, culori RAL diverse (mat/lucios/3D lemn). Garanție 30 ani, transport gratuit, retur 30 zile.`

  const sipcaProducts = [
    // PAGE 1 - Products 1-12
    { name: 'Șipcă Metalică P1 - 7024 MAT', slug: 'sipca-metalica-p1-7024-mat', price: 2.68, originalPrice: 2.83, profile: 'P1', color: '7024 Negru', finish: 'Mat', isFeatured: true, isBestseller: true },
    { name: 'Șipcă Metalică P10 - 7024 MAT', slug: 'sipca-metalica-p10-7024-mat', price: 3.18, originalPrice: 3.33, profile: 'P10', color: '7024 Negru', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P11 - 5010 LUCIOS', slug: 'sipca-metalica-p11-5010-lucios', price: 2.93, originalPrice: 3.08, profile: 'P11', color: '5010 Albastru', finish: 'Lucios', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P12 - 8017 MAT', slug: 'sipca-metalica-p12-8017-mat', price: 3.18, originalPrice: 3.33, profile: 'P12', color: '8017 Maro', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P14 - 8019 MAT', slug: 'sipca-metalica-p14-8019-mat', price: 3.33, originalPrice: 3.48, profile: 'P14', color: '8019 Negru intens', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P15 - 3011 LUCIOS', slug: 'sipca-metalica-p15-3011-lucios', price: 2.88, originalPrice: 3.03, profile: 'P15', color: '3011 Roșu-maro', finish: 'Lucios', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P16 - 8017 LUCIOS', slug: 'sipca-metalica-p16-8017-lucios', price: 2.88, originalPrice: 3.03, profile: 'P16', color: '8017 Maro', finish: 'Lucios', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P17 - 8004 MAT', slug: 'sipca-metalica-p17-8004-mat', price: 3.18, originalPrice: 3.33, profile: 'P17', color: '8004 Negru pur', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P18 - 9005 MAT', slug: 'sipca-metalica-p18-9005-mat', price: 3.18, originalPrice: 3.33, profile: 'P18', color: '9005 Negru profund', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P19 - 7024 MAT', slug: 'sipca-metalica-p19-7024-mat', price: 2.78, originalPrice: 2.93, profile: 'P19', color: '7024 Negru', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P2 - Zincat (AL ZN)', slug: 'sipca-metalica-p2-zincat', price: 2.28, originalPrice: 2.43, profile: 'P2', color: 'Zincat natural', finish: 'Aluminiu-Zinc', isFeatured: false, isBestseller: true },
    { name: 'Șipcă Metalică P20 - Zincat (AL ZN)', slug: 'sipca-metalica-p20-zincat', price: 2.38, originalPrice: 2.53, profile: 'P20', color: 'Zincat natural', finish: 'Aluminiu-Zinc', isFeatured: false, isBestseller: false },
    // PAGE 2 - Products 13-24
    { name: 'Șipcă Metalică P3 - 8017 MAT', slug: 'sipca-metalica-p3-8017-mat', price: 2.68, originalPrice: 2.83, profile: 'P3', color: '8017 Maro', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P5 - 8019 MAT', slug: 'sipca-metalica-p5-8019-mat', price: 2.68, originalPrice: 2.83, profile: 'P5', color: '8019 Negru intens', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P6 - 3011 LUCIOS', slug: 'sipca-metalica-p6-3011-lucios', price: 2.43, originalPrice: 2.58, profile: 'P6', color: '3011 Roșu-maro', finish: 'Lucios', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P7 - 8017 LUCIOS', slug: 'sipca-metalica-p7-8017-lucios', price: 2.43, originalPrice: 2.58, profile: 'P7', color: '8017 Maro', finish: 'Lucios', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P8 - 8004 MAT', slug: 'sipca-metalica-p8-8004-mat', price: 2.68, originalPrice: 2.83, profile: 'P8', color: '8004 Negru pur', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P9 - 9005 MAT', slug: 'sipca-metalica-p9-9005-mat', price: 2.68, originalPrice: 2.83, profile: 'P9', color: '9005 Negru profund', finish: 'Mat', isFeatured: true, isBestseller: false },
    { name: 'Șipcă Metalică P21 - 8017 MAT', slug: 'sipca-metalica-p21-8017-mat', price: 2.78, originalPrice: 2.93, profile: 'P21', color: '8017 Maro', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P23 - 8019 MAT', slug: 'sipca-metalica-p23-8019-mat', price: 2.93, originalPrice: 3.08, profile: 'P23', color: '8019 Negru intens', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P24 - 3011 LUCIOS', slug: 'sipca-metalica-p24-3011-lucios', price: 2.53, originalPrice: 2.68, profile: 'P24', color: '3011 Roșu-maro', finish: 'Lucios', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P25 - 8017 LUCIOS', slug: 'sipca-metalica-p25-8017-lucios', price: 2.53, originalPrice: 2.68, profile: 'P25', color: '8017 Maro', finish: 'Lucios', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P26 - 8004 MAT', slug: 'sipca-metalica-p26-8004-mat', price: 2.78, originalPrice: 2.93, profile: 'P26', color: '8004 Negru pur', finish: 'Mat', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P27 - 9005 MAT', slug: 'sipca-metalica-p27-9005-mat', price: 2.93, originalPrice: 3.08, profile: 'P27', color: '9005 Negru profund', finish: 'Mat', isFeatured: false, isBestseller: false },
    // PAGE 3 - 3D Wood Imitation Products 25-27
    { name: 'Șipcă Metalică P4 - Stejar (3D)', slug: 'sipca-metalica-p4-stejar', price: 3.23, originalPrice: 3.38, profile: 'P4', color: 'Stejar (aspect lemn)', finish: '3D Lemn', isFeatured: true, isBestseller: false },
    { name: 'Șipcă Metalică P13 - Stejar (3D)', slug: 'sipca-metalica-p13-stejar', price: 3.58, originalPrice: 3.73, profile: 'P13', color: 'Stejar (aspect lemn)', finish: '3D Lemn', isFeatured: false, isBestseller: false },
    { name: 'Șipcă Metalică P22 - Stejar (3D)', slug: 'sipca-metalica-p22-stejar', price: 3.33, originalPrice: 3.48, profile: 'P22', color: 'Stejar (aspect lemn)', finish: '3D Lemn', isFeatured: false, isBestseller: false },
  ]

  const createdSipcaProducts = await Promise.all(
    sipcaProducts.map((p) =>
      prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          shortDescription: `${p.profile} - Culoare ${p.color} - Finisaj ${p.finish}`,
          longDescription: sipcaDescription.replace('Culoare RAL', `Culoare: ${p.color} - Finisaj: ${p.finish}`),
          categoryId: cat_sipca.id,
          priceFrom: p.price,
          priceType: 'per_meter',
          specs: {
            material: 'Tablă zincată DX 51',
            profil: p.profile,
            culoare: p.color,
            grosime: '0.45 mm',
            latime: '9 cm',
            finisaj: p.finish,
            bucinPerMetru: '10',
          },
          isFeatured: p.isFeatured,
          isBestseller: p.isBestseller,
          isActive: true,
        },
      })
    )
  )
  console.log(`✓ 27 Șipcă Metalică products created`)

  const allProducts = [...createdSipcaProducts]

  // Create variants
  let variantCount = 0

  // Heights for Șipcă Metalică - 0.6m to 3.0m
  const heights = ['0.6 m', '0.8 m', '1.0 m', '1.2 m', '1.5 m', '1.8 m', '2.0 m', '2.4 m', '3.0 m']
  const heightMultipliers = {
    '0.6 m': 0.6,
    '0.8 m': 0.8,
    '1.0 m': 1.0,
    '1.2 m': 1.2,
    '1.5 m': 1.5,
    '1.8 m': 1.8,
    '2.0 m': 2.0,
    '2.4 m': 2.4,
    '3.0 m': 3.0,
  }

  for (const p of createdSipcaProducts) {
    for (const height of heights) {
      const multiplier = heightMultipliers[height as keyof typeof heightMultipliers] || 1.0
      const variantPrice = parseFloat((p.priceFrom * multiplier).toFixed(2))

      await prisma.variant.create({
        data: {
          productId: p.id,
          sku: `${p.slug}-${height.replace(' ', '')}`,
          attributes: { inaltime: height },
          price: variantPrice,
          stockStatus: 'in_stock',
          stockQty: 9999,
        },
      })
      variantCount++
    }
  }

  console.log(`✓ ${variantCount} variants created`)

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        productId: createdSipcaProducts[0].id,
        name: 'Ion Popescu',
        email: 'ion@exemplu.ro',
        rating: 5,
        text: 'Șipcă de foarte bună calitate! Perfect pentru gardul meu. Recomand cu încredere!',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: createdSipcaProducts[8].id,
        name: 'Gheorghe Mărgărit',
        email: 'gheorghe@exemplu.ro',
        rating: 5,
        text: 'Livrare rapidă, produsul corespunde perfect descrisului. Mulțumesc pentru profesionalism!',
        isApproved: true,
      },
    }),
  ])
  console.log('✓ 2 reviews created')

  console.log('\n✅ DATABASE SEED COMPLETED!')
  console.log(`\n📊 SUMMARY:`)
  console.log(`   • Șipcă Metalică: ${createdSipcaProducts.length} produse (P1-P27)`)
  console.log(`   ────────────────────────────────────────`)
  console.log(`   TOTAL: ${allProducts.length} PRODUSE`)
  console.log(`   + ${variantCount} Variante`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
