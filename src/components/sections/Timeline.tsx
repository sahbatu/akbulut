import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import { useTimeline } from '@/hooks/usePageSections'

export function Timeline() {
  const { content: milestones } = useTimeline()

  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent md:-translate-x-px" />

      <div className="space-y-12 md:space-y-0">
        {milestones.map((item, i) => (
          <motion.div
            key={`${item.year}-${i}`}
            className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-0 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
              <span className="font-display text-4xl gold-gradient-text font-bold">{item.year}</span>
              <h3 className="font-display text-xl text-paper mt-2">{item.title}</h3>
              <p className="text-paper/50 text-sm mt-2 leading-relaxed">{item.description}</p>
            </div>

            <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-gold rounded-full md:-translate-x-1.5 mt-2 ring-4 ring-ink" />

            <div className="hidden md:block md:w-1/2" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
