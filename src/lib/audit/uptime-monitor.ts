import { SupabaseClient } from '@supabase/supabase-js'
import { UptimeCheck } from '@/types'

export interface SingleUptimeResult {
  is_up: boolean
  status_code: number | null
  response_time_ms: number
  error_message?: string | null
}

/**
 * Pings a website to determine status code and response time.
 */
export async function pingWebsite(url: string): Promise<SingleUptimeResult> {
  const startTime = Date.now()

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    })

    const responseTime = Date.now() - startTime

    // 2xx and 3xx are operational
    const isUp = res.status >= 200 && res.status < 400

    return {
      is_up: isUp,
      status_code: res.status,
      response_time_ms: responseTime,
      error_message: isUp ? null : `HTTP ${res.status}`,
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.message.toLowerCase().includes('timeout'))

    return {
      is_up: false,
      status_code: isTimeout ? 504 : null,
      response_time_ms: responseTime,
      error_message: isTimeout
        ? 'Connection timed out (>10s)'
        : error instanceof Error
        ? error.message
        : 'Connection failed',
    }
  }
}

/**
 * Runs uptime check across active websites, stores records, and issues alerts when down.
 */
export async function runUptimeMonitoring(supabase: SupabaseClient) {
  const { data: websites, error: webError } = await supabase
    .from('websites')
    .select('*')
    .eq('is_active', true)

  if (webError || !websites) {
    throw new Error(webError?.message || 'Failed to fetch websites')
  }

  const results = []

  for (const site of websites) {
    const check = await pingWebsite(site.url)

    // 1. Record uptime check
    const uptimeRecord: UptimeCheck = {
      website_id: site.id,
      status_code: check.status_code,
      response_time_ms: check.response_time_ms,
      is_up: check.is_up,
      error_message: check.error_message,
    }

    await supabase.from('uptime_checks').insert(uptimeRecord)

    // 2. Alert handling
    if (!check.is_up) {
      // Check if alert already sent in last 2 hours to avoid notification spam
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      const { data: recentAlerts } = await supabase
        .from('alerts')
        .select('id')
        .eq('website_id', site.id)
        .eq('type', 'downtime')
        .gt('created_at', twoHoursAgo)
        .limit(1)

      if (!recentAlerts || recentAlerts.length === 0) {
        const errorDesc = check.status_code
          ? `HTTP ${check.status_code}`
          : check.error_message || 'Unreachable'

        await supabase.from('alerts').insert({
          website_id: site.id,
          user_id: site.user_id,
          type: 'downtime',
          title: `Website Down: ${site.domain || site.name}`,
          message: `${site.url} is down (${errorDesc}). Response took ${check.response_time_ms}ms.`,
          status_code: check.status_code,
          is_read: false,
        })
      }

      // Update website status
      await supabase
        .from('websites')
        .update({ last_audit_status: 'critical' })
        .eq('id', site.id)
    } else {
      // If back up, check if previous check was down and send recovery alert
      const { data: previousChecks } = await supabase
        .from('uptime_checks')
        .select('is_up')
        .eq('website_id', site.id)
        .order('checked_at', { ascending: false })
        .limit(2)

      if (previousChecks && previousChecks.length > 1 && !previousChecks[1].is_up) {
        await supabase.from('alerts').insert({
          website_id: site.id,
          user_id: site.user_id,
          type: 'recovery',
          title: `Website Recovered: ${site.domain || site.name}`,
          message: `${site.url} is back online (HTTP ${check.status_code}) with ${check.response_time_ms}ms response time.`,
          status_code: check.status_code,
          is_read: false,
        })

        await supabase
          .from('websites')
          .update({ last_audit_status: 'healthy' })
          .eq('id', site.id)
      }
    }

    results.push({
      website_id: site.id,
      url: site.url,
      ...check,
    })
  }

  return results
}
