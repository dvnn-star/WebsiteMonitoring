import React from 'react'
import { render, screen } from '@testing-library/react'
import { WebsiteCard } from '@/components/websites/WebsiteCard'
import { Website } from '@/types'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
}))

global.fetch = jest.fn()

const baseWebsite: Website = {
  id: 'site-1',
  user_id: 'user-1',
  url: 'https://example.com',
  domain: 'example.com',
  name: 'Example Site',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('WebsiteCard', () => {
  it('renders website name', () => {
    render(<WebsiteCard website={baseWebsite} />)
    expect(screen.getByText('Example Site')).toBeInTheDocument()
  })

  it('renders website URL', () => {
    render(<WebsiteCard website={baseWebsite} />)
    expect(screen.getByText('https://example.com')).toBeInTheDocument()
  })

  it('falls back to domain when name is missing', () => {
    render(<WebsiteCard website={{ ...baseWebsite, name: undefined }} />)
    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('shows "Not audited yet" when no audit date', () => {
    render(<WebsiteCard website={{ ...baseWebsite, last_audit_at: undefined }} />)
    expect(screen.getByText(/not audited yet/i)).toBeInTheDocument()
  })

  it('shows last audit date when available', () => {
    render(
      <WebsiteCard website={{ ...baseWebsite, last_audit_at: '2026-06-01T00:00:00Z' }} />
    )
    expect(screen.getByText(/last audit/i)).toBeInTheDocument()
  })

  it('renders View Details link to website page', () => {
    render(<WebsiteCard website={baseWebsite} />)
    const link = screen.getByRole('link', { name: /view details/i })
    expect(link).toHaveAttribute('href', '/dashboard/websites/site-1')
  })

  it('renders delete button', () => {
    render(<WebsiteCard website={baseWebsite} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('shows healthy status', () => {
    render(<WebsiteCard website={{ ...baseWebsite, last_audit_status: 'healthy' }} />)
    expect(screen.getByText('healthy')).toBeInTheDocument()
  })

  it('shows critical status', () => {
    render(<WebsiteCard website={{ ...baseWebsite, last_audit_status: 'critical' }} />)
    expect(screen.getByText('critical')).toBeInTheDocument()
  })
})
