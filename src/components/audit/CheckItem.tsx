'use client'

import { AuditResult } from '@/types'
import { CheckCircle2, AlertTriangle, XCircle, AlertOctagon } from 'lucide-react'

interface CheckItemProps {
  result: AuditResult
  onClick?: () => void
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
    icon: <AlertOctagon className="w-4 h-4 text-rose-700" />,
  },
}

export function CheckItem({ result, onClick }: CheckItemProps) {
  const config = statusConfig[result.status] || statusConfig.WARNING

  return (
    <div
      onClick={onClick}
      className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-slate-50/80' : ''
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 shrink-0">
          {config.icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 leading-snug">
            {result.title}
          </div>
          {result.message && (
            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-lg">
              {result.message}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
          {result.status}
        </span>
      </div>
    </div>
  )
}
