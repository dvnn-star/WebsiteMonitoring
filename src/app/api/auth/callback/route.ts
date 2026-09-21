import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getSafeRedirectUrl } from '@/lib/validation/schemas'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextParam = requestUrl.searchParams.get('next')
  const next = getSafeRedirectUrl(nextParam, '/dashboard')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin + next)
}
