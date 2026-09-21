import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegisterForm } from '@/components/auth/RegisterForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

const mockSignUp = jest.fn()
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  },
}))

beforeEach(() => {
  mockPush.mockReset()
  mockSignUp.mockReset()
})

describe('RegisterForm', () => {
  it('renders email, password and confirm password inputs', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'pass1234' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } })
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('shows error when password is too short', async () => {
    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: '123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
    })
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('shows supabase error on failed signup', async () => {
    mockSignUp.mockResolvedValueOnce({ error: { message: 'Email already registered' } })

    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument()
    })
  })

  it('redirects to dashboard on success', async () => {
    mockSignUp.mockResolvedValueOnce({ error: null })

    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })
})
