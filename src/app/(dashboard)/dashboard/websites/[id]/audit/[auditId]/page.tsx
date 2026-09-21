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
    <div className="w-full px-6 sm:px-10 lg:px-14 py-8">
      <Link
        href={`/dashboard/websites/${id}`}
        className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        ← Back to Website
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {website.name || website.domain}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">{website.url}</p>
        <p className="text-xs text-slate-400 mt-2">
          Audited on {new Date(audit.created_at).toLocaleDateString()} at{' '}
          {new Date(audit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
