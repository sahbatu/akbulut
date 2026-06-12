import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { resolveHeroPanels, type HeroPanel } from '@/data/heroPanels'
import type { Category } from '@/types'

interface HeroBackgroundProps {
  categories: Category[]
}

function HeroPanelTile({ panel, priority }: { panel: HeroPanel; priority?: boolean }) {
  return (
    <Link
      to={`/urunlerimiz/${panel.slug}`}
      className="group relative block overflow-hidden min-h-[25vh] md:min-h-0"
      aria-label={`${panel.label} ürünlerini görüntüle`}
    >
      <img
        src={panel.image}
        alt=""
        width={960}
        height={640}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[8000ms] ease-out motion-safe:group-hover:scale-110 hero-panel-image"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding={priority ? 'sync' : 'async'}
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
      <span className="absolute bottom-3 left-3 right-3 font-body text-[10px] md:text-xs tracking-[0.14em] text-paper/80 opacity-0 translate-y-1 transition-all duration-300 motion-safe:group-hover:opacity-100 motion-safe:group-hover:translate-y-0">
        {panel.label}
      </span>
    </Link>
  )
}

export function HeroBackground({ categories }: HeroBackgroundProps) {
  const panels = useMemo(() => resolveHeroPanels(categories), [categories])

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1">
        {panels.map((panel, i) => (
          <HeroPanelTile key={panel.slug} panel={panel} priority={i === 0} />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/88 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/40 pointer-events-none" />
    </div>
  )
}
