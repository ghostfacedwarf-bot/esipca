'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Phone, MapPin } from 'lucide-react'
import { useCart } from '@/lib/store'
import RegionSelector from './RegionSelector'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { getTotalItems } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky-top">
      {/* Top bar with contact info */}
      <div className="bg-dark-800 text-white text-sm hidden md:block py-2">
        <div className="container-max flex justify-between items-center">
          <div className="flex gap-6">
            <a href="tel:+40722292519" className="flex items-center gap-2 hover:text-accent-400">
              <Phone size={16} />
              +40 (722) 292 519
            </a>
            <a href="mailto:office@exprestrading.com" className="hover:text-accent-400">
              office@exprestrading.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-accent-400">
              <MapPin size={16} />
              Galati, DN26 Nr 19
            </div>
            <div className="border-l border-dark-600 pl-4">
              <RegionSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <nav className="border-b border-dark-100">
        <div className="container-max flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/1024.png"
              alt="Esipca Metalica Logo"
              width={120}
              height={60}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/produse" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Produse
            </Link>
            <Link href="/despre-noi" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Despre Noi
            </Link>
            <Link href="/contact" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Region Selector */}
            <div className="md:hidden">
              <RegionSelector />
            </div>

            <Link href="/cos" className="relative p-2 hover:bg-dark-100 rounded-lg transition-colors">
              <ShoppingCart size={24} className="text-dark-700" />
              <span className="absolute top-1 right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {mounted ? getTotalItems() : 0}
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-dark-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X size={24} className="text-dark-700" />
              ) : (
                <Menu size={24} className="text-dark-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-dark-100 bg-white">
            <div className="container-max py-4 flex flex-col gap-4">
              <Link
                href="/"
                className="text-dark-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/produse"
                className="text-dark-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Produse
              </Link>
              <Link
                href="/despre-noi"
                className="text-dark-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Despre Noi
              </Link>
              <Link
                href="/contact"
                className="text-dark-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
