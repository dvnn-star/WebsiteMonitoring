import { pingWebsite, runUptimeMonitoring } from '@/lib/audit/uptime-monitor'

const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

beforeEach(() => mockFetch.mockReset())

describe('pingWebsite', () => {
  it('returns up for 200 OK', async () => {
    mockFetch.mockResolvedValueOnce({ status: 200, ok: true } as Response)

    const result = await pingWebsite('https://example.com')

    expect(result.is_up).toBe(true)
    expect(result.status_code).toBe(200)
    expect(typeof result.response_time_ms).toBe('number')
    expect(result.error_message).toBeNull()
  })

  it('returns down for 500 error', async () => {
    mockFetch.mockResolvedValueOnce({ status: 500, ok: false } as Response)

    const result = await pingWebsite('https://example.com')

    expect(result.is_up).toBe(false)
    expect(result.status_code).toBe(500)
    expect(result.error_message).toContain('500')
  })

  it('returns 504 timeout when fetch times out', async () => {
    mockFetch.mockRejectedValueOnce(Object.assign(new Error('timeout exceeded'), { name: 'TimeoutError' }))

    const result = await pingWebsite('https://example.com')

    expect(result.is_up).toBe(false)
    expect(result.status_code).toBe(504)
    expect(result.error_message).toContain('timed out')
  })

  it('returns down for generic network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

    const result = await pingWebsite('https://example.com')

    expect(result.is_up).toBe(false)
    expect(result.status_code).toBeNull()
    expect(result.error_message).toContain('ECONNREFUSED')
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('runUptimeMonitoring', () => {
  const mockPing = jest.fn()

  beforeEach(() => {
    jest.resetModules()
  })

  it('inserts uptime records and creates downtime alert when site is down', async () => {
    const fakeWebsites = [
      { id: 'site-1', url: 'https://example.com', domain: 'example.com', user_id: 'user-1', is_active: true },
    ]

    const inserts: any[] = []
    const websiteUpdates: any[] = []
    const alertInserts: any[] = []

    const makeQuery = (table: string) => {
      if (table === 'websites') {
        return {
          select: () => ({
            eq: () => Promise.resolve({ data: fakeWebsites, error: null }),
          }),
          update: (data: any) => ({
            eq: (col: string, val: string) => {
              websiteUpdates.push({ data, col, val })
              return Promise.resolve({ error: null })
            },
          }),
        }
      }
      if (table === 'uptime_checks') {
        return {
          insert: (data: any) => {
            inserts.push(data)
            return Promise.resolve({ error: null })
          },
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: [{ is_up: true }], error: null }),
              }),
            }),
          }),
        }
      }
      if (table === 'alerts') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                gt: () => ({
                  limit: () => Promise.resolve({ data: [], error: null }),
                }),
              }),
            }),
          }),
          insert: (data: any) => {
            alertInserts.push(data)
            return Promise.resolve({ error: null })
          },
        }
      }
      return {
        select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) }),
        insert: () => Promise.resolve({ error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      }
    }

    jest.doMock('@/lib/audit/uptime-monitor', () => ({
      pingWebsite: mockPing,
    }))

    mockFetch.mockResolvedValueOnce({ status: 500, ok: false } as Response)

    const mockSupabase: any = {
      from: (table: string) => makeQuery(table),
    }

    const results = await runUptimeMonitoring(mockSupabase)

    expect(results).toHaveLength(1)
    expect(results[0].is_up).toBe(false)
    expect(inserts.length).toBeGreaterThan(0)
    expect(alertInserts.length).toBe(1)
    expect(alertInserts[0].type).toBe('downtime')
  })
})
