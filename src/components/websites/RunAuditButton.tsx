'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
      className={`bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 ${className}`}
    >
      {loading ? 'Starting...' : 'Run Audit'}
    </button>
  )
}
