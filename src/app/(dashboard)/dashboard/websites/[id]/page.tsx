import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RunAuditButton } from '@/components/websites/RunAuditButton'
import { AuditCharts } from '@/components/websites/AuditCharts'
import { Audit } from '@/types'

export const metadata: Metadata = {
  title: 'Website Details - Website Monitor',
}

export default async function WebsiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const { data: website } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!website) {
    notFound()
  }

  const { data: audits } = await supabase
    .from('audits')
    .select('*')
    .eq('website_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  const statusColors: Record<string, string> = {
    healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
  }

  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {website.name || website.domain}
            </h1>
            <a
              href={website.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
            >
              {website.url} ↗
            </a>
          </div>
          <RunAuditButton websiteId={website.id} />
        </div>

        {/* Quick status cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
            {website.last_audit_status ? (
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[website.last_audit_status] || 'bg-slate-100 text-slate-600'}`}>
                {website.last_audit_status}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500">Not audited</span>
            )}
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-1">Last Audit</p>
            <p className="text-sm font-semibold text-slate-900">
              {website.last_audit_at
                ? new Date(website.last_audit_at).toLocaleDateString()
                : '-'}
            </p>
          </div>
        </div>

        {/* Audit Graphics & Analytics */}
        <AuditCharts audits={(audits as Audit[]) || []} />

        {/* Details list */}
        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Website Details
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
              <dt className="text-slate-500 font-medium">Domain</dt>
              <dd className="text-slate-900 font-semibold mt-0.5">{website.domain}</dd>
            </div>
            <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
              <dt className="text-slate-500 font-medium">Added</dt>
              <dd className="text-slate-900 font-semibold mt-0.5">
                {new Date(website.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Audit History */}
        {audits && audits.length > 0 && (
          <div className="border-t border-slate-100 pt-8 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Audit History
              </h2>
              <span className="text-xs text-slate-400 font-medium">{audits.length} audits</span>
            </div>
            <div className="space-y-2.5">
              {audits.map((audit) => (
                <Link
                  key={audit.id}
                  href={`/dashboard/websites/${website.id}/audit/${audit.id}`}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      {new Date(audit.created_at).toLocaleDateString()} at{' '}
                      {new Date(audit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {audit.status === 'completed' ? 'Completed' : audit.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {audit.pass_count} Pass
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                      {audit.warning_count} Warning
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      {audit.error_count} Error
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(!audits || audits.length === 0) && (
          <div className="border-t border-slate-100 pt-8 mt-8 text-center py-8">
            <p className="text-xs text-slate-500 mb-4">No audits yet. Run your first audit to see results.</p>
            <RunAuditButton websiteId={website.id} />
          </div>
        )}
      </div>
    </div>
  )
}
