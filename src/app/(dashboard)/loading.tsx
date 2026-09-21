export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-bg-secondary rounded w-32 animate-pulse"></div>
        <div className="h-9 bg-bg-secondary rounded w-28 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-bg-primary border border-border-light rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-bg-secondary rounded w-12 mb-2"></div>
            <div className="h-4 bg-bg-secondary rounded w-20"></div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1,2,3].map(i => (
          <div key={i} className="bg-bg-primary border border-border-light rounded-lg p-4 animate-pulse">
            <div className="h-5 bg-bg-secondary rounded w-32 mb-2"></div>
            <div className="h-4 bg-bg-secondary rounded w-48 mb-4"></div>
            <div className="h-9 bg-bg-secondary rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
