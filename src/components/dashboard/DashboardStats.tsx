interface DashboardStatsProps {
  stats: {
    totalWebsites: number
    healthy: number
    warning: number
    critical: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-500 mb-2">Total Websites</div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight">
          {stats.totalWebsites}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-500 mb-2">Healthy</div>
        <div className="text-3xl font-bold text-emerald-600 tracking-tight">
          {stats.healthy}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-500 mb-2">Warning</div>
        <div className="text-3xl font-bold text-amber-500 tracking-tight">
          {stats.warning}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-500 mb-2">Critical</div>
        <div className="text-3xl font-bold text-rose-600 tracking-tight">
          {stats.critical}
        </div>
      </div>
    </div>
  )
}
