import { Button } from '@/components/ui/Button'

interface HeroProps {
  tagline: string
}

export function Hero({ tagline }: HeroProps) {
  const words = tagline.split(' ')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-light/30 to-ink" />

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #C9A962 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8D5C4 0%, transparent 40%)',
        }}
      />

      <div className="absolute top-1/4 -left-32 w-96 h-96 border border-gold/10 rotate-45 opacity-30" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 border border-paper/5 rotate-12" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 text-center pt-24 pb-28">
        <span className="hero-enter inline-block text-gold text-xs md:text-sm tracking-[0.4em] uppercase mb-6">
          Akbulut Kırtasiye & Matbaa
        </span>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
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
          className="hero-enter max-w-xl mx-auto text-paper/50 text-base md:text-lg leading-relaxed mb-10"
          style={{ animationDelay: '120ms' }}
        >
          Promosyon, matbaa, kırtasiye ve kurumsal çözümlerde Kadıköy&apos;den Türkiye&apos;ye.
        </p>

        <div className="hero-enter flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '200ms' }}>
          <Button to="/urunlerimiz" size="lg">
            Ürünlerimizi Keşfedin
          </Button>
          <Button to="/iletisim" variant="outline" size="lg">
            Teklif Alın
          </Button>
        </div>
      </div>

      <div
        className="hero-enter absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 motion-reduce:hidden pointer-events-none"
        style={{ animationDelay: '360ms' }}
        aria-hidden="true"
      >
        <span className="text-paper/30 text-[10px] tracking-[0.3em] uppercase">Keşfet</span>
        <div className="hero-scroll-line w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  )
}
