import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'
import { useValues } from '@/hooks/usePageSections'

export function ValuesGrid() {
  const { content: values } = useValues()

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {values.map((value, i) => (
        <motion.div
          key={value.title}
          className="group p-8 border border-paper/5 hover:border-gold/30 bg-ink/30 transition-all duration-500 relative overflow-hidden"
          variants={fadeUp}
          custom={i}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <span className="text-2xl text-gold mb-4 block">{value.icon}</span>
          <h3 className="font-display text-xl text-paper mb-2">{value.title}</h3>
          <p className="text-paper/50 text-sm leading-relaxed">{value.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
