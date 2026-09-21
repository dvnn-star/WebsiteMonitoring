'use client'

import { AuditResult } from '@/types'
import { X, Lightbulb, Code2, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

interface IssueDetailProps {
  result: AuditResult
  onClose: () => void
}

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  PASS: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
  WARNING: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  },
  ERROR: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: <XCircle className="w-4 h-4 text-rose-600" />,
  },
  CRITICAL: {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-300',
    icon: <AlertCircle className="w-4 h-4 text-rose-700" />,
  },
}

export function IssueDetail({ result, onClose }: IssueDetailProps) {
  const config = statusConfig[result.status] || statusConfig.WARNING

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">{result.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div>
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
              Status
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border}`}>
              {config.icon}
              <span>{result.status}</span>
            </span>
          </div>

          {result.message && (
            <div>
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                Current Observation
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-medium">
                {result.message}
              </div>
            </div>
          )}

          {result.recommendation && (
            <div className="p-4 bg-blue-50/70 border border-blue-200/70 rounded-xl">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold mb-1.5">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span>Recommendation</span>
              </div>
              <div className="text-blue-900 leading-relaxed">
                {result.recommendation}
              </div>
            </div>
          )}

          {result.technical_details && Object.keys(result.technical_details).length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Technical Details</span>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                {JSON.stringify(result.technical_details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
