'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ShoppingCart, ChevronLeft, LogOut, RefreshCw, Loader2, Search,
  X, Package, Clock, CheckCircle, Truck, XCircle, Mail, Phone,
  MapPin, Save, FileText, ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  price: number
  productName: string
  variantName: string | null
  sku: string | null
  imageUrl: string | null
  attributes: Record<string, unknown> | null
  createdAt: string
}

interface StatusHistoryEntry {
  status: string
  date: string
  note?: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string | null
  customerCity: string | null
  customerCounty: string | null
  customerPostal: string | null
  customerCountry: string | null
  items: OrderItem[]
  message: string | null
  estimatedTotal: number | null
  status: string
  paymentMethod: string
  notes: string | null
  trackingNumber: string | null
  courierName: string | null
  statusHistory: StatusHistoryEntry[] | null
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  shipped: number
  completed: number
  cancelled: number
  totalRevenue: number
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: typeof Clock }> = {
  pending: { label: 'In asteptare', bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  confirmed: { label: 'Confirmata', bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
  shipped: { label: 'Livrata', bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck },
  completed: { label: 'Completata', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  cancelled: { label: 'Anulata', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
}

const COURIER_OPTIONS = [
  { value: '', label: 'Selecteaza curier...' },
  { value: 'FanCourier', label: 'FanCourier' },
  { value: 'Sameday', label: 'Sameday' },
  { value: 'Cargus', label: 'Cargus' },
  { value: 'GLS', label: 'GLS' },
  { value: 'DPD', label: 'DPD' },
  { value: 'PostaRomana', label: 'Posta Romana' },
]

const COURIER_TRACKING_URLS: Record<string, string> = {
  FanCourier: 'https://www.fancourier.ro/awb-tracking/?awb=',
  Sameday: 'https://www.sameday.ro/tracking/awb/',
  Cargus: 'https://www.cargus.ro/tracking/?t=',
  GLS: 'https://gls-group.eu/track/',
  DPD: 'https://tracking.dpd.de/status/en_US/parcel/',
  PostaRomana: 'https://www.pfroman.ro/tracking/',
}

const STATUS_TABS = [
  { key: 'all', label: 'Toate' },
  { key: 'pending', label: 'In asteptare' },
  { key: 'confirmed', label: 'Confirmate' },
  { key: 'shipped', label: 'Livrate' },
  { key: 'completed', label: 'Completate' },
  { key: 'cancelled', label: 'Anulate' },
]

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0, pending: 0, confirmed: 0, shipped: 0, completed: 0, cancelled: 0, totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeStatus, setActiveStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editTrackingNumber, setEditTrackingNumber] = useState('')
  const [editCourierName, setEditCourierName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (activeStatus !== 'all') params.set('status', activeStatus)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()

      if (data.orders) {
        setOrders(data.orders)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeStatus, searchQuery])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setEditStatus(order.status)
    setEditNotes(order.notes || '')
    setEditTrackingNumber(order.trackingNumber || '')
    setEditCourierName(order.courierName || '')
  }

  const closeModal = useCallback(() => {
    setSelectedOrder(null)
    setEditStatus('')
    setEditNotes('')
    setEditTrackingNumber('')
    setEditCourierName('')
  }, [])

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedOrder) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedOrder, closeModal])

  const handleSaveOrder = async () => {
    if (!selectedOrder) return
    setIsSaving(true)

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: editStatus,
          notes: editNotes,
          trackingNumber: editTrackingNumber,
          courierName: editCourierName,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSelectedOrder(data.order)
        fetchOrders()
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    } finally {
      setIsSaving(false)
    }
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

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
        <div className="max-w-[1400px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-green-500" />
                <h1 className="text-lg font-bold text-slate-800">Comenzi</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cauta comanda, client..."
                  className="pl-9 pr-8 py-1.5 w-64 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={fetchOrders}
                className="p-2 text-slate-600 hover:text-green-500 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delogare"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Iesire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 flex-1 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Total comenzi</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-600">In asteptare</p>
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-600">Confirmate</p>
            <p className="text-2xl font-bold text-blue-700">{stats.confirmed}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
            <p className="text-xs text-purple-600">Livrate</p>
            <p className="text-2xl font-bold text-purple-700">{stats.shipped}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-xs text-green-600">Completate</p>
            <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-xs text-red-600">Anulate</p>
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          </div>
        </div>

        {/* Revenue */}
        {stats.totalRevenue > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm mb-6 inline-block">
            <p className="text-xs text-slate-500">Venit total (excl. anulate)</p>
            <p className="text-xl font-bold text-green-700">{formatPrice(stats.totalRevenue)} RON</p>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStatus === tab.key
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.label}
              {tab.key !== 'all' && stats[tab.key as keyof Stats] > 0 && (
                <span className={`ml-1.5 text-xs ${activeStatus === tab.key ? 'text-green-100' : 'text-slate-400'}`}>
                  ({stats[tab.key as keyof Stats]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nicio comanda gasita</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600"># Comanda</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Data</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Client</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600">Produse</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">Total</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => openOrderDetail(order)}
                      className="border-b border-slate-100 hover:bg-green-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-semibold text-slate-800">{order.orderNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800">{order.customerName}</p>
                        <p className="text-xs text-slate-400">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <Package className="w-3.5 h-3.5" />
                          {order.items.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-slate-800">
                          {order.estimatedTotal ? `${formatPrice(order.estimatedTotal)} RON` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Detalii comanda ${selectedOrder.orderNumber}`} onClick={closeModal}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Comanda {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-slate-500">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button onClick={closeModal} aria-label="Inchide detalii comanda" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Informatii client
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium text-slate-800">{selectedOrder.customerName}</p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={`mailto:${selectedOrder.customerEmail}`}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {selectedOrder.customerEmail}
                    </a>
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                  {selectedOrder.customerAddress && (
                    <p className="text-sm text-slate-600">
                      {selectedOrder.customerAddress}
                      {selectedOrder.customerCity && `, ${selectedOrder.customerCity}`}
                      {selectedOrder.customerCounty && `, ${selectedOrder.customerCounty}`}
                      {selectedOrder.customerPostal && ` ${selectedOrder.customerPostal}`}
                      {selectedOrder.customerCountry && ` (${selectedOrder.customerCountry})`}
                    </p>
                  )}
                  {selectedOrder.message && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-500">Mesaj client:</p>
                      <p className="text-sm text-slate-700 italic">{selectedOrder.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Produse comandate ({selectedOrder.items.length})
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600">Produs</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-slate-600">Cant.</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold text-slate-600">Pret/buc</th>
                        <th className="text-right px-4 py-2 text-xs font-semibold text-slate-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium text-slate-800">{item.productName}</p>
                                {item.variantName && (
                                  <p className="text-xs text-slate-500">{item.variantName}</p>
                                )}
                                {item.sku && (
                                  <p className="text-xs text-slate-400">SKU: {item.sku}</p>
                                )}
                                {item.attributes && Object.keys(item.attributes).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {Object.entries(item.attributes).map(([key, val]) => (
                                      <span key={key} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                        {key}: {String(val)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-slate-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-sm text-slate-700">{formatPrice(item.price)} RON</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                            {formatPrice(item.price * item.quantity)} RON
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                {selectedOrder.estimatedTotal && (
                  <div className="flex justify-end mt-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                      <span className="text-sm text-green-600">Total estimat: </span>
                      <span className="text-lg font-bold text-green-700">
                        {formatPrice(selectedOrder.estimatedTotal)} RON
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="orderStatus" className="block text-sm font-semibold text-slate-700 mb-1">
                    Status comanda
                  </label>
                  <select
                    id="orderStatus"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="pending">In asteptare</option>
                    <option value="confirmed">Confirmata</option>
                    <option value="shipped">Livrata</option>
                    <option value="completed">Completata</option>
                    <option value="cancelled">Anulata</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Timestamps</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Creat: {formatDate(selectedOrder.createdAt)}</p>
                    <p>Actualizat: {formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Tracking / Expediere
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="courierName" className="block text-xs font-medium text-slate-600 mb-1">
                      Curier
                    </label>
                    <select
                      id="courierName"
                      value={editCourierName}
                      onChange={(e) => setEditCourierName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {COURIER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="trackingNumber" className="block text-xs font-medium text-slate-600 mb-1">
                      Numar AWB / Tracking
                    </label>
                    <input
                      id="trackingNumber"
                      type="text"
                      value={editTrackingNumber}
                      onChange={(e) => setEditTrackingNumber(e.target.value)}
                      placeholder="Numar AWB..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                {editTrackingNumber && editCourierName && COURIER_TRACKING_URLS[editCourierName] && (
                  <a
                    href={`${COURIER_TRACKING_URLS[editCourierName]}${encodeURIComponent(editTrackingNumber)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Urmarire colet ({editCourierName})
                  </a>
                )}
              </div>

              {/* Status History Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Istoric status</h3>
                  <div className="space-y-2">
                    {(Array.isArray(selectedOrder.statusHistory) ? selectedOrder.statusHistory : []).map((entry, idx) => {
                      const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.bg.replace('bg-', 'bg-')}`}
                            style={{ backgroundColor: entry.status === 'pending' ? '#f59e0b' : entry.status === 'confirmed' ? '#3b82f6' : entry.status === 'shipped' ? '#a855f7' : entry.status === 'completed' ? '#22c55e' : '#ef4444' }}
                          />
                          <div className="flex-1">
                            <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
                            <span className="text-xs text-slate-400 ml-2">
                              {new Date(entry.date).toLocaleString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {entry.note && <p className="text-xs text-slate-500 mt-0.5">{entry.note}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="orderNotes" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1">
                  <FileText className="w-4 h-4" />
                  Note interne
                </label>
                <textarea
                  id="orderNotes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Adauga note interne despre comanda..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveOrder}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Se salveaza...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salveaza modificarile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
