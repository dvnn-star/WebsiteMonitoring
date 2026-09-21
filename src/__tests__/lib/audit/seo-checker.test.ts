import { checkSEO } from '@/lib/audit/seo-checker'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => mockFetch.mockReset())

const htmlWith = (parts: string) =>
  `<html><head>${parts}</head><body><h1>Heading</h1></body></html>`

describe('checkSEO', () => {
  it('returns ERROR when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'))

    const results = await checkSEO('https://example.com')
    const result = results.find(r => r.check_type === 'page_fetch')

    expect(result?.status).toBe('ERROR')
  })

  describe('title checks', () => {
    it('returns PASS for title under 60 chars', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWith('<title>Short Title</title>'),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'title')

      expect(result?.status).toBe('PASS')
      expect(result?.message).toContain('Short Title')
    })

    it('returns WARNING for title over 60 chars', async () => {
      const longTitle = 'A'.repeat(61)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWith(`<title>${longTitle}</title>`),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'title')

      expect(result?.status).toBe('WARNING')
      expect(result?.recommendation).toBeTruthy()
    })

    it('returns ERROR when title missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWith(''),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'title')

      expect(result?.status).toBe('ERROR')
      expect(result?.recommendation).toBeTruthy()
    })
  })

  describe('meta description checks', () => {
    it('returns PASS for description 50-160 chars', async () => {
      const desc = 'A'.repeat(100)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          htmlWith(`<title>T</title><meta name="description" content="${desc}">`),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'meta_description')

      expect(result?.status).toBe('PASS')
    })

    it('returns WARNING for description under 50 chars', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          htmlWith('<title>T</title><meta name="description" content="Short">'),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'meta_description')

      expect(result?.status).toBe('WARNING')
    })

    it('returns WARNING when meta description missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWith('<title>T</title>'),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'meta_description')

      expect(result?.status).toBe('WARNING')
      expect(result?.message).toContain('Missing')
    })
  })

  describe('h1 checks', () => {
    it('returns PASS for exactly one H1', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          '<html><head><title>T</title></head><body><h1>Main heading</h1></body></html>',
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'h1')

      expect(result?.status).toBe('PASS')
    })

    it('returns WARNING for no H1', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><head><title>T</title></head><body></body></html>',
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'h1')

      expect(result?.status).toBe('WARNING')
    })

    it('returns WARNING for multiple H1', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          '<html><head><title>T</title></head><body><h1>A</h1><h1>B</h1></body></html>',
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'h1')

      expect(result?.status).toBe('WARNING')
      expect(result?.message).toContain('Multiple')
    })
  })

  describe('canonical checks', () => {
    it('returns PASS when canonical tag exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          htmlWith('<title>T</title><link rel="canonical" href="https://example.com/">'),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'canonical')

      expect(result?.status).toBe('PASS')
      expect(result?.message).toContain('https://example.com/')
    })

    it('returns WARNING when canonical tag missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWith('<title>T</title>'),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'canonical')

      expect(result?.status).toBe('WARNING')
    })
  })

  describe('open graph checks', () => {
    it('returns PASS for og:title', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          htmlWith('<title>T</title><meta property="og:title" content="OG Title">'),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'og_title')

      expect(result?.status).toBe('PASS')
    })

    it('returns WARNING for missing og:image', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWith('<title>T</title>'),
      })

      const results = await checkSEO('https://example.com')
      const result = results.find(r => r.check_type === 'og_image')

      expect(result?.status).toBe('WARNING')
    })
  })
})
