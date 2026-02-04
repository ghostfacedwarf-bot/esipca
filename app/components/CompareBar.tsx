'use client'

import { useState, useEffect } from 'react'
import { useComparator } from '@/lib/store'
import { X, GitCompare } from 'lucide-react'
import Link from 'next/link'

export default function CompareBar() {
  const [mounted, setMounted] = useState(false)
  const { products, removeProduct, clearAll } = useComparator()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || products.length === 0) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-auto sm:min-w-[320px] bg-white border-2 border-primary-500 rounded-xl shadow-xl z-40 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-primary-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2 font-semibold">
          <GitCompare size={18} />
          <span>Comparare ({products.length}/2)</span>
        </div>
        <button
          onClick={clearAll}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          title="Golește"
        >
          <X size={16} />
        </button>
      </div>

      {/* Products */}
      <div className="p-3 space-y-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-2 bg-dark-50 rounded-lg px-3 py-2"
          >
            {product.media && product.media[0]?.url ? (
              <img
                src={product.media[0].url}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-100 rounded flex items-center justify-center">
                📦
              </div>
            )}
            <span className="text-sm font-medium text-dark-800 flex-1 truncate max-w-[150px]">
              {product.name}
            </span>
            <button
              onClick={() => removeProduct(product.id)}
              className="p-1 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Elimină"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Empty slot */}
        {products.length < 2 && (
          <div className="flex items-center justify-center gap-2 border-2 border-dashed border-dark-200 rounded-lg px-3 py-3 text-dark-400">
            <span className="text-sm">+ Adaugă produs</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="px-3 pb-3">
        {products.length === 2 ? (
          <Link href="/compara" className="btn btn-primary w-full justify-center">
            Compară acum
          </Link>
        ) : (
          <button
            disabled
            className="btn btn-primary w-full justify-center opacity-50 cursor-not-allowed"
          >
            Selectează 2 produse
          </button>
        )}
      </div>
    </div>
  )
}
