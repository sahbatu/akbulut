import { motion } from 'framer-motion'
import { PageSeo } from '@/components/seo/PageSeo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContactForm } from '@/components/sections/ContactForm'
import { useSiteData } from '@/hooks/useSiteData'
import { fadeUp } from '@/lib/animations'

export function Contact() {
  const { settings } = useSiteData()

  return (
    <>
      <PageSeo pageKey="contact" />
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading
            label="İletişim"
            title="Bize Ulaşın"
            subtitle="Teklif, sipariş ve bilgi talepleriniz için formu doldurun veya doğrudan arayın."
          />
        </div>
      </section>

      <section className="pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="space-y-8 mb-10">
                <div>
                  <h3 className="eyebrow text-gold mb-3">Adres</h3>
                  <p className="text-ink/70 leading-relaxed">{settings.address}</p>
                </div>

                <div>
                  <h3 className="eyebrow text-gold mb-3">Telefon</h3>
                  <ul className="space-y-1">
                    {settings.phones.map((phone) => (
                      <li key={phone}>
                        <a
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          className="text-ink/70 hover:text-gold transition-colors"
                          data-cursor-hover
                        >
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="eyebrow text-gold mb-3">Faks</h3>
                  <p className="text-ink/70">{settings.fax}</p>
                </div>

                <div>
                  <h3 className="eyebrow text-gold mb-3">E-posta</h3>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-ink/70 hover:text-gold transition-colors"
                    data-cursor-hover
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden border border-ink/10 rounded-xl">
                <iframe
                  src={settings.map_embed_url}
                  className="absolute inset-0 w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Akbulut Konum"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-ink/80 backdrop-blur px-3 py-2">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-gold"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-paper/70 text-xs">Hasanpaşa, Kadıköy</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-8 md:p-10 border border-ink/8 bg-paper rounded-2xl shadow-sm shadow-ink/5"
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="font-display text-2xl text-ink mb-2">Destek ve Sipariş</h3>
              <p className="text-ink/50 text-sm mb-8">
                Sipariş detaylarınızı aşağıdaki form aracılığıyla iletebilirsiniz.
              </p>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
