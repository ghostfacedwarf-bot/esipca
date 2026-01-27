'use client'

import { useState } from 'react'
import { ShoppingCart, Share2, AlertCircle } from 'lucide-react'
import { useCart, CartItem, useRegionStore, getRegionalPrice } from '@/lib/store'
import { useExchangeRate, ronToEur, formatEur } from '@/lib/useExchangeRate'
import { toast } from 'react-hot-toast'

interface Variant {
  id: string
  sku: string
  attributes: Record<string, any>
  price: number
  priceEU: number | null
  stockStatus: string
  stockQty: number
}

interface ProductOrderFormProps {
  productId: string
  productName: string
  variants: Variant[]
  priceType: string
  priceFrom: number
  categoryName?: string
  specs?: Record<string, any>
}

export default function ProductOrderForm({
  productId,
  productName,
  variants,
  priceType,
  priceFrom,
  categoryName = '',
  specs = {},
}: ProductOrderFormProps) {
  // Extract unique paint options from variants
  const paintOptions = Array.from(
    new Set(
      variants
        .map((v) => v.attributes?.optiune_vopsea)
        .filter((opt) => opt !== undefined)
    )
  ) as string[]

  // Get default paint option (first one)
  const defaultPaintOption = paintOptions.length > 0 ? paintOptions[0] : 'Standard'

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [selectedHeight, setSelectedHeight] = useState('') // Separate state for height
  const [selectedPaintOption, setSelectedPaintOption] = useState(defaultPaintOption)
  const [quantity, setQuantity] = useState(1)
  const [length, setLength] = useState('1.0') // Lungime în metri (1.0m default)
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()
  const region = useRegionStore((state) => state.region)
  const { rate: eurRate } = useExchangeRate()

  // Calculate base price for region (use first variant's priceEU ratio or default to double for EU)
  const basePrice = region === 'EU'
    ? (variants[0]?.priceEU ? (priceFrom * (variants[0].priceEU / variants[0].price)) : priceFrom * 2)
    : priceFrom

  // Get regional price for a variant
  const getVariantPrice = (variant: Variant | null): number => {
    if (!variant) return basePrice // Use regional base price when no variant selected
    return getRegionalPrice(variant.price, variant.priceEU, region)
  }

  // Find matching variant based on height and paint option
  const findMatchingVariant = (height: string, paintOpt: string) => {
    return variants.find((v) => {
      const varHeight = String(v.attributes?.inaltime || '').replace(' m', '')
      const varPaintOpt = v.attributes?.optiune_vopsea || 'Standard'
      return varHeight === height && varPaintOpt === paintOpt
    })
  }

  // Update variant when height or paint option changes
  const updateVariant = (height: string, paintOpt: string) => {
    const variant = findMatchingVariant(height, paintOpt)
    if (variant) {
      setSelectedVariant(variant)
    }
  }

  // Calculate price addition for paint option display
  const getPaintOptionPriceAdd = (option: string): string => {
    if (option.includes('mat față / mat spate')) return '+0.30 LEI/ml'
    if (option.includes('ambele părți')) return '+0.10 LEI/ml'
    return ''
  }

  // Extract bucăți per metru from specs
  const bucinPerMetru = parseInt(String(specs?.bucinPerMetru || 10), 10)

  // Calculate pieces needed based on length
  const lengthNum = parseFloat(length)
  const piecesNeeded = Math.ceil(lengthNum * bucinPerMetru * quantity)

  // Calculate total price: price per piece × pieces needed (using regional price)
  const currentPrice = getVariantPrice(selectedVariant)
  const totalPrice = currentPrice * piecesNeeded

  // Group variants by attributes for better UX
  const getUniqueAttributeValues = (attributeKey: string) => {
    return Array.from(
      new Set(
        variants
          .map((v) => v.attributes[attributeKey])
          .filter((v) => v !== undefined)
      )
    )
  }

  const getAttributeKeys = () => {
    if (variants.length === 0) return []
    return Object.keys(variants[0].attributes)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Selectează o variantă')
      return
    }

    if (!selectedHeight) {
      toast.error('Selectează o înălțime')
      return
    }

    setIsLoading(true)
    try {
      const paintLabel = getPaintOptionPriceAdd(selectedPaintOption) ? ` - ${selectedPaintOption}` : ''
      const regionalPrice = getVariantPrice(selectedVariant)
      const cartItem: CartItem = {
        id: `${productId}-${selectedVariant.id}-${region}`,
        productId,
        variantId: selectedVariant.id,
        productName,
        sku: selectedVariant.sku,
        attributes: {
          ...selectedVariant.attributes,
          inaltime: selectedHeight,
          optiune_vopsea: selectedPaintOption
        },
        price: regionalPrice,
        priceRO: selectedVariant.price,
        priceEU: selectedVariant.priceEU,
        quantity,
        priceType,
        region,
      }

      addItem(cartItem)
      toast.success(`${productName} (${selectedHeight}m${paintLabel}) adăugat în coș!`)

      // Reset form
      setQuantity(1)
      setSelectedHeight('')
    } catch (error) {
      toast.error('Eroare la adăugare în coș')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestQuote = async () => {
    if (!selectedVariant) {
      toast.error('Selectează o variantă')
      return
    }

    if (!selectedHeight) {
      toast.error('Selectează o înălțime')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          variantId: selectedVariant.id,
          sku: selectedVariant.sku,
          quantity,
          price: selectedVariant.price,
          height: selectedHeight,
          attributes: selectedVariant.attributes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send quote request')
      }

      toast.success('Cerere de ofertă trimisă!')
      setQuantity(1)
      setSelectedHeight('')
    } catch (error: any) {
      toast.error(error.message || 'Eroare la trimitere cererii')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const isOutOfStock = selectedVariant?.stockStatus === 'out_of_stock'
  const attributeKeys = getAttributeKeys()

  return (
    <div className="space-y-3 notranslate" translate="no">
      {/* Regional Base Price */}
      <div className="p-4 bg-primary-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-dark-600 text-sm">Preț de bază</p>
          <span className="text-xs px-2 py-1 bg-white rounded-full text-dark-600">
            {region === 'EU' ? '🇪🇺 Europa' : '🇷🇴 Romania'}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-primary-600">
            {basePrice.toFixed(2)}
          </span>
          <span className="text-xl text-dark-700">
            RON/{priceType === 'per_meter' ? 'metru' : 'bucată'}
          </span>
        </div>
        <p className="text-sm text-dark-500 mt-1">
          ~{formatEur(ronToEur(basePrice, eurRate))} EUR <span className="text-xs">(curs BNR)</span>
        </p>
      </div>

      {/* Variant Selector */}
      {attributeKeys.length > 0 && (
        <div className="p-4 bg-white border border-dark-100 rounded-lg space-y-3">
          <h3 className="text-base font-bold text-dark-900">Selectează Varianta</h3>

          {attributeKeys
            .filter((key) => key !== 'optiune_vopsea') // Skip optiune_vopsea - shown separately below
            .map((key) => {
            const isSipcaCategory = categoryName.toLowerCase().includes('șipcă')
            const isHeightAttribute = (key.toLowerCase() === 'inaltime' || key.toLowerCase() === 'height') && isSipcaCategory
            const uniqueValues = getUniqueAttributeValues(key)

            return (
              <div key={key}>
                <label className="block text-sm font-semibold text-dark-800 mb-3 capitalize">
                  {key === 'inaltime' ? 'Înălțime' : key}
                </label>

                {isHeightAttribute ? (
                  // Dropdown for height attribute - ONLY for Șipcă Metalică
                  <select
                    value={selectedHeight}
                    onChange={(e) => {
                      const selectedValue = e.target.value
                      setSelectedHeight(selectedValue)
                      updateVariant(selectedValue, selectedPaintOption)
                    }}
                    className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white font-semibold text-dark-900 notranslate"
                    translate="no"
                  >
                    <option value="">Selectează o înălțime...</option>
                    {Array.from({ length: 25 }, (_, i) => {
                      const height = (0.6 + i * 0.1).toFixed(1)
                      return (
                        <option key={height} value={height} className="notranslate" translate="no">
                          {height} m
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  // Buttons for other attributes
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {uniqueValues.map((value) => {
                      // When filtering by other attributes (color, etc.), keep the selected height in mind
                      const matchingVariant = variants.find((v) => {
                        const matches = v.attributes[key] === value
                        // If height is selected, also check it matches
                        if (selectedHeight && attributeKeys.includes('inaltime')) {
                          return matches && String(v.attributes['inaltime']) === selectedHeight
                        }
                        return matches
                      })
                      const isSelected = selectedVariant?.attributes[key] === value

                      return (
                        <button
                          key={String(value)}
                          onClick={() => {
                            if (matchingVariant) {
                              setSelectedVariant(matchingVariant)
                            }
                          }}
                          className={`p-3 rounded-lg font-semibold transition-all border-2 ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50 text-primary-700'
                              : 'border-dark-200 bg-white text-dark-700 hover:border-dark-300'
                          }`}
                          disabled={!matchingVariant}
                        >
                          {String(value)}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Paint Option Selector - for Șipcă Metalică (only if multiple options exist) */}
      {categoryName.toLowerCase().includes('șipcă') && paintOptions.length > 1 && (
        <div className="p-4 bg-white border border-dark-100 rounded-lg">
          <label className="block text-sm font-semibold text-dark-800 mb-3">
            Opțiuni Vopsea
          </label>
          <div className="space-y-2">
            {paintOptions.map((option) => {
              const priceAdd = getPaintOptionPriceAdd(option)
              const isSelected = selectedPaintOption === option

              return (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300"
                  style={{
                    borderColor: isSelected ? '#16a34a' : '#e5e7eb',
                    backgroundColor: isSelected ? '#f0fdf4' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="optiune_vopsea"
                    value={option}
                    checked={isSelected}
                    onChange={(e) => {
                      setSelectedPaintOption(e.target.value)
                      updateVariant(selectedHeight, e.target.value)
                    }}
                    className="w-4 h-4 text-primary-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-dark-900">{option}</span>
                      {priceAdd && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded">
                          {priceAdd}
                        </span>
                      )}
                    </div>
                    {option.includes('Standard') && (
                      <p className="text-xs text-dark-500">Grund alb/gri pe spate</p>
                    )}
                    {option.includes('o parte') && (
                      <p className="text-xs text-dark-500">Vopsit doar pe față</p>
                    )}
                    {(option.includes('ambele') || option.includes('mat spate')) && (
                      <p className="text-xs text-dark-500">Aceeași culoare pe ambele fețe</p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Length Input */}
      <div className="p-4 bg-white border border-dark-100 rounded-lg notranslate" translate="no">
        <label className="block text-sm font-semibold text-dark-800 mb-2">
          Lungime (m)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Ex: 87.5"
            step="0.1"
            min="0.1"
            className="flex-1 px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold text-dark-900 text-sm notranslate"
            translate="no"
          />
          <span className="text-dark-600 font-semibold text-sm">m</span>
        </div>
        <p className="text-xs text-dark-500 mt-1">
          Introdu orice valoare (ex: 1.5, 2.75, 87.5)
        </p>
      </div>

      {/* Variant Details & Pricing */}
      {selectedVariant && selectedHeight && (
        <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-dark-600 text-xs mb-1">Înălțime selectată</p>
              <p className="font-bold text-primary-700 text-sm">
                {selectedHeight} m
              </p>
            </div>
            {paintOptions.length > 1 && (
              <div>
                <p className="text-dark-600 text-xs mb-1">Opțiune vopsea</p>
                <p className="font-bold text-primary-700 text-sm">
                  {selectedPaintOption}
                  {getPaintOptionPriceAdd(selectedPaintOption) && (
                    <span className="text-xs ml-1 text-primary-600">
                      ({getPaintOptionPriceAdd(selectedPaintOption)})
                    </span>
                  )}
                </p>
              </div>
            )}
            <div>
              <p className="text-dark-600 text-xs mb-1">Cod produs</p>
              <p className="font-mono font-semibold text-dark-900 text-xs">
                {selectedVariant.sku}
              </p>
            </div>
            <div>
              <p className="text-dark-600 text-xs mb-1">Stoc</p>
              <p className={`font-semibold text-sm ${
                selectedVariant.stockStatus === 'in_stock'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {selectedVariant.stockStatus === 'in_stock'
                  ? `${selectedVariant.stockQty} buc.`
                  : 'Indisponibil'}
              </p>
            </div>
            <div>
              <p className="text-dark-600 text-xs mb-1">Preț/buc ({region === 'EU' ? 'Europa' : 'Romania'})</p>
              <p className="font-bold text-primary-600">
                {currentPrice.toFixed(2)} RON
              </p>
            </div>
            <div>
              <p className="text-dark-600 text-xs mb-1">Buc. necesare</p>
              <p className="font-bold text-dark-900">
                {piecesNeeded} buc.
              </p>
              <p className="text-xs text-dark-500 mt-0.5">
                ({lengthNum}m × {quantity} × {bucinPerMetru})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="p-4 bg-white border border-dark-100 rounded-lg notranslate" translate="no">
        <label className="block text-sm font-semibold text-dark-800 mb-2">
          Cantitate (unități)
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 border border-dark-200 rounded-lg hover:bg-dark-100 transition"
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-2 border border-dark-200 rounded-lg text-center font-semibold notranslate"
            translate="no"
            min="1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 border border-dark-200 rounded-lg hover:bg-dark-100 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Total Price Summary */}
      <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center text-xs text-dark-500">
            <span>Preturi pentru:</span>
            <span className="font-medium">{region === 'EU' ? '🇪🇺 Europa' : '🇷🇴 Romania'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-700">Preț/buc:</span>
            <div className="text-right">
              <span className="font-semibold text-dark-900">{currentPrice.toFixed(2)} RON</span>
              <span className="text-xs text-dark-500 ml-1">(~{formatEur(ronToEur(currentPrice, eurRate))} €)</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-700">Buc. necesare:</span>
            <span className="font-semibold text-dark-900">{piecesNeeded} buc.</span>
          </div>
          <div className="border-t border-primary-300 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-dark-900">TOTAL:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary-600">{totalPrice.toFixed(2)} RON</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-dark-500">
                ({lengthNum}m × {quantity} × {bucinPerMetru} = {piecesNeeded} buc)
              </span>
              <span className="text-sm font-semibold text-dark-600">~{formatEur(ronToEur(totalPrice, eurRate))} EUR</span>
            </div>
            <p className="text-xs text-dark-400 mt-1 text-right">curs BNR: 1 EUR = {eurRate.toFixed(4)} RON</p>
          </div>
        </div>
      </div>

      {/* Stock Warning */}
      {isOutOfStock && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Produs indisponibil</p>
            <p className="text-sm">Contactează-ne pentru a afla când va fi disponibil</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-sm"
        >
          <ShoppingCart size={18} />
          {isLoading ? 'Se adaugă...' : 'Adaugă în Coș'}
        </button>
        <button
          onClick={handleRequestQuote}
          disabled={isLoading}
          className="w-full btn btn-outline flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-2 text-sm"
        >
          📋 Solicită Ofertă
        </button>
        <button className="w-full btn btn-ghost flex items-center justify-center gap-2 py-2 text-sm">
          <Share2 size={16} />
          Partajează
        </button>
      </div>

      {/* Info */}
      <div className="p-3 bg-dark-50 rounded-lg text-xs text-dark-700">
        <p>
          Nu ești sigur ce variantă alegi?
          <a href="/contact" className="text-primary-600 font-semibold hover:text-primary-700">
            {' '}Contactează-ne
          </a>
        </p>
      </div>
    </div>
  )
}
