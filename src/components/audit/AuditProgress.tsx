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

        setStatus(data.audit.status)
        setResults(data.audit.results || [])

        if (data.audit.status === 'completed' || data.audit.status === 'failed') {
          onComplete(data.audit.results || [])
          return
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
    PASS: 'text-status-pass',
    WARNING: 'text-status-warning',
    ERROR: 'text-status-error',
    QUEUED: 'text-text-tertiary',
    RUNNING: 'text-status-running',
  }

  return (
    <div className="bg-bg-primary border border-border-light rounded-lg p-6">
      <div className="text-lg font-medium text-text-primary mb-4">
        Auditing...
      </div>
      <div className="space-y-2">
        {checkTypes.map((check) => {
          const checkStatus = getCheckStatus(check.type)
          return (
            <div key={check.type} className="flex items-center justify-between py-2">
              <span className="text-text-secondary">{check.label}</span>
              <span className={`text-sm font-medium ${statusColors[checkStatus]}`}>
                {checkStatus === 'RUNNING' ? 'Checking...' : checkStatus}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
