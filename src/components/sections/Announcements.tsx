import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'
import type { Announcement } from '@/types'

interface AnnouncementsProps {
  items: Announcement[]
}

export function Announcements({ items }: AnnouncementsProps) {
  if (items.length === 0) return null

  return (
    <section className="py-20 md:py-32 bg-paper border-y border-ink/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <span className="eyebrow text-gold">Duyurular</span>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mt-2 mb-12">
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
              className="group p-8 border border-ink/8 hover:border-gold/40 transition-all duration-500 bg-paper-dark/40 rounded-xl"
              variants={fadeUp}
              custom={i}
            >
              <time className="text-ink/40 text-xs tracking-wider">
                {new Date(item.published_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h3 className="font-display text-2xl text-ink mt-3 mb-3 group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-ink/55 text-sm leading-relaxed">{item.excerpt}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
