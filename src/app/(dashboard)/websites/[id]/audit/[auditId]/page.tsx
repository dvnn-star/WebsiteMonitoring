import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuditResults } from '@/components/audit/AuditResults'
import { ArrowLeft, Globe, Clock, ExternalLink } from 'lucide-react'

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
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Website</span>
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
            <Globe className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight truncate">
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
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Audited on {new Date(audit.created_at).toLocaleDateString()} at{' '}
                {new Date(audit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
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
