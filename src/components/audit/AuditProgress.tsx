'use client'

import { AuditResult } from '@/types'
import { useState, useEffect } from 'react'

interface AuditProgressProps {
  auditId: string
  onComplete: (results: AuditResult[]) => void
}

const checkTypes = [
  { type: 'http_status', label: 'HTTP Status' },
  { type: 'ssl_certificate', label: 'SSL Certificate' },
  { type: 'dns', label: 'DNS' },
  { type: 'title', label: 'Title' },
  { type: 'meta_description', label: 'Meta Description' },
  { type: 'h1', label: 'H1 Heading' },
  { type: 'canonical', label: 'Canonical' },
  { type: 'robots_txt', label: 'Robots.txt' },
  { type: 'sitemap', label: 'Sitemap' },
  { type: 'og_title', label: 'Open Graph' },
  { type: 'mobile_viewport', label: 'Mobile Viewport' },
  { type: 'response_time', label: 'Response Time' },
]

export function AuditProgress({ auditId, onComplete }: AuditProgressProps) {
  const [status, setStatus] = useState<'queued' | 'running' | 'completed' | 'failed'>('queued')
  const [results, setResults] = useState<AuditResult[]>([])

  useEffect(() => {
    const pollAudit = async () => {
      try {
        const res = await fetch(`/api/audits/${auditId}`)
        const data = await res.json()

        if (data.audit) {
          setStatus(data.audit.status)
          setResults(data.audit.results || [])

          if (data.audit.status === 'completed' || data.audit.status === 'failed') {
            onComplete(data.audit.results || [])
            return
          }
        }
      } catch (error) {
        console.error('Failed to poll audit:', error)
      }
    }

    pollAudit()
    const interval = setInterval(pollAudit, 2000)

    return () => clearInterval(interval)
  }, [auditId, onComplete])

  const getCheckStatus = (checkType: string) => {
    const result = results.find(r => r.check_type === checkType)
    if (result) return result.status
    if (status === 'queued') return 'QUEUED'
    return 'RUNNING'
  }

  const statusColors: Record<string, string> = {
    PASS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
    ERROR: 'bg-rose-50 text-rose-700 border-rose-200',
    RUNNING: 'bg-blue-50 text-blue-700 border-blue-200',
    QUEUED: 'bg-slate-100 text-slate-500 border-slate-200',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">
          Auditing website...
        </h2>
        <p className="text-xs text-slate-500 mt-1">Executing checks asynchronously.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {checkTypes.map((check) => {
          const checkStatus = getCheckStatus(check.type)
          return (
            <div
              key={check.type}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60"
            >
              <span className="text-xs font-medium text-slate-800">{check.label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[checkStatus] || 'text-slate-500'}`}>
                {checkStatus === 'RUNNING' ? 'Checking...' : checkStatus}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
