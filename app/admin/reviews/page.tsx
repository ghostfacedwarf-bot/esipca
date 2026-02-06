'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Star, ChevronLeft, LogOut, RefreshCw, Loader2,
  CheckCircle, Trash2, Clock, User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Review {
  id: string
  productId: string
  name: string
  email: string | null
  rating: number
  text: string | null
  isApproved: boolean
  createdAt: string
  updatedAt: string
  product: {
    name: string
    slug: string
  }
}

interface Stats {
  total: number
  pending: number
  approved: number
  avgRating: number
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200'
          }
        />
      ))}
    </div>
  )
}

const FILTER_TABS = [
  { key: 'all', label: 'Toate' },
  { key: 'pending', label: 'In asteptare' },
  { key: 'approved', label: 'Aprobate' },
]

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, avgRating: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()

      if (data.reviews) {
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleApprove = async (reviewId: string, approve: boolean) => {
    setActionLoading(reviewId)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isApproved: approve }),
      })

      if (res.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to update review:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Sigur vrei sa stergi aceasta recenzie?')) return

    setActionLoading(reviewId)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      })

      if (res.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'pending') return !r.isApproved
    if (activeFilter === 'approved') return r.isApproved
    return true
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
                <Star className="w-6 h-6 text-orange-500" />
                <h1 className="text-lg font-bold text-slate-800">Recenzii</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchReviews}
                className="p-2 text-slate-600 hover:text-orange-500 transition-colors"
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Total recenzii</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-600">In asteptare</p>
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-xs text-green-600">Aprobate</p>
            <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-600">Rating mediu</p>
            <p className="text-2xl font-bold text-blue-700">
              {stats.avgRating > 0 ? stats.avgRating : '-'}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.label}
              {tab.key === 'pending' && stats.pending > 0 && (
                <span className={`ml-1.5 text-xs ${activeFilter === tab.key ? 'text-orange-100' : 'text-slate-400'}`}>
                  ({stats.pending})
                </span>
              )}
              {tab.key === 'approved' && stats.approved > 0 && (
                <span className={`ml-1.5 text-xs ${activeFilter === tab.key ? 'text-orange-100' : 'text-slate-400'}`}>
                  ({stats.approved})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 text-center py-16 text-slate-400">
              <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nicio recenzie gasita</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  !review.isApproved
                    ? 'border-l-4 border-l-amber-400 border-t-slate-200 border-r-slate-200 border-b-slate-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="px-5 py-4">
                  {/* Top row: name, stars, product, date */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800 text-sm">{review.name}</p>
                          {!review.isApproved && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              <Clock className="w-3 h-3" />
                              In asteptare
                            </span>
                          )}
                          {review.isApproved && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Aprobata
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarDisplay rating={review.rating} />
                          {review.email && (
                            <span className="text-xs text-slate-400">
                              {review.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                      <a
                        href={`/produse/${review.product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {review.product.name}
                      </a>
                    </div>
                  </div>

                  {/* Review text */}
                  {review.text && (
                    <p className="text-sm text-slate-700 mb-3 pl-12">{review.text}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pl-12">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        disabled={actionLoading === review.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        {actionLoading === review.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        Aproba
                      </button>
                    )}
                    {review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        disabled={actionLoading === review.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        {actionLoading === review.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        Revoca
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={actionLoading === review.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      {actionLoading === review.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Sterge
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
