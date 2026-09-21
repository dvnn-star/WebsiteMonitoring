'use client'

import Link from 'next/link'
import { Website } from '@/types'
import { DeleteWebsiteButton } from './DeleteWebsiteButton'

interface WebsiteCardProps {
  website: Website
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const statusColor: Record<string, string> = {
    healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {website.name || website.domain}
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {website.url}
            </p>
          </div>

          {website.last_audit_status && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor[website.last_audit_status] || 'bg-slate-100 text-slate-600'}`}>
              {website.last_audit_status}
            </span>
          )}
        </div>

        <div className="text-xs text-slate-400 my-4 py-2 border-y border-slate-100">
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
          className="flex-1 text-center bg-slate-100 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
        >
          View Details
        </Link>
        <DeleteWebsiteButton websiteId={website.id} />
      </div>
    </div>
  )
}
