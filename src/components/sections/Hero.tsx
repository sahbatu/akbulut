import { Button } from '@/components/ui/Button'
import { HeroBackground } from '@/components/sections/HeroBackground'
import type { Category } from '@/types'

interface HeroProps {
  tagline: string
  categories?: Category[]
}

export function Hero({ tagline, categories = [] }: HeroProps) {
  const words = tagline.split(' ')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground categories={categories} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 text-center pt-24 pb-28">
        <span className="hero-enter eyebrow inline-block text-gold md:text-sm mb-6 drop-shadow-sm">
          Akbulut Kırtasiye & Matbaa
        </span>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 drop-shadow-md">
          {words.map((word, i) => (
            <span
              key={i}
              className="hero-word inline-block mr-[0.25em] last:mr-0"
              style={{ animationDelay: `${80 + i * 40}ms` }}
            >
              {i === words.length - 1 ? (
                <span className="gold-gradient-text">{word}</span>
              ) : (
                <span className="text-paper">{word}</span>
              )}
            </span>
          ))}
        </h1>

        <p
          className="hero-enter max-w-xl mx-auto text-paper/75 text-base md:text-lg leading-relaxed mb-10 drop-shadow-sm"
          style={{ animationDelay: '120ms' }}
        >
          Promosyon, matbaa, kırtasiye ve kurumsal çözümlerde Kadıköy&apos;den Türkiye&apos;ye.
        </p>

        <div className="hero-enter flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '200ms' }}>
          <Button to="/urunlerimiz" size="lg">
            Ürünlerimizi Keşfedin
          </Button>
          <Button
            to="/iletisim"
            variant="outline"
            size="lg"
            className="!text-paper !border-paper/25 hover:!border-gold/60 hover:!text-gold !bg-ink/20 backdrop-blur-sm"
          >
            Teklif Alın
          </Button>
        </div>
      </div>

      <div
        className="hero-enter absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 motion-reduce:hidden pointer-events-none"
        style={{ animationDelay: '360ms' }}
        aria-hidden="true"
      >
        <span className="text-paper/40 text-[10px] tracking-[0.2em] font-body">Keşfet</span>
        <div className="hero-scroll-line w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  )
}
