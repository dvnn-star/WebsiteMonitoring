export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-xl shadow-sm p-5 ${className}`}>
      {children}
    </div>
  )
}
