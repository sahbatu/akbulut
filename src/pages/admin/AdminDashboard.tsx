import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Mail, Phone, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, unread: 0, categories: 0 })
  const [recent, setRecent] = useState<{ name: string; subject: string; created_at: string }[]>([])

  useEffect(() => {
    if (!supabase) return
    async function load() {
      const [products, unread, categories, messages] = await Promise.all([
        supabase!.from('category_images').select('id', { count: 'exact', head: true }),
        supabase!.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase!.from('categories').select('id', { count: 'exact', head: true }),
        supabase!.from('contact_submissions').select('name, subject, created_at').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        products: products.count ?? 0,
        unread: unread.count ?? 0,
        categories: categories.count ?? 0,
      })
      setRecent(messages.data ?? [])
    }
    load()
  }, [])

  const cards = [
    { label: 'Ürün Görselleri', value: stats.products, icon: Package, to: '/admin/urunler' },
    { label: 'Okunmamış Mesaj', value: stats.unread, icon: Mail, to: '/admin/mesajlar' },
    { label: 'Kategoriler', value: stats.categories, icon: Package, to: '/admin/kategoriler' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Panel</h1>
      <p className="text-slate-500 text-sm mt-1">Site yönetimine hoş geldiniz</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-300 transition-colors"
          >
            <card.icon className="h-5 w-5 text-amber-600 mb-3" />
            <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-medium text-slate-900 mb-4">Hızlı İşlemler</h2>
          <div className="space-y-2">
            <Link to="/admin/urunler" className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-700">
              <Package className="h-4 w-4" /> Yeni ürün görseli ekle
            </Link>
            <Link to="/admin/iletisim" className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-700">
              <Phone className="h-4 w-4" /> İletişim bilgilerini düzenle
            </Link>
            <Link to="/admin/seo" className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-700">
              <Search className="h-4 w-4" /> SEO ayarlarını yönet
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-medium text-slate-900 mb-4">Son Mesajlar</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400">Henüz mesaj yok</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((m, i) => (
                <li key={i} className="text-sm border-b border-slate-100 pb-2 last:border-0">
                  <span className="font-medium text-slate-800">{m.name}</span>
                  <span className="text-slate-400"> — {m.subject}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
