import { Link } from 'react-router-dom'
import type { Category } from '@/types'

interface CategoryTreeProps {
  items: Category[]
  getChildren: (parentId: string) => Category[]
  onLinkClick?: () => void
  compact?: boolean
}

export function CategoryTree({
  items,
  getChildren,
  onLinkClick,
  compact = false,
}: CategoryTreeProps) {
  return (
    <ul className={compact ? 'space-y-0.5' : 'space-y-1'}>
      {items.map((item) => {
        const nested = getChildren(item.id)
        const hasNested = nested.length > 0

        return (
          <li key={item.id}>
            <Link
              to={`/urunlerimiz/${item.slug}`}
              onClick={onLinkClick}
              className={`flex items-center gap-2 transition-colors hover:text-gold ${
                compact
                  ? 'text-paper/60 text-sm py-1.5'
                  : 'text-paper/70 text-sm px-3 py-2 hover:bg-paper/5'
              } ${hasNested ? 'font-medium' : ''}`}
            >
              {item.name}
              {hasNested && <span className="text-[10px] text-gold/50">›</span>}
            </Link>

            {hasNested && (
              <ul className={`ml-3 border-l border-paper/10 ${compact ? 'pl-2 mb-1' : 'pl-3 mb-2'}`}>
                {nested.map((child) => (
                  <li key={child.id}>
                    <Link
                      to={`/urunlerimiz/${child.slug}`}
                      onClick={onLinkClick}
                      className={`block text-paper/45 hover:text-gold transition-colors ${
                        compact ? 'text-xs py-1 pl-2' : 'text-xs py-1.5 pl-2'
                      }`}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
