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
      <div className="bg-bg-primary border border-border-light rounded-lg p-4">
        <div className="text-3xl font-bold text-text-primary mb-1">
          {stats.totalWebsites}
        </div>
        <div className="text-sm text-text-secondary">Total Websites</div>
      </div>
      <div className="bg-bg-primary border border-border-light rounded-lg p-4">
        <div className="text-3xl font-bold text-status-pass mb-1">
          {stats.healthy}
        </div>
        <div className="text-sm text-text-secondary">Healthy</div>
      </div>
      <div className="bg-bg-primary border border-border-light rounded-lg p-4">
        <div className="text-3xl font-bold text-status-warning mb-1">
          {stats.warning}
        </div>
        <div className="text-sm text-text-secondary">Warning</div>
      </div>
      <div className="bg-bg-primary border border-border-light rounded-lg p-4">
        <div className="text-3xl font-bold text-status-error mb-1">
          {stats.critical}
        </div>
        <div className="text-sm text-text-secondary">Critical</div>
      </div>
    </div>
  )
}
