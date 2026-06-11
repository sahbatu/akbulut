import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function CtaBand() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent" />
      <div className="absolute inset-0 border-y border-gold/10" />

      <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-paper mb-6 text-balance">
            Projeniz için <span className="gold-gradient-text">özel teklif</span> alın
          </h2>
          <p className="text-paper/50 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Talebinize en kısa sürede, firmanıza uygun ekonomik teklif hazırlayıp sunuyoruz.
          </p>
          <Button to="/iletisim" size="lg">
            Teklif Alın
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
