import { checkHTTPStatus } from '@/lib/audit/http-checker'
import { checkDNS } from '@/lib/audit/dns-checker'
import { checkMobileViewport } from '@/lib/audit/mobile-checker'
import { checkRobotsAndSitemap } from '@/lib/audit/crawlability-checker'

// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('checkHTTPStatus', () => {
  it('returns PASS for 200 OK response', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      url: 'https://example.com/',
      redirected: false,
      ok: true,
    })

    const results = await checkHTTPStatus('https://example.com')
    const httpResult = results.find(r => r.check_type === 'http_status')

    expect(httpResult).toBeDefined()
    expect(httpResult?.status).toBe('PASS')
    expect(httpResult?.category).toBe('technical')
    expect(httpResult?.message).toContain('200')
  })

  it('returns WARNING for redirect response', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 301,
      url: 'https://example.com/',
      redirected: true,
      ok: false,
    })

    const results = await checkHTTPStatus('https://example.com')
    const httpResult = results.find(r => r.check_type === 'http_status')

    expect(httpResult?.status).toBe('WARNING')
  })

  it('returns ERROR for 404 response', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 404,
      url: 'https://example.com/',
      redirected: false,
      ok: false,
    })

    const results = await checkHTTPStatus('https://example.com')
    const httpResult = results.find(r => r.check_type === 'http_status')

    expect(httpResult?.status).toBe('ERROR')
    expect(httpResult?.recommendation).toBeTruthy()
  })

  it('returns ERROR when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

    const results = await checkHTTPStatus('https://example.com')
    const httpResult = results.find(r => r.check_type === 'http_status')

    expect(httpResult?.status).toBe('ERROR')
    expect(httpResult?.message).toContain('Failed')
  })

  it('includes response_time check result', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      url: 'https://example.com/',
      redirected: false,
      ok: true,
    })

    const results = await checkHTTPStatus('https://example.com')
    const timeResult = results.find(r => r.check_type === 'response_time')

    expect(timeResult).toBeDefined()
    expect(timeResult?.category).toBe('performance')
  })

  it('returns redirect WARNING when redirected is true', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      url: 'https://www.example.com/',
      redirected: true,
      ok: true,
    })

    const results = await checkHTTPStatus('https://example.com')
    const redirectResult = results.find(r => r.check_type === 'redirect')

    expect(redirectResult?.status).toBe('WARNING')
  })

  it('returns redirect PASS when not redirected', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      url: 'https://example.com/',
      redirected: false,
      ok: true,
    })

    const results = await checkHTTPStatus('https://example.com')
    const redirectResult = results.find(r => r.check_type === 'redirect')

    expect(redirectResult?.status).toBe('PASS')
  })
})

describe('checkDNS', () => {
  it('returns PASS with domain info', async () => {
    const results = await checkDNS('https://example.com')

    expect(results).toHaveLength(1)
    expect(results[0].status).toBe('PASS')
    expect(results[0].category).toBe('infrastructure')
    expect(results[0].check_type).toBe('dns')
    expect(results[0].message).toContain('example.com')
  })
})

describe('checkMobileViewport', () => {
  it('returns PASS when proper viewport meta exists', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () =>
        '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head></html>',
    })

    const results = await checkMobileViewport('https://example.com')
    const result = results.find(r => r.check_type === 'mobile_viewport')

    expect(result?.status).toBe('PASS')
    expect(result?.message).toContain('Properly configured')
  })

  it('returns WARNING when viewport exists but lacks width=device-width', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () =>
        '<html><head><meta name="viewport" content="initial-scale=1"></head></html>',
    })

    const results = await checkMobileViewport('https://example.com')
    const result = results.find(r => r.check_type === 'mobile_viewport')

    expect(result?.status).toBe('WARNING')
  })

  it('returns ERROR when no viewport meta tag', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '<html><head><title>Test</title></head></html>',
    })

    const results = await checkMobileViewport('https://example.com')
    const result = results.find(r => r.check_type === 'mobile_viewport')

    expect(result?.status).toBe('ERROR')
    expect(result?.recommendation).toBeTruthy()
  })

  it('returns WARNING when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'))

    const results = await checkMobileViewport('https://example.com')
    const result = results.find(r => r.check_type === 'mobile_viewport')

    expect(result?.status).toBe('WARNING')
  })
})

describe('checkRobotsAndSitemap', () => {
  it('returns PASS for robots.txt when found and not blocking', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => 'User-agent: *\nDisallow:',
      })
      .mockResolvedValueOnce({ ok: true })

    const results = await checkRobotsAndSitemap('https://example.com')
    const robotsResult = results.find(r => r.check_type === 'robots_txt')

    expect(robotsResult?.status).toBe('PASS')
  })

  it('returns WARNING for robots.txt when blocking all crawlers', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => 'User-agent: *\nDisallow: /',
      })
      .mockResolvedValueOnce({ ok: true })

    const results = await checkRobotsAndSitemap('https://example.com')
    const robotsResult = results.find(r => r.check_type === 'robots_txt')

    expect(robotsResult?.status).toBe('WARNING')
  })

  it('returns WARNING for robots.txt when not found', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true })

    const results = await checkRobotsAndSitemap('https://example.com')
    const robotsResult = results.find(r => r.check_type === 'robots_txt')

    expect(robotsResult?.status).toBe('WARNING')
  })

  it('returns PASS for sitemap when found', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true })

    const results = await checkRobotsAndSitemap('https://example.com')
    const sitemapResult = results.find(r => r.check_type === 'sitemap')

    expect(sitemapResult?.status).toBe('PASS')
  })

  it('returns WARNING for sitemap when not found', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: false, status: 404 })

    const results = await checkRobotsAndSitemap('https://example.com')
    const sitemapResult = results.find(r => r.check_type === 'sitemap')

    expect(sitemapResult?.status).toBe('WARNING')
    expect(sitemapResult?.recommendation).toBeTruthy()
  })
})
