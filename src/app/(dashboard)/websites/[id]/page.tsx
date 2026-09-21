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
    .limit(10)

  const statusColors: Record<string, string> = {
    healthy: 'text-status-pass',
    warning: 'text-status-warning',
    critical: 'text-status-error',
  }

  const statusBgColors: Record<string, string> = {
    healthy: 'bg-status-pass/10',
    warning: 'bg-status-warning/10',
    critical: 'bg-status-error/10',
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
            <p className="text-sm text-text-secondary mb-1">Status</p>
            {website.last_audit_status ? (
              <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${statusBgColors[website.last_audit_status]} ${statusColors[website.last_audit_status]}`}>
                {website.last_audit_status}
              </span>
            ) : (
              <span className="text-text-secondary">Not audited</span>
            )}
          </div>
          <div className="border border-border-light rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Last Audit</p>
            <p className="text-text-primary font-medium">
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-text-primary">Audit History</h2>
              <span className="text-sm text-text-secondary">{audits.length} audits</span>
            </div>
            <div className="space-y-2">
              {audits.map((audit) => (
                <Link
                  key={audit.id}
                  href={`/dashboard/websites/${website.id}/audit/${audit.id}`}
                  className="flex items-center justify-between p-4 border border-border-light rounded-lg hover:bg-bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${audit.error_count > 0 ? 'bg-status-error' : audit.warning_count > 0 ? 'bg-status-warning' : 'bg-status-pass'}`}></div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {new Date(audit.created_at).toLocaleDateString()} at{' '}
                        {new Date(audit.created_at).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">
                        {audit.status === 'completed' ? 'Completed' : audit.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-status-pass">{audit.pass_count} Pass</span>
                    <span className="text-status-warning">{audit.warning_count} Warning</span>
                    <span className="text-status-error">{audit.error_count} Error</span>
                    <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(!audits || audits.length === 0) && (
          <div className="border-t border-border-light pt-6 mt-6 text-center py-8">
            <p className="text-text-secondary mb-4">No audits yet. Run your first audit to see results.</p>
            <RunAuditButton websiteId={website.id} />
          </div>
        )}
      </div>
    </div>
  )
}
