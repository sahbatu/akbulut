import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useSiteData } from '@/hooks/useSiteData'
import { HeaderAppearanceContext, useHeaderAppearance } from './headerAppearance'
import {
  CatalogMenuProvider,
  CatalogMenuOverlay,
  ProductsMobileMenu,
  ProductsNavItem,
  useCatalogMenu,
} from './ProductsMegaMenu'

const navLinks = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/iletisim', label: 'İletişim' },
]

function HeaderBar() {
  const { settings } = useSiteData()
  const { dark } = useHeaderAppearance()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const navIdle = dark ? 'text-paper/60 hover:text-paper' : 'text-ink/60 hover:text-ink'
  const navActive = 'text-gold'
  const divider = dark ? 'bg-paper/20' : 'bg-ink/15'
  const estText = dark ? 'text-paper/40' : 'text-ink/40'
  const logoText = dark
    ? 'text-paper group-hover:text-gold'
    : 'text-ink group-hover:text-gold'
  const menuLine = dark ? 'bg-paper' : 'bg-ink'

  return (
    <>
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.logo_alt || 'Akbulut'}
              className="h-8 md:h-10 w-auto object-contain"
            />
          ) : (
            <span
              className={`font-display text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${logoText}`}
            >
              Akbulut
            </span>
          )}
          <span className={`hidden sm:block w-px h-5 ${divider}`} />
          <span className={`hidden sm:block text-[10px] tracking-[0.25em] uppercase ${estText}`}>
            Est. 2006
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm tracking-wide transition-colors duration-300 ${isActive ? navActive : navIdle}`
            }
          >
            Ana Sayfa
          </NavLink>

          <NavLink
            to="/hakkimizda"
            className={({ isActive }) =>
              `text-sm tracking-wide transition-colors duration-300 ${isActive ? navActive : navIdle}`
            }
          >
            Hakkımızda
          </NavLink>

          <ProductsNavItem />

          <NavLink
            to="/iletisim"
            className={({ isActive }) =>
              `text-sm tracking-wide transition-colors duration-300 ${isActive ? navActive : navIdle}`
            }
          >
            İletişim
          </NavLink>
        </nav>

        <div className="hidden lg:block">
          <Button to="/iletisim" size="sm">
            Teklif Al
          </Button>
        </div>

        <button
          className={`menu-toggle lg:hidden flex flex-col gap-1.5 p-2 ${menuOpen ? 'menu-toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-px ${menuLine}`} />
          <span className={`block w-6 h-px ${menuLine}`} />
          <span className={`block w-6 h-px ${menuLine}`} />
        </button>
      </div>

      <div
        className={`mobile-menu fixed inset-0 top-0 bg-ink/95 backdrop-blur-2xl lg:hidden flex flex-col items-center justify-center gap-6 overflow-y-auto py-24 z-[60] transition-opacity duration-300 ${
          menuOpen ? 'mobile-menu--open opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        {navLinks.map((link, i) => (
          <div
            key={link.to}
            className="mobile-menu-item"
            style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
          >
            <NavLink
              to={link.to}
              end={link.to === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-display text-3xl ${isActive ? 'text-gold' : 'text-paper'}`
              }
            >
              {link.label}
            </NavLink>
          </div>
        ))}

        <div className="mobile-menu-item" style={{ transitionDelay: menuOpen ? '180ms' : '0ms' }}>
          <ProductsMobileMenu onNavigate={closeMenu} />
        </div>

        <Button to="/iletisim" onClick={closeMenu}>
          Teklif Al
        </Button>
      </div>
    </>
  )
}

function HeaderWithCatalog({
  headerRef,
  scrolled,
}: {
  headerRef: React.RefObject<HTMLElement | null>
  scrolled: boolean
}) {
  const { open: catalogOpen } = useCatalogMenu()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const overHero = isHome && !scrolled
  const dark = overHero

  const headerSurface =
    overHero && !catalogOpen
      ? 'bg-transparent py-5 md:py-6 border-b border-transparent'
      : overHero && catalogOpen
        ? 'bg-ink/95 backdrop-blur-xl py-3 border-b border-paper/5'
        : 'bg-paper/95 backdrop-blur-xl py-3 border-b border-ink/8 shadow-sm shadow-ink/5'

  return (
    <HeaderAppearanceContext.Provider value={{ dark }}>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerSurface}`}
      >
        <HeaderBar />
        <CatalogMenuOverlay headerRef={headerRef} />
      </header>
    </HeaderAppearanceContext.Provider>
  )
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <CatalogMenuProvider>
      <HeaderWithCatalog headerRef={headerRef} scrolled={scrolled} />
    </CatalogMenuProvider>
  )
}
