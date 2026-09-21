'use client'

import { AuditResult } from '@/types'
import { CheckItem } from './CheckItem'
import {
  Server,
  Search,
  Bot,
  Zap,
  Shield,
  Network,
  CheckCircle2,
} from 'lucide-react'

interface CategoryCardProps {
  title: string
  results: AuditResult[]
  onSelectResult?: (result: AuditResult) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  Technical: <Server className="w-4 h-4 text-blue-600" />,
  SEO: <Search className="w-4 h-4 text-purple-600" />,
  Crawlability: <Bot className="w-4 h-4 text-indigo-600" />,
  Performance: <Zap className="w-4 h-4 text-amber-500" />,
  Security: <Shield className="w-4 h-4 text-emerald-600" />,
  Infrastructure: <Network className="w-4 h-4 text-sky-600" />,
}

export function CategoryCard({ title, results, onSelectResult }: CategoryCardProps) {
  if (results.length === 0) return null

  const passCount = results.filter(r => r.status === 'PASS').length
  const icon = categoryIcons[title] || <CheckCircle2 className="w-4 h-4 text-slate-500" />

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <h3 className="font-bold text-sm text-slate-900">{title}</h3>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          <span className="text-emerald-600 font-semibold">{passCount}</span>
          <span className="text-slate-400">/{results.length} checks passed</span>
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
