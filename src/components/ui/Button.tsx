export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow focus:ring-accent',
    secondary: 'bg-white text-text-primary border border-border-light hover:bg-slate-50 hover:border-border-medium active:bg-slate-100 shadow-sm focus:ring-slate-400',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-300',
    danger: 'bg-status-error text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus:ring-rose-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
