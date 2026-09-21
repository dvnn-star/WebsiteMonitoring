'use client'

import { AuditResult } from '@/types'
import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react'

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

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Auditing website...
          </h2>
          <p className="text-xs text-slate-500">Executing asynchronous technical and SEO verification.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {checkTypes.map((check) => {
          const checkStatus = getCheckStatus(check.type)
          const isPass = checkStatus === 'PASS'
          const isWarning = checkStatus === 'WARNING'
          const isError = checkStatus === 'ERROR' || checkStatus === 'CRITICAL'
          const isRunning = checkStatus === 'RUNNING'

          return (
            <div
              key={check.type}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50"
            >
              <div className="flex items-center gap-2.5">
                {isPass ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : isError ? (
                  <XCircle className="w-4 h-4 text-rose-600" />
                ) : isRunning ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-semibold text-slate-800">{check.label}</span>
              </div>

              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPass ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' :
                isWarning ? 'bg-amber-50 text-amber-700 border border-amber-200/80' :
                isError ? 'bg-rose-50 text-rose-700 border border-rose-200/80' :
                isRunning ? 'bg-blue-50 text-blue-700 border border-blue-200/80 animate-pulse' :
                'bg-slate-100 text-slate-500 border border-slate-200/60'
              }`}>
                {isRunning ? 'Checking...' : checkStatus}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
