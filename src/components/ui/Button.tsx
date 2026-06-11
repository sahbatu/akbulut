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
    'bg-gold text-ink hover:bg-gold-light border border-gold/50 shadow-[0_0_30px_rgba(201,169,98,0.2)]',
  outline:
    'bg-transparent text-paper border border-paper/20 hover:border-gold/60 hover:text-gold',
  ghost: 'bg-transparent text-paper/70 hover:text-gold border border-transparent',
}

const sizes = {
  sm: 'px-4 py-2 text-xs tracking-widest uppercase',
  md: 'px-6 py-3 text-sm tracking-widest uppercase',
  lg: 'px-8 py-4 text-sm tracking-widest uppercase',
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
