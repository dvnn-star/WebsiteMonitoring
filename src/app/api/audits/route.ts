import { createClient } from '@/lib/supabase/server'
import { NextResponse, after } from 'next/server'
import { validateAuditUrl } from '@/lib/utils'
import { executeAudit } from '@/lib/audit/engine'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { website_id } = await request.json()

  if (!website_id) {
    return NextResponse.json({ error: 'Website ID is required' }, { status: 400 })
  }

  const { data: website, error: websiteError } = await supabase
    .from('websites')
    .select('*')
    .eq('id', website_id)
    .eq('user_id', user.id)
    .single()

  if (websiteError || !website) {
    return NextResponse.json({ error: 'Website not found' }, { status: 404 })
  }

  // SSRF protection
  const validation = validateAuditUrl(website.url)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  // Rate limiting: clean up any stale queued/running audits older than 1 minute
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
  await supabase
    .from('audits')
    .update({ status: 'failed', error_message: 'Audit timed out' })
    .eq('website_id', website_id)
    .in('status', ['queued', 'running'])
    .lt('created_at', oneMinuteAgo)

  // Block concurrent audits if another audit is actively running (< 1 minute old)
  const { data: activeAudits } = await supabase
    .from('audits')
    .select('id')
    .eq('website_id', website_id)
    .in('status', ['queued', 'running'])
    .gt('created_at', oneMinuteAgo)
    .limit(1)

  if (activeAudits && activeAudits.length > 0) {
    return NextResponse.json({ error: 'Audit already in progress for this website' }, { status: 429 })
  }

  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .insert({ website_id, user_id: user.id, status: 'queued' })
    .select()
    .single()

  if (auditError) {
    return NextResponse.json({ error: auditError.message }, { status: 400 })
  }

  // Schedule background audit execution via Next.js after()
  after(async () => {
    try {
      await executeAudit(supabase, audit.id, website.url, website.id)
    } catch (err) {
      console.error('Audit execution error:', err)
    }
  })

  return NextResponse.json({ audit })
}
