import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuditSummary } from '@/components/audit/AuditSummary'
import { Audit } from '@/types'

const baseAudit: Audit = {
  id: 'audit-1',
  website_id: 'site-1',
  user_id: 'user-1',
  status: 'completed',
  created_at: '2026-01-01T00:00:00Z',
  pass_count: 18,
  warning_count: 5,
  error_count: 2,
}

describe('AuditSummary', () => {
  it('displays pass count', () => {
    render(<AuditSummary audit={baseAudit} />)
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('displays warning count', () => {
    render(<AuditSummary audit={baseAudit} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('displays error count', () => {
    render(<AuditSummary audit={baseAudit} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays Pass, Warning, Error labels', () => {
    render(<AuditSummary audit={baseAudit} />)
    expect(screen.getByText('Pass')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders zero counts correctly', () => {
    render(<AuditSummary audit={{ ...baseAudit, pass_count: 0, warning_count: 0, error_count: 0 }} />)
    expect(screen.getAllByText('0')).toHaveLength(3)
  })
})

// CheckItem
import { CheckItem } from '@/components/audit/CheckItem'
import { AuditResult } from '@/types'

const baseResult: AuditResult = {
  id: 'r-1',
  audit_id: 'audit-1',
  category: 'seo',
  check_type: 'title',
  status: 'PASS',
  severity: 'passed',
  title: 'Title',
  message: '"Example Title"',
}

describe('CheckItem', () => {
  it('renders title', () => {
    render(<CheckItem result={baseResult} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders message', () => {
    render(<CheckItem result={baseResult} />)
    expect(screen.getByText('"Example Title"')).toBeInTheDocument()
  })

  it('renders PASS status', () => {
    render(<CheckItem result={baseResult} />)
    expect(screen.getByText('PASS')).toBeInTheDocument()
  })

  it('renders WARNING status', () => {
    render(<CheckItem result={{ ...baseResult, status: 'WARNING' }} />)
    expect(screen.getByText('WARNING')).toBeInTheDocument()
  })

  it('renders ERROR status', () => {
    render(<CheckItem result={{ ...baseResult, status: 'ERROR' }} />)
    expect(screen.getByText('ERROR')).toBeInTheDocument()
  })
})

// DashboardStats
import { DashboardStats } from '@/components/dashboard/DashboardStats'

describe('DashboardStats', () => {
  const stats = { totalWebsites: 10, healthy: 7, warning: 2, critical: 1 }

  it('renders all stats', () => {
    render(<DashboardStats stats={stats} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders labels', () => {
    render(<DashboardStats stats={stats} />)
    expect(screen.getByText('Total Websites')).toBeInTheDocument()
    expect(screen.getByText('Healthy')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })
})
