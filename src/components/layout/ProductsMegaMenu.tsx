import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  createContext,
  useContext,
  type RefObject,
} from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { categoryIcons } from '@/data/seed'
import { useCategories } from '@/hooks/useCategories'
import { stopPageScroll, startPageScroll } from '@/lib/lenis'
import type { Category } from '@/types'

const CLOSE_DELAY = 200

interface CatalogMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  handleOpen: () => void
  handleClose: () => void
}

const CatalogMenuContext = createContext<CatalogMenuContextValue | null>(null)

export function useCatalogMenu() {
  const ctx = useContext(CatalogMenuContext)
  if (!ctx) throw new Error('useCatalogMenu must be used within CatalogMenuProvider')
  return ctx
}

export function CatalogMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const handleOpen = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  const handleClose = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY)
  }, [clearCloseTimer])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (open) {
      stopPageScroll()
      return () => startPageScroll()
    }
    startPageScroll()
  }, [open])

  useEffect(() => {
    if (!open) return

    const onWheel = (e: WheelEvent) => {
      const target = e.target
      if (!(target instanceof HTMLElement)) return

      const scrollHost = target.closest<HTMLElement>('[data-catalog-scroll]')
      if (!scrollHost) {
        e.preventDefault()
        return
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollHost
      const maxScroll = scrollHeight - clientHeight
      if (maxScroll <= 0) {
        e.preventDefault()
        return
      }

      const scrollingUp = e.deltaY < 0
      const scrollingDown = e.deltaY > 0
      const atTop = scrollTop <= 0
      const atBottom = scrollTop >= maxScroll - 1

      if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
        e.preventDefault()
      }
    }

    document.addEventListener('wheel', onWheel, { passive: false })
    return () => document.removeEventListener('wheel', onWheel)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <CatalogMenuContext.Provider value={{ open, setOpen, handleOpen, handleClose }}>
      {children}
    </CatalogMenuContext.Provider>
  )
}

export function CatalogMenuOverlay({ headerRef }: { headerRef: RefObject<HTMLElement | null> }) {
  const { open, handleOpen, handleClose, setOpen } = useCatalogMenu()
  const [backdropTop, setBackdropTop] = useState(0)

  useEffect(() => {
    if (!open) return

    const updateTop = () => {
      const header = headerRef.current
      if (header) setBackdropTop(header.getBoundingClientRect().bottom)
    }

    updateTop()
    window.addEventListener('resize', updateTop)
    window.addEventListener('scroll', updateTop, { passive: true })

    const observer = headerRef.current
      ? new ResizeObserver(updateTop)
      : null
    if (headerRef.current) observer?.observe(headerRef.current)

    return () => {
      window.removeEventListener('resize', updateTop)
      window.removeEventListener('scroll', updateTop)
      observer?.disconnect()
    }
  }, [open, headerRef])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed left-0 right-0 bottom-0 z-40 bg-ink/50 backdrop-blur-[2px]"
            style={{ top: backdropTop }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            aria-hidden
          />

          <motion.div
            data-lenis-prevent
            className="absolute left-0 right-0 top-full z-50 w-full"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            <CatalogPanel onClose={() => setOpen(false)} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function filterSubcategories(
  items: Category[],
  getChildren: (id: string) => Category[],
  query: string,
): { item: Category; nested: Category[] }[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return items.map((item) => ({ item, nested: getChildren(item.id) }))
  }

  return items
    .map((item) => {
      const nested = getChildren(item.id)
      const parentMatch = item.name.toLowerCase().includes(q)
      const matchedNested = nested.filter((n) => n.name.toLowerCase().includes(q))

      if (parentMatch) return { item, nested }
      if (matchedNested.length > 0) return { item, nested: matchedNested }
      return null
    })
    .filter((x): x is { item: Category; nested: Category[] } => x !== null)
}

function CatalogGroup({
  item,
  nested,
  onNavigate,
}: {
  item: Category
  nested: Category[]
  onNavigate?: () => void
}) {
  return (
    <div className="break-inside-avoid">
      <Link
        to={`/urunlerimiz/${item.slug}`}
        onClick={onNavigate}
        className="font-display text-base text-paper hover:text-gold transition-colors leading-snug"
      >
        {item.name}
      </Link>
      {item.description && nested.length === 0 && (
        <p className="text-paper/35 text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
      )}
      {nested.length > 0 && (
        <ul className="mt-2.5 space-y-1 border-l border-gold/20 pl-3">
          {nested.map((child) => (
            <li key={child.id}>
              <Link
                to={`/urunlerimiz/${child.slug}`}
                onClick={onNavigate}
                className="text-paper/50 text-sm hover:text-gold transition-colors leading-snug"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CatalogPanel({
  onClose,
  className = '',
}: {
  onClose?: () => void
  className?: string
}) {
  const { rootCategories, getChildren, loading } = useCategories()
  const [activeRoot, setActiveRoot] = useState(rootCategories[0]?.id ?? null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!activeRoot && rootCategories.length > 0) {
      setActiveRoot(rootCategories[0].id)
    }
  }, [activeRoot, rootCategories])

  const activeCategory = rootCategories.find((c) => c.id === activeRoot)
  const subcategories = activeRoot ? getChildren(activeRoot) : []

  const displayGroups = useMemo(
    () => filterSubcategories(subcategories, getChildren, search),
    [subcategories, getChildren, search],
  )

  const totalInGroup = subcategories.length

  return (
    <div
      data-lenis-prevent
      className={`flex flex-col overflow-hidden bg-ink/98 backdrop-blur-xl border-b border-paper/10 shadow-2xl shadow-black/50 h-[70vh] max-h-[calc(100dvh-6rem)] ${className}`}
    >
      <div className="shrink-0 border-b border-paper/5 px-5 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kategori ara... (ör. kartvizit, hp, zarf)"
              className="w-full bg-ink-light/60 border border-paper/10 px-4 py-2.5 pl-10 text-paper text-sm focus:outline-none focus:border-gold/50 transition-colors rounded-lg"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/30 text-sm">⌕</span>
          </div>
          {activeCategory && (
            <p className="text-paper/40 text-xs shrink-0">
              <span className="text-gold">{activeCategory.name}</span>
              {' · '}
              {search ? `${displayGroups.length} sonuç` : `${totalInGroup} kategori`}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside
          data-lenis-prevent
          data-catalog-scroll
          className="w-[220px] shrink-0 border-r border-paper/5 py-4 overflow-y-auto overscroll-contain hide-scrollbar min-h-0"
        >
          <p className="px-5 mb-2 text-[10px] tracking-[0.25em] uppercase text-gold/60">
            Ürün Grupları
          </p>
          <ul>
            {rootCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setActiveRoot(cat.id)
                    setSearch('')
                  }}
                  onClick={() => {
                    setActiveRoot(cat.id)
                    setSearch('')
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-colors ${
                    activeRoot === cat.id
                      ? 'bg-gold/10 text-gold border-r-2 border-gold'
                      : 'text-paper/65 hover:text-paper hover:bg-paper/5'
                  }`}
                >
                  <span className="text-base opacity-80">{categoryIcons[cat.slug] ?? '◆'}</span>
                  <span className="leading-snug">{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div
          data-lenis-prevent
          data-catalog-scroll
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 md:px-8 py-6"
        >
          {loading ? (
            <p className="text-paper/40 text-sm">Yükleniyor...</p>
          ) : !activeCategory ? null : displayGroups.length === 0 ? (
            <p className="text-paper/40 text-sm py-8 text-center">
              &quot;{search}&quot; için sonuç bulunamadı.
            </p>
          ) : (
            <motion.div
              key={activeCategory.id + search}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5">
                <h3 className="font-display text-2xl text-paper">{activeCategory.name}</h3>
                {activeCategory.description && (
                  <p className="text-paper/40 text-sm mt-1">{activeCategory.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
                {displayGroups.map(({ item, nested }) => (
                  <CatalogGroup
                    key={item.id}
                    item={item}
                    nested={nested}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-paper/5 px-5 md:px-8 py-3 bg-ink-light/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="text-paper/30 text-xs hidden sm:block">
            Tüm ürün ve hizmetler için teklif alabilirsiniz
          </span>
          <div className="flex items-center gap-6 ml-auto">
            <Link
              to="/urunlerimiz"
              onClick={onClose}
              className="text-paper/60 text-xs tracking-widest uppercase hover:text-paper transition-colors"
            >
              Tüm Ürünler
            </Link>
            <Link
              to="/iletisim"
              onClick={onClose}
              className="text-gold text-xs tracking-widest uppercase hover:underline"
            >
              Teklif Al →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductsNavItem() {
  const { open, handleOpen, handleClose } = useCatalogMenu()

  return (
    <div className="relative" onMouseEnter={handleOpen} onMouseLeave={handleClose}>
      <NavLink
        to="/urunlerimiz"
        className={({ isActive }) =>
          `inline-flex items-center gap-1.5 text-sm tracking-wide transition-colors duration-300 ${
            isActive || open ? 'text-gold' : 'text-paper/60 hover:text-paper'
          }`
        }
        onFocus={handleOpen}
      >
        Ürünlerimiz
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] opacity-60"
        >
          ▾
        </motion.span>
      </NavLink>
    </div>
  )
}

function MobileCategoryNode({
  category,
  getChildren,
  onNavigate,
  depth = 0,
}: {
  category: Category
  getChildren: (id: string) => Category[]
  onNavigate: () => void
  depth?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const children = getChildren(category.id)
  const hasChildren = children.length > 0

  if (!hasChildren) {
    return (
      <Link
        to={`/urunlerimiz/${category.slug}`}
        onClick={onNavigate}
        className="block text-paper/50 text-xs py-1.5 hover:text-gold transition-colors"
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {category.name}
      </Link>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-2 text-paper/75 text-xs hover:text-paper"
        style={{ paddingLeft: `${depth * 12 + 12}px`, paddingRight: '12px' }}
      >
        <span>{category.name}</span>
        <span className="opacity-40 pr-1">{expanded ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children.map((child) => (
              <MobileCategoryNode
                key={child.id}
                category={child}
                getChildren={getChildren}
                onNavigate={onNavigate}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProductsMobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const { rootCategories, getChildren } = useCategories()
  const [expanded, setExpanded] = useState(false)
  const [expandedRoot, setExpandedRoot] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filteredRoots = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rootCategories
    return rootCategories.filter((root) => {
      if (root.name.toLowerCase().includes(q)) return true
      return getChildren(root.id).some(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          getChildren(sub.id).some((n) => n.name.toLowerCase().includes(q)),
      )
    })
  }, [rootCategories, getChildren, search])

  return (
    <div className="w-full max-w-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="font-display text-3xl text-paper flex items-center gap-3 w-full justify-center"
      >
        Ürünlerimiz
        <span className="text-lg opacity-50">{expanded ? '−' : '+'}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kategori ara..."
              className="w-full mb-3 bg-ink-light/60 border border-paper/10 px-4 py-2 text-paper text-sm focus:outline-none focus:border-gold/50"
            />

            <div className="space-y-1 text-left max-h-[55vh] overflow-y-auto">
              {filteredRoots.map((cat) => {
                const isOpen = expandedRoot === cat.id
                const subs = filterSubcategories(getChildren(cat.id), getChildren, search)

                return (
                  <div key={cat.id} className="border border-paper/5">
                    <button
                      type="button"
                      onClick={() => setExpandedRoot(isOpen ? null : cat.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-paper/80 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-gold">{categoryIcons[cat.slug] ?? '◆'}</span>
                        {cat.name}
                      </span>
                      <span className="text-xs opacity-40">{isOpen ? '−' : '+'}</span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-paper/5 py-2"
                        >
                          {subs.map(({ item, nested }) =>
                            nested.length > 0 ? (
                              <MobileCategoryNode
                                key={item.id}
                                category={item}
                                getChildren={getChildren}
                                onNavigate={onNavigate}
                              />
                            ) : (
                              <Link
                                key={item.id}
                                to={`/urunlerimiz/${item.slug}`}
                                onClick={onNavigate}
                                className="block text-paper/50 text-xs py-1.5 pl-3 hover:text-gold"
                              >
                                {item.name}
                              </Link>
                            ),
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              <Link
                to="/urunlerimiz"
                onClick={onNavigate}
                className="block text-center text-gold text-sm tracking-widest uppercase py-3"
              >
                Tüm Ürünler →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

