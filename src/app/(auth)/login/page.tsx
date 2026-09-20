import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login - Website Monitor',
  description: 'Login to your account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">Login</h1>
          <p className="text-text-secondary mt-2">
            Welcome back! Please login to your account.
          </p>
        </div>
        
        <div className="bg-bg-primary border border-border-light rounded-lg p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
