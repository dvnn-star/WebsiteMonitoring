import { z } from 'zod'
import validator from 'validator'
import DOMPurify from 'dompurify'

export const emailSchema = z
  .string()
  .trim()
  .max(255, 'Email must be at most 255 characters')
  .email('Invalid email format')
  .refine((val) => validator.isEmail(val), {
    message: 'Invalid email format',
  })

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine(
    (val) =>
      /[a-z]/.test(val) &&
      /[A-Z]/.test(val) &&
      /[0-9]/.test(val),
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }
  )

export const websiteNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters')
  .refine((val) => !containsHtml(val), {
    message: 'Name cannot contain HTML',
  })

export const urlSchema = z
  .string()
  .trim()
  .max(2048, 'URL must be at most 2048 characters')
  .url('Invalid URL format')
  .refine(
    (val) => {
      try {
        const url = new URL(val)
        return ['http:', 'https:'].includes(url.protocol)
      } catch {
        return false
      }
    },
    { message: 'URL must use HTTP or HTTPS protocol' }
  )

export const uuidSchema = z
  .string()
  .trim()
  .uuid('Invalid ID format')

export const alertIdSchema = z
  .string()
  .trim()
  .min(1, 'Alert ID is required')

export const websiteIdSchema = uuidSchema

export const auditIdSchema = uuidSchema

export const createWebsiteSchema = z.object({
  url: urlSchema,
  name: websiteNameSchema,
})

export const createAuditSchema = z.object({
  website_id: websiteIdSchema,
})

export const markAlertReadSchema = z.object({
  alert_id: alertIdSchema,
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized as T
}

export function containsHtml(input: string): boolean {
  const htmlPattern = /<[^>]*>/g
  return htmlPattern.test(input)
}

export function isValidRedirectUrl(url: string, allowedOrigins: string[]): boolean {
  try {
    if (url.startsWith('/') && !url.startsWith('//')) {
      return true
    }
    const parsedUrl = new URL(url, 'http://localhost')
    return allowedOrigins.some(
      (origin) => parsedUrl.origin === origin || parsedUrl.pathname.startsWith(origin)
    )
  } catch {
    return false
  }
}

export function getSafeRedirectUrl(url: string | null, defaultUrl: string = '/dashboard'): string {
  if (!url) return defaultUrl
  if (url.startsWith('/') && !url.startsWith('//') && !url.includes('://')) {
    return url
  }
  return defaultUrl
}
