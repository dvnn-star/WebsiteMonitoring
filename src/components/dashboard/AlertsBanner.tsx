'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Alert } from '@/types'

interface AlertsBannerProps {
  initialAlerts: (Alert & { websites?: { name?: string; domain?: string } })[]
}

export function AlertsBanner({ initialAlerts = [] }: AlertsBannerProps) {
  const [alerts, setAlerts] = useState(initialAlerts)

  if (alerts.length === 0) return null

  const handleDismiss = async (alertId: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId }),
      })
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    } catch (err) {
      console.error('Failed to dismiss alert:', err)
    }
  }

  return (
    <div className="mb-6 space-y-2.5">
      {alerts.map((alert) => {
        const siteName = alert.websites?.name || alert.websites?.domain || 'Website'
        const isDown = alert.type === 'downtime'

        return (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              isDown
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3">
              <span
                className={`w-2.5 h-2.5 rounded-full mt-1 sm:mt-0 shrink-0 ${
                  isDown ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              <div>
                <span className="font-bold">{alert.title}</span>
                <span className="text-slate-600 ml-1.5">{alert.message}</span>
                <span className="text-slate-400 ml-2">
                  ({new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <Link
                href={`/dashboard/websites/${alert.website_id}`}
                className="font-semibold underline hover:opacity-80 text-xs"
              >
                View {siteName}
              </Link>
              <button
                onClick={() => handleDismiss(alert.id)}
                className="text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded bg-white/60 hover:bg-white border border-slate-200/60 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
