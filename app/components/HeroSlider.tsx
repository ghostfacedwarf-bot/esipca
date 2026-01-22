'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: number
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  bgColor: string
  bgGradient: string
  bgImage?: string
  bgImages?: string[]
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Șipcă Metalică Premium',
    subtitle: 'Garduri elegante și rezistente - Livrare Oriunde în România',
    cta: 'Vezi Produse',
    ctaLink: '/produse',
    bgColor: 'from-primary-600 to-primary-800',
    bgGradient: 'bg-gradient-to-r',
    bgImage: '/images/hero/sipca-1.jpg',
  },
  {
    id: 2,
    title: '30+ Ani de Experiență',
    subtitle: 'Consultanță Profesională Gratuită - Transport Gratuit',
    cta: 'Contactează-ne',
    ctaLink: '/contact',
    bgColor: 'from-dark-700 to-dark-900',
    bgGradient: 'bg-gradient-to-r',
    bgImage: '/images/hero/experienta.jpg',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoplay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setIsAutoplay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoplay(false)
  }

  const goToSlide = (index: number) => {
    setCurrent(index)
    setIsAutoplay(false)
  }

  const slide = slides[current]

  return (
    <section
      className={`relative overflow-hidden py-24 md:py-40 transition-all duration-500`}
      style={slide.bgImage ? {
        backgroundImage: `url('${slide.bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {/* Multiple Images Background (for bgImages array) */}
      {slide.bgImages && (
        <div className="absolute inset-0 flex">
          {slide.bgImages.map((img, idx) => (
            <div
              key={idx}
              className="flex-1"
              style={{
                backgroundImage: `url('${img}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Background overlay with gradient */}
      <div className={`absolute inset-0 ${slide.bgGradient} ${slide.bgColor} opacity-60`}></div>

      {/* Animated background pattern (for non-image slides) */}
      {!slide.bgImage && !slide.bgImages && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="container-max relative z-10">
        <div className="text-center text-white space-y-8 max-w-3xl mx-auto">
          {/* Title */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              {slide.subtitle}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-primary-50 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              {slide.cta}
              <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        onMouseEnter={() => setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
        onMouseEnter={() => setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        <ChevronRight size={28} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-white w-8 shadow-lg'
                : 'bg-white/50 w-3 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 right-8 z-20 text-white/80 font-semibold text-sm backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full">
        {current + 1} / {slides.length}
      </div>
    </section>
  )
}
