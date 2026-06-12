interface ExperienceStatProps {
  years: string | number
  numberClassName?: string
  labelClassName?: string
}

export function ExperienceStat({
  years,
  numberClassName = 'text-7xl md:text-8xl',
  labelClassName = 'text-paper/60',
}: ExperienceStatProps) {
  return (
    <>
      <span className={`stat-number block font-bold gold-gradient-text ${numberClassName}`}>
        {years}
      </span>
      <p className={`font-body text-xs tracking-[0.14em] mt-2 ${labelClassName}`}>Yıllık Deneyim</p>
    </>
  )
}
