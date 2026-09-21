'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { registerSchema, sanitizeInput } from '@/lib/validation/schemas'

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!supabase) {
      setError('Supabase is not configured. Please set environment variables.')
      return
    }

    const parseResult = registerSchema.safeParse({
      email: sanitizeInput(email.trim()),
      password,
      confirmPassword,
    })

    if (!parseResult.success) {
      const firstError = Object.values(parseResult.error.flatten().fieldErrors)[0]?.[0]
      setError(firstError || 'Validation failed')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: parseResult.data.email,
        password: parseResult.data.password,
      })

      if (error) {
        setError(error.message)
        return
      }

      await Swal.fire({
        title: 'Registrasi Berhasil!',
        text: 'Silakan cek email Anda untuk mengkonfirmasi akun sebelum melanjutkan.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
      })

      router.push('/login')
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={loading}
      />
      
      <div className="space-y-1.5">
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          disabled={loading}
        />
        <p className="text-xs text-slate-500">
          Must contain uppercase, lowercase, and number
        </p>
      </div>

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        required
        disabled={loading}
      />

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Register'}
      </Button>

      <p className="text-center text-xs text-slate-500 pt-1">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  )
}
