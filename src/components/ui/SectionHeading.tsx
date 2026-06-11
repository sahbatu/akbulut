import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = 'left',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <motion.div
      className={`max-w-2xl mb-12 md:mb-16 ${alignClass}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
    >
      {label && (
        <span className="block text-gold text-xs tracking-[0.3em] uppercase mb-3 font-body">
          {label}
        </span>
      )}
      <h2
        className={`font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight ${light ? 'text-ink' : 'text-paper'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed ${light ? 'text-ink-light/70' : 'text-paper/60'}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-px w-16 bg-gradient-to-r from-gold to-transparent ${align === 'center' ? 'mx-auto' : ''}`}
      />
    </motion.div>
  )
}
