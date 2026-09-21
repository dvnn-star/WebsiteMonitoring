'use client'

import { useState, useEffect } from 'react'
import { AuditResult } from '@/types'
import { AuditProgress } from '@/components/audit/AuditProgress'
import { AuditSummary } from '@/components/audit/AuditSummary'
import { CategoryCard } from '@/components/audit/CategoryCard'
import { IssueDetail } from '@/components/audit/IssueDetail'

const categoryOrder = ['technical', 'seo', 'crawlability', 'performance', 'security', 'infrastructure']

const categoryTitles: Record<string, string> = {
  technical: 'Technical',
  seo: 'SEO',
  crawlability: 'Crawlability',
  performance: 'Performance',
  security: 'Security',
  infrastructure: 'Infrastructure',
}

interface AuditClientProps {
  auditId: string
}

export function AuditClient({ auditId }: AuditClientProps) {
  const [status, setStatus] = useState<'queued' | 'running' | 'completed' | 'failed'>('queued')
  const [results, setResults] = useState<AuditResult[]>([])
  const [selectedResult, setSelectedResult] = useState<AuditResult | null>(null)

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const res = await fetch(`/api/audits/${auditId}`)
        const data = await res.json()
        setStatus(data.audit.status)
        if (data.audit.results) {
          setResults(data.audit.results)
        }
      } catch (error) {
        console.error('Failed to check audit status:', error)
      }
    }

    checkInitialStatus()
  }, [auditId])

  const handleComplete = (newResults: AuditResult[]) => {
    setResults(newResults)
    setStatus('completed')
  }

  const groupedResults = categoryOrder.reduce((acc, category) => {
    acc[category] = results.filter(r => r.category === category)
    return acc
  }, {} as Record<string, AuditResult[]>)

  if (status === 'queued' || status === 'running') {
    return <AuditProgress auditId={auditId} onComplete={handleComplete} />
  }

  const passCount = results.filter(r => r.status === 'PASS').length
  const warningCount = results.filter(r => r.status === 'WARNING').length
  const errorCount = results.filter(r => r.status === 'ERROR' || r.status === 'CRITICAL').length

  return (
    <div>
      <AuditSummary
        audit={{
          id: auditId,
          website_id: '',
          user_id: '',
          status,
          created_at: '',
          pass_count: passCount,
          warning_count: warningCount,
          error_count: errorCount,
        }}
      />

      <div className="space-y-4">
        {categoryOrder.map((category) => (
          groupedResults[category].length > 0 && (
            <CategoryCard
              key={category}
              title={categoryTitles[category]}
              results={groupedResults[category].map(r => ({ ...r, id: r.id || `${r.check_type}-${r.category}` }))}
            />
          )
        ))}
      </div>

      {selectedResult && (
        <IssueDetail result={selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </div>
  )
}
