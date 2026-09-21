export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
  )
}

export function WebsiteCardSkeleton() {
  return (
    <div className="bg-bg-primary border border-border-light rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="h-5 bg-bg-secondary rounded w-32 mb-2"></div>
          <div className="h-4 bg-bg-secondary rounded w-48"></div>
        </div>
        <div className="h-4 bg-bg-secondary rounded w-16"></div>
      </div>
      <div className="h-4 bg-bg-secondary rounded w-24 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-9 bg-bg-secondary rounded flex-1"></div>
        <div className="h-9 bg-bg-secondary rounded w-16"></div>
      </div>
    </div>
  )
}

export function AuditResultSkeleton() {
  return (
    <div className="bg-bg-primary border border-border-light rounded-lg p-4 animate-pulse">
      <div className="h-5 bg-bg-secondary rounded w-32 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 bg-bg-secondary rounded w-24"></div>
            <div className="h-4 bg-bg-secondary rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
