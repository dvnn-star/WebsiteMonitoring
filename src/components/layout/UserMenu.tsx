'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function UserMenu({ email }: { email: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initial = email ? email[0].toUpperCase() : 'U'

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
          {initial}
        </div>
        <span className="text-xs font-medium text-slate-700 max-w-[180px] truncate">
          {email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
        title="Logout"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Logout</span>
      </button>
    </div>
  )
}
