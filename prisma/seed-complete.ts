const { PrismaClient } = require('@prisma/client')
const bcryptjs = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed with ALL 38 products from production...')

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
      companyEmail: 'office@exprestrading.com',
      freeShippingThreshold: 350,
      warrantyYears: 30,
      deliveryDays: '1-7',
    },
  })
  console.log('✓ Settings created')

  // Create categories
  const [cat_sipca, cat_tabla, cat_tigla, cat_pluvial, cat_accesorii] = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Șipcă Metalică',
        slug: 'sipca-metalica-galati',
        description: 'Șipcă metalică din oțel zincat DX 51 vopsit în câmp electrostatic. Profile P1-P9 cu diverse culori RAL.',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tablă Cutată Galvanizată',
        slug: 'tabla-zincata-producator',
        description: 'Tablă cutată din oțel galvanizat în grosimi de 0.14-0.40mm. Pentru acoperiș și pereți.',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Țiglă Metalică',
        slug: 'tigla-metalica',
        description: 'Țiglă metalică cu aspect tradițional. Vopsire în câmp electrostatic cu protecție poliester.',
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
    prisma.category.create({
      data: {
        name: 'Elemente și Accesorii',
        slug: 'elemente-si-accesorii',
        description: 'Piese complementare și accesorii pentru instalații complete.',
        sortOrder: 5,
        isActive: true,
      },
    }),
  ])
  console.log('✓ 5 Categories created')

  // ========== SIPCA METALICA - 9 PRODUCTS ==========
  const sipcaProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P1 - 7024 MAT (Negru)',
        slug: 'sipca-metalica-p1-7024-mat',
        shortDescription: 'Șipcă P1 din oțel zincat DX 51, negru RAL 7024, finisaj mat',
        longDescription: `Șipcă metalică P1 7024 MAT - profil modern cu două crestături și vârf semi-rotunjit.

Material: Tablă zincată DX 51 – vopsită în câmp electrostatic cu protecție poliester lucios
Grosime: 0.45 mm | Lățime: 9 cm | Culoare: Negru RAL 7024
Înălțime disponibilă: 0.50m - 3.00m (personalizabil)
Instalare: 10 bucăți per metru liniar

Caracteristici: Garanție 30 ani | Rezistent la coroziune | Livrare gratuită | 30 zile retur`,
        categoryId: cat_sipca.id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: {
          material: 'Tablă zincată DX 51',
          profil: 'P1',
          culoare: 'Negru RAL 7024',
          grosime: '0.45 mm',
        },
        isFeatured: true,
        isBestseller: true,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P2 - Zincat (AL ZN)',
        slug: 'sipca-metalica-p2-al-zn',
        shortDescription: 'Șipcă P2 din oțel zincat natural',
        longDescription: `Șipcă metalică P2 AL ZN - protecție naturală din aluminiu și zinc.
Material: Tablă zincată DX 51 | Grosime: 0.45 mm | Culoare: Zincat natural (Argintiu)
Protecție naturală AL-ZN (aluminiu-zinc) | Garanție 30 ani`,
        categoryId: cat_sipca.id,
        priceFrom: 2.28,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51', profil: 'P2', culoare: 'Zincat natural' },
        isFeatured: false,
        isBestseller: true,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P3 - 8017 MAT (Gri Antracit)',
        slug: 'sipca-metalica-p3-8017-mat',
        shortDescription: 'Șipcă P3 gri antracit, finisaj mat elegant',
        longDescription: `Șipcă metalică P3 8017 MAT - culoare gri antracit sofisticată.
Material: Tablă zincată DX 51 | Grosime: 0.45 mm | Culoare: Gri antracit RAL 8017
Aspect elegant și modern | Rezistență pe termen lung la coroziune`,
        categoryId: cat_sipca.id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51', profil: 'P3', culoare: 'Gri antracit RAL 8017' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P4 - Stejar (Decor lemn)',
        slug: 'sipca-metalica-p4-stejar',
        shortDescription: 'Șipcă P4 cu aspect de stejar, decor premium',
        longDescription: `Șipcă metalică P4 Stejar - imită culoare și aspect lemnului de stejar.
Material: Tablă zincată DX 51 cu decor | Grosime: 0.45 mm | Culoare: Stejar
Finisaj: Lustruit cu efect 3D | Efect decorativ premium`,
        categoryId: cat_sipca.id,
        priceFrom: 3.23,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51 cu decor', profil: 'P4', culoare: 'Stejar' },
        isFeatured: true,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P5 - 8019 MAT (Negru intens)',
        slug: 'sipca-metalica-p5-8019-mat',
        shortDescription: 'Șipcă P5 negru intens, design modern',
        longDescription: `Șipcă metalică P5 8019 MAT - negru intens cu finisaj mat.
Material: Tablă zincată DX 51 | Grosime: 0.45 mm | Culoare: Negru intens RAL 8019`,
        categoryId: cat_sipca.id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51', profil: 'P5', culoare: 'Negru intens RAL 8019' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P6 - 3011 LUCIOS (Roșu-maro)',
        slug: 'sipca-metalica-p6-3011-lucios',
        shortDescription: 'Șipcă P6 roșu-maro lustruit, aspect cald clasic',
        longDescription: `Șipcă metalică P6 3011 LUCIOS - culoare roșu-maro clasică.
Material: Tablă zincată DX 51 | Grosime: 0.45 mm | Culoare: Roșu-maro RAL 3011
Finisaj: Lustruit | Aspect cald și tradițional`,
        categoryId: cat_sipca.id,
        priceFrom: 2.43,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51', profil: 'P6', culoare: 'Roșu-maro RAL 3011' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P7 - 8017 LUCIOS (Gri antracit lustruit)',
        slug: 'sipca-metalica-p7-8017-lucios',
        shortDescription: 'Șipcă P7 gri antracit lustruit cu efect reflexie',
        longDescription: `Șipcă metalică P7 8017 LUCIOS - gri antracit cu efect lucios.
Material: Tablă zincată DX 51 | Grosime: 0.45 mm | Culoare: Gri antracit RAL 8017
Finisaj: Lustruit cu efect reflexie specular`,
        categoryId: cat_sipca.id,
        priceFrom: 2.43,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51', profil: 'P7', culoare: 'Gri antracit RAL 8017' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P8 - 8004 MAT (Negru pur mat)',
        slug: 'sipca-metalica-p8-8004-mat',
        shortDescription: 'Șipcă P8 negru pur mat, design minimalist',
        longDescription: `Șipcă metalică P8 8004 MAT - negru pur cu finisaj mat.
Material: Tablă zincată DX 51 | Grosime: 0.45 mm | Culoare: Negru pur RAL 8004
Perfect pentru design minimalist`,
        categoryId: cat_sipca.id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51', profil: 'P8', culoare: 'Negru pur RAL 8004' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șipcă Metalică P9 - 9005 MAT (Negru profund)',
        slug: 'sipca-metalica-p9-9005-mat',
        shortDescription: 'Șipcă P9 negru profund intens, culoare extremă',
        longDescription: `Șipcă metalică P9 9005 MAT - negru profund și intens.
Material: Tablă zincată DX 51 | Grosime: 0.45 mm | Culoare: Negru profund RAL 9005
Aspect dramatic și elegant`,
        categoryId: cat_sipca.id,
        priceFrom: 2.68,
        priceType: 'per_meter',
        specs: { material: 'Tablă zincată DX 51', profil: 'P9', culoare: 'Negru profund RAL 9005' },
        isFeatured: true,
        isBestseller: false,
        isActive: true,
      },
    }),
  ])
  console.log('✓ 9 Șipcă Metalică products created')

  // ========== TABLA CUTATA - 7 PRODUCTS ==========
  const tableProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.14mm',
        slug: 'tabla-cutata-galvanizata-0-14mm',
        shortDescription: 'Tablă cutată, grosime ușoară 0.14mm',
        longDescription: `Tablă cutată galvanizată 0.14mm - grosime ușoară.
Grosime: 0.14 mm | Dimensiuni: 900 x 2000 mm | Material: Oțel galvanizat
Culori: Galvanizat, Roșu RAL 3011, Maro RAL 8017`,
        categoryId: cat_tabla.id,
        priceFrom: 18.50,
        priceType: 'per_sheet',
        specs: { material: 'Oțel galvanizat', grosime: '0.14 mm', dimensiuni: '900 x 2000 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Zincată - 0.15mm',
        slug: 'tabla-cutata-zincata-0-15mm',
        shortDescription: 'Tablă cutată zincată, grosime 0.15mm',
        longDescription: `Tablă cutată zincată 0.15mm - protecție naturală.
Grosime: 0.15 mm | Dimensiuni: 900 x 2000 mm | Material: Oțel zincat
Culori: Roșu RAL 3011, Maro RAL 8017`,
        categoryId: cat_tabla.id,
        priceFrom: 21.32,
        priceType: 'per_sheet',
        specs: { material: 'Oțel zincat', grosime: '0.15 mm', dimensiuni: '900 x 2000 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.20mm (Standard)',
        slug: 'tabla-cutata-galvanizata-0-20mm',
        shortDescription: 'Tablă cutată, grosime standard 0.20mm, cea mai populară',
        longDescription: `Tablă cutată galvanizată 0.20mm - grosime standard.
Grosime: 0.20 mm | Dimensiuni: 900 x 2000 mm | Material: Oțel galvanizat
Cea mai solicitată variantă | Ideal pentru acoperiș rezidențial și comercial`,
        categoryId: cat_tabla.id,
        priceFrom: 30.45,
        priceType: 'per_sheet',
        specs: { material: 'Oțel galvanizat', grosime: '0.20 mm', dimensiuni: '900 x 2000 mm' },
        isFeatured: true,
        isBestseller: true,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.25mm',
        slug: 'tabla-cutata-galvanizata-0-25mm',
        shortDescription: 'Tablă cutată, grosime 0.25mm, rezistență crescută',
        longDescription: `Tablă cutată galvanizată 0.25mm - grosime medie.
Grosime: 0.25 mm | Dimensiuni: 900 x 2000 mm | Material: Oțel galvanizat`,
        categoryId: cat_tabla.id,
        priceFrom: 32.48,
        priceType: 'per_sheet',
        specs: { material: 'Oțel galvanizat', grosime: '0.25 mm', dimensiuni: '900 x 2000 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.30mm (Robustă)',
        slug: 'tabla-cutata-galvanizata-0-30mm',
        shortDescription: 'Tablă cutată, grosime 0.30mm, pentru aplicații grele',
        longDescription: `Tablă cutată galvanizată 0.30mm - grosime robustă.
Grosime: 0.30 mm | Dimensiuni: 900 x 2000 mm | Material: Oțel galvanizat premium`,
        categoryId: cat_tabla.id,
        priceFrom: 39.59,
        priceType: 'per_sheet',
        specs: { material: 'Oțel galvanizat premium', grosime: '0.30 mm', dimensiuni: '900 x 2000 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Galvanizată - 0.35mm (Extra robustă)',
        slug: 'tabla-cutata-galvanizata-0-35mm',
        shortDescription: 'Tablă cutată, grosime 0.35mm, durabilitate maximă',
        longDescription: `Tablă cutată galvanizată 0.35mm - grosime extra robustă.
Grosime: 0.35 mm | Dimensiuni: 900 x 2000 mm | Material: Oțel galvanizat industrial`,
        categoryId: cat_tabla.id,
        priceFrom: 41.62,
        priceType: 'per_sheet',
        specs: { material: 'Oțel galvanizat industrial', grosime: '0.35 mm', dimensiuni: '900 x 2000 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tablă Cutată Zincată - 0.40mm (Premium)',
        slug: 'tabla-cutata-zincata-0-40mm',
        shortDescription: 'Tablă cutată zincată, grosime 0.40mm, calitate maximă',
        longDescription: `Tablă cutată zincată 0.40mm - grosime premium.
Grosime: 0.40 mm | Dimensiuni: 900 x 2000 mm | Material: Oțel zincat premium
Cea mai durabilă opțiune`,
        categoryId: cat_tabla.id,
        priceFrom: 49.74,
        priceType: 'per_sheet',
        specs: { material: 'Oțel zincat premium', grosime: '0.40 mm', dimensiuni: '900 x 2000 mm' },
        isFeatured: true,
        isBestseller: false,
        isActive: true,
      },
    }),
  ])
  console.log('✓ 7 Tablă Cutată products created')

  // ========== TIGLA METALICA - 4 PRODUCTS ==========
  const tiglaMeatalicaProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Țiglă Metalică RAL 3011 LUCIOS (Roșu)',
        slug: 'tigla-metalica-ral-3011-lucios',
        shortDescription: 'Țiglă metalică roșu RAL 3011, finisaj lustruit',
        longDescription: `Țiglă metalică RAL 3011 LUCIOS - culoare roșu profund cu finisaj lustruit.
Material: Oțel vopsit în câmp electrostatic | Lățime: 120 cm | Culoare: Roșu RAL 3011
Finisaj: Lucios cu protecție poliester | Garanție 30 ani`,
        categoryId: cat_tigla.id,
        priceFrom: 27.41,
        priceType: 'per_tile',
        specs: { material: 'Oțel vopsit electrostatic', culoare: 'Roșu RAL 3011', finisaj: 'Lucios', latime: '120 cm' },
        isFeatured: true,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Țiglă Metalică RAL 3011 MAT (Roșu)',
        slug: 'tigla-metalica-ral-3011-mat',
        shortDescription: 'Țiglă metalică roșu RAL 3011, finisaj mat',
        longDescription: `Țiglă metalică RAL 3011 MAT - culoare roșu profund cu finisaj mat.
Material: Oțel vopsit în câmp electrostatic | Lățime: 120 cm | Culoare: Roșu RAL 3011
Finisaj: Mat | Aspect tradițional și elegant`,
        categoryId: cat_tigla.id,
        priceFrom: 33.50,
        priceType: 'per_tile',
        specs: { material: 'Oțel vopsit electrostatic', culoare: 'Roșu RAL 3011', finisaj: 'Mat', latime: '120 cm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Țiglă Metalică RAL 8017 LUCIOS (Maro)',
        slug: 'tigla-metalica-ral-8017-lucios',
        shortDescription: 'Țiglă metalică maro RAL 8017, finisaj lustruit',
        longDescription: `Țiglă metalică RAL 8017 LUCIOS - culoare maro chocolate cu finisaj lustruit.
Material: Oțel vopsit în câmp electrostatic | Lățime: 120 cm | Culoare: Maro RAL 8017
Finisaj: Lucios | Aspect cald și sofisticat`,
        categoryId: cat_tigla.id,
        priceFrom: 27.41,
        priceType: 'per_tile',
        specs: { material: 'Oțel vopsit electrostatic', culoare: 'Maro RAL 8017', finisaj: 'Lucios', latime: '120 cm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Țiglă Metalică RAL 8017 MAT (Maro)',
        slug: 'tigla-metalica-ral-8017-mat',
        shortDescription: 'Țiglă metalică maro RAL 8017, finisaj mat',
        longDescription: `Țiglă metalică RAL 8017 MAT - culoare maro chocolate cu finisaj mat.
Material: Oțel vopsit în câmp electrostatic | Lățime: 120 cm | Culoare: Maro RAL 8017
Finisaj: Mat | Protecție poliester`,
        categoryId: cat_tigla.id,
        priceFrom: 33.50,
        priceType: 'per_tile',
        specs: { material: 'Oțel vopsit electrostatic', culoare: 'Maro RAL 8017', finisaj: 'Mat', latime: '120 cm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
  ])
  console.log('✓ 4 Țiglă Metalică products created')

  // ========== SISTEM PLUVIAL - 10 PRODUCTS ==========
  const pluvalProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Brățară Burlan - 125mm (Maro RAL 8017)',
        slug: 'bratara-burlan-125mm',
        shortDescription: 'Brățară metalică pentru jgheaburi 125mm',
        longDescription: `Brățară burlan metalică - suport pentru jgheaburi.
Material: Oțel galvanizat | Diametru: 125 mm | Culoare: Maro RAL 8017
Montaj: Pe perete | Rezistent la coroziune`,
        categoryId: cat_pluvial.id,
        priceFrom: 12.69,
        priceType: 'per_piece',
        specs: { material: 'Oțel galvanizat', tip: 'Brățară', diametru: '125 mm', culoare: 'Maro RAL 8017' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Burlan Metalic - 88mm (Maro RAL 8017)',
        slug: 'burlan-metalic-88mm',
        shortDescription: 'Țeavă de scurgere metalică 88mm',
        longDescription: `Burlan metalic - țeavă de scurgere pentru apă pluvială.
Material: Oțel galvanizat | Diametru: 88 mm | Culoare: Maro RAL 8017
Lungime standard: 1 metru | Conectare rapidă`,
        categoryId: cat_pluvial.id,
        priceFrom: 75.11,
        priceType: 'per_meter',
        specs: { material: 'Oțel galvanizat', tip: 'Țeavă de scurgere', diametru: '88 mm', culoare: 'Maro RAL 8017' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Capac Jgheab - 88mm (Maro RAL 8017)',
        slug: 'capac-jgheab-88mm',
        shortDescription: 'Capac de închidere pentru țevi 88mm',
        longDescription: `Capac jgheab - închide capatul țevilor de scurgere.
Material: Oțel galvanizat | Diametru: 88 mm | Culoare: Maro RAL 8017
Prevenire intruziuni | Finisaj lucios`,
        categoryId: cat_pluvial.id,
        priceFrom: 12.69,
        priceType: 'per_piece',
        specs: { material: 'Oțel galvanizat', tip: 'Capac', diametru: '88 mm', culoare: 'Maro RAL 8017' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cărlig Jgheab - 125mm (Maro RAL 8017)',
        slug: 'carlig-jgheab-125mm',
        shortDescription: 'Cărlig de suspensie pentru jgheaburi 125mm',
        longDescription: `Cărlig jgheab - suspendă jgheabul de structura acoperișului.
Material: Oțel galvanizat | Pentru jgheab: 125 mm | Culoare: Maro RAL 8017
Montaj pe ferme | Rezistent la vânt și greutate`,
        categoryId: cat_pluvial.id,
        priceFrom: 15.73,
        priceType: 'per_piece',
        specs: { material: 'Oțel galvanizat', tip: 'Cărlig', pentru_jgheab: '125 mm', culoare: 'Maro RAL 8017' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Colț Interior Jgheab - 125mm',
        slug: 'coltar-interior-jgheab-125mm',
        shortDescription: 'Colț interior pentru jgheaburi 125mm',
        longDescription: `Colț interior jgheab - conectează jgheaburi la unghi de 90 grade.
Material: Oțel galvanizat | Diametru: 125 mm | Finisaj galvanizat
Pentru schimbări de direcție | Etanșare sigură`,
        categoryId: cat_pluvial.id,
        priceFrom: 65.98,
        priceType: 'per_piece',
        specs: { material: 'Oțel galvanizat', tip: 'Colț interior', diametru: '125 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cot Burlan - 88mm (Maro RAL 8017)',
        slug: 'cot-burlan-88mm',
        shortDescription: 'Cot pentru țevi de scurgere 88mm',
        longDescription: `Cot burlan - schimbă direcția țevilor de scurgere.
Material: Oțel vopsit | Diametru: 88 mm | Culoare: Maro RAL 8017
Unghi: 45 sau 90 grade | Montare rapidă`,
        categoryId: cat_pluvial.id,
        priceFrom: 21.82,
        priceType: 'per_piece',
        specs: { material: 'Oțel vopsit', tip: 'Cot', diametru: '88 mm', culoare: 'Maro RAL 8017' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Element Îmbinare Jgheab - 125mm',
        slug: 'element-imbinare-jgheab-125mm',
        shortDescription: 'Cuplă de îmbinare pentru jgheaburi 125mm',
        longDescription: `Element îmbinare jgheab - conectează două bucăți de jgheab.
Material: Oțel galvanizat | Diametru: 125 mm | Finisaj galvanizat
Etanșare cu cauciuc | Montare ușoară`,
        categoryId: cat_pluvial.id,
        priceFrom: 12.69,
        priceType: 'per_piece',
        specs: { material: 'Oțel galvanizat', tip: 'Cuplă', diametru: '125 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Jgheaburi Metalice - 4m',
        slug: 'jgheaburi-metalice-4m',
        shortDescription: 'Jgheab metalic complet de 4 metri',
        longDescription: `Jgheab metalic - sistem complet de colectare a apei pluviale.
Lungime: 4 metru | Material: Oțel galvanizat | Diametru standard: 125 mm
Montare pe ferme | Transport sigur`,
        categoryId: cat_pluvial.id,
        priceFrom: 72.07,
        priceType: 'per_4m_section',
        specs: { material: 'Oțel galvanizat', lungime: '4 m', diametru: '125 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Prelungitor Burlan - 1m',
        slug: 'prelungitor-burlan-1m',
        shortDescription: 'Extensie țeavă de scurgere 1 metru',
        longDescription: `Prelungitor burlan - lungește țevile de scurgere.
Lungime: 1 metru | Material: Oțel galvanizat | Diametru: 88 mm
Pentru variații de înălțime | Montare rapidă`,
        categoryId: cat_pluvial.id,
        priceFrom: 28.42,
        priceType: 'per_meter',
        specs: { material: 'Oțel galvanizat', tip: 'Prelungitor', lungime: '1 m', diametru: '88 mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Racord Jgheab-Burlan',
        slug: 'racord-jgheab-burlan',
        shortDescription: 'Conector jgheab la țeavă de scurgere',
        longDescription: `Racord jgheab-burlan - conectează jgheabul la țeva de scurgere.
Material: Oțel galvanizat | Standard: 125mm jgheab, 88mm țeavă
Direcționare fluxului | Etanșare sigură`,
        categoryId: cat_pluvial.id,
        priceFrom: 29.44,
        priceType: 'per_piece',
        specs: { material: 'Oțel galvanizat', tip: 'Racord', dimensiuni: '125mm-88mm' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
  ])
  console.log('✓ 10 Sistem Pluvial products created')

  // ========== ELEMENTE SI ACCESORII - 8 PRODUCTS ==========
  const accesoryProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Coamă Metalică Acoperiș - 2m',
        slug: 'coama-metalica-acoperis-2m',
        shortDescription: 'Coamă protectoare pentru creastă acoperiș 2m',
        longDescription: `Coamă metalică - protejează creastă acoperișului.
Lungime: 2 metri | Material: Oțel vopsit electrostatic | Finisaj premium
Prevenire infiltrații | Aspect finalizat profesional`,
        categoryId: cat_accesorii.id,
        priceFrom: 37.05,
        priceType: 'per_2m',
        specs: { material: 'Oțel vopsit electrostatic', lungime: '2 m', tip: 'Coamă' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dolić Mic Acoperiș RAL 8017 MAT - 2m',
        slug: 'dolic-mic-acoperis-ral-8017-mat-2m',
        shortDescription: 'Dolić (vale) mic pentru acoperiș, maro mat 2m',
        longDescription: `Dolić acoperiș - colectează apa dintre pante.
Lungime: 2 metri | Culoare: Maro RAL 8017 MAT | Material: Oțel vopsit
Pentru interioare și exterioare | Etanșare perfectă`,
        categoryId: cat_accesorii.id,
        priceFrom: 37.05,
        priceType: 'per_2m',
        specs: { material: 'Oțel vopsit', culoare: 'Maro RAL 8017 MAT', lungime: '2 m', tip: 'Dolić' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Folie Anticondens - 75m²',
        slug: 'folie-anticondens-75mp',
        shortDescription: 'Membrană anticondens pentru acoperișuri 75m²',
        longDescription: `Folie anticondens - previne condensul sub acoperiș.
Suprafață: 75 metri pătrați | Material: Polietilenă cu efect reflectant
Izolare termică | Prevenție mucegai și coroziune`,
        categoryId: cat_accesorii.id,
        priceFrom: 233.45,
        priceType: 'per_roll',
        specs: { material: 'Polietilenă cu efect reflectant', suprafata: '75 m²', tip: 'Membrană anticondens' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Glaf Calcan - 2m',
        slug: 'glaf-calcan-2m',
        shortDescription: 'Trimă pentru pere frontală 2 metri',
        longDescription: `Glaf calcan - protejează pereții frontali.
Lungime: 2 metri | Material: Oțel vopsit electrostatic | Standard universal
Prevenire infiltrații ploaie | Finisaj elegant`,
        categoryId: cat_accesorii.id,
        priceFrom: 37.05,
        priceType: 'per_2m',
        specs: { material: 'Oțel vopsit electrostatic', lungime: '2 m', tip: 'Glaf calcan' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Membrană Etanșare Coamă - 100/150mm',
        slug: 'membrana-etansare-coama-100-150mm',
        shortDescription: 'Benzi etanșare pentru creastă acoperiș',
        longDescription: `Membrană etanșare coamă - sigilează creastă acoperișului.
Dimensiuni: 100/150 mm | Material: Cauciuc sintetic rezistent
Aderență puternică | Rezistență UV și temperatură extremă`,
        categoryId: cat_accesorii.id,
        priceFrom: 50.75,
        priceType: 'per_roll',
        specs: { material: 'Cauciuc sintetic', dimensiuni: '100/150 mm', tip: 'Membrană etanșare' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Opritor Liniar Zăpadă - 2m',
        slug: 'opritor-liniar-zapada-2m',
        shortDescription: 'Barieră zăpadă pentru acoperiș 2m',
        longDescription: `Opritor zăpadă - previne avalanșele de zăpadă de pe acoperiș.
Lungime: 2 metri | Material: Oțel galvanizat | Montare pe acoperiș
Siguritate: Protejează persoane și proprietatea | Rezistent la greutate`,
        categoryId: cat_accesorii.id,
        priceFrom: 34.00,
        priceType: 'per_2m',
        specs: { material: 'Oțel galvanizat', lungime: '2 m', tip: 'Opritor liniar' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sort Streașină - 2m',
        slug: 'sort-strasina-2m',
        shortDescription: 'Tavă de închidere streașină 2 metri',
        longDescription: `Sort streașină - închide și protejează streașina.
Lungime: 2 metri | Material: Oțel vopsit | Finisaj profesional
Prevenire păsări și insecte | Aspect final curat`,
        categoryId: cat_accesorii.id,
        priceFrom: 28.93,
        priceType: 'per_2m',
        specs: { material: 'Oțel vopsit', lungime: '2 m', tip: 'Sort streașină' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Șurub Autoforant Cap Hexagonal 4.8x19mm - 250buc',
        slug: 'surub-autoforant-cap-hex-4-8x19-250buc',
        shortDescription: 'Șuruburi autoforante pentru metal 250 bucăți',
        longDescription: `Șurub autoforant - fixare directă pe metal.
Dimensiune: 4.8 x 19 mm | Ambalaj: 250 bucăți per cutie | Cap hexagonal
Material: Oțel zincat | Autotăietor și autoforant | Rezistent la coroziune`,
        categoryId: cat_accesorii.id,
        priceFrom: 50.75,
        priceType: 'per_box',
        specs: { material: 'Oțel zincat', dimensiune: '4.8 x 19 mm', cantitate: '250 buc', tip: 'Șurub autoforant' },
        isFeatured: false,
        isBestseller: false,
        isActive: true,
      },
    }),
  ])
  console.log('✓ 8 Elemente și Accesorii products created')

  const allProducts = [...sipcaProducts, ...tableProducts, ...tiglaMeatalicaProducts, ...pluvalProducts, ...accesoryProducts]
  console.log(`\n✅ Total ${allProducts.length} products created!`)

  // Create a few variants for demonstration
  await Promise.all([
    ...sipcaProducts.map((p) =>
      prisma.variant.create({
        data: {
          productId: p.id,
          sku: `${p.slug}-1m`,
          attributes: { inaltime: '1.00 m' },
          price: p.priceFrom,
          stockStatus: 'in_stock',
          stockQty: 9999,
        },
      })
    ),
    ...tableProducts.slice(0, 3).map((p) =>
      prisma.variant.create({
        data: {
          productId: p.id,
          sku: `${p.slug}-standard`,
          attributes: { culoare: 'Galvanizat' },
          price: p.priceFrom,
          stockStatus: 'in_stock',
          stockQty: 500,
        },
      })
    ),
  ])
  console.log('✓ Variants created')

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        productId: sipcaProducts[0].id,
        name: 'Ion Popescu',
        email: 'ion@exemplu.ro',
        rating: 5,
        text: 'Șipcă de foarte bună calitate! Perfect pentru gardul meu. Recomand!',
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        productId: tableProducts[2].id,
        name: 'Maria Ionescu',
        email: 'maria@exemplu.ro',
        rating: 5,
        text: 'Tablă excelentă pentru acoperiș! Calitate premium, rezistență garantată.',
        isApproved: true,
      },
    }),
  ])
  console.log('✓ Reviews created')

  console.log('\n✅ Database seed COMPLETED!')
  console.log(`\n📊 SUMMARY:`)
  console.log(`   • Șipcă Metalică: 9 produse`)
  console.log(`   • Tablă Cutată: 7 produse`)
  console.log(`   • Țiglă Metalică: 4 produse`)
  console.log(`   • Sistem Pluvial: 10 produse`)
  console.log(`   • Elemente & Accesorii: 8 produse`)
  console.log(`   ────────────────────────`)
  console.log(`   TOTAL: 38 PRODUSE`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
