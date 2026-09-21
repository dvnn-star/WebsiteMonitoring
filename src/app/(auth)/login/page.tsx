import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Login - Website Monitor',
  description: 'Login to your account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Login</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Welcome back! Please login to your account.
          </p>
        </div>
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xl shadow-slate-200/40">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
