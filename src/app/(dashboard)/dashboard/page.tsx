import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { WebsiteList } from '@/components/websites/WebsiteList'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { Plus, ChevronRight, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react'

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of monitored websites and technical diagnostics.
          </p>
        </div>
        <Link
          href="/dashboard/websites/new"
          className="inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Website</span>
        </Link>
      </div>

      <DashboardStats stats={stats} />

      {/* Websites Grid */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">My Websites</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold">
              {websites?.length || 0}
            </span>
          </div>
        </div>
        <WebsiteList websites={websites || []} />
      </div>

      {/* Recent Audits */}
      {recentAudits && recentAudits.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent Audits</h2>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
            {recentAudits.map((audit) => {
              const websiteName = (() => {
                const w = audit.websites as unknown as { name: string; domain: string } | { name: string; domain: string }[] | null
                if (!w) return 'Unknown'
                const obj = Array.isArray(w) ? w[0] : w
                return obj?.name || obj?.domain || 'Unknown'
              })()

              const isPassed = audit.error_count === 0 && audit.warning_count === 0
              const hasErrors = audit.error_count > 0

              return (
                <Link
                  key={audit.id}
                  href={`/dashboard/websites/${audit.website_id}/audit/${audit.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      hasErrors ? 'bg-rose-50 text-rose-600' : isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {hasErrors ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {websiteName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(audit.created_at).toLocaleDateString()} at{' '}
                          {new Date(audit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {audit.pass_count} Pass
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
                        {audit.warning_count} Warning
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60">
                        {audit.error_count} Error
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
