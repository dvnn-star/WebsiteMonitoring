import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Register - Website Monitor',
  description: 'Create a new account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Create an account to get started with website audits.
          </p>
        </div>
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xl shadow-slate-200/40">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
