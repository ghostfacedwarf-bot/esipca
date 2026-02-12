'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import ProductCard from './ProductCard'
import PriceRangeSlider from './PriceRangeSlider'

interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  longDescription: string | null
  priceFrom: number
  discountPercent?: number
  priceType: string
  categoryId: string
  specs: Record<string, any> | null
  isFeatured: boolean
  isBestseller: boolean
  category?: { name: string }
  media?: { url: string }[]
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductsClientViewProps {
  allProducts: Product[]
  categories: Category[]
}

const ITEMS_PER_PAGE = 9

const SORT_OPTIONS = [
  { value: 'default', label: 'Recomandare' },
  { value: 'price-asc', label: 'Pret (crescator)' },
  { value: 'price-desc', label: 'Pret (descrescator)' },
  { value: 'bestseller', label: 'Cele mai vandute' },
]

export default function ProductsClientView({ allProducts, categories }: ProductsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Extract filter options from data
  const filterOptions = useMemo(() => {
    const prices = allProducts.map(p => p.priceFrom)
    const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices) * 100) / 100 : 0
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices) * 100) / 100 : 100

    const colors = new Set<string>()
    const profiles = new Set<string>()

    for (const p of allProducts) {
      if (p.specs?.culoare) colors.add(p.specs.culoare)
      if (p.specs?.profil) profiles.add(p.specs.profil)
    }

    return {
      minPrice,
      maxPrice,
      colors: Array.from(colors).sort(),
      profiles: Array.from(profiles).sort((a, b) => {
        const numA = parseInt(a.replace('P', ''))
        const numB = parseInt(b.replace('P', ''))
        return numA - numB
      }),
    }
  }, [allProducts])

  // Initialize price range
  useEffect(() => {
    setPriceRange([filterOptions.minPrice, filterOptions.maxPrice])
  }, [filterOptions.minPrice, filterOptions.maxPrice])

  // Filter + sort + search
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((p) => {
        const inName = p.name.toLowerCase().includes(q)
        const inDesc = (p.shortDescription || '').toLowerCase().includes(q)
          || (p.longDescription || '').toLowerCase().includes(q)
        const inSpecs = p.specs
          ? Object.values(p.specs).some((v) => String(v).toLowerCase().includes(q))
          : false
        return inName || inDesc || inSpecs
      })
    }

    // Category
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory)
    }

    // Price range
    if (priceRange[0] > filterOptions.minPrice || priceRange[1] < filterOptions.maxPrice) {
      result = result.filter((p) => p.priceFrom >= priceRange[0] && p.priceFrom <= priceRange[1])
    }

    // Color
    if (selectedColors.length > 0) {
      result = result.filter((p) => p.specs?.culoare && selectedColors.includes(p.specs.culoare))
    }

    // Profile
    if (selectedProfiles.length > 0) {
      result = result.filter((p) => p.specs?.profil && selectedProfiles.includes(p.specs.profil))
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.priceFrom - b.priceFrom)
        break
      case 'price-desc':
        result.sort((a, b) => b.priceFrom - a.priceFrom)
        break
      case 'bestseller':
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
        break
    }

    return result
  }, [allProducts, searchQuery, selectedCategory, sortBy, priceRange, selectedColors, selectedProfiles, filterOptions.minPrice, filterOptions.maxPrice])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const hasActiveFilters = searchQuery || selectedCategory || selectedColors.length > 0 || selectedProfiles.length > 0
    || priceRange[0] > filterOptions.minPrice || priceRange[1] < filterOptions.maxPrice

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedColors([])
    setSelectedProfiles([])
    setPriceRange([filterOptions.minPrice, filterOptions.maxPrice])
    setSortBy('default')
    setCurrentPage(1)
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
    setCurrentPage(1)
  }

  const toggleProfile = (profile: string) => {
    setSelectedProfiles(prev =>
      prev.includes(profile) ? prev.filter(p => p !== profile) : [...prev, profile]
    )
    setCurrentPage(1)
  }

  const filterSidebar = (
    <div className="space-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Filter size={20} />
        Filtre
      </h2>

      {/* Search */}
      <div>
        <label className="font-semibold text-dark-900 mb-2 block text-sm">Cauta</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            placeholder="Cauta produs..."
            className="w-full pl-9 pr-8 py-2.5 border border-dark-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setCurrentPage(1) }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div className="pt-4 border-t border-dark-100">
          <h3 className="font-semibold text-dark-900 mb-3 text-sm">Categorii</h3>
          <div className="space-y-1.5">
            <button
              onClick={() => { setSelectedCategory(''); setCurrentPage(1) }}
              className={`block w-full text-left py-2 px-3 rounded-lg transition-colors text-sm ${
                !selectedCategory
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : 'text-dark-600 hover:bg-dark-50'
              }`}
            >
              Toate categoriile
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1) }}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-colors text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-dark-600 hover:bg-dark-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="pt-4 border-t border-dark-100">
        <h3 className="font-semibold text-dark-900 mb-3 text-sm">Pret (RON/ml)</h3>
        <PriceRangeSlider
          min={filterOptions.minPrice}
          max={filterOptions.maxPrice}
          value={priceRange}
          onChange={(v) => { setPriceRange(v); setCurrentPage(1) }}
        />
      </div>

      {/* Color Filter */}
      {filterOptions.colors.length > 0 && (
        <div className="pt-4 border-t border-dark-100">
          <h3 className="font-semibold text-dark-900 mb-3 text-sm">Culoare</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.colors.map((color) => (
              <label key={color} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleColor(color)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-dark-600">{color}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Profile Filter */}
      {filterOptions.profiles.length > 0 && (
        <div className="pt-4 border-t border-dark-100">
          <h3 className="font-semibold text-dark-900 mb-3 text-sm">Profil</h3>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.profiles.map((profile) => (
              <button
                key={profile}
                onClick={() => toggleProfile(profile)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  selectedProfiles.includes(profile)
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                }`}
              >
                {profile}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear all filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-dark-100">
          <button
            onClick={clearAllFilters}
            className="w-full py-2.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium border border-primary-200"
          >
            Sterge toate filtrele
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="bg-white p-6 rounded-lg border border-dark-100 sticky top-24">
          {filterSidebar}
        </div>
      </aside>

      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-dark-200 rounded-lg text-dark-700 font-medium"
        >
          <SlidersHorizontal size={18} />
          Filtre {hasActiveFilters ? `(active)` : ''}
        </button>

        {showMobileFilters && (
          <div className="mt-3 bg-white p-6 rounded-lg border border-dark-100">
            {filterSidebar}
          </div>
        )}
      </div>

      {/* Products grid */}
      <section className="lg:col-span-3">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-dark-100">
          <p className="text-dark-600 text-sm">
            <span className="font-semibold">{filteredProducts.length}</span> produse gasite
            {searchQuery && (
              <span className="ml-1">
                pentru &quot;<span className="font-semibold text-dark-800">{searchQuery}</span>&quot;
              </span>
            )}
          </p>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2 border border-dark-200 rounded-lg text-dark-700 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Products */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid-products">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-dark-100">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex items-center gap-1 px-4 py-2 border border-dark-200 rounded-lg text-dark-700 hover:bg-dark-50 transition-colors font-semibold text-sm"
                  >
                    <ChevronLeft size={16} />
                    Inapoi
                  </button>
                )}

                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                        pageNum === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'border border-dark-200 text-dark-700 hover:bg-dark-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex items-center gap-1 px-4 py-2 border border-dark-200 rounded-lg text-dark-700 hover:bg-dark-50 transition-colors font-semibold text-sm"
                  >
                    Inainte
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto mb-4 text-dark-300" />
            <p className="text-dark-600 text-lg mb-2">Nu am gasit produse</p>
            <p className="text-dark-400 text-sm mb-6">Incearca alte filtre sau sterge cautarea</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Sterge filtrele
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
