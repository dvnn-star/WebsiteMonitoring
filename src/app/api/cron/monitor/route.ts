import { createClient } from '@/lib/supabase/server'
import { runUptimeMonitoring } from '@/lib/audit/uptime-monitor'
import { NextResponse } from 'next/server'

async function handleMonitorCron(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // 1. Check if invoked via CRON_SECRET (Vercel Cron or GitHub Actions)
  const isAuthorizedCron =
    cronSecret &&
    (authHeader === `Bearer ${cronSecret}` ||
      request.headers.get('x-cron-secret') === cronSecret)

  const supabase = await createClient()

  // 2. If not cron secret, allow authenticated logged-in user
  if (!isAuthorizedCron) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Provide valid CRON_SECRET or user session.' },
        { status: 401 }
      )
    }
  }

  try {
    const results = await runUptimeMonitoring(supabase)
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      checkedCount: results.length,
      results,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown cron error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return handleMonitorCron(request)
}

export async function POST(request: Request) {
  return handleMonitorCron(request)
}
