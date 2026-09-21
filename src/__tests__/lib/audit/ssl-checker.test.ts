import { checkSSL } from '@/lib/audit/ssl-checker'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => mockFetch.mockReset())

describe('checkSSL', () => {
  it('returns ERROR for http URL (no HTTPS)', async () => {
    const results = await checkSSL('http://example.com')
    const httpsResult = results.find(r => r.check_type === 'https')

    expect(httpsResult?.status).toBe('ERROR')
    expect(httpsResult?.message).toContain('Not using HTTPS')
    expect(results).toHaveLength(1)
  })

  it('returns PASS for https URL with valid SSL', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true })

    const results = await checkSSL('https://example.com')

    const httpsResult = results.find(r => r.check_type === 'https')
    const sslResult = results.find(r => r.check_type === 'ssl_certificate')
    const expiryResult = results.find(r => r.check_type === 'ssl_expiry')

    expect(httpsResult?.status).toBe('PASS')
    expect(sslResult?.status).toBe('PASS')
    expect(expiryResult?.status).toBe('PASS')
  })

  it('returns ERROR for SSL certificate error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('certificate has expired'))

    const results = await checkSSL('https://example.com')
    const sslResult = results.find(r => r.check_type === 'ssl_certificate')

    expect(sslResult?.status).toBe('ERROR')
    expect(sslResult?.recommendation).toBeTruthy()
  })

  it('returns WARNING for non-SSL connection error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

    const results = await checkSSL('https://example.com')
    const sslResult = results.find(r => r.check_type === 'ssl_certificate')

    expect(sslResult?.status).toBe('WARNING')
  })
})
