'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface UserMenuProps {
  email: string
  redirectTo?: string
}

export function UserMenu({ email, redirectTo = '/login' }: UserMenuProps) {
  const router = useRouter()

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.refresh?.()
    router.push(redirectTo)
  }

  const initial = email ? email[0].toUpperCase() : 'U'

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200">
        <div className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-medium">
          {initial}
        </div>
        <span className="text-xs font-medium text-slate-700 max-w-[200px] truncate">
          {email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
      >
        Logout
      </button>
    </div>
  )
}
