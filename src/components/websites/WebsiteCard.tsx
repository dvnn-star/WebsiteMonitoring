'use client'

import Link from 'next/link'
import { Website } from '@/types'
import { DeleteWebsiteButton } from './DeleteWebsiteButton'
import { Globe, Clock, ArrowRight } from 'lucide-react'

interface WebsiteCardProps {
  website: Website
}

export function WebsiteCard({ website }: WebsiteCardProps) {
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

  const statusStyle = website.last_audit_status ? statusConfig[website.last_audit_status] : null

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {website.name || website.domain}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                {website.url}
              </p>
            </div>
          </div>

          {website.last_audit_status && statusStyle && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`}></span>
              {website.last_audit_status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 my-4 py-2 border-y border-slate-100">
          <Clock className="w-3.5 h-3.5" />
          {website.last_audit_at ? (
            <span>Last audit: {new Date(website.last_audit_at).toLocaleDateString()}</span>
          ) : (
            <span>Not audited yet</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Link
          href={`/dashboard/websites/${website.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-100 text-slate-800 px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <DeleteWebsiteButton websiteId={website.id} />
      </div>
    </div>
  )
}
