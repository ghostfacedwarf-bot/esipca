/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Transpile Prisma to fix Turbopack module resolution
  transpilePackages: ['@prisma/client'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.metalfence.ro',
      },
      {
        protocol: 'https',
        hostname: '*.esipcametalica.ro',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Bundle Prisma client instead of treating as external
  // This fixes Turbopack module resolution issues on Hostinger

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://translate.google.com https://*.googleapis.com https://*.google.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://fonts.googleapis.com; img-src 'self' data: blob: https: http:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.googleapis.com https://*.google.com https://api.mymemory.translated.net https://*.bnr.ro; frame-src 'self' https://translate.google.com;",
          },
        ],
      },
    ]
  },

  redirects: async () => {
    return []
  },

  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
      ],
    }
  },
}

// Wrap with Serwist (PWA service worker) - safe require
let finalConfig = nextConfig
try {
  const withSerwist = require('@serwist/next').default({
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',
  })
  finalConfig = withSerwist(finalConfig)
} catch (e) {
  console.warn('[next.config] @serwist/next not available, skipping PWA')
}

// Wrap with Sentry - safe require
try {
  const { withSentryConfig } = require('@sentry/nextjs')
  finalConfig = withSentryConfig(finalConfig, {
    silent: true,
    hideSourceMaps: true,
    tunnelRoute: '/monitoring',
  })
} catch (e) {
  console.warn('[next.config] @sentry/nextjs not available, skipping Sentry')
}

module.exports = finalConfig
