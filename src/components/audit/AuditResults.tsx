'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuditResult, AuditStatus } from '@/types'
import { AuditProgress } from '@/components/audit/AuditProgress'
import { AuditSummary } from '@/components/audit/AuditSummary'
import { CategoryCard } from '@/components/audit/CategoryCard'
import { IssueDetail } from '@/components/audit/IssueDetail'
import { RotateCw, Loader2 } from 'lucide-react'

const categoryOrder = ['technical', 'seo', 'crawlability', 'performance', 'security', 'infrastructure']

const categoryTitles: Record<string, string> = {
  technical: 'Technical',
  seo: 'SEO',
  crawlability: 'Crawlability',
  performance: 'Performance',
  security: 'Security',
  infrastructure: 'Infrastructure',
}

interface AuditResultsProps {
  auditId: string
  websiteId: string
  initialStatus: string
  initialResults: AuditResult[]
}

export function AuditResults({ 
  auditId, 
  websiteId, 
  initialStatus, 
  initialResults 
}: AuditResultsProps) {
  const router = useRouter()
  const [status, setStatus] = useState<AuditStatus>(initialStatus as AuditStatus)
  const [results, setResults] = useState<AuditResult[]>(initialResults)
  const [isRerunning, setIsRerunning] = useState(false)
  const [selectedResult, setSelectedResult] = useState<AuditResult | null>(null)

  const handleRerunAudit = async () => {
    setIsRerunning(true)
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website_id: websiteId }),
      })

      const data = await res.json()

      if (res.ok && data.audit) {
        router.push(`/dashboard/websites/${websiteId}/audit/${data.audit.id}`)
      }
    } catch (error) {
      console.error('Failed to rerun audit:', error)
    } finally {
      setIsRerunning(false)
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <AuditSummary
          audit={{
            id: auditId,
            website_id: websiteId,
            user_id: '',
            status,
            created_at: '',
            pass_count: passCount,
            warning_count: warningCount,
            error_count: errorCount,
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          Click on any check to view technical details and optimization recommendations.
        </p>
        <button
          onClick={handleRerunAudit}
          disabled={isRerunning}
          className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 shrink-0"
        >
          {isRerunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Starting...</span>
            </>
          ) : (
            <>
              <RotateCw className="w-3.5 h-3.5" />
              <span>Run Audit Again</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {categoryOrder.map((category) => (
          groupedResults[category].length > 0 && (
            <CategoryCard
              key={category}
              title={categoryTitles[category]}
              results={groupedResults[category].map(r => ({ ...r, id: r.id || `${r.check_type}-${r.category}` }))}
              onSelectResult={(result) => setSelectedResult(result)}
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
