'use client'

import { useState } from 'react'
import { Search, Loader2, Package, Truck, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react'

interface StatusHistoryEntry {
  status: string
  date: string
  note?: string
}

interface OrderItem {
  productName: string
  variantName: string | null
  quantity: number
  price: number
}

interface TrackResult {
  orderNumber: string
  customerName: string
  status: string
  trackingNumber: string | null
  courierName: string | null
  statusHistory: StatusHistoryEntry[]
  estimatedTotal: number | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: 'In asteptare', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  confirmed: { label: 'Confirmata', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: CheckCircle },
  shipped: { label: 'Expediata', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Truck },
  completed: { label: 'Finalizata', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Anulata', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
}

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'completed']

const COURIER_TRACKING_URLS: Record<string, string> = {
  FanCourier: 'https://www.fancourier.ro/awb-tracking/?awb=',
  Sameday: 'https://www.sameday.ro/tracking/awb/',
  Cargus: 'https://www.cargus.ro/tracking/?t=',
  GLS: 'https://gls-group.eu/track/',
  DPD: 'https://tracking.dpd.de/status/en_US/parcel/',
  PostaRomana: 'https://www.pfroman.ro/tracking/',
}

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) return

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Eroare la cautarea comenzii')
        return
      }

      setResult(data.order)
    } catch {
      setError('Eroare de retea. Incercati din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIndex = (status: string) => {
    const idx = STATUS_STEPS.indexOf(status)
    return idx >= 0 ? idx : -1
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Urmarire Comanda</h1>
          <p className="text-slate-500">
            Introdu numarul comenzii si adresa de email pentru a vedea statusul
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Numar comanda
              </label>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORD-20260206-0001"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="trackEmail" className="block text-sm font-medium text-slate-700 mb-1">
                Adresa de email
              </label>
              <input
                id="trackEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.ro"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Se cauta...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Cauta comanda
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-500">Comanda</p>
                  <p className="text-lg font-bold font-mono text-slate-800">{result.orderNumber}</p>
                </div>
                {(() => {
                  const config = STATUS_CONFIG[result.status] || STATUS_CONFIG.pending
                  const Icon = config.icon
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bgColor} ${config.color}`}>
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </span>
                  )
                })()}
              </div>

              {/* Visual Status Timeline */}
              {result.status !== 'cancelled' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between relative">
                    {/* Progress line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" />
                    <div
                      className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all"
                      style={{ width: `${Math.max(0, getStepIndex(result.status)) / (STATUS_STEPS.length - 1) * 100}%` }}
                    />

                    {STATUS_STEPS.map((step, idx) => {
                      const config = STATUS_CONFIG[step]
                      const Icon = config.icon
                      const currentIdx = getStepIndex(result.status)
                      const isCompleted = idx <= currentIdx
                      const isCurrent = idx === currentIdx

                      return (
                        <div key={step} className="relative flex flex-col items-center z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className={`text-xs mt-2 font-medium ${isCompleted ? 'text-blue-700' : 'text-slate-400'}`}>
                            {config.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tracking Info */}
              {result.trackingNumber && result.courierName && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>AWB:</strong> {result.trackingNumber} ({result.courierName})
                  </p>
                  {COURIER_TRACKING_URLS[result.courierName] && (
                    <a
                      href={`${COURIER_TRACKING_URLS[result.courierName]}${encodeURIComponent(result.trackingNumber)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Urmareste coletul pe {result.courierName}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Order Items */}
            {result.items.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Produse comandate</h3>
                <div className="space-y-3">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-xs text-slate-500">{item.variantName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{item.quantity} x {formatPrice(item.price)} RON</p>
                        <p className="text-sm font-semibold text-slate-800">{formatPrice(item.price * item.quantity)} RON</p>
                      </div>
                    </div>
                  ))}
                </div>
                {result.estimatedTotal && (
                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between">
                    <span className="text-sm font-semibold text-slate-700">Total estimat</span>
                    <span className="text-lg font-bold text-green-700">{formatPrice(result.estimatedTotal)} RON</span>
                  </div>
                )}
              </div>
            )}

            {/* Status History */}
            {result.statusHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Istoric actualizari</h3>
                <div className="space-y-3">
                  {result.statusHistory.map((entry, idx) => {
                    const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{
                            backgroundColor: entry.status === 'pending' ? '#f59e0b' : entry.status === 'confirmed' ? '#3b82f6' : entry.status === 'shipped' ? '#a855f7' : entry.status === 'completed' ? '#22c55e' : '#ef4444',
                          }}
                        />
                        <div>
                          <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
                          <p className="text-xs text-slate-400">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Order date */}
            <p className="text-center text-xs text-slate-400">
              Comanda plasata la: {formatDate(result.createdAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
