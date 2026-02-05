'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store'
import { useRegion } from '@/lib/region-context'
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

const EU_COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgia' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croația' },
  { code: 'CY', name: 'Cipru' },
  { code: 'CZ', name: 'Cehia' },
  { code: 'DK', name: 'Danemarca' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finlanda' },
  { code: 'FR', name: 'Franța' },
  { code: 'DE', name: 'Germania' },
  { code: 'GR', name: 'Grecia' },
  { code: 'HU', name: 'Ungaria' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'IT', name: 'Italia' },
  { code: 'LV', name: 'Letonia' },
  { code: 'LT', name: 'Lituania' },
  { code: 'LU', name: 'Luxemburg' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Olanda' },
  { code: 'PL', name: 'Polonia' },
  { code: 'PT', name: 'Portugalia' },
  { code: 'SK', name: 'Slovacia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spania' },
  { code: 'SE', name: 'Suedia' },
  { code: 'GB', name: 'Marea Britanie' },
  { code: 'CH', name: 'Elveția' },
  { code: 'NO', name: 'Norvegia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'UA', name: 'Ucraina' },
]

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems, recalculatePrices } = useCart()
  const { region } = useRegion()
  const [isLoading, setIsLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: region === 'EU' ? '' : 'RO',
  })
  const [errors, setErrors] = useState<Partial<CustomerData>>({})

  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Recalculate prices when region changes
  useEffect(() => {
    if (items.length > 0) {
      recalculatePrices(region)
    }
  }, [region])

  // Set country when region changes
  useEffect(() => {
    if (region === 'RO') {
      setCustomerData(prev => ({ ...prev, country: 'RO' }))
    } else if (customerData.country === 'RO') {
      setCustomerData(prev => ({ ...prev, country: '' }))
    }
  }, [region])

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {}
    if (!customerData.name.trim()) newErrors.name = 'Numele este obligatoriu'
    if (!customerData.email.trim()) newErrors.email = 'Email este obligatoriu'
    if (!customerData.phone.trim()) newErrors.phone = 'Telefonul este obligatoriu'
    if (!customerData.address.trim()) newErrors.address = 'Adresa este obligatorie'
    if (!customerData.city.trim()) newErrors.city = 'Orașul este obligatoriu'
    if (!customerData.postalCode.trim()) newErrors.postalCode = 'Codul poștal este obligatoriu'
    if (region === 'EU' && !customerData.country.trim()) newErrors.country = 'Țara este obligatorie'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  if (isLoading) {
    return (
      <div className="container-max py-12">
        <div className="flex justify-center items-center h-96">
          <p className="text-dark-600">Se încarcă...</p>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-dark-900 mb-4">Comandă Plasată cu Succes!</h1>
          <p className="text-dark-600 mb-4 text-lg">
            Comanda ta a fost primită și este în curs de procesare.
          </p>
          <p className="text-dark-600 mb-8">
            Vei primi în scurt timp un email cu detaliile comenzii și informații despre livrare.
          </p>
          <div className="space-y-3">
            <p className="text-dark-700 font-semibold">
              Contactează-ne pentru orice întrebări:
            </p>
            <a href="tel:+40722292519" className="text-primary-600 font-semibold hover:text-primary-700 block">
              📞 +40 (722) 292 519
            </a>
            <a href="mailto:clienti@metalfence.ro" className="text-primary-600 font-semibold hover:text-primary-700 block">
              📧 clienti@metalfence.ro
            </a>
          </div>
          <Link href="/produse" className="btn btn-primary mt-8 inline-block">
            Continuă Cumpărăturile
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-max py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/produse" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2">
              <ArrowLeft size={16} />
              Înapoi la produse
            </Link>
          </div>

          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-dark-900 mb-4">Coșul tău este gol</h1>
            <p className="text-dark-600 mb-8">Explorează catalogul nostru și adaugă produse în coș</p>
            <Link href="/produse" className="btn btn-primary">
              Explorează Produse
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error('Completează toate câmpurile obligatorii')
      return
    }

    setIsLoading(true)
    try {
      // Get user's language preference for email
      const userLanguage = typeof window !== 'undefined'
        ? localStorage.getItem('esipca_language') || 'ro'
        : 'ro'

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: customerData,
          totalPrice: getTotalPrice(),
          language: userLanguage,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Eroare la plasarea comenzii')
      }

      clearCart()
      setOrderPlaced(true)
      toast.success('Comandă plasată cu succes!')
    } catch (error: any) {
      toast.error(error.message || 'Eroare la plasarea comenzii')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-dark-50 border-b border-dark-100 py-4">
        <div className="container-max text-sm text-dark-600">
          <Link href="/" className="hover:text-dark-900">Home</Link> / <span className="text-dark-900 font-semibold">Coș de Cumpărături</span>
        </div>
      </div>

      <div className="container-max py-12">
        <h1 className="text-4xl font-bold mb-8">Coșul Tău de Cumpărături</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-white border border-dark-100 rounded-lg">
              <h2 className="text-xl font-bold text-dark-900 mb-6">Informații de Livrare</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-dark-800 mb-2">
                    Nume și Prenume *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900"
                    placeholder="Ion Popescu"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-dark-800 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900"
                      placeholder="ion@exemplu.ro"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-dark-800 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900"
                      placeholder="+40 (722) 292 519"
                    />
                    {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-dark-800 mb-2">
                    Adresă *
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900"
                    placeholder="Strada Alexandru Cel Bun, Nr. 25"
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                {region === 'EU' && (
                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-dark-800 mb-2">
                      Țară *
                    </label>
                    <select
                      id="country"
                      value={customerData.country}
                      onChange={(e) => setCustomerData({ ...customerData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900 bg-white"
                    >
                      <option value="">Selectează țara...</option>
                      {EU_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-dark-800 mb-2">
                      Oraș *
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={customerData.city}
                      onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900"
                      placeholder="Galați"
                    />
                    {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-semibold text-dark-800 mb-2">
                      Cod Poștal *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={customerData.postalCode}
                      onChange={(e) => setCustomerData({ ...customerData, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900"
                      placeholder="800012"
                    />
                    {errors.postalCode && <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-6 bg-white border border-dark-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0 shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
                        <span className="text-2xl">📦</span>
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark-900 mb-2">{item.productName}</h3>
                      <p className="text-sm text-dark-600 mb-3">
                        <span className="font-mono">SKU: {item.sku}</span>
                      </p>

                      {/* Display relevant attributes */}
                      <div className="mb-3 text-sm text-dark-700 space-y-1">
                        {item.attributes.inaltime && (
                          <div>
                            <span className="font-semibold">Înălțime:</span> {item.attributes.inaltime} m
                          </div>
                        )}
                        {item.attributes.optiune_vopsea && item.attributes.optiune_vopsea !== 'Standard' && (
                          <div>
                            <span className="font-semibold">Vopsea:</span> {item.attributes.optiune_vopsea}
                          </div>
                        )}
                        {item.attributes.doubleSided && (
                          <div className="text-blue-600 font-semibold">
                            Vopsit față/spate (+{item.doubleSidedSurcharge?.toFixed(2) || '0.00'} RON/buc)
                          </div>
                        )}
                      </div>

                      {/* Price display */}
                      <div className="space-y-1">
                        {item.pricePerMeter && (
                          <p className="text-sm text-dark-500">
                            Preț bază: {item.pricePerMeter.toFixed(2)} RON/metru
                          </p>
                        )}
                        <p className="font-bold text-primary-600">
                          {item.price.toFixed(2)} RON/bucată
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={() => {
                          removeItem(item.id)
                          toast.success('Produs eliminat din coș')
                        }}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex items-center gap-3 bg-dark-50 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-dark-200 rounded transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-dark-600">Total:</p>
                        <p className="text-lg font-bold text-dark-900">
                          {(item.price * item.quantity).toFixed(2)} RON
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="p-6 bg-primary-50 border border-primary-200 rounded-lg">
                <h2 className="text-lg font-bold text-dark-900 mb-4">Rezumat Comandă</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-primary-200">
                  <div className="flex justify-between text-dark-600 text-sm">
                    <span>Preturi pentru:</span>
                    <span className="font-medium">
                      {region === 'EU' ? '🇪🇺 Europa' : '🇷🇴 Romania'}
                    </span>
                  </div>
                  <div className="flex justify-between text-dark-700">
                    <span>Articole ({getTotalItems()}):</span>
                    <span className="font-semibold">
                      {getTotalPrice().toFixed(2)} RON
                    </span>
                  </div>
                  <div className="flex justify-between text-dark-700">
                    <span>Livrare:</span>
                    <span className="text-sm text-primary-600">Se va calcula</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">
                    {getTotalPrice().toFixed(2)} RON
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                  className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  <ShoppingCart size={20} />
                  {isLoading ? 'Se procesează...' : 'Plasează Comanda'}
                </button>

                <button
                  onClick={() => {
                    clearCart()
                    toast.success('Coșul a fost golit')
                  }}
                  className="w-full btn btn-outline"
                >
                  Golește Coșul
                </button>
              </div>

              <div className="p-4 bg-dark-50 rounded-lg text-sm text-dark-700">
                <p className="mb-2">
                  <span className="font-semibold">📧 Contactează-ne</span> pentru detalii despre livrare și plată.
                </p>
                <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700">
                  Trimite o întrebare
                </Link>
              </div>

              <div className="p-4 bg-accent-50 rounded-lg text-sm text-accent-900">
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Livrare rapidă 1-7 zile</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Plată securizată</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Consultanță gratuită</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-dark-100">
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <ArrowLeft size={16} />
            Continuă cumpărăturile
          </Link>
        </div>
      </div>
    </div>
  )
}
