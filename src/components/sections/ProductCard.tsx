import { motion } from 'framer-motion'
import type { CategoryImage } from '@/types'
import { scaleIn } from '@/lib/animations'

interface ProductCardProps {
  image: CategoryImage
  categoryName: string
  index: number
  onClick: () => void
}

export function getProductTitle(image: CategoryImage, categoryName: string) {
  return image.title?.trim() || `${categoryName} ${image.sort_order}`
}

export function ProductCard({ image, categoryName, index, onClick }: ProductCardProps) {
  const title = getProductTitle(image, categoryName)

  return (
    <motion.button
      type="button"
      variants={scaleIn}
      custom={index}
      onClick={onClick}
      className="group text-left w-full flex flex-col overflow-hidden rounded-xl bg-ink-light border border-paper/5 hover:border-gold/40 transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <img
          src={image.thumb_url}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/25 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full border border-paper/40 flex items-center justify-center text-paper text-lg">
            +
          </span>
        </div>
      </div>

      <div className="p-3 md:p-4 border-t border-paper/5">
        <h3 className="font-display text-base md:text-lg text-paper group-hover:text-gold transition-colors leading-snug line-clamp-2">
          {title}
        </h3>
      </div>
    </motion.button>
  )
}
