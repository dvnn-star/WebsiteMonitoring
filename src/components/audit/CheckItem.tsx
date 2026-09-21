'use client'

import { AuditResult } from '@/types'

interface CheckItemProps {
  result: AuditResult
  onClick?: () => void
}

const statusConfig: Record<string, { badge: string; symbol: string }> = {
  PASS: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    symbol: 'text-emerald-600',
  },
  WARNING: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    symbol: 'text-amber-600',
  },
  ERROR: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    symbol: 'text-rose-600',
  },
  CRITICAL: {
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    symbol: 'text-rose-700',
  },
}

export function CheckItem({ result, onClick }: CheckItemProps) {
  const config = statusConfig[result.status] || statusConfig.WARNING

  return (
    <div
      onClick={onClick}
      className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-slate-50' : ''
      }`}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-900 leading-snug">
          {result.title}
        </div>
        {result.message && (
          <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
            {result.message}
          </div>
        )}
      </div>

      <div className="shrink-0">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge}`}>
          {result.status}
        </span>
      </div>
    </div>
  )
}
