import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UptimeChart } from '@/components/websites/UptimeChart'

const mockChecks = [
  { id: 'c1', website_id: 'site-1', status_code: 200, response_time_ms: 245, is_up: true, checked_at: '2026-09-21T10:00:00Z' },
  { id: 'c2', website_id: 'site-1', status_code: 500, response_time_ms: 1200, is_up: false, checked_at: '2026-09-21T08:00:00Z' },
  { id: 'c3', website_id: 'site-1', status_code: 200, response_time_ms: 300, is_up: true, checked_at: '2026-09-21T06:00:00Z' },
]

const mockAlerts = [
  {
    id: 'alert-1',
    website_id: 'site-1',
    user_id: 'user-1',
    type: 'downtime' as const,
    title: 'Website Down: example.com',
    message: 'https://example.com is down (HTTP 500)',
    status_code: 500,
    is_read: false,
    created_at: '2026-09-21T08:05:00Z',
  },
]

describe('UptimeChart', () => {
  it('renders section header and metric labels', () => {
    render(<UptimeChart websiteId="site-1" initialChecks={mockChecks} initialAlerts={[]} />)
    expect(screen.getByText(/uptime & response time monitoring/i)).toBeInTheDocument()
    expect(screen.getByText(/current status/i)).toBeInTheDocument()
    expect(screen.getByText(/uptime \(recent\)/i)).toBeInTheDocument()
    expect(screen.getAllByText(/response time/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/average latency/i)).toBeInTheDocument()
  })

  it('shows calculated uptime percentage (2 of 3 up = 66.7%)', () => {
    render(<UptimeChart websiteId="site-1" initialChecks={mockChecks} initialAlerts={[]} />)
    expect(screen.getByText('66.7%')).toBeInTheDocument()
  })

  it('renders alert banner when there are unread alerts', () => {
    render(<UptimeChart websiteId="site-1" initialChecks={mockChecks} initialAlerts={mockAlerts} />)
    expect(screen.getByText(/website down: example\.com/i)).toBeInTheDocument()
  })

  it('dismisses alert when clicking Dismiss', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({ ok: true })
    global.fetch = mockFetch as unknown as typeof fetch

    render(<UptimeChart websiteId="site-1" initialChecks={mockChecks} initialAlerts={mockAlerts} />)

    const dismissBtn = screen.getByRole('button', { name: /dismiss/i })
    fireEvent.click(dismissBtn)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/alerts',
        expect.objectContaining({ method: 'PATCH' })
      )
    })
  })

  it('renders placeholder checks when no data exists (synthetic timeline)', () => {
    render(<UptimeChart websiteId="site-1" initialChecks={[]} initialAlerts={[]} />)
    // Synthetic checks show 500 ms scale max
    expect(screen.getByText(/uptime \(200 ok, 500, timeout\)/i)).toBeInTheDocument()
    expect(screen.getByText(/response time \(245 ms\)/i)).toBeInTheDocument()
  })

  it('triggers manual uptime check on button click', async () => {
    const mockFetch = jest.fn()
      .mockResolvedValueOnce({ ok: true } as unknown as Response) // /api/cron/monitor
      .mockResolvedValueOnce({ ok: true, json: async () => ({ checks: [], alerts: [] }) } as unknown as Response) // /api/websites/[id]/uptime
    global.fetch = mockFetch as unknown as typeof fetch

    render(<UptimeChart websiteId="site-1" initialChecks={mockChecks} initialAlerts={[]} />)

    const checkBtn = screen.getByRole('button', { name: /check uptime now/i })
    fireEvent.click(checkBtn)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/cron/monitor', { method: 'POST' })
    })
  })
})
