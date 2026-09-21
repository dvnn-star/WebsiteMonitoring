'use client'

import { Audit } from '@/types'

interface AuditSummaryProps {
  audit: Audit
}

export function AuditSummary({ audit }: AuditSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-5 mb-6 w-full">
      {/* Pass */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
        <div className="text-3xl font-bold text-emerald-600 tracking-tight mb-1">
          {audit.pass_count}
        </div>
        <div className="text-xs font-medium text-slate-500">
          Pass
        </div>
      </div>

      {/* Warning */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
        <div className="text-3xl font-bold text-amber-500 tracking-tight mb-1">
          {audit.warning_count}
        </div>
        <div className="text-xs font-medium text-slate-500">
          Warning
        </div>
      </div>

      {/* Error */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
        <div className="text-3xl font-bold text-rose-600 tracking-tight mb-1">
          {audit.error_count}
        </div>
        <div className="text-xs font-medium text-slate-500">
          Error
        </div>
      </div>
    </div>
  )
}
