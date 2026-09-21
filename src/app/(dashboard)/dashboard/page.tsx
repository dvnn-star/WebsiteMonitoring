import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { WebsiteList } from '@/components/websites/WebsiteList'
import { DashboardStats } from '@/components/dashboard/DashboardStats'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: websites } = await supabase
    .from('websites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: recentAudits } = await supabase
    .from('audits')
    .select('id, status, created_at, pass_count, warning_count, error_count, website_id, websites(name, domain)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = {
    totalWebsites: websites?.length || 0,
    healthy: websites?.filter(w => w.last_audit_status === 'healthy').length || 0,
    warning: websites?.filter(w => w.last_audit_status === 'warning').length || 0,
    critical: websites?.filter(w => w.last_audit_status === 'critical').length || 0,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
        <Link
          href="/dashboard/websites/new"
          className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Add Website
        </Link>
      </div>

      <DashboardStats stats={stats} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-text-primary">My Websites</h2>
        </div>
        <WebsiteList websites={websites || []} />
      </div>

      {recentAudits && recentAudits.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-text-primary mb-4">Recent Audits</h2>
          <div className="bg-bg-primary border border-border-light rounded-lg divide-y divide-border-light">
            {recentAudits.map((audit) => (
              <Link
                key={audit.id}
                href={`/dashboard/websites/${audit.website_id}/audit/${audit.id}`}
                className="flex items-center justify-between p-4 hover:bg-bg-secondary"
              >
                <div>
                  <div className="font-medium text-text-primary">
                    {(() => { const w = audit.websites as unknown as { name: string; domain: string } | { name: string; domain: string }[] | null; if (!w) return 'Unknown'; const obj = Array.isArray(w) ? w[0] : w; return obj?.name || obj?.domain || 'Unknown'; })()}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {new Date(audit.created_at).toLocaleDateString()} at{' '}
                    {new Date(audit.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-status-pass">{audit.pass_count} Pass</span>
                  <span className="text-status-warning">{audit.warning_count} Warning</span>
                  <span className="text-status-error">{audit.error_count} Error</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
