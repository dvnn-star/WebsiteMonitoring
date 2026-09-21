import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createWebsiteSchema, sanitizeInput } from '@/lib/validation/schemas'
import { websiteCreateRateLimit, createRateLimitResponse, getClientIdentifier } from '@/lib/validation/rate-limit'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: websites, error } = await supabase
    .from('websites')
    .select('id, url, domain, name, created_at, is_active, last_audit_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ websites })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const identifier = getClientIdentifier(request, user.id)
  const rateLimitResult = websiteCreateRateLimit(identifier)
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.resetTime - Date.now())
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parseResult = createWebsiteSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { url, name } = parseResult.data
  const sanitizedName = sanitizeInput(name)
  const sanitizedUrl = sanitizeInput(url)

  let domain: string
  try {
    domain = new URL(sanitizedUrl).hostname
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .eq('domain', domain)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Website already exists' }, { status: 409 })
  }

  const { data: website, error } = await supabase
    .from('websites')
    .insert({
      user_id: user.id,
      url: sanitizedUrl,
      domain,
      name: sanitizedName,
    })
    .select('id, url, domain, name, created_at, is_active, last_audit_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ website })
}
