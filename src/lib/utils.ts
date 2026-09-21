/**
 * Validates a URL is safe to audit (SSRF protection)
 */
export function validateAuditUrl(rawUrl: string): { valid: boolean; url?: string; error?: string } {
  let url: URL

  try {
    // Only normalise if completely missing a scheme (no ://)
    const withScheme = rawUrl.includes('://')
      ? rawUrl
      : `https://${rawUrl}`
    url = new URL(withScheme)
  } catch {
    return { valid: false, error: 'Invalid URL format.' }
  }

  // Only allow http and https
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed.' }
  }

  const hostname = url.hostname.toLowerCase()

  // Block localhost variants
  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '::1',
    '0.0.0.0',
  ]
  if (blockedHosts.includes(hostname)) {
    return { valid: false, error: 'Localhost URLs are not allowed.' }
  }

  // Block private IP ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^169\.254\./,      // link-local (AWS metadata)
    /^100\.64\./,       // shared address
    /^fc00:/,           // IPv6 ULA
    /^fe80:/,           // IPv6 link-local
  ]
  for (const pattern of privateRanges) {
    if (pattern.test(hostname)) {
      return { valid: false, error: 'Private network URLs are not allowed.' }
    }
  }

  // Block internal TLDs
  if (hostname.endsWith('.local') || hostname.endsWith('.internal') || hostname.endsWith('.localhost')) {
    return { valid: false, error: 'Internal URLs are not allowed.' }
  }

  return { valid: true, url: url.toString() }
}

/**
 * Formats a date string to readable format
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
