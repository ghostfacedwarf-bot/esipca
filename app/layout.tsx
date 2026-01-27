import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleTranslator from '@/components/GoogleTranslator'
import RegionAutoDetect from '@/components/RegionAutoDetect'
import { Toaster } from 'react-hot-toast'
import { initializeDatabase } from '@/lib/init-db-auto'
import { RegionProvider } from '@/lib/region-context'

// Initialize database on server startup
initializeDatabase().catch(err => console.error('[Layout] DB init error:', err))

export const metadata: Metadata = {
  title: {
    default: 'Esipca Metalica - Șipcă, Tablă și Jgheaburi de Calitate',
    template: '%s | Esipca Metalica',
  },
  description: 'Furnizor de șipcă metalică, tablă zincată și jgheaburi pentru construcții. 30 ani de experiență. Livrare rapidă în România. Consultanță profesională.',
  keywords: [
    'șipcă metalică',
    'tablă zincată',
    'jgheaburi',
    'furnituri construcții',
    'metalica',
    'garduri',
    'acoperiș',
  ],
  authors: [{ name: 'Esipca Metalica' }],
  creator: 'Esipca Metalica',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://esipcametalica.ro',
    siteName: 'Esipca Metalica',
    title: 'Esipca Metalica - Șipcă, Tablă și Jgheaburi de Calitate',
    description: 'Furnizor de șipcă metalică, tablă zincată și jgheaburi pentru construcții. 30 ani de experiență.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Esipca Metalica',
    description: 'Șipcă metalică și produse metalice de calitate',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#C0392B" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Canonical URL (updated dynamically by pages) */}
        <link rel="canonical" href="https://esipcametalica.ro" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Esipca Metalica',
              url: 'https://esipcametalica.ro',
              logo: 'https://esipcametalica.ro/logo.png',
              description: 'Furnizor de șipcă metalică, tablă zincată și jgheaburi',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'RO',
                addressLocality: 'Galati',
                streetAddress: 'DN26 Nr 19',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                telephone: '+40-722-292-519',
              },
              sameAs: [
                'https://www.facebook.com/esipcametalica',
              ],
            }),
          }}
        />
      </head>
      <body>
        <RegionProvider>
          <RegionAutoDetect />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
          <GoogleTranslator />
        </RegionProvider>
      </body>
    </html>
  )
}
