import { SeoHead } from '@/components/seo/SeoHead'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <>
      <SeoHead
        title="Sayfa Bulunamadı | Akbulut"
        description="Aradığınız sayfa bulunamadı."
        robotsIndex={false}
        robotsFollow={false}
      />
      <section className="min-h-[70vh] flex items-center justify-center pt-24 pb-16 px-5">
        <div className="max-w-lg text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">404</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4">
            Sayfa bulunamadı
          </h1>
          <p className="text-ink/55 text-base leading-relaxed mb-10">
            Aradığınız sayfa kaldırılmış, taşınmış veya hiç var olmamış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/">Ana Sayfa</Button>
            <Button to="/urunlerimiz" variant="outline">
              Ürünlerimiz
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
