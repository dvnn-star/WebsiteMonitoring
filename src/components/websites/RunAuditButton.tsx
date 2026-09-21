'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'

interface RunAuditButtonProps {
  websiteId: string
  className?: string
}

export function RunAuditButton({ websiteId, className = '' }: RunAuditButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRunAudit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website_id: websiteId }),
      })

      const data = await res.json()

      if (res.ok && data.audit) {
        router.push(`/dashboard/websites/${websiteId}/audit/${data.audit.id}`)
      } else {
        alert(data.error || 'Failed to start audit')
      }
    } catch {
      alert('Failed to start audit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleRunAudit}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Starting...</span>
        </>
      ) : (
        <>
          <Play className="w-4 h-4 fill-white" />
          <span>Run Audit</span>
        </>
      )}
    </button>
  )
}
