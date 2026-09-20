'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      router.push('/login')
      return
    }
    
    const client = supabase
    
    const checkAuth = async () => {
      const { data: { session } } = await client.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }
      
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
