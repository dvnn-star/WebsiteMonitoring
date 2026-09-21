'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase/client'

interface LandingHeroAuthProps {
  initialUser: { email?: string } | null
}

export function LandingHeroAuth({ initialUser }: LandingHeroAuthProps) {
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
      <div className="flex justify-center mb-14">
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
      <Link href="/register">
        <Button size="lg" className="w-full sm:w-auto">Get Started Free</Button>
      </Link>
      <Link href="/login">
        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
          Sign In to Dashboard
        </Button>
      </Link>
    </div>
  )
}
