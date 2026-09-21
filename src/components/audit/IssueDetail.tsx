'use client'

import { AuditResult } from '@/types'

interface IssueDetailProps {
  result: AuditResult
  onClose: () => void
}

const statusColors: Record<string, string> = {
  PASS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
  ERROR: 'bg-rose-50 text-rose-700 border-rose-200',
  CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300',
}

export function IssueDetail({ result, onClose }: IssueDetailProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-slate-900">{result.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 text-sm rounded transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px] mb-1">
              Status
            </div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full font-medium border ${statusColors[result.status] || 'bg-slate-100 text-slate-700'}`}>
              {result.status}
            </span>
          </div>

          {result.message && (
            <div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px] mb-1">
                Current Observation
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
                {result.message}
              </div>
            </div>
          )}

          {result.recommendation && (
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
              <div className="text-blue-900 font-semibold mb-1">
                Recommendation
              </div>
              <div className="text-blue-900 leading-relaxed">
                {result.recommendation}
              </div>
            </div>
          )}

          {result.technical_details && Object.keys(result.technical_details).length > 0 && (
            <div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px] mb-1">
                Technical Details
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
                {JSON.stringify(result.technical_details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
