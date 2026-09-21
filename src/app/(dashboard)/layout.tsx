import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserMenu } from '@/components/layout/UserMenu'
import { Activity } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Website Monitor
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-600">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-900 font-semibold"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/websites/new"
                className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                + Add Website
              </Link>
            </nav>
          </div>
          <UserMenu email={user.email || ''} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
