'use client'

import { useState, useEffect } from 'react'
import { useComparator, useRegionStore } from '@/lib/store'
import { useExchangeRate, ronToEur, formatEur } from '@/lib/useExchangeRate'
import { X, ArrowLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Spec key translations
const specTranslations: Record<string, string> = {
  latime: 'Lățime',
  profil: 'Profil',
  culoare: 'Culoare',
  finisaj: 'Finisaj',
  grosime: 'Grosime',
  discount: 'Discount',
  material: 'Material',
  bucinPerMetru: 'Bucăți/Metru',
  prețOriginal: 'Preț Original',
  thickness: 'Grosime',
  colors: 'Culori disponibile',
}

export default function ComparePage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { products, removeProduct, clearAll } = useComparator()
  const region = useRegionStore((state) => state.region)
  const { rate: eurRate } = useExchangeRate()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-pulse text-4xl mb-4">⏳</div>
          <p className="text-dark-500">Se încarcă...</p>
        </div>
      </main>
    )
  }

  // If no products to compare, show empty state
  if (products.length === 0) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold mb-2">Niciun produs de comparat</h1>
          <p className="text-dark-600 mb-6">
            Selectează 2 produse din catalog pentru a le compara.
          </p>
          <Link href="/produse" className="btn btn-primary">
            <ArrowLeft size={18} />
            Înapoi la produse
          </Link>
        </div>
      </main>
    )
  }

  // If only 1 product, show partial state
  if (products.length === 1) {
    return (
      <main className="min-h-[60vh]">
        <div className="bg-dark-50 border-b border-dark-100 py-4">
          <div className="container-max text-sm text-dark-600">
            <Link href="/" className="hover:text-dark-900">Home</Link> /
            <Link href="/produse" className="hover:text-dark-900 mx-1">Produse</Link> /
            <span className="text-dark-900 font-semibold">Comparare</span>
          </div>
        </div>

        <div className="container-max py-8">
          <h1 className="text-3xl font-bold mb-6">Comparare Produse</h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Ai selectat 1 produs. Mai selectează încă un produs pentru a compara.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* First product */}
            <ProductColumn
              product={products[0]}
              region={region}
              eurRate={eurRate}
              onRemove={() => removeProduct(products[0].id)}
            />

            {/* Empty slot */}
            <div className="border-2 border-dashed border-dark-200 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="text-4xl mb-3 opacity-50">+</div>
              <p className="text-dark-500 mb-4">Selectează al doilea produs</p>
              <Link href="/produse" className="btn btn-outline btn-sm">
                Vezi produse
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Get all unique spec keys from both products
  const allSpecKeys = new Set<string>()
  products.forEach(p => {
    if (p.specs) {
      Object.keys(p.specs).forEach(key => allSpecKeys.add(key))
    }
  })

  return (
    <main>
      {/* Breadcrumb */}
      <div className="bg-dark-50 border-b border-dark-100 py-4">
        <div className="container-max text-sm text-dark-600">
          <Link href="/" className="hover:text-dark-900">Home</Link> /
          <Link href="/produse" className="hover:text-dark-900 mx-1">Produse</Link> /
          <span className="text-dark-900 font-semibold">Comparare</span>
        </div>
      </div>

      <div className="container-max py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Comparare Produse</h1>
          <button
            onClick={() => { clearAll(); router.push('/produse') }}
            className="btn btn-ghost text-dark-500"
          >
            <X size={18} />
            Golește comparația
          </button>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-dark-50 border border-dark-100 w-1/4 text-left font-semibold">
                  Caracteristică
                </th>
                {products.map(product => (
                  <th key={product.id} className="p-4 bg-dark-50 border border-dark-100 w-[37.5%]">
                    <div className="relative">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        aria-label={`Elimină ${product.name}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Product images */}
              <tr>
                <td className="p-4 border border-dark-100 font-semibold bg-dark-50">
                  Imagine
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border border-dark-100 text-center">
                    <Link href={`/produse/${product.slug}`}>
                      {product.media && product.media[0]?.url ? (
                        <img
                          src={product.media[0].url}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mx-auto flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                    </Link>
                  </td>
                ))}
              </tr>

              {/* Product names */}
              <tr>
                <td className="p-4 border border-dark-100 font-semibold bg-dark-50">
                  Nume produs
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border border-dark-100 text-center">
                    <Link
                      href={`/produse/${product.slug}`}
                      className="text-lg font-bold text-primary-600 hover:text-primary-700"
                    >
                      {product.name}
                    </Link>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="p-4 border border-dark-100 font-semibold bg-dark-50">
                  Categorie
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border border-dark-100 text-center text-dark-600">
                    {product.category?.name || '-'}
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr>
                <td className="p-4 border border-dark-100 font-semibold bg-dark-50">
                  Preț ({region === 'EU' ? '🇪🇺' : '🇷🇴'})
                </td>
                {products.map(product => {
                  const regionalPrice = region === 'EU' ? product.priceFrom * 2 : product.priceFrom
                  return (
                    <td key={product.id} className="p-4 border border-dark-100 text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {regionalPrice.toFixed(2)} RON
                      </div>
                      <div className="text-sm text-dark-500">
                        ~{formatEur(ronToEur(regionalPrice, eurRate))} EUR
                      </div>
                      <div className="text-xs text-dark-400 mt-1">
                        {product.priceType === 'per_meter' ? 'per metru' : 'per bucată'}
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* Dynamic specs */}
              {Array.from(allSpecKeys).map((key, idx) => (
                <tr key={key} className={idx % 2 === 0 ? 'bg-dark-50/50' : ''}>
                  <td className="p-4 border border-dark-100 font-semibold bg-dark-50">
                    {specTranslations[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                  </td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 border border-dark-100 text-center">
                      {product.specs && product.specs[key] !== undefined
                        ? String(product.specs[key])
                        : <span className="text-dark-300">-</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}

              {/* Actions */}
              <tr>
                <td className="p-4 border border-dark-100 font-semibold bg-dark-50">
                  Acțiuni
                </td>
                {products.map(product => (
                  <td key={product.id} className="p-4 border border-dark-100 text-center">
                    <Link
                      href={`/produse/${product.slug}`}
                      className="btn btn-primary btn-sm inline-flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Vezi detalii
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link href="/produse" className="btn btn-outline inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Înapoi la produse
          </Link>
        </div>
      </div>
    </main>
  )
}

// Product column component for single product view
function ProductColumn({
  product,
  region,
  eurRate,
  onRemove
}: {
  product: any
  region: 'RO' | 'EU'
  eurRate: number
  onRemove: () => void
}) {
  const regionalPrice = region === 'EU' ? product.priceFrom * 2 : product.priceFrom

  return (
    <div className="card p-4 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        aria-label={`Elimină ${product.name}`}
      >
        <X size={16} />
      </button>

      <Link href={`/produse/${product.slug}`}>
        {product.media && product.media[0]?.url ? (
          <img
            src={product.media[0].url}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 flex items-center justify-center text-6xl">
            📦
          </div>
        )}
      </Link>

      <Link
        href={`/produse/${product.slug}`}
        className="text-lg font-bold text-dark-900 hover:text-primary-600 block mb-2"
      >
        {product.name}
      </Link>

      <p className="text-dark-500 text-sm mb-3">{product.category?.name}</p>

      <div className="text-xl font-bold text-primary-600">
        {regionalPrice.toFixed(2)} RON
      </div>
      <div className="text-sm text-dark-500">
        ~{formatEur(ronToEur(regionalPrice, eurRate))} EUR
      </div>
    </div>
  )
}
