import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .insert({
      website_id,
      user_id: user.id,
      status: 'queued',
    })
    .select()
    .single()

  if (auditError) {
    return NextResponse.json({ error: auditError.message }, { status: 400 })
  }

  await runAudit(audit.id, website.url)

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

    const { data: audit } = await supabase
      .from('audits')
      .select('website_id')
      .eq('id', auditId)
      .single()

    if (audit) {
      const overallStatus = errorCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy'
      await supabase
        .from('websites')
        .update({
          last_audit_at: new Date().toISOString(),
          last_audit_status: overallStatus,
        })
        .eq('id', audit.website_id)
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

  const [http, ssl, dns, seo, crawlability, mobile] = await Promise.all([
    checkHTTPStatus(url),
    checkSSL(url),
    checkDNS(url),
    checkSEO(url),
    checkRobotsAndSitemap(url),
    checkMobileViewport(url),
  ])

  return [...http, ...ssl, ...dns, ...seo, ...crawlability, ...mobile]
}
