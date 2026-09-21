import { SupabaseClient } from '@supabase/supabase-js'
import { AuditResult } from '@/types'

/**
 * Executes all website audit checks and persists results incrementally to Supabase.
 */
export async function executeAudit(
  supabase: SupabaseClient,
  auditId: string,
  url: string,
  websiteId: string
) {
  try {
    // 1. Mark as running
    await supabase
      .from('audits')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', auditId)

    const { checkHTTPStatus } = await import('@/lib/audit/http-checker')
    const { checkSSL } = await import('@/lib/audit/ssl-checker')
    const { checkDNS } = await import('@/lib/audit/dns-checker')
    const { checkSEO } = await import('@/lib/audit/seo-checker')
    const { checkRobotsAndSitemap } = await import('@/lib/audit/crawlability-checker')
    const { checkMobileViewport } = await import('@/lib/audit/mobile-checker')

    const allResults: AuditResult[] = []

    // Helper to run a check and save its results immediately so progress polling sees it
    const runAndSave = async (checkFn: () => Promise<AuditResult[]>) => {
      try {
        const items = await checkFn()
        if (items && items.length > 0) {
          const toInsert = items.map(item => ({
            audit_id: auditId,
            category: item.category,
            check_type: item.check_type,
            status: item.status,
            severity: item.severity,
            title: item.title,
            message: item.message || null,
            technical_details: item.technical_details || null,
            recommendation: item.recommendation || null,
          }))

          const { error: insertError } = await supabase
            .from('audit_results')
            .insert(toInsert)

          if (insertError) {
            console.error('Failed to insert audit results batch:', insertError)
          }

          allResults.push(...items)
        }
        return items
      } catch (err) {
        console.error('Checker error:', err)
        return []
      }
    }

    // Run checkers in parallel
    await Promise.allSettled([
      runAndSave(() => checkHTTPStatus(url)),
      runAndSave(() => checkSSL(url)),
      runAndSave(() => checkDNS(url)),
      runAndSave(() => checkSEO(url)),
      runAndSave(() => checkRobotsAndSitemap(url)),
      runAndSave(() => checkMobileViewport(url)),
    ])

    const passCount = allResults.filter(r => r.status === 'PASS').length
    const warningCount = allResults.filter(r => r.status === 'WARNING').length
    const errorCount = allResults.filter(r => r.status === 'ERROR' || r.status === 'CRITICAL').length

    // 2. Mark audit as completed
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

    // 3. Update overall website status
    const overallStatus = errorCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy'
    await supabase
      .from('websites')
      .update({
        last_audit_at: new Date().toISOString(),
        last_audit_status: overallStatus,
      })
      .eq('id', websiteId)

    return {
      status: 'completed',
      passCount,
      warningCount,
      errorCount,
      results: allResults,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown audit error'
    console.error('Audit execution failed:', errorMsg)
    try {
      await supabase
        .from('audits')
        .update({
          status: 'failed',
          error_message: errorMsg,
          completed_at: new Date().toISOString(),
        })
        .eq('id', auditId)
    } catch (updateErr) {
      console.error('Failed to update audit failure status:', updateErr)
    }

    throw error
  }
}
