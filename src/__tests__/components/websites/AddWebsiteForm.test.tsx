import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddWebsiteForm } from '@/components/websites/AddWebsiteForm'

const mockPush = jest.fn()
const mockBack = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockPush.mockReset()
  mockBack.mockReset()
  mockFetch.mockReset()
})

describe('AddWebsiteForm', () => {
  it('renders URL input and buttons', () => {
    render(<AddWebsiteForm />)
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/website name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add website/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('normalises URL without scheme before submitting', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ website: { id: '1' } }),
    })

    render(<AddWebsiteForm />)
    fireEvent.change(screen.getByLabelText(/website url/i), {
      target: { value: 'example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add website/i }))

    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.url).toBe('https://example.com')
    })
  })

  it('shows error for completely invalid URL', async () => {
    render(<AddWebsiteForm />)
    fireEvent.change(screen.getByLabelText(/website url/i), {
      target: { value: 'not a url' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add website/i }))

    await waitFor(() => {
      expect(screen.getByText(/valid url/i)).toBeInTheDocument()
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('shows server error message on failed request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Website already exists' }),
    })

    render(<AddWebsiteForm />)
    fireEvent.change(screen.getByLabelText(/website url/i), {
      target: { value: 'https://example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add website/i }))

    await waitFor(() => {
      expect(screen.getByText('Website already exists')).toBeInTheDocument()
    })
  })

  it('redirects to dashboard on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ website: { id: '1' } }),
    })

    render(<AddWebsiteForm />)
    fireEvent.change(screen.getByLabelText(/website url/i), {
      target: { value: 'https://example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add website/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('calls router.back on cancel', () => {
    render(<AddWebsiteForm />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockBack).toHaveBeenCalled()
  })
})
