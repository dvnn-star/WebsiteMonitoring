import { Globe, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react'

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Websites */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">Total Websites</span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {stats.totalWebsites}
        </div>
        <div className="text-xs text-slate-400 mt-1">Active monitored targets</div>
      </div>

      {/* Healthy */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">Healthy</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
          {stats.healthy}
        </div>
        <div className="text-xs text-emerald-600/80 font-medium mt-1">Passing all critical checks</div>
      </div>

      {/* Warning */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">Warning</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-amber-500 tracking-tight">
          {stats.warning}
        </div>
        <div className="text-xs text-amber-600/80 font-medium mt-1">Optimization needed</div>
      </div>

      {/* Critical */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">Critical</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-rose-600 tracking-tight">
          {stats.critical}
        </div>
        <div className="text-xs text-rose-600/80 font-medium mt-1">Requires immediate attention</div>
      </div>
    </div>
  )
}
