import { useState, useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { categoryIcons } from '@/data/seed'
import type { Category } from '@/types'

interface ProductCategoryCardProps {
  category: Category
  children: Category[]
  getChildren: (parentId: string) => Category[]
}

function SubcategoryItem({
  item,
  getChildren,
}: {
  item: Category
  getChildren: (parentId: string) => Category[]
}) {
  const nested = getChildren(item.id)

  return (
    <div className="border border-paper/5 hover:border-gold/30 transition-all duration-300">
      <Link
        to={`/urunlerimiz/${item.slug}`}
        className="block px-4 py-3 text-paper/70 text-sm font-medium hover:text-gold transition-colors"
      >
        {item.name}
      </Link>
      {nested.length > 0 && (
        <ul className="border-t border-paper/5 px-2 py-2 space-y-0.5">
          {nested.map((child) => (
            <li key={child.id}>
              <Link
                to={`/urunlerimiz/${child.slug}`}
                className="block px-2 py-1.5 text-xs text-paper/45 hover:text-gold transition-colors"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ProductCategoryCard({
  category,
  children,
  getChildren,
}: ProductCategoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const totalCount =
    children.length + children.reduce((sum, c) => sum + getChildren(c.id).length, 0)

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -8, y: x * 8 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      layout
    >
      <div
        className={`border transition-all duration-500 bg-ink-light/40 overflow-hidden rounded-2xl ${
          expanded ? 'border-gold/40 gold-border-glow' : 'border-paper/5 hover:border-gold/20'
        }`}
      >
        <button
          className="w-full text-left p-8 md:p-10 group"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5">
              <span className="text-3xl text-gold shrink-0">
                {categoryIcons[category.slug] ?? '◆'}
              </span>
              <div>
                <Link
                  to={`/urunlerimiz/${category.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-display text-2xl md:text-3xl text-paper group-hover:text-gold transition-colors hover:text-gold"
                >
                  {category.name}
                </Link>
                {category.description && (
                  <p className="text-paper/50 text-sm mt-2 leading-relaxed max-w-lg">
                    {category.description}
                  </p>
                )}
                <span className="inline-block mt-3 text-paper/30 text-xs">
                  {children.length} alt kategori
                  {totalCount > children.length && ` · ${totalCount} toplam öğe`}
                </span>
              </div>
            </div>
            <motion.span
              className="text-gold text-xl shrink-0 mt-1"
              animate={{ rotate: expanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              +
            </motion.span>
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-8 md:px-10 pb-8 md:pb-10 border-t border-paper/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-6">
                  {children.map((child) => (
                    <SubcategoryItem
                      key={child.id}
                      item={child}
                      getChildren={getChildren}
                    />
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-paper/5 flex justify-end">
                  <Link
                    to={`/urunlerimiz/${category.slug}`}
                    className="text-gold text-xs tracking-widest uppercase hover:underline shrink-0"
                  >
                    Galeriyi Gör →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
