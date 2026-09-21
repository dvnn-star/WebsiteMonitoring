import { NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (identifier: string) => string
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyGenerator } = config

  return (identifier: string): { success: boolean; remaining: number; resetTime: number } => {
    const key = keyGenerator ? keyGenerator(identifier) : identifier
    const now = Date.now()
    const resetTime = now + windowMs

    if (!store[key] || store[key].resetTime < now) {
      store[key] = { count: 1, resetTime }
      return { success: true, remaining: maxRequests - 1, resetTime }
    }

    if (store[key].count >= maxRequests) {
      return { success: false, remaining: 0, resetTime: store[key].resetTime }
    }

    store[key].count++
    return { success: true, remaining: maxRequests - store[key].count, resetTime }
  }
}

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
})

export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
})

export const websiteCreateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
})

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 60,
})

export function createRateLimitResponse(retryAfter: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(retryAfter / 1000)),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}

export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`
  
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}
