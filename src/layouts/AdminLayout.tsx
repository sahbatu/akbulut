import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Phone,
  Mail,
  Image,
  PanelBottom,
  Search,
  Megaphone,
  Sliders,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { to: '/admin', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/admin/urunler', label: 'Ürünler', icon: Package },
  { to: '/admin/kategoriler', label: 'Kategoriler', icon: FolderTree },
  { to: '/admin/iletisim', label: 'İletişim', icon: Phone },
  { to: '/admin/mesajlar', label: 'Mesajlar', icon: Mail },
  { to: '/admin/marka', label: 'Logo & Favicon', icon: Image },
  { to: '/admin/footer', label: 'Footer', icon: PanelBottom },
  { to: '/admin/seo', label: 'SEO', icon: Search },
  { to: '/admin/duyurular', label: 'Duyurular', icon: Megaphone },
  { to: '/admin/icerik', label: 'Öne Çıkan & İçerik', icon: Sliders },
]

export function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-panel min-h-screen bg-slate-50 flex text-slate-900">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <span className="font-display text-xl font-semibold text-slate-900">Akbulut</span>
          <p className="text-xs text-slate-500 mt-0.5">Yönetim Paneli</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <ExternalLink className="h-4 w-4" />
            Siteyi Görüntüle
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Çıkış ({user?.email?.split('@')[0]})
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
