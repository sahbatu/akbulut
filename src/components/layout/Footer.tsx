import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { useFooterSettings } from '@/hooks/useFooterSettings'
import { useSiteData } from '@/hooks/useSiteData'

export function Footer() {
  const { rootCategories } = useCategories()
  const { footer } = useFooterSettings()
  const { settings } = useSiteData()

  return (
    <footer className="bg-ink border-t border-paper/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-display text-3xl font-bold text-paper">{footer.brand_title}</span>
            <p className="mt-4 text-paper/50 text-sm leading-relaxed">{footer.brand_text}</p>
          </div>

          <div>
            <h4 className="eyebrow text-gold mb-4">Sayfalar</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Ana Sayfa' },
                { to: '/hakkimizda', label: 'Hakkımızda' },
                { to: '/urunlerimiz', label: 'Ürünlerimiz' },
                { to: '/iletisim', label: 'İletişim' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-paper/50 hover:text-gold text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold mb-4">Ürün Grupları</h4>
            <ul className="space-y-2 columns-1">
              {rootCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/urunlerimiz/${cat.slug}`}
                    className="text-paper/50 hover:text-gold text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold mb-4">İletişim</h4>
            <ul className="space-y-2 text-paper/50 text-sm">
              <li>{settings.address}</li>
              {settings.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-paper/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-paper/30 text-xs">
          <p>{footer.copyright_text}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/kvkk" className="hover:text-gold transition-colors">
              KVKK
            </Link>
            <Link to="/cerez-politikasi" className="hover:text-gold transition-colors">
              Çerez Politikası
            </Link>
            <span className="hidden sm:inline text-paper/20">|</span>
            <span>www.akbulutltd.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
