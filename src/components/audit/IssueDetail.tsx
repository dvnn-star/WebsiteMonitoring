'use client'

import { AuditResult } from '@/types'

interface IssueDetailProps {
  result: AuditResult
  onClose: () => void
}

export function IssueDetail({ result, onClose }: IssueDetailProps) {
  const statusColors: Record<string, string> = {
    PASS: 'bg-status-pass/10 text-status-pass',
    WARNING: 'bg-status-warning/10 text-status-warning',
    ERROR: 'bg-status-error/10 text-status-error',
    CRITICAL: 'bg-status-critical/10 text-status-critical',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h2 className="text-lg font-semibold text-text-primary">{result.title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-text-secondary mb-1">Status</div>
            <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${statusColors[result.status]}`}>
              {result.status}
            </span>
          </div>

          {result.message && (
            <div>
              <div className="text-sm text-text-secondary mb-1">Current</div>
              <div className="text-text-primary">{result.message}</div>
            </div>
          )}

          {result.technical_details && Object.keys(result.technical_details).length > 0 && (
            <div>
              <div className="text-sm text-text-secondary mb-1">Technical Details</div>
              <pre className="bg-bg-secondary p-3 rounded text-sm overflow-x-auto text-text-primary">
                {JSON.stringify(result.technical_details, null, 2)}
              </pre>
            </div>
          )}

          {result.recommendation && (
            <div>
              <div className="text-sm text-text-secondary mb-1">Recommendation</div>
              <div className="text-text-primary">{result.recommendation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
