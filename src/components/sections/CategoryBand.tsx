import { Link } from 'react-router-dom'
import { categoryIcons } from '@/data/seed'
import type { Category } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'

interface CategoryBandProps {
  categories: Category[]
  loading?: boolean
}

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <div className="relative shrink-0 px-3 py-5 group/card">
      <Link
        to={`/urunlerimiz/${cat.slug}`}
        className="group block h-full min-w-[280px] md:min-w-[320px] p-8 bg-ink text-paper overflow-hidden rounded-2xl md:rounded-3xl origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/card:scale-[1.05] motion-safe:group-hover/card:relative motion-safe:group-hover/card:z-20 hover:gold-border-glow"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

        <span className="text-3xl text-gold mb-6 block">
          {categoryIcons[cat.slug] ?? '◆'}
        </span>

        <h3 className="font-display text-2xl font-semibold mb-3 group-hover:text-gold transition-colors">
          {cat.name}
        </h3>

        {cat.description && (
          <p className="text-paper/50 text-sm leading-relaxed line-clamp-2">
            {cat.description}
          </p>
        )}

        <span className="inline-flex items-center gap-2 mt-6 text-gold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Keşfet <span>→</span>
        </span>
      </Link>
    </div>
  )
}

export function CategoryBand({ categories, loading }: CategoryBandProps) {
  const looped = [...categories, ...categories]

  return (
    <section className="py-20 md:py-32 bg-paper text-ink relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-paper-dark/30 to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-12">
        <span className="eyebrow text-gold-dim">Hizmetlerimiz</span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2">Ürün Grupları</h2>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-hidden px-5 md:px-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[280px] h-64 shrink-0 rounded-2xl md:rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-x-clip py-2">
            <div className="marquee-track items-center px-6">
              {looped.map((cat, i) => (
                <CategoryCard key={`${cat.id}-${i}`} cat={cat} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
