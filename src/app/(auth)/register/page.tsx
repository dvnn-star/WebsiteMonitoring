import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Register - Website Monitor',
  description: 'Create a new account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">Register</h1>
          <p className="text-text-secondary mt-2">
            Create an account to get started.
          </p>
        </div>
        
        <div className="bg-bg-primary border border-border-light rounded-lg p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
