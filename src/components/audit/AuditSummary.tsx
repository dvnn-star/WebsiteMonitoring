'use client'

import { Audit } from '@/types'

interface AuditSummaryProps {
  audit: Audit
}

export function AuditSummary({ audit }: AuditSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-bg-primary border border-border-light rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-status-pass mb-1">{audit.pass_count}</div>
        <div className="text-sm text-text-secondary">Pass</div>
      </div>
      <div className="bg-bg-primary border border-border-light rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-status-warning mb-1">{audit.warning_count}</div>
        <div className="text-sm text-text-secondary">Warning</div>
      </div>
      <div className="bg-bg-primary border border-border-light rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-status-error mb-1">{audit.error_count}</div>
        <div className="text-sm text-text-secondary">Error</div>
      </div>
    </div>
  )
}
