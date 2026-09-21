export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-accent"></div>
    </div>
  )
}

export function WebsiteCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-slate-100 rounded-md w-36"></div>
          <div className="h-4 bg-slate-100 rounded-md w-48"></div>
        </div>
        <div className="h-5 bg-slate-100 rounded-full w-16"></div>
      </div>
      <div className="h-4 bg-slate-100 rounded-md w-28"></div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <div className="h-9 bg-slate-100 rounded-lg flex-1"></div>
        <div className="h-9 bg-slate-100 rounded-lg w-20"></div>
      </div>
    </div>
  )
}

export function AuditResultSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm animate-pulse space-y-4">
      <div className="h-5 bg-slate-100 rounded-md w-40"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div className="h-4 bg-slate-100 rounded-md w-32"></div>
            <div className="h-5 bg-slate-100 rounded-full w-20"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
