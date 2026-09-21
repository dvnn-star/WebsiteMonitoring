import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Verify website ownership
  const { data: website, error: webError } = await supabase
    .from('websites')
    .select('id, url')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (webError || !website) {
    return NextResponse.json({ error: 'Website not found' }, { status: 404 })
  }

  // Fetch recent uptime checks (last 50)
  const { data: checks, error: checksError } = await supabase
    .from('uptime_checks')
    .select('*')
    .eq('website_id', id)
    .order('checked_at', { ascending: false })
    .limit(50)

  if (checksError) {
    return NextResponse.json({ error: checksError.message }, { status: 500 })
  }

  // Fetch active alerts
  const { data: alerts, error: alertsError } = await supabase
    .from('alerts')
    .select('*')
    .eq('website_id', id)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(10)

  if (alertsError) {
    return NextResponse.json({ error: alertsError.message }, { status: 500 })
  }

  return NextResponse.json({ checks: checks || [], alerts: alerts || [] })
}
