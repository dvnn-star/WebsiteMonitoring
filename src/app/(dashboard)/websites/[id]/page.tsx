import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RunAuditButton } from '@/components/websites/RunAuditButton'

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
    .limit(5)

  const statusColors: Record<string, string> = {
    healthy: 'text-status-pass',
    warning: 'text-status-warning',
    critical: 'text-status-error',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-bg-primary border border-border-light rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {website.name || website.domain}
            </h1>
            <p className="text-text-secondary mt-1">{website.url}</p>
          </div>
          <RunAuditButton websiteId={website.id} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-border-light rounded-lg p-4">
            <p className="text-sm text-text-secondary">Status</p>
            <p className={`text-lg font-medium ${statusColors[website.last_audit_status || ''] || 'text-text-secondary'}`}>
              {website.last_audit_status || 'Not audited'}
            </p>
          </div>
          <div className="border border-border-light rounded-lg p-4">
            <p className="text-sm text-text-secondary">Last Audit</p>
            <p className="text-lg font-medium text-text-primary">
              {website.last_audit_at
                ? new Date(website.last_audit_at).toLocaleDateString()
                : '-'}
            </p>
          </div>
        </div>

        <div className="border-t border-border-light pt-6">
          <h2 className="text-lg font-medium text-text-primary mb-4">Website Details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-text-secondary">Domain</dt>
              <dd className="text-text-primary font-medium">{website.domain}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Added</dt>
              <dd className="text-text-primary font-medium">
                {new Date(website.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        {audits && audits.length > 0 && (
          <div className="border-t border-border-light pt-6 mt-6">
            <h2 className="text-lg font-medium text-text-primary mb-4">Recent Audits</h2>
            <div className="space-y-2">
              {audits.map((audit) => (
                <Link
                  key={audit.id}
                  href={`/dashboard/websites/${website.id}/audit/${audit.id}`}
                  className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-bg-secondary"
                >
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {new Date(audit.created_at).toLocaleDateString()} at{' '}
                      {new Date(audit.created_at).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {audit.pass_count} Pass, {audit.warning_count} Warning, {audit.error_count} Error
                    </div>
                  </div>
                  <span className={`text-sm ${statusColors[audit.status === 'completed' ? (audit.error_count > 0 ? 'critical' : audit.warning_count > 0 ? 'warning' : 'healthy') : '']}`}>
                    {audit.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
