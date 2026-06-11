import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'
import type { Announcement } from '@/types'

interface AnnouncementsProps {
  items: Announcement[]
}

export function Announcements({ items }: AnnouncementsProps) {
  if (items.length === 0) return null

  return (
    <section className="py-20 md:py-32 bg-ink-light/50">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Duyurular</span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-paper mt-2 mb-12">
          Haberler
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              className="group p-8 border border-paper/5 hover:border-gold/30 transition-all duration-500 bg-ink/50"
              variants={fadeUp}
              custom={i}
            >
              <time className="text-paper/30 text-xs tracking-wider">
                {new Date(item.published_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h3 className="font-display text-2xl text-paper mt-3 mb-3 group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-paper/50 text-sm leading-relaxed">{item.excerpt}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
