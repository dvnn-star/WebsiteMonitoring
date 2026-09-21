export default function DashboardLoading() {
  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-slate-200/80 rounded-lg w-36 animate-pulse"></div>
        <div className="h-10 bg-slate-200/80 rounded-lg w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-20 mb-3"></div>
            <div className="h-8 bg-slate-100 rounded w-14 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-28"></div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm animate-pulse space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-slate-100 rounded w-32"></div>
                <div className="h-4 bg-slate-100 rounded w-44"></div>
              </div>
              <div className="h-5 bg-slate-100 rounded-full w-16"></div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-24"></div>
            <div className="h-9 bg-slate-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
