import { motion } from 'framer-motion'
import { categoryIcons } from '@/data/seed'
import type { Category } from '@/types'
import { staggerContainer, scaleIn } from '@/lib/animations'

interface ServiceAreasProps {
  categories: Category[]
}

export function ServiceAreas({ categories }: ServiceAreasProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          className="flex flex-col items-center justify-center p-6 border border-paper/5 hover:border-gold/30 bg-ink-light/30 text-center transition-all duration-300 group"
          variants={scaleIn}
          custom={i}
        >
          <span className="text-2xl text-gold mb-3 group-hover:scale-110 transition-transform">
            {categoryIcons[cat.slug] ?? '◆'}
          </span>
          <span className="text-paper/70 text-sm group-hover:text-paper transition-colors">
            {cat.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}
