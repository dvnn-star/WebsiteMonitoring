import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateAuditUrl } from '@/lib/utils'

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

  // Rate limiting: max 1 queued/running audit per website
  const { data: running } = await supabase
    .from('audits')
    .select('id')
    .eq('website_id', website_id)
    .in('status', ['queued', 'running'])
    .limit(1)

  if (running && running.length > 0) {
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

  // Run audit asynchronously — do not await so response returns immediately
  runAudit(audit.id, website.url).catch(console.error)

  return NextResponse.json({ audit })
}

async function runAudit(auditId: string, url: string) {
  const supabase = await createClient()

  await supabase
    .from('audits')
    .update({ status: 'running', started_at: new Date().toISOString() })
    .eq('id', auditId)

  try {
    const results = await runAllChecks(url)

    const passCount = results.filter(r => r.status === 'PASS').length
    const warningCount = results.filter(r => r.status === 'WARNING').length
    const errorCount = results.filter(r => r.status === 'ERROR' || r.status === 'CRITICAL').length

    await supabase
      .from('audit_results')
      .insert(results.map(r => ({ ...r, audit_id: auditId })))

    await supabase
      .from('audits')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        pass_count: passCount,
        warning_count: warningCount,
        error_count: errorCount,
      })
      .eq('id', auditId)

    // Update website health
    const { data: auditRow } = await supabase
      .from('audits')
      .select('website_id')
      .eq('id', auditId)
      .single()

    if (auditRow) {
      const overallStatus = errorCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy'
      await supabase
        .from('websites')
        .update({ last_audit_at: new Date().toISOString(), last_audit_status: overallStatus })
        .eq('id', auditRow.website_id)
    }
  } catch (error) {
    await supabase
      .from('audits')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString(),
      })
      .eq('id', auditId)
  }
}

async function runAllChecks(url: string) {
  const { checkHTTPStatus } = await import('@/lib/audit/http-checker')
  const { checkSSL } = await import('@/lib/audit/ssl-checker')
  const { checkDNS } = await import('@/lib/audit/dns-checker')
  const { checkSEO } = await import('@/lib/audit/seo-checker')
  const { checkRobotsAndSitemap } = await import('@/lib/audit/crawlability-checker')
  const { checkMobileViewport } = await import('@/lib/audit/mobile-checker')

  const results = await Promise.allSettled([
    checkHTTPStatus(url),
    checkSSL(url),
    checkDNS(url),
    checkSEO(url),
    checkRobotsAndSitemap(url),
    checkMobileViewport(url),
  ])

  return results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
}
