export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`border border-border-light rounded-lg bg-bg-primary p-4 ${className}`}>
      {children}
    </div>
  )
}
