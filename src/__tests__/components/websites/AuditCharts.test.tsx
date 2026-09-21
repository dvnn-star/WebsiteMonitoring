import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuditCharts } from '@/components/websites/AuditCharts'
import { Audit } from '@/types'

const mockAudits: Audit[] = [
  {
    id: 'audit-1',
    website_id: 'site-1',
    user_id: 'user-1',
    status: 'completed',
    created_at: '2026-09-21T10:00:00Z',
    pass_count: 15,
    warning_count: 2,
    error_count: 1,
  },
  {
    id: 'audit-2',
    website_id: 'site-1',
    user_id: 'user-1',
    status: 'completed',
    created_at: '2026-09-20T10:00:00Z',
    pass_count: 12,
    warning_count: 4,
    error_count: 2,
  },
  {
    id: 'audit-3',
    website_id: 'site-1',
    user_id: 'user-1',
    status: 'completed',
    created_at: '2026-09-19T10:00:00Z',
    pass_count: 10,
    warning_count: 5,
    error_count: 3,
  },
]

describe('AuditCharts', () => {
  it('returns null when audits array is empty', () => {
    const { container } = render(<AuditCharts audits={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when audits have no completed runs and zero counts', () => {
    const queuedAudit: Audit = {
      id: 'audit-0',
      website_id: 'site-1',
      user_id: 'user-1',
      status: 'queued',
      created_at: '2026-09-21T10:00:00Z',
      pass_count: 0,
      warning_count: 0,
      error_count: 0,
    }
    const { container } = render(<AuditCharts audits={[queuedAudit]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders section title and score percentage', () => {
    render(<AuditCharts audits={mockAudits} />)
    expect(screen.getByText(/audit analytics & trends/i)).toBeInTheDocument()
    // 15 out of 18 is 83%
    expect(screen.getAllByText('83%').length).toBeGreaterThanOrEqual(1)
  })

  it('renders latest pass ratio and counts', () => {
    render(<AuditCharts audits={mockAudits} />)
    expect(screen.getByText(/15 of 18 checks passed/i)).toBeInTheDocument()
    expect(screen.getAllByText('Pass').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Warn')).toBeInTheDocument()
    expect(screen.getByText('Err')).toBeInTheDocument()
  })

  it('renders trend chart with correct number of history bars', () => {
    render(<AuditCharts audits={mockAudits} />)
    expect(screen.getByText(/recent audits trend/i)).toBeInTheDocument()
    expect(screen.getByText(/showing last 3 runs/i)).toBeInTheDocument()
  })

  it('handles a single audit gracefully', () => {
    render(<AuditCharts audits={[mockAudits[0]]} />)
    expect(screen.getByText(/showing last 1 run/i)).toBeInTheDocument()
    expect(screen.getByText(/15 of 18 checks passed/i)).toBeInTheDocument()
  })

  it('handles an audit with 100% pass and 0 errors/warnings', () => {
    const perfectAudit: Audit = {
      id: 'audit-perfect',
      website_id: 'site-1',
      user_id: 'user-1',
      status: 'completed',
      created_at: '2026-09-21T10:00:00Z',
      pass_count: 18,
      warning_count: 0,
      error_count: 0,
    }
    render(<AuditCharts audits={[perfectAudit]} />)
    expect(screen.getAllByText('100%').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/18 of 18 checks passed/i)).toBeInTheDocument()
  })
})
