'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3, ChevronLeft, LogOut, RefreshCw, Loader2,
  ShoppingCart, DollarSign, Users, Package, TrendingUp,
  Mail, MessageCircle, Award, Clock,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Overview {
  totalOrders: number
  ordersLast7Days: number
  ordersLast30Days: number
  totalRevenue: number
  revenueThisMonth: number
  uniqueCustomers: number
  totalProducts: number
  activeProducts: number
  chats: number
}

interface OrdersByStatus {
  pending: number
  confirmed: number
  shipped: number
  completed: number
  cancelled: number
}

interface ChartDay {
  date: string
  orders: number
  revenue: number
}

interface TopProduct {
  name: string
  quantity: number
  revenue: number
}

interface TopCustomer {
  email: string
  name: string
  orders: number
  total: number
}

interface Newsletter {
  total: number
  active: number
  newLast30Days: number
}

interface StatsData {
  overview: Overview
  ordersByStatus: OrdersByStatus
  chartData: ChartDay[]
  topProducts: TopProduct[]
  topCustomers: TopCustomer[]
  newsletter: Newsletter
}

export default function AdminStatsPage() {
  const router = useRouter()
  const [data, setData] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/stats')
      const json = await res.json()
      if (res.ok) setData(json)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
  }

  // Find max values for chart scaling
  const maxRevenue = data ? Math.max(...data.chartData.map((d) => d.revenue), 1) : 1
  const maxOrders = data ? Math.max(...data.chartData.map((d) => d.orders), 1) : 1

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
                <BarChart3 className="w-6 h-6 text-indigo-500" />
                <h1 className="text-lg font-bold text-slate-800">Statistici</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStats}
                className="p-2 text-slate-600 hover:text-indigo-500 transition-colors"
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
        {isLoading && !data ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : !data ? (
          <div className="text-center py-24 text-slate-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nu s-au putut incarca statisticile</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard
                icon={ShoppingCart}
                label="Total comenzi"
                value={String(data.overview.totalOrders)}
                sub={`${data.overview.ordersLast7Days} ultimele 7 zile`}
                color="green"
              />
              <StatCard
                icon={DollarSign}
                label="Venit total"
                value={`${formatPrice(data.overview.totalRevenue)} RON`}
                sub={`${formatPrice(data.overview.revenueThisMonth)} RON luna aceasta`}
                color="emerald"
              />
              <StatCard
                icon={Users}
                label="Clienti unici"
                value={String(data.overview.uniqueCustomers)}
                color="blue"
              />
              <StatCard
                icon={Package}
                label="Produse active"
                value={`${data.overview.activeProducts}/${data.overview.totalProducts}`}
                color="amber"
              />
              <StatCard
                icon={Mail}
                label="Newsletter"
                value={String(data.newsletter.active)}
                sub={`+${data.newsletter.newLast30Days} luna aceasta`}
                color="purple"
              />
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Comenzi dupa status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <StatusBar label="In asteptare" count={data.ordersByStatus.pending} total={data.overview.totalOrders} color="bg-amber-500" />
                <StatusBar label="Confirmate" count={data.ordersByStatus.confirmed} total={data.overview.totalOrders} color="bg-blue-500" />
                <StatusBar label="Livrate" count={data.ordersByStatus.shipped} total={data.overview.totalOrders} color="bg-purple-500" />
                <StatusBar label="Completate" count={data.ordersByStatus.completed} total={data.overview.totalOrders} color="bg-green-500" />
                <StatusBar label="Anulate" count={data.ordersByStatus.cancelled} total={data.overview.totalOrders} color="bg-red-500" />
              </div>
            </div>

            {/* Revenue Chart (last 30 days) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Venituri ultimele 30 zile
              </h3>
              {data.overview.totalOrders === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">Nicio comanda inca. Graficul va aparea dupa prima comanda.</p>
              ) : (
                <div className="space-y-4">
                  {/* Revenue bars */}
                  <div className="flex items-end gap-[3px] h-40">
                    {data.chartData.map((day) => {
                      const pct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
                      return (
                        <div
                          key={day.date}
                          className="flex-1 group relative"
                          title={`${formatDate(day.date)}: ${formatPrice(day.revenue)} RON (${day.orders} comenzi)`}
                        >
                          <div className="w-full bg-slate-100 rounded-t-sm relative" style={{ height: '160px' }}>
                            <div
                              className="absolute bottom-0 w-full bg-indigo-400 hover:bg-indigo-500 rounded-t-sm transition-colors"
                              style={{ height: `${Math.max(pct, day.revenue > 0 ? 3 : 0)}%` }}
                            />
                          </div>
                          {/* Tooltip */}
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap z-10 shadow-lg">
                            <p className="font-semibold">{formatDate(day.date)}</p>
                            <p>{formatPrice(day.revenue)} RON</p>
                            <p>{day.orders} comenzi</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {/* X-axis labels (show every 5 days) */}
                  <div className="flex gap-[3px]">
                    {data.chartData.map((day, i) => (
                      <div key={day.date} className="flex-1 text-center">
                        {i % 5 === 0 && (
                          <span className="text-[10px] text-slate-400">{formatDate(day.date)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Orders Chart (last 30 days) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Comenzi ultimele 30 zile
              </h3>
              {data.overview.totalOrders === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">Nicio comanda inca.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-end gap-[3px] h-32">
                    {data.chartData.map((day) => {
                      const pct = maxOrders > 0 ? (day.orders / maxOrders) * 100 : 0
                      return (
                        <div
                          key={day.date}
                          className="flex-1 group relative"
                          title={`${formatDate(day.date)}: ${day.orders} comenzi`}
                        >
                          <div className="w-full bg-slate-100 rounded-t-sm relative" style={{ height: '128px' }}>
                            <div
                              className="absolute bottom-0 w-full bg-green-400 hover:bg-green-500 rounded-t-sm transition-colors"
                              style={{ height: `${Math.max(pct, day.orders > 0 ? 5 : 0)}%` }}
                            />
                          </div>
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap z-10 shadow-lg">
                            <p className="font-semibold">{formatDate(day.date)}</p>
                            <p>{day.orders} comenzi</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex gap-[3px]">
                    {data.chartData.map((day, i) => (
                      <div key={day.date} className="flex-1 text-center">
                        {i % 5 === 0 && (
                          <span className="text-[10px] text-slate-400">{formatDate(day.date)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Grid: Top Products + Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Top produse (ultimele 30 zile)
                </h3>
                {data.topProducts.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">Nicio comanda inca.</p>
                ) : (
                  <div className="space-y-2">
                    {data.topProducts.map((product, i) => (
                      <div key={product.name} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-amber-100 text-amber-700' :
                          i === 1 ? 'bg-slate-200 text-slate-600' :
                          i === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.quantity} bucati vandute</p>
                        </div>
                        <span className="text-sm font-semibold text-green-700">{formatPrice(product.revenue)} RON</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Customers */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Top clienti
                </h3>
                {data.topCustomers.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">Niciun client inca.</p>
                ) : (
                  <div className="space-y-2">
                    {data.topCustomers.map((customer, i) => (
                      <div key={customer.email} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-amber-100 text-amber-700' :
                          i === 1 ? 'bg-slate-200 text-slate-600' :
                          i === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{customer.name}</p>
                          <p className="text-xs text-slate-400">{customer.email} — {customer.orders} comenzi</p>
                        </div>
                        <span className="text-sm font-semibold text-green-700">{formatPrice(customer.total)} RON</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Extra info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Newsletter
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-2xl font-bold text-purple-700">{data.newsletter.active}</p>
                    <p className="text-xs text-slate-500">Abonati activi</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-700">{data.newsletter.total}</p>
                    <p className="text-xs text-slate-500">Total abonati</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">+{data.newsletter.newLast30Days}</p>
                    <p className="text-xs text-slate-500">Noi (30 zile)</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Activitate
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-2xl font-bold text-amber-700">{data.overview.chats}</p>
                    <p className="text-xs text-slate-500">Conversatii chat</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{data.overview.ordersLast30Days}</p>
                    <p className="text-xs text-slate-500">Comenzi (30 zile)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">{data.overview.ordersLast7Days}</p>
                    <p className="text-xs text-slate-500">Comenzi (7 zile)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof ShoppingCart
  label: string
  value: string
  sub?: string
  color: string
}) {
  const colorMap: Record<string, { bg: string; icon: string; value: string }> = {
    green: { bg: 'bg-green-50 border-green-200', icon: 'text-green-600', value: 'text-green-800' },
    emerald: { bg: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-600', value: 'text-emerald-800' },
    blue: { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-600', value: 'text-blue-800' },
    amber: { bg: 'bg-amber-50 border-amber-200', icon: 'text-amber-600', value: 'text-amber-800' },
    purple: { bg: 'bg-purple-50 border-purple-200', icon: 'text-purple-600', value: 'text-purple-800' },
    indigo: { bg: 'bg-indigo-50 border-indigo-200', icon: 'text-indigo-600', value: 'text-indigo-800' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`${c.bg} border rounded-xl px-4 py-3`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${c.icon}`} />
        <p className="text-xs text-slate-500">{label}</p>
      </div>
      <p className={`text-xl font-bold ${c.value} leading-tight`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function StatusBar({ label, count, total, color }: {
  label: string
  count: number
  total: number
  color: string
}) {
  const pct = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-semibold text-slate-700">{count}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
        />
      </div>
      {total > 0 && (
        <p className="text-[10px] text-slate-400 mt-0.5">{pct.toFixed(0)}%</p>
      )}
    </div>
  )
}
