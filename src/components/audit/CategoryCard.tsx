'use client'

import { AuditResult } from '@/types'
import { CheckItem } from './CheckItem'

interface CategoryCardProps {
  title: string
  results: AuditResult[]
  onSelectResult?: (result: AuditResult) => void
}

export function CategoryCard({ title, results, onSelectResult }: CategoryCardProps) {
  if (results.length === 0) return null

  const passCount = results.filter(r => r.status === 'PASS').length

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900">{title}</h3>
        <div className="text-xs text-slate-500 font-medium">
          <span className="text-emerald-600 font-semibold">{passCount}</span>
          <span className="text-slate-400">/{results.length} passed</span>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {results.map((result) => (
          <CheckItem
            key={result.id}
            result={result}
            onClick={onSelectResult ? () => onSelectResult(result) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
