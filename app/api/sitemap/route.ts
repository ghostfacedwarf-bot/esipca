import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://esipcametalica.ro'

  // Fetch all active products for dynamic URLs
  let productSlugs: string[] = []
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
    productSlugs = products.map((p) => p.slug)
  } catch {
    // Fallback to empty if DB unavailable
  }

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/produse', priority: '0.9', changefreq: 'daily' },
    { url: '/configurator', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${productSlugs
  .map(
    (slug) => `  <url>
    <loc>${siteUrl}/produse/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
