import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuditResults } from '@/components/audit/AuditResults'

export const metadata: Metadata = {
  title: 'Audit Results - Website Monitor',
}

export default async function AuditResultPage({
  params,
}: {
  params: Promise<{ id: string; auditId: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id, auditId } = await params

  const { data: website } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!website) {
    notFound()
  }

  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .eq('website_id', id)
    .single()

  if (!audit) {
    notFound()
  }

  const { data: results } = await supabase
    .from('audit_results')
    .select('*')
    .eq('audit_id', auditId)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/dashboard/websites/${id}`}
        className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Website
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">
          {website.name || website.domain}
        </h1>
        <p className="text-text-secondary">{website.url}</p>
        <p className="text-sm text-text-tertiary mt-1">
          Audited on {new Date(audit.created_at).toLocaleDateString()} at{' '}
          {new Date(audit.created_at).toLocaleTimeString()}
        </p>
      </div>

      <AuditResults
        auditId={auditId}
        websiteId={id}
        initialStatus={audit.status}
        initialResults={results || []}
      />
    </div>
  )
}
