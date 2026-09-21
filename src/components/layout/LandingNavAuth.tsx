'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UserMenu } from './UserMenu'
import { supabase } from '@/lib/supabase/client'

interface LandingNavAuthProps {
  initialUser: { email?: string } | null
}

export function LandingNavAuth({ initialUser }: LandingNavAuthProps) {
  const [user, setUser] = useState<{ email?: string } | null>(initialUser)

  useEffect(() => {
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button size="sm" variant="secondary">Dashboard</Button>
        </Link>
        <UserMenu email={user.email || ''} redirectTo="/" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button variant="ghost" size="sm">Login</Button>
      </Link>
      <Link href="/register">
        <Button size="sm">Register</Button>
      </Link>
    </div>
  )
}
