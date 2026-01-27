const { PrismaClient } = require('@prisma/client')
const bcryptjs = require('bcryptjs')

const prisma = new PrismaClient()

// Calculate EU price: RO price x 2 (dublu)
function calculateEUPrice(roPrice: number): number {
  return Math.round(roPrice * 2 * 100) / 100
}

async function main() {
  console.log('🌱 Starting database seed with COMPLETE product data...')

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
  const admin = await prisma.user.create({
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
      companyEmail: 'office@exprestrading.com',
      freeShippingThreshold: 350,
      warrantyYears: 30,
      deliveryDays: '1-7',
    },
  })
  console.log('✓ Settings created')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Șipcă Metalică',
        slug: 'sipca-metalica-galati',
        description: 'Șipcă metalică din oțel zincat DX 51 vopsit în câmp electrostatic. Profile P1-P9 cu diverse culori RAL. Ideală pentru garduri moderne și rezistente.',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tablă Cutată Galvanizată',
        slug: 'tabla-zincata-producator',
        description: 'Tablă cutată din oțel galvanizat în grosimi de 0.14-0.40mm. Disponibilă în culori galvanizate, roșu RAL 3011 și maro RAL 8017. Pentru acoperiș și pereți.',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Țiglă Metalică',
        slug: 'tigla-metalica',
        description: 'Țiglă metalică cu aspect tradițional sau modern. Vopsire în câmp electrostatic cu protecție poliester.',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sistem Pluvial',
        slug: 'sistem-pluvial',
        description: 'Sisteme complete de jgheaburi și țevi de scurgere din oțel galvanizat.',
        sortOrder: 4,
        isActive: true,
      },
    }),
  ])
  console.log('✓ Categories created')

  // ========== SIPCA METALICA PRODUCTS (P1-P9) ==========
  const sipcaProducts = await Promise.all([
    // P1 - Negru
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P1 - 7024 MAT (Negru)',
        slug: 'sipca-metalica-p1-7024-mat',
        shortDescription: 'Șipcă P1 din oțel zincat DX 51, vopsit în culoare negru RAL 7024, finisaj mat',
        longDescription: `Șipcă metalică P1 7024 MAT - profil modern cu două crestături și vârf semi-rotunjit.

Material: Tablă zincată DX 51 – vopsită în câmp electrostatic cu protecție poliester lucios
Grosime: 0.45 mm
Lățime: 9 cm
Culoare: Negru RAL 7024, finisaj mat
Înălțime disponibilă: 0.50m - 3.00m (personalizabil)
Instalare: 10 bucăți per metru liniar

Caracteristici:
- Garanție 30 de ani
- Rezistent la coroziune
- Livrare gratuită în toată România
- 30 zile drept de retur
- Stoc disponibil`,
        categoryId: categories[0].id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P1',
          culoare: 'Negru RAL 7024',
          grosime: '0.45 mm',
          latime: '9 cm',
          finisaj: 'Mat',
          bucinPerMetru: '10',
        },
        isFeatured: true,
        isBestseller: true,
        isActive: true,
      },
    }),
    // P2 - Zincat
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P2 - Zincat (AL ZN)',
        slug: 'sipca-metalica-p2-al-zn',
        shortDescription: 'Șipcă P2 din oțel zincat natural, protecție naturală',
        longDescription: `Șipcă metalică P2 AL ZN - profil cu protecție naturală din aluminiu și zinc.

Material: Tablă zincată DX 51
Grosime: 0.45 mm
Lățime: 9 cm
Culoare: Zincat natural (Argintiu)
Înălțime disponibilă: 0.50m - 3.00m
Instalare: 10 bucăți per metru liniar

Caracteristici:
- Protecție naturală AL-ZN (aluminiu-zinc)
- Garanție 30 de ani
- Aspect clasic metalic
- Ideal pentru garduri moderne minimaliste`,
        categoryId: categories[0].id,
        priceFrom: 2.28,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P2',
          culoare: 'Zincat natural',
          grosime: '0.45 mm',
          latime: '9 cm',
          finisaj: 'Zincat',
        },
        isFeatured: false,
        isBestseller: true,
        isActive: true,
      },
    }),
    // P3 - Gri Antracit
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P3 - 8017 MAT (Gri Antracit)',
        slug: 'sipca-metalica-p3-8017-mat',
        shortDescription: 'Șipcă P3 gri antracit, finisaj mat elegant',
        longDescription: `Șipcă metalică P3 8017 MAT - culoare gri antracit sofisticată.

Material: Tablă zincată DX 51 – vopsită în câmp electrostatic
Grosime: 0.45 mm
Culoare: Gri antracit RAL 8017, finisaj mat
Înălțime disponibilă: 0.50m - 3.00m

Caracteristici:
- Aspect elegant și modern
- Rezistență pe termen lung la coroziune
- Combinație perfectă cu peisajul`,
        categoryId: categories[0].id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P3',
          culoare: 'Gri antracit RAL 8017',
          grosime: '0.45 mm',
          finisaj: 'Mat',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // P4 - Stejar
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P4 - Stejar (Decor lemn)',
        slug: 'sipca-metalica-p4-stejar',
        shortDescription: 'Șipcă P4 cu aspect de stejar, decor prem ium',
        longDescription: `Șipcă metalică P4 Stejar - imită culoare și aspect lemnului de stejar.

Material: Tablă zincată DX 51 cu decor
Grosime: 0.45 mm
Culoare: Stejar (aspect lemn)
Finisaj: Lustruit cu efect 3D

Caracteristici:
- Efect decorativ premium
- Aspect cald și invitator
- Perfect pentru garduri elegante
- Durabil ca metalul, aspect ca lemnul`,
        categoryId: categories[0].id,
        priceFrom: 3.23,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51 cu decor',
          profil: 'P4',
          culoare: 'Stejar',
          finisaj: 'Lustruit',
        },
        isFeatured: true,
        isBestseller: false,
        isActive: true,
      },
    }),
    // P5 - Negru intens
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P5 - 8019 MAT (Negru intens)',
        slug: 'sipca-metalica-p5-8019-mat',
        shortDescription: 'Șipcă P5 negru intens, design modern',
        longDescription: `Șipcă metalică P5 8019 MAT - negru intens cu finisaj mat.

Material: Tablă zincată DX 51
Grosime: 0.45 mm
Culoare: Negru intens RAL 8019, finisaj mat
Înălțime disponibilă: 0.50m - 3.00m

Caracteristici:
- Aspect modern și sofisticat
- Negru profund și elegant
- Perfect pentru design contemporan`,
        categoryId: categories[0].id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P5',
          culoare: 'Negru intens RAL 8019',
          finisaj: 'Mat',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // P6 - Roșu
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P6 - 3011 LUCIOS (Roșu-maro)',
        slug: 'sipca-metalica-p6-3011-lucios',
        shortDescription: 'Șipcă P6 roșu-maro lustruit, aspect cald clasic',
        longDescription: `Șipcă metalică P6 3011 LUCIOS - culoare roșu-maro clasică.

Material: Tablă zincată DX 51
Grosime: 0.45 mm
Culoare: Roșu-maro RAL 3011, finisaj lustruit
Finisaj: Lustruit cu efect reflexie

Caracteristici:
- Aspect cald și tradițional
- Culoare care nu se decolorează
- Perfect pentru case cu caracter`,
        categoryId: categories[0].id,
        priceFrom: 2.43,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P6',
          culoare: 'Roșu-maro RAL 3011',
          finisaj: 'Lustruit',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // P7 - Gri Antracit Lustruit
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P7 - 8017 LUCIOS (Gri antracit lustruit)',
        slug: 'sipca-metalica-p7-8017-lucios',
        shortDescription: 'Șipcă P7 gri antracit lustruit cu efect reflexie',
        longDescription: `Șipcă metalică P7 8017 LUCIOS - gri antracit cu efect lucios.

Material: Tablă zincată DX 51
Grosime: 0.45 mm
Culoare: Gri antracit RAL 8017
Finisaj: Lustruit cu efect reflexie specular

Caracteristici:
- Efect lucios și elegant
- Reflexie subtilă la lumină
- Modern și sofisticat`,
        categoryId: categories[0].id,
        priceFrom: 2.43,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P7',
          culoare: 'Gri antracit RAL 8017',
          finisaj: 'Lustruit',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // P8 - Negru pur
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P8 - 8004 MAT (Negru pur mat)',
        slug: 'sipca-metalica-p8-8004-mat',
        shortDescription: 'Șipcă P8 negru pur mat, design minimalist',
        longDescription: `Șipcă metalică P8 8004 MAT - negru pur cu finisaj mat.

Material: Tablă zincată DX 51
Grosime: 0.45 mm
Culoare: Negru pur RAL 8004, finisaj mat
Înălțime disponibilă: 0.50m - 3.00m

Caracteristici:
- Negru pur și absolut
- Perfect pentru design minimalist
- Aspect modern și curat`,
        categoryId: categories[0].id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P8',
          culoare: 'Negru pur RAL 8004',
          finisaj: 'Mat',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // P9 - Negru profund
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P9 - 9005 MAT (Negru profund)',
        slug: 'sipca-metalica-p9-9005-mat',
        shortDescription: 'Șipcă P9 negru profund intens, culoare extremă',
        longDescription: `Șipcă metalică P9 9005 MAT - negru profund și intens.

Material: Tablă zincată DX 51
Grosime: 0.45 mm
Culoare: Negru profund RAL 9005, finisaj mat
Finisaj: Mat fără reflexie

Caracteristici:
- Negru cel mai profund din linie
- Aspect dramatic și elegant
- Ideal pentru case moderne cu caracter puternic`,
        categoryId: categories[0].id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P9',
          culoare: 'Negru profund RAL 9005',
          finisaj: 'Mat',
        },
        isFeatured: true,
        isBestseller: false,
        isActive: true,
      },
    }),
  ])

  // ========== TABLA CUTATA PRODUCTS ==========
  const tableProducts = await Promise.all([
    // 0.14mm
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.14mm',
        slug: 'tabla-cutata-galvanizata-0-14mm',
        shortDescription: 'Tablă cutată, grosime ușoară 0.14mm, pentru aplicații ușoare',
        longDescription: `Tablă cutată galvanizată 0.14mm - grosime ușoară pentru aplicații generale.

Grosime: 0.14 mm
Dimensiuni: 900 x 2000 mm
Material: Oțel galvanizat
Culori disponibile: Galvanizat, Roșu RAL 3011, Maro RAL 8017

Caracteristici:
- Ușoară și ușor de manipulat
- Ideal pentru aplicații interioare
- Garanție 30 ani
- Livrare gratuită
- Preț accesibil`,
        categoryId: categories[1].id,
        priceFrom: 18.50,
        priceType: 'per_sheet',
        specs: {
          material: 'Oțel galvanizat',
          grosime: '0.14 mm',
          dimensiuni: '900 x 2000 mm',
          culoriDisponibile: 'Galvanizat, Roșu RAL 3011, Maro RAL 8017',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // 0.15mm
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Zincată - 0.15mm',
        slug: 'tabla-cutata-zincata-0-15mm',
        shortDescription: 'Tablă cutată zincată, grosime 0.15mm',
        longDescription: `Tablă cutată zincată 0.15mm - grosime subțire cu protecție naturală.

Grosime: 0.15 mm
Dimensiuni: 900 x 2000 mm
Material: Oțel zincat
Culori disponibile: Roșu RAL 3011, Maro RAL 8017

Caracteristici:
- Protecție naturală din zinc
- Aspect metalic clasic
- Ușor de instalat
- Preț economic`,
        categoryId: categories[1].id,
        priceFrom: 21.32,
        priceType: 'per_sheet',
        specs: {
          material: 'Oțel zincat',
          grosime: '0.15 mm',
          dimensiuni: '900 x 2000 mm',
          culoriDisponibile: 'Roșu RAL 3011, Maro RAL 8017',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // 0.20mm
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.20mm (Standard)',
        slug: 'tabla-cutata-galvanizata-0-20mm',
        shortDescription: 'Tablă cutată, grosime standard 0.20mm, cea mai populară',
        longDescription: `Tablă cutată galvanizată 0.20mm - grosime standard pentru utilizare universală.

Grosime: 0.20 mm
Dimensiuni: 900 x 2000 mm
Material: Oțel galvanizat de înaltă calitate
Culori disponibile: Galvanizat, Roșu RAL 3011, Maro RAL 8017

Caracteristici:
- Cea mai solicitată variantă
- Rezistență bună la corziune
- Ideal pentru acoperiș rezidențial și comercial
- Echilibru perfect între preț și durabilitate
- Garanție 30 ani`,
        categoryId: categories[1].id,
        priceFrom: 30.45,
        priceType: 'per_sheet',
        specs: {
          material: 'Oțel galvanizat',
          grosime: '0.20 mm',
          dimensiuni: '900 x 2000 mm',
          culoriDisponibile: 'Galvanizat, Roșu RAL 3011, Maro RAL 8017',
        },
        isFeatured: true,
        isBestseller: true,
        isActive: true,
      },
    }),
    // 0.25mm
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.25mm',
        slug: 'tabla-cutata-galvanizata-0-25mm',
        shortDescription: 'Tablă cutată, grosime 0.25mm, rezistență crescută',
        longDescription: `Tablă cutată galvanizată 0.25mm - grosime medie cu rezistență crescută.

Grosime: 0.25 mm
Dimensiuni: 900 x 2000 mm
Material: Oțel galvanizat
Culori disponibile: Roșu RAL 3011, Maro RAL 8017

Caracteristici:
- Rezistență mai mare decât 0.20mm
- Ideal pentru zone cu condiții mai grele
- Preț avantajos`,
        categoryId: categories[1].id,
        priceFrom: 32.48,
        priceType: 'per_sheet',
        specs: {
          material: 'Oțel galvanizat',
          grosime: '0.25 mm',
          dimensiuni: '900 x 2000 mm',
          culoriDisponibile: 'Roșu RAL 3011, Maro RAL 8017',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // 0.30mm
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.30mm (Robustă)',
        slug: 'tabla-cutata-galvanizata-0-30mm',
        shortDescription: 'Tablă cutată, grosime 0.30mm, pentru aplicații grele',
        longDescription: `Tablă cutată galvanizată 0.30mm - grosime robustă pentru aplicații pretențioase.

Grosime: 0.30 mm
Dimensiuni: 900 x 2000 mm
Material: Oțel galvanizat premium
Culori disponibile: Roșu RAL 3011, Maro RAL 8017

Caracteristici:
- Rezistență excelentă la coroziune
- Ideal pentru zone cu vânt puternic și zăpadă abundentă
- Durabilitate pe termen lung
- Garanție 30 ani
- Instalare profesională recomandată`,
        categoryId: categories[1].id,
        priceFrom: 39.59,
        priceType: 'per_sheet',
        specs: {
          material: 'Oțel galvanizat premium',
          grosime: '0.30 mm',
          dimensiuni: '900 x 2000 mm',
          culoriDisponibile: 'Roșu RAL 3011, Maro RAL 8017',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // 0.35mm
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.35mm (Extra robustă)',
        slug: 'tabla-cutata-galvanizata-0-35mm',
        shortDescription: 'Tablă cutată, grosime 0.35mm, durabilitate maximă',
        longDescription: `Tablă cutată galvanizată 0.35mm - grosime extra robustă pentru aplicații industriale.

Grosime: 0.35 mm
Dimensiuni: 900 x 2000 mm
Material: Oțel galvanizat industrial
Culori disponibile: Roșu RAL 3011, Maro RAL 8017

Caracteristici:
- Rezistență maximă la coroziune
- Ideal pentru construcții industriale
- Durabilitate pe termen foarte lung (30+ ani)
- Preț premium pentru calitate superioară`,
        categoryId: categories[1].id,
        priceFrom: 41.62,
        priceType: 'per_sheet',
        specs: {
          material: 'Oțel galvanizat industrial',
          grosime: '0.35 mm',
          dimensiuni: '900 x 2000 mm',
          culoriDisponibile: 'Roșu RAL 3011, Maro RAL 8017',
        },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    // 0.40mm
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Zincată - 0.40mm (Premium)',
        slug: 'tabla-cutata-zincata-0-40mm',
        shortDescription: 'Tablă cutată zincată, grosime 0.40mm, calitate maximă',
        longDescription: `Tablă cutată zincată 0.40mm - grosime premium pentru aplicații critice.

Grosime: 0.40 mm
Dimensiuni: 900 x 2000 mm
Material: Oțel zincat de cea mai înaltă calitate
Culori disponibile: Roșu RAL 3011

Caracteristici:
- Cea mai groasă variantă
- Rezistență la coroziune aproape nelimitată
- Ideal pentru construcții speciale și inginerie civilă
- Investiție pe termen foarte lung
- Garanție 30 ani cu acoperire completă`,
        categoryId: categories[1].id,
        priceFrom: 49.74,
        priceType: 'per_sheet',
        specs: {
          material: 'Oțel zincat premium',
          grosime: '0.40 mm',
          dimensiuni: '900 x 2000 mm',
          culoriDisponibile: 'Roșu RAL 3011',
        },
        isFeatured: true,
        isBestseller: false,
        isActive: true,
      },
    }),
  ])

  const products = [...sipcaProducts, ...tableProducts]
  console.log(`✓ Products created (${products.length} total)`)

  // ========== CREATE VARIANTS ==========
  // Sipca variants with height options (including EU prices)
  const sipcaVariants = await Promise.all(
    sipcaProducts.map((product) =>
      prisma.variant.create({
        data: {
          productId: product.id,
          sku: `${product.slug}-1m`,
          attributes: {
            inaltime: '1.00 m',
            lungime: '1 metru liniar',
          },
          price: product.priceFrom,
          priceEU: calculateEUPrice(product.priceFrom),
          stockStatus: 'in_stock',
          stockQty: 9999,
        },
      })
    )
  )

  // Tabla variants with color options (including EU prices)
  const tableVariants = await Promise.all([
    // 0.14mm
    prisma.variant.create({
      data: {
        productId: tableProducts[0].id,
        sku: 'TABLA-014-GALV',
        attributes: {
          culoare: 'Galvanizat',
          grosime: '0.14 mm',
        },
        price: 18.50,
        priceEU: calculateEUPrice(18.50),
        stockStatus: 'in_stock',
        stockQty: 500,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[0].id,
        sku: 'TABLA-014-RED',
        attributes: {
          culoare: 'Roșu RAL 3011',
          grosime: '0.14 mm',
        },
        price: 20.30,
        priceEU: calculateEUPrice(20.30),
        stockStatus: 'in_stock',
        stockQty: 300,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[0].id,
        sku: 'TABLA-014-BROWN',
        attributes: {
          culoare: 'Maro RAL 8017',
          grosime: '0.14 mm',
        },
        price: 20.30,
        priceEU: calculateEUPrice(20.30),
        stockStatus: 'in_stock',
        stockQty: 250,
      },
    }),
    // 0.15mm
    prisma.variant.create({
      data: {
        productId: tableProducts[1].id,
        sku: 'TABLA-015-RED',
        attributes: {
          culoare: 'Roșu RAL 3011',
          grosime: '0.15 mm',
        },
        price: 21.32,
        priceEU: calculateEUPrice(21.32),
        stockStatus: 'in_stock',
        stockQty: 200,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[1].id,
        sku: 'TABLA-015-BROWN',
        attributes: {
          culoare: 'Maro RAL 8017',
          grosime: '0.15 mm',
        },
        price: 21.32,
        priceEU: calculateEUPrice(21.32),
        stockStatus: 'in_stock',
        stockQty: 180,
      },
    }),
    // 0.20mm
    prisma.variant.create({
      data: {
        productId: tableProducts[2].id,
        sku: 'TABLA-020-GALV',
        attributes: {
          culoare: 'Galvanizat',
          grosime: '0.20 mm',
        },
        price: 30.45,
        priceEU: calculateEUPrice(30.45),
        stockStatus: 'in_stock',
        stockQty: 600,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[2].id,
        sku: 'TABLA-020-RED',
        attributes: {
          culoare: 'Roșu RAL 3011',
          grosime: '0.20 mm',
        },
        price: 30.45,
        priceEU: calculateEUPrice(30.45),
        stockStatus: 'in_stock',
        stockQty: 500,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[2].id,
        sku: 'TABLA-020-BROWN',
        attributes: {
          culoare: 'Maro RAL 8017',
          grosime: '0.20 mm',
        },
        price: 30.45,
        priceEU: calculateEUPrice(30.45),
        stockStatus: 'in_stock',
        stockQty: 450,
      },
    }),
    // 0.25mm
    prisma.variant.create({
      data: {
        productId: tableProducts[3].id,
        sku: 'TABLA-025-RED',
        attributes: {
          culoare: 'Roșu RAL 3011',
          grosime: '0.25 mm',
        },
        price: 34.51,
        priceEU: calculateEUPrice(34.51),
        stockStatus: 'in_stock',
        stockQty: 300,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[3].id,
        sku: 'TABLA-025-BROWN',
        attributes: {
          culoare: 'Maro RAL 8017',
          grosime: '0.25 mm',
        },
        price: 32.48,
        priceEU: calculateEUPrice(32.48),
        stockStatus: 'in_stock',
        stockQty: 250,
      },
    }),
    // 0.30mm
    prisma.variant.create({
      data: {
        productId: tableProducts[4].id,
        sku: 'TABLA-030-RED',
        attributes: {
          culoare: 'Roșu RAL 3011',
          grosime: '0.30 mm',
        },
        price: 41.62,
        priceEU: calculateEUPrice(41.62),
        stockStatus: 'in_stock',
        stockQty: 200,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[4].id,
        sku: 'TABLA-030-BROWN',
        attributes: {
          culoare: 'Maro RAL 8017',
          grosime: '0.30 mm',
        },
        price: 39.59,
        priceEU: calculateEUPrice(39.59),
        stockStatus: 'in_stock',
        stockQty: 180,
      },
    }),
    // 0.35mm
    prisma.variant.create({
      data: {
        productId: tableProducts[5].id,
        sku: 'TABLA-035-RED',
        attributes: {
          culoare: 'Roșu RAL 3011',
          grosime: '0.35 mm',
        },
        price: 46.69,
        priceEU: calculateEUPrice(46.69),
        stockStatus: 'in_stock',
        stockQty: 120,
      },
    }),
    prisma.variant.create({
      data: {
        productId: tableProducts[5].id,
        sku: 'TABLA-035-BROWN',
        attributes: {
          culoare: 'Maro RAL 8017',
          grosime: '0.35 mm',
        },
        price: 41.62,
        priceEU: calculateEUPrice(41.62),
        stockStatus: 'in_stock',
        stockQty: 100,
      },
    }),
    // 0.40mm
    prisma.variant.create({
      data: {
        productId: tableProducts[6].id,
        sku: 'TABLA-040-RED',
        attributes: {
          culoare: 'Roșu RAL 3011',
          grosime: '0.40 mm',
        },
        price: 49.74,
        priceEU: calculateEUPrice(49.74),
        stockStatus: 'in_stock',
        stockQty: 80,
      },
    }),
  ])

  console.log(`✓ Variants created (${sipcaVariants.length + tableVariants.length} total)`)

  // ========== CREATE REVIEWS ==========
  await Promise.all([
    prisma.review.create({
      data: {
        productId: sipcaProducts[0].id,
        name: 'Ion Popescu',
        email: 'ion@exemplu.ro',
        rating: 5,
        text: 'Șipcă de foarte bună calitate! Perfect pentru gardul meu nou. Recomand cu încredere! Livrare rapidă și ambalare profesională.',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: sipcaProducts[0].id,
        name: 'Gheorghe Mărgărit',
        email: 'gheorghe@exemplu.ro',
        rating: 5,
        text: 'Livrare rapidă, produsul corespunde perfect descrisului. Mulțumesc pentru profesionalism și atenție la detalii!',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: sipcaProducts[0].id,
        name: 'Vasile Niculăiță',
        email: 'vasile@exemplu.ro',
        rating: 5,
        text: 'Piesa foarte bine realizată, culoarea este exactă cum se vede în poze. Recomand să comandați cu încredere!',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: tableProducts[2].id,
        name: 'Maria Ionescu',
        email: 'maria@exemplu.ro',
        rating: 5,
        text: 'Tablă excelentă pentru acoperiș. Calitate premium, rezistență pe termen lung garantată! Cea mai bună alegere pentru prețul acesta.',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: tableProducts[2].id,
        name: 'Adrian Trifan',
        email: 'adrian@exemplu.ro',
        rating: 5,
        text: 'Utilizez tablă de la Esipca Metalica de 3 ani. Zero probleme, aspect impecabil. Prețul și calitatea sunt în echilibru perfect!',
        isApproved: true,
      },
    }),
  ])

  console.log('✓ Reviews created')

  console.log('✅ Database seed completed successfully with COMPLETE product data!')
  console.log(`📊 Total: ${products.length} produse + ${sipcaVariants.length + tableVariants.length} variante + 5 recenzii`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
