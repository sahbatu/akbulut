import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  to?: string
  href?: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

const variants = {
  primary:
    'bg-gold text-paper hover:bg-gold-light border border-gold/50 shadow-[0_0_30px_rgba(30,107,214,0.25)]',
  outline:
    'bg-transparent text-ink border border-ink/15 hover:border-gold/50 hover:text-gold',
  ghost: 'bg-transparent text-ink/70 hover:text-gold border border-transparent',
}

const sizes = {
  sm: 'px-4 py-2 text-xs tracking-wide font-semibold',
  md: 'px-6 py-3 text-sm tracking-wide font-semibold',
  lg: 'px-8 py-4 text-sm tracking-wide font-semibold',
}

export function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled,
  className = '',
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-body font-medium transition-all duration-300 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
