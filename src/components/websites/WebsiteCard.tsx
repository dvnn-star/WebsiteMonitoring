'use client'

import Link from 'next/link'
import { Website } from '@/types'
import { DeleteWebsiteButton } from './DeleteWebsiteButton'

interface WebsiteCardProps {
  website: Website
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const statusColor = {
    healthy: 'text-status-pass',
    warning: 'text-status-warning',
    critical: 'text-status-error',
  }

  return (
    <div className="bg-bg-primary border border-border-light rounded-lg p-4 hover:border-border-medium transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-text-primary">
            {website.name || website.domain}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            {website.url}
          </p>
        </div>
        {website.last_audit_status && (
          <span className={`text-sm font-medium ${statusColor[website.last_audit_status]}`}>
            {website.last_audit_status}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
        {website.last_audit_at ? (
          <span>Last audit: {new Date(website.last_audit_at).toLocaleDateString()}</span>
        ) : (
          <span>Not audited yet</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/websites/${website.id}`}
          className="flex-1 text-center bg-bg-secondary text-text-primary px-3 py-2 rounded-md text-sm hover:bg-bg-tertiary"
        >
          View Details
        </Link>
        <DeleteWebsiteButton websiteId={website.id} />
      </div>
    </div>
  )
}
