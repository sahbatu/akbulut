import { ExperienceStat } from '@/components/ui/ExperienceStat'
import { PageSeo } from '@/components/seo/PageSeo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Timeline } from '@/components/sections/Timeline'
import { ValuesGrid } from '@/components/sections/ValuesGrid'
import { ServiceAreas } from '@/components/sections/ServiceAreas'
import { useSiteData } from '@/hooks/useSiteData'
import { useCategories } from '@/hooks/useCategories'

export function About() {
  const { settings } = useSiteData()
  const { rootCategories } = useCategories()

  const paragraphs = settings.about_full.split('\n\n').filter(Boolean)

  return (
    <>
      <PageSeo pageKey="about" />
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading
            label="Hakkımızda"
            title="Başarı ve Paylaşım"
            subtitle={settings.company_name}
          />
        </div>
      </section>

      <section className="pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-ink/65 leading-relaxed text-base md:text-lg">
                  {para}
                </p>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center p-10 border border-gold/25 bg-ink text-paper rounded-2xl w-full shadow-lg shadow-ink/15">
                <ExperienceStat years={settings.years_experience} numberClassName="text-8xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-paper border-y border-ink/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading label="Tarihçe" title="Yolculuğumuz" align="center" />
          <Timeline />
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading label="Değerlerimiz" title="Neye İnanıyoruz" />
          <ValuesGrid />
        </div>
      </section>

      <section className="py-20 md:py-32 bg-paper text-ink">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading
            label="Faaliyet Alanları"
            title="Hizmet Verdiğimiz Alanlar"
            align="center"
            light
          />
          <ServiceAreas categories={rootCategories} />
        </div>
      </section>
    </>
  )
}
