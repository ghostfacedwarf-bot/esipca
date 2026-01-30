'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, GitCompare, Check } from 'lucide-react'
import { useRegionStore, useComparator, CompareProduct } from '@/lib/store'
import { useExchangeRate, ronToEur, formatEur } from '@/lib/useExchangeRate'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    priceFrom: number
    priceType: string
    specs?: Record<string, any> | null
    category?: { name: string }
    media?: { url: string }[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false)
  const region = useRegionStore((state) => state.region)
  const { rate: eurRate } = useExchangeRate()
  const { addProduct, removeProduct, isInComparison, canAdd } = useComparator()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate regional price (EU = double)
  const regionalPrice = region === 'EU' ? product.priceFrom * 2 : product.priceFrom

  // Only check comparison status after mount to avoid hydration mismatch
  const inComparison = mounted && isInComparison(product.id)

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inComparison) {
      removeProduct(product.id)
      toast.success(`${product.name} eliminat din comparație`)
    } else if (canAdd()) {
      const compareProduct: CompareProduct = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceFrom: product.priceFrom,
        priceType: product.priceType,
        specs: product.specs || null,
        category: product.category,
        media: product.media,
      }
      const added = addProduct(compareProduct)
      if (added) {
        toast.success(`${product.name} adăugat pentru comparație`)
      }
    } else {
      toast.error('Poți compara maxim 2 produse')
    }
  }

  return (
    <Link href={`/produse/${product.slug}`}>
      <div className="card card-hover h-full flex flex-col">
        {/* Product image */}
        <div className="aspect-square bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden group relative">
          {product.media && product.media.length > 0 && product.media[0]?.url ? (
            <img
              src={product.media[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <>
              <div className="text-6xl group-hover:scale-110 transition-transform">📦</div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors" />
            </>
          )}

          {/* Compare button overlay */}
          <button
            onClick={handleCompareClick}
            className={`absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-md transition-all text-xs font-medium ${
              inComparison
                ? 'bg-primary-500 text-white'
                : 'bg-white/95 text-dark-700 hover:bg-primary-500 hover:text-white'
            }`}
            title={inComparison ? 'Elimină din comparație' : 'Adaugă pentru comparație'}
          >
            {inComparison ? <Check size={14} /> : <GitCompare size={14} />}
            <span className="hidden sm:inline">{inComparison ? 'Comparat' : 'Compară'}</span>
          </button>
        </div>

        {/* Product info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-dark-900 truncate-2 mb-2 flex-1">
            {product.name}
          </h3>

          <p className="text-dark-600 text-sm mb-4">
            {product.category?.name}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-dark-100">
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
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
