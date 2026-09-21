'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export function UserMenu({ email }: { email: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-text-secondary text-sm">{email}</span>
      <button
        onClick={handleLogout}
        className="text-sm text-text-secondary hover:text-text-primary"
      >
        Logout
      </button>
    </div>
  )
}
