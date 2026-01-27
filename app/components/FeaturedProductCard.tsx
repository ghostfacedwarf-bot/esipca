'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRegionStore } from '@/lib/store'
import { useExchangeRate, ronToEur, formatEur } from '@/lib/useExchangeRate'

interface FeaturedProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    shortDescription?: string
    priceFrom: number
    priceType: string
    media?: { url: string; alt?: string }[]
  }
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const region = useRegionStore((state) => state.region)
  const { rate: eurRate } = useExchangeRate()

  // Calculate regional price (EU = double)
  const regionalPrice = region === 'EU' ? product.priceFrom * 2 : product.priceFrom

  return (
    <Link href={`/produse/${product.slug}`}>
      <div className="card card-hover overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-primary-100 to-dark-100 flex items-center justify-center text-6xl overflow-hidden relative">
          {product.media && product.media.length > 0 ? (
            <Image
              src={product.media[0].url}
              alt={product.media[0].alt || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <span>📦</span>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-dark-600 text-sm mb-4 flex-1 line-clamp-2">{product.shortDescription}</p>
          <div className="flex items-center justify-between pt-4 border-t border-dark-200">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {regionalPrice.toFixed(2)} RON
              </p>
              <p className="text-xs text-dark-500">
                ~{formatEur(ronToEur(regionalPrice, eurRate))} EUR
              </p>
              <p className="text-xs text-dark-400">
                {product.priceType === 'per_meter' ? 'per metru' : 'per bucată'}
                <span className="ml-1">({region === 'EU' ? '🇪🇺' : '🇷🇴'})</span>
              </p>
            </div>
            <button className="btn btn-primary btn-sm">
              Detalii
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
