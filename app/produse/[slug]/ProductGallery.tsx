'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Media {
  id: string
  url: string
  alt: string
}

interface ProductGalleryProps {
  productName: string
  category: string
  media?: Media[]
}

export default function ProductGallery({ productName, category, media }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Generate a gradient color based on product name for consistent branding
  const getGradient = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colors = [
      'from-blue-500 to-blue-700',
      'from-red-500 to-red-700',
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-yellow-500 to-yellow-700',
      'from-pink-500 to-pink-700',
      'from-indigo-500 to-indigo-700',
      'from-teal-500 to-teal-700',
    ]
    return colors[hash % colors.length]
  }

  const hasMedia = media && media.length > 0
  const gradient = getGradient(productName)

  return (
    <div>
      {/* Main Image */}
      <div
        className={`relative aspect-square bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-6 overflow-hidden group`}
      >
        {hasMedia ? (
          <>
            <img
              src={media[selectedImageIndex]?.url || ''}
              alt={media[selectedImageIndex]?.alt || productName}
              className="w-full h-full object-cover"
            />
          </>
        ) : (
          <div className="text-center">
            <div className="text-8xl opacity-30 mb-4">📦</div>
            <p className="text-white text-lg font-semibold opacity-70">
              {category}
            </p>
            <p className="text-white text-sm opacity-50 mt-2">
              Imagine nu este disponibilă
            </p>
          </div>
        )}

        {/* Image Counter */}
        {hasMedia && media.length > 1 && (
          <div className="absolute top-4 right-4 bg-dark-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {selectedImageIndex + 1} / {media.length}
          </div>
        )}

        {/* Navigation Buttons */}
        {hasMedia && media.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex((prev) => (prev - 1 + media.length) % media.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-dark-100 text-dark-900 p-2 rounded-full shadow-lg transition z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setSelectedImageIndex((prev) => (prev + 1) % media.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-dark-100 text-dark-900 p-2 rounded-full shadow-lg transition z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {hasMedia && media.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {media.slice(0, 4).map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedImageIndex(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === idx
                  ? 'border-primary-500 shadow-md'
                  : 'border-dark-200 hover:border-dark-300'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
            </button>
          ))}
          {media.length > 4 && (
            <div className="aspect-square rounded-lg bg-dark-100 border-2 border-dark-200 flex items-center justify-center text-dark-600 font-semibold text-sm">
              +{media.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Upload Hint for Admin */}
      {!hasMedia && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <p className="font-semibold mb-1">📸 Imagini lipsă</p>
          <p>Administratorii pot adăuga imagini pentru acest produs din panoul de control.</p>
        </div>
      )}
    </div>
  )
}
