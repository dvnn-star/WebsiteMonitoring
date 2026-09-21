import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sanitizeInput } from '@/lib/validation/schemas'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('id, type, message, is_read, created_at, website_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const unreadCount = alerts?.filter((a) => !a.is_read).length || 0

  return NextResponse.json({ alerts, unreadCount })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { alert_id, mark_all_read } = body as Record<string, unknown>

  if (mark_all_read === true) {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  if (alert_id && typeof alert_id === 'string') {
    const sanitizedAlertId = sanitizeInput(alert_id)
    
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', sanitizedAlertId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Missing alert_id or mark_all_read' }, { status: 400 })
}
