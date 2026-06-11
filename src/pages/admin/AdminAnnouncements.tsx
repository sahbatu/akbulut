import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput, AdminTextarea } from '@/components/admin/ui/AdminField'
import type { Announcement } from '@/types'

export function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  const [editing, setEditing] = useState<Announcement | null>(null)

  const load = async () => {
    if (!supabase) return
    const { data } = await supabase.from('announcements').select('*').order('published_at', { ascending: false })
    setItems((data as Announcement[]) ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  const startNew = () => {
    setEditing({
      id: crypto.randomUUID(),
      title: '',
      excerpt: '',
      published_at: new Date().toISOString().slice(0, 10),
    })
  }

  const save = async () => {
    if (!supabase || !editing) return
    const { error } = await supabase.from('announcements').upsert(editing)
    if (error) return alert(error.message)
    setEditing(null)
    load()
  }

  const remove = async (id: string) => {
    if (!supabase || !confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('announcements').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Duyurular</h1>
          <p className="text-slate-500 text-sm mt-1">Ana sayfada gösterilen duyurular</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Yeni Duyuru
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between gap-4">
              <button type="button" onClick={() => setEditing(item)} className="text-left flex-1">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500 line-clamp-2">{item.excerpt}</p>
                <p className="text-xs text-slate-400 mt-1">{item.published_at}</p>
              </button>
              <button type="button" onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {editing && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 sticky top-6">
            <h2 className="font-medium text-slate-900">{items.find((i) => i.id === editing.id) ? 'Düzenle' : 'Yeni Duyuru'}</h2>
            <AdminField label="Başlık">
              <AdminInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </AdminField>
            <AdminField label="Özet">
              <AdminTextarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </AdminField>
            <AdminField label="Yayın Tarihi">
              <AdminInput type="date" value={editing.published_at} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} />
            </AdminField>
            <div className="flex gap-2">
              <button type="button" onClick={save} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Kaydet</button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">İptal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
