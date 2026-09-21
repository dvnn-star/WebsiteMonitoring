import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RunAuditButton } from '@/components/websites/RunAuditButton'
import { ArrowLeft, ExternalLink, Globe, ChevronRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react'

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

  const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    healthy: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      border: 'border-amber-200',
    },
    critical: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      dot: 'bg-rose-500',
      border: 'border-rose-200',
    },
  }

  const currentStatus = website.last_audit_status ? statusConfig[website.last_audit_status] : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {website.name || website.domain}
              </h1>
              <a
                href={website.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline mt-1"
              >
                <span>{website.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <RunAuditButton websiteId={website.id} />
        </div>

        {/* Quick status cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Status</p>
            {website.last_audit_status && currentStatus ? (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} animate-pulse`}></span>
                {website.last_audit_status}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500">Not audited</span>
            )}
          </div>
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Last Audit</p>
            <p className="text-sm font-semibold text-slate-900">
              {website.last_audit_at
                ? new Date(website.last_audit_at).toLocaleDateString()
                : '-'}
            </p>
          </div>
        </div>

        {/* Details list */}
        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">
            Website Details
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
              <dt className="text-slate-500 font-medium">Domain</dt>
              <dd className="text-slate-900 font-semibold mt-0.5">{website.domain}</dd>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
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
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
                Audit History
              </h2>
              <span className="text-xs font-medium text-slate-400">{audits.length} audits</span>
            </div>
            <div className="space-y-2">
              {audits.map((audit) => {
                const hasErrors = audit.error_count > 0
                const isPassed = audit.error_count === 0 && audit.warning_count === 0

                return (
                  <Link
                    key={audit.id}
                    href={`/dashboard/websites/${website.id}/audit/${audit.id}`}
                    className="flex items-center justify-between p-4 border border-slate-200/80 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        hasErrors ? 'bg-rose-50 text-rose-600' : isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {hasErrors ? (
                          <ShieldAlert className="w-4 h-4" />
                        ) : isPassed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {new Date(audit.created_at).toLocaleDateString()} at{' '}
                          {new Date(audit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {audit.status === 'completed' ? 'Completed' : audit.status}
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

        {(!audits || audits.length === 0) && (
          <div className="border-t border-slate-100 pt-8 mt-8 text-center py-8">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 mb-4">No audits yet. Run your first audit to see results.</p>
            <RunAuditButton websiteId={website.id} />
          </div>
        )}
      </div>
    </div>
  )
}
