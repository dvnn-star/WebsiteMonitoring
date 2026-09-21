'use client'

import { Audit } from '@/types'

interface AuditChartsProps {
  audits: Audit[]
}

export function AuditCharts({ audits }: AuditChartsProps) {
  // Filter for completed audits with check counts
  const completedAudits = audits.filter(
    (a) => a.status === 'completed' || a.pass_count + a.warning_count + a.error_count > 0
  )

  if (completedAudits.length === 0) {
    return null
  }

  // Latest audit for breakdown
  const latestAudit = completedAudits[0]
  const latestTotal = Math.max(
    latestAudit.pass_count + latestAudit.warning_count + latestAudit.error_count,
    1
  )
  const passPercent = Math.round((latestAudit.pass_count / latestTotal) * 100)
  const warningPercent = Math.round((latestAudit.warning_count / latestTotal) * 100)
  const errorPercent = Math.max(0, 100 - passPercent - warningPercent)

  // Chronological order (oldest to newest) for trend chart
  const history = [...completedAudits].slice(0, 10).reverse()
  const maxTotal = Math.max(
    ...history.map((a) => a.pass_count + a.warning_count + a.error_count),
    1
  )

  return (
    <div className="border-t border-slate-100 pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Audit Analytics & Trends
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          Latest Score: <strong className="text-emerald-600">{passPercent}%</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Latest Audit Breakdown */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-semibold text-slate-700">Latest Pass Ratio</span>
              <span className="text-lg font-bold text-slate-900">{passPercent}%</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              {latestAudit.pass_count} of {latestTotal} checks passed
            </p>

            {/* Segmented Distribution Bar */}
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex" aria-label="Pass distribution bar">
              {passPercent > 0 && (
                <div
                  style={{ width: `${passPercent}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Pass: ${passPercent}%`}
                />
              )}
              {warningPercent > 0 && (
                <div
                  style={{ width: `${warningPercent}%` }}
                  className="bg-amber-400 h-full transition-all duration-300"
                  title={`Warning: ${warningPercent}%`}
                />
              )}
              {errorPercent > 0 && (
                <div
                  style={{ width: `${errorPercent}%` }}
                  className="bg-rose-500 h-full transition-all duration-300"
                  title={`Error: ${errorPercent}%`}
                />
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-slate-200/60 text-[11px]">
            <div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Pass</span>
              </div>
              <div className="text-slate-900 font-bold mt-0.5">{latestAudit.pass_count}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Warn</span>
              </div>
              <div className="text-slate-900 font-bold mt-0.5">{latestAudit.warning_count}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>Err</span>
              </div>
              <div className="text-slate-900 font-bold mt-0.5">{latestAudit.error_count}</div>
            </div>
          </div>
        </div>

        {/* Right: History Stacked Bar Chart */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Recent Audits Trend</span>
            <span className="text-[11px] text-slate-400">
              Showing last {history.length} run{history.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-28 w-full flex items-end gap-2 pt-3 pb-1 border-b border-slate-200">
            {history.map((item, idx) => {
              const itemTotal = item.pass_count + item.warning_count + item.error_count || 1
              const heightPercent = Math.max(Math.round((itemTotal / maxTotal) * 100), 12)
              const itemPassPct = (item.pass_count / itemTotal) * 100
              const itemWarnPct = (item.warning_count / itemTotal) * 100
              const itemErrPct = (item.error_count / itemTotal) * 100

              const dateLabel = new Date(item.created_at).toLocaleDateString([], {
                day: 'numeric',
                month: 'short',
              })

              return (
                <div
                  key={item.id || idx}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.pass_count}P / {item.warning_count}W / {item.error_count}E
                  </div>

                  {/* Stacked Vertical Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[28px] rounded-t overflow-hidden flex flex-col justify-end bg-slate-200 transition-all group-hover:opacity-90"
                  >
                    {item.error_count > 0 && (
                      <div
                        style={{ height: `${itemErrPct}%` }}
                        className="w-full bg-rose-500 shrink-0"
                      />
                    )}
                    {item.warning_count > 0 && (
                      <div
                        style={{ height: `${itemWarnPct}%` }}
                        className="w-full bg-amber-400 shrink-0"
                      />
                    )}
                    {item.pass_count > 0 && (
                      <div
                        style={{ height: `${itemPassPct}%` }}
                        className="w-full bg-emerald-500 shrink-0"
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 truncate w-full text-center">
                    {dateLabel}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
            <span>Older</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-emerald-500" /> Pass
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-amber-400" /> Warning
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-rose-500" /> Error
              </span>
            </div>
            <span>Newest</span>
          </div>
        </div>
      </div>
    </div>
  )
}
