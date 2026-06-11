import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { slideFromLeft, slideFromRight } from '@/lib/animations'

interface AboutTeaserProps {
  text: string
}

export function AboutTeaser({ text }: AboutTeaserProps) {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Hakkımızda</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-paper mt-3 mb-6 leading-tight">
              Kalite ve Güvenin <span className="gold-gradient-text">18 Yılı</span>
            </h2>
            <p className="text-paper/60 leading-relaxed text-base md:text-lg">{text}</p>
            <Link
              to="/hakkimizda"
              className="inline-flex items-center gap-3 mt-8 text-gold text-sm tracking-widest uppercase group"
              data-cursor-hover
            >
              Daha Fazla
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </motion.div>

          <motion.div
            className="relative"
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-4 border border-gold/20 rotate-3" />
              <div className="absolute inset-0 bg-ink-light flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="font-display text-7xl md:text-8xl font-bold gold-gradient-text">
                    18
                  </span>
                  <p className="text-paper/50 text-sm tracking-[0.3em] uppercase mt-2">Yıllık Deneyim</p>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/10 border border-gold/30"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
