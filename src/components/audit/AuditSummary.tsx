'use client'

import { Audit } from '@/types'
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react'

interface AuditSummaryProps {
  audit: Audit
}

export function AuditSummary({ audit }: AuditSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 w-full">
      {/* Pass */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm text-center relative overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-3xl font-extrabold text-emerald-600 tracking-tight mb-0.5">
          {audit.pass_count}
        </div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Pass
        </div>
      </div>

      {/* Warning */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm text-center relative overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-3xl font-extrabold text-amber-500 tracking-tight mb-0.5">
          {audit.warning_count}
        </div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Warning
        </div>
      </div>

      {/* Error */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm text-center relative overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
          <AlertOctagon className="w-4 h-4" />
        </div>
        <div className="text-3xl font-extrabold text-rose-600 tracking-tight mb-0.5">
          {audit.error_count}
        </div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Error
        </div>
      </div>
    </div>
  )
}
