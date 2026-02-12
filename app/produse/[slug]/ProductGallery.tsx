'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)

  const hasMedia = media && media.length > 0

  const goTo = useCallback((index: number) => {
    if (!media) return
    setSelectedIndex(((index % media.length) + media.length) % media.length)
  }, [media])

  const prev = useCallback(() => goTo(selectedIndex - 1), [goTo, selectedIndex])
  const next = useCallback(() => goTo(selectedIndex + 1), [goTo, selectedIndex])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    lightboxRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isLightboxOpen, prev, next])

  // Gradient fallback
  const getGradient = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colors = [
      'from-blue-500 to-blue-700', 'from-red-500 to-red-700',
      'from-green-500 to-green-700', 'from-purple-500 to-purple-700',
      'from-yellow-500 to-yellow-700', 'from-pink-500 to-pink-700',
      'from-indigo-500 to-indigo-700', 'from-teal-500 to-teal-700',
    ]
    return colors[hash % colors.length]
  }

  const gradient = getGradient(productName)

  return (
    <div>
      {/* Main Image */}
      <div
        className={`relative aspect-square bg-gradient-to-br ${gradient} rounded-lg overflow-hidden mb-4 group cursor-pointer`}
        onClick={() => hasMedia && setIsLightboxOpen(true)}
        onMouseMove={(e) => {
          if (!hasMedia) return
          const rect = e.currentTarget.getBoundingClientRect()
          setZoomPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          })
        }}
        onMouseLeave={() => setZoomPos(null)}
      >
        {hasMedia ? (
          <div
            className="w-full h-full transition-transform duration-200"
            style={zoomPos ? {
              transform: 'scale(2)',
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            } : undefined}
          >
            <Image
              src={media[selectedIndex]?.url || ''}
              alt={media[selectedIndex]?.alt || productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-8xl opacity-30 mb-4">📦</div>
            <p className="text-white text-lg font-semibold opacity-70">{category}</p>
            <p className="text-white text-sm opacity-50 mt-2">Imagine indisponibila</p>
          </div>
        )}

        {/* Zoom hint */}
        {hasMedia && !zoomPos && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={14} />
            Click pentru marire
          </div>
        )}

        {/* Counter */}
        {hasMedia && media.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {selectedIndex + 1} / {media.length}
          </div>
        )}

        {/* Prev / Next */}
        {hasMedia && media.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark-900 p-2 rounded-full shadow-lg transition z-10"
              aria-label="Imaginea anterioara"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-dark-900 p-2 rounded-full shadow-lg transition z-10"
              aria-label="Imaginea urmatoare"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - scrollable, all visible */}
      {hasMedia && media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {media.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-primary-500 ring-2 ring-primary-500/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || productName}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* No media hint */}
      {!hasMedia && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <p className="font-semibold mb-1">Imagini lipsa</p>
          <p>Administratorii pot adauga imagini din panoul de control.</p>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && hasMedia && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie imagini"
          tabIndex={-1}
        >
          {/* Close */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors z-20"
            aria-label="Inchide galeria"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-5 text-white/80 text-sm font-medium z-20">
            {selectedIndex + 1} / {media.length}
          </div>

          {/* Main lightbox image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={media[selectedIndex]?.url || ''}
              alt={media[selectedIndex]?.alt || productName}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Prev / Next for lightbox */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors z-20"
                aria-label="Imaginea anterioara"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors z-20"
                aria-label="Imaginea urmatoare"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Bottom thumbnails in lightbox */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-20">
              {media.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx) }}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedIndex === idx
                      ? 'border-white ring-2 ring-white/40'
                      : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || productName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
