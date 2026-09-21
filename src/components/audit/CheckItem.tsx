'use client'

import { AuditResult } from '@/types'

interface CheckItemProps {
  result: AuditResult
}

const statusColors: Record<string, string> = {
  PASS: 'text-status-pass',
  WARNING: 'text-status-warning',
  ERROR: 'text-status-error',
  CRITICAL: 'text-status-critical',
}

const statusIcons: Record<string, string> = {
  PASS: '✓',
  WARNING: '!',
  ERROR: '✗',
  CRITICAL: '✗',
}

export function CheckItem({ result }: CheckItemProps) {
  return (
    <div className="px-4 py-3 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <span className={`text-lg font-bold ${statusColors[result.status]}`}>
          {statusIcons[result.status]}
        </span>
        <div>
          <div className="font-medium text-text-primary">{result.title}</div>
          {result.message && (
            <div className="text-sm text-text-secondary mt-0.5">{result.message}</div>
          )}
        </div>
      </div>
      <span className={`text-sm font-medium ${statusColors[result.status]}`}>
        {result.status}
      </span>
    </div>
  )
}
