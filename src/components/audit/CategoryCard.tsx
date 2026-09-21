'use client'

import { AuditResult } from '@/types'
import { CheckItem } from './CheckItem'

interface CategoryCardProps {
  title: string
  results: AuditResult[]
}

export function CategoryCard({ title, results }: CategoryCardProps) {
  if (results.length === 0) return null

  return (
    <div className="bg-bg-primary border border-border-light rounded-lg">
      <div className="px-4 py-3 border-b border-border-light">
        <h3 className="font-medium text-text-primary">{title}</h3>
      </div>
      <div className="divide-y divide-border-light">
        {results.map((result) => (
          <CheckItem key={result.id} result={result} />
        ))}
      </div>
    </div>
  )
}
