'use client'

import { useState, useEffect } from 'react'
import { Star, Loader2, Send } from 'lucide-react'

interface Review {
  id: string
  name: string
  rating: number
  text: string | null
  createdAt: string
}

interface ReviewSectionProps {
  productId: string
  productName: string
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200'
          }
        />
      ))}
    </div>
  )
}

function InteractiveStarRating({
  rating,
  onRate,
}: {
  rating: number
  onRate: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`${star} stele`}
        >
          <Star
            size={28}
            className={
              star <= (hovered || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-300'
            }
          />
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ productId, productName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [formName, setFormName] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formText, setFormText] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [productId])

  async function fetchReviews() {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/reviews?productId=${productId}`)
      const data = await res.json()

      if (data.reviews) {
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setTotalCount(data.totalCount)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitMessage('')
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: formName.trim(),
          rating: formRating,
          text: formText.trim(),
          email: formEmail.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSubmitMessage(data.message)
        setFormName('')
        setFormRating(5)
        setFormText('')
        setFormEmail('')
      } else {
        setSubmitError(data.message || 'Eroare la trimiterea recenziei')
      }
    } catch {
      setSubmitError('Eroare de conexiune. Incercati din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <section className="py-8 bg-white">
      <div className="container-max max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recenzii</h2>
            {totalCount > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={Math.round(averageRating)} />
                <span className="text-sm text-dark-600">
                  {averageRating} din 5 ({totalCount}{' '}
                  {totalCount === 1 ? 'recenzie' : 'recenzii'})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-dark-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-dark-900 text-sm">
                        {review.name}
                      </p>
                      <p className="text-xs text-dark-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                {review.text && (
                  <p className="text-sm text-dark-700 leading-relaxed">
                    {review.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8 bg-dark-50 rounded-lg">
            <Star className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-dark-500 text-sm">
              Nicio recenzie inca. Fii primul care lasa o parere!
            </p>
          </div>
        )}

        {/* Submit Form */}
        <div className="border border-dark-200 rounded-lg p-6 bg-dark-50">
          <h3 className="text-lg font-bold mb-4">Lasa o recenzie</h3>

          {submitMessage ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
              {submitMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">
                  Rating
                </label>
                <InteractiveStarRating
                  rating={formRating}
                  onRate={setFormRating}
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="review-name"
                  className="block text-sm font-semibold text-dark-700 mb-1"
                >
                  Nume *
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Numele tau"
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Text */}
              <div>
                <label
                  htmlFor="review-text"
                  className="block text-sm font-semibold text-dark-700 mb-1"
                >
                  Recenzie *
                </label>
                <textarea
                  id="review-text"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  required
                  minLength={5}
                  rows={3}
                  placeholder={`Ce parere ai despre ${productName}?`}
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <label
                  htmlFor="review-email"
                  className="block text-sm font-semibold text-dark-700 mb-1"
                >
                  Email <span className="font-normal text-dark-400">(optional)</span>
                </label>
                <input
                  id="review-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="email@exemplu.ro"
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Trimite recenzia
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
