/**
 * Simple in-memory rate limiter for API routes
 * For production at scale, consider using @upstash/ratelimit with Redis
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit: number
  /** Time window in seconds */
  windowSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param options - Rate limit configuration
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  const windowMs = options.windowSeconds * 1000
  const key = identifier

  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    // Create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, newEntry)
    return {
      success: true,
      remaining: options.limit - 1,
      reset: newEntry.resetTime,
    }
  }

  if (entry.count >= options.limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    }
  }

  entry.count++
  return {
    success: true,
    remaining: options.limit - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

/**
 * Pre-configured rate limits for different endpoints
 */
export const RATE_LIMITS = {
  // Contact form: 5 requests per minute
  contact: { limit: 5, windowSeconds: 60 },
  // Orders: 10 requests per minute
  orders: { limit: 10, windowSeconds: 60 },
  // Quote requests: 5 requests per minute
  quote: { limit: 5, windowSeconds: 60 },
  // General API: 100 requests per minute
  api: { limit: 100, windowSeconds: 60 },
  // Admin endpoints: 10 requests per minute
  admin: { limit: 10, windowSeconds: 60 },
} as const
