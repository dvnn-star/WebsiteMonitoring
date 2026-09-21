import { executeAudit } from '@/lib/audit/engine'
import { SupabaseClient } from '@supabase/supabase-js'

// Mock checkers
jest.mock('@/lib/audit/http-checker', () => ({
  checkHTTPStatus: jest.fn().mockResolvedValue([
    {
      category: 'technical',
      check_type: 'http_status',
      status: 'PASS',
      severity: 'passed',
      title: 'HTTP Status',
      message: '200 OK',
    },
  ]),
}))

jest.mock('@/lib/audit/ssl-checker', () => ({
  checkSSL: jest.fn().mockResolvedValue([
    {
      category: 'security',
      check_type: 'ssl_certificate',
      status: 'PASS',
      severity: 'passed',
      title: 'SSL Certificate',
      message: 'Valid SSL',
    },
  ]),
}))

jest.mock('@/lib/audit/dns-checker', () => ({
  checkDNS: jest.fn().mockResolvedValue([
    {
      category: 'infrastructure',
      check_type: 'dns',
      status: 'PASS',
      severity: 'passed',
      title: 'DNS',
      message: 'Resolvable',
    },
  ]),
}))

jest.mock('@/lib/audit/seo-checker', () => ({
  checkSEO: jest.fn().mockResolvedValue([
    {
      category: 'seo',
      check_type: 'title',
      status: 'WARNING',
      severity: 'warning',
      title: 'Title',
      message: 'Too long',
    },
  ]),
}))

jest.mock('@/lib/audit/crawlability-checker', () => ({
  checkRobotsAndSitemap: jest.fn().mockResolvedValue([
    {
      category: 'crawlability',
      check_type: 'robots_txt',
      status: 'PASS',
      severity: 'passed',
      title: 'Robots.txt',
      message: 'Found',
    },
  ]),
}))

jest.mock('@/lib/audit/mobile-checker', () => ({
  checkMobileViewport: jest.fn().mockResolvedValue([
    {
      category: 'performance',
      check_type: 'mobile_viewport',
      status: 'PASS',
      severity: 'passed',
      title: 'Mobile Viewport',
      message: 'Configured',
    },
  ]),
}))

describe('executeAudit', () => {
  it('runs all checks, persists results, and completes successfully', async () => {
    const mockUpdate = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) })
    const mockInsert = jest.fn().mockResolvedValue({ error: null })

    const mockSupabase = {
      from: jest.fn((table: string) => {
        if (table === 'audits') {
          return { update: mockUpdate }
        }
        if (table === 'audit_results') {
          return { insert: mockInsert }
        }
        if (table === 'websites') {
          return { update: mockUpdate }
        }
        return {}
      }),
    } as unknown as SupabaseClient

    const result = await executeAudit(
      mockSupabase,
      'audit-123',
      'https://example.com',
      'site-123'
    )

    expect(result.status).toBe('completed')
    expect(result.passCount).toBe(5)
    expect(result.warningCount).toBe(1)
    expect(result.errorCount).toBe(0)
    expect(result.results.length).toBe(6)

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'running' })
    )
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'completed', pass_count: 5, warning_count: 1 })
    )
  })

  it('handles error by marking audit as failed', async () => {
    const mockUpdate = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) })

    const mockSupabase = {
      from: jest.fn((table: string) => {
        if (table === 'audits') {
          return {
            update: jest.fn((data: Record<string, unknown>) => {
              if (data.status === 'running') {
                throw new Error('Database connection failed')
              }
              return mockUpdate(data)
            }),
          }
        }
        return {}
      }),
    } as unknown as SupabaseClient

    await expect(
      executeAudit(mockSupabase, 'audit-123', 'https://example.com', 'site-123')
    ).rejects.toThrow('Database connection failed')

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'failed', error_message: 'Database connection failed' })
    )
  })
})
