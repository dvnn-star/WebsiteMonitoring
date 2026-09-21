import { validateAuditUrl, formatDate, formatDateTime } from '@/lib/utils'

describe('validateAuditUrl', () => {
  describe('valid URLs', () => {
    it('accepts valid https URL', () => {
      const result = validateAuditUrl('https://example.com')
      expect(result.valid).toBe(true)
      expect(result.url).toBe('https://example.com/')
    })

    it('accepts valid http URL', () => {
      const result = validateAuditUrl('http://example.com')
      expect(result.valid).toBe(true)
    })

    it('normalises URL without scheme to https', () => {
      const result = validateAuditUrl('example.com')
      expect(result.valid).toBe(true)
      expect(result.url).toContain('https://')
    })

    it('accepts URL with path', () => {
      const result = validateAuditUrl('https://example.com/path/to/page')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with subdomain', () => {
      const result = validateAuditUrl('https://www.example.co.uk')
      expect(result.valid).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('rejects completely invalid string', () => {
      const result = validateAuditUrl('not a url at all!!!')
      expect(result.valid).toBe(false)
      expect(result.error).toBeTruthy()
    })

    it('rejects ftp:// protocol', () => {
      const result = validateAuditUrl('ftp://example.com')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('HTTP and HTTPS')
    })
  })

  describe('SSRF protection', () => {
    it('blocks localhost', () => {
      const result = validateAuditUrl('http://localhost')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Localhost')
    })

    it('blocks 127.0.0.1', () => {
      const result = validateAuditUrl('http://127.0.0.1')
      expect(result.valid).toBe(false)
    })

    it('blocks 0.0.0.0', () => {
      const result = validateAuditUrl('http://0.0.0.0')
      expect(result.valid).toBe(false)
    })

    it('blocks private 10.x.x.x range', () => {
      const result = validateAuditUrl('http://10.0.0.1')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Private network')
    })

    it('blocks private 192.168.x.x range', () => {
      const result = validateAuditUrl('http://192.168.1.1')
      expect(result.valid).toBe(false)
    })

    it('blocks 172.16.x.x - 172.31.x.x range', () => {
      expect(validateAuditUrl('http://172.16.0.1').valid).toBe(false)
      expect(validateAuditUrl('http://172.31.255.255').valid).toBe(false)
    })

    it('allows 172.15.x.x (outside private range)', () => {
      const result = validateAuditUrl('http://172.15.0.1')
      expect(result.valid).toBe(true)
    })

    it('blocks AWS metadata IP 169.254.x.x', () => {
      const result = validateAuditUrl('http://169.254.169.254')
      expect(result.valid).toBe(false)
    })

    it('blocks .local TLD', () => {
      const result = validateAuditUrl('http://myserver.local')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Internal')
    })

    it('blocks .internal TLD', () => {
      const result = validateAuditUrl('http://api.internal')
      expect(result.valid).toBe(false)
    })

    it('blocks .localhost TLD', () => {
      const result = validateAuditUrl('http://app.localhost')
      expect(result.valid).toBe(false)
    })
  })
})

describe('formatDate', () => {
  it('formats ISO date string to readable format', () => {
    const result = formatDate('2026-01-15T10:00:00Z')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2026')
  })
})

describe('formatDateTime', () => {
  it('formats ISO date string to readable date + time', () => {
    const result = formatDateTime('2026-01-15T10:00:00Z')
    expect(result).toContain('Jan')
    expect(result).toContain('2026')
  })
})
