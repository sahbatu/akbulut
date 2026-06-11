import { useEffect, useState } from 'react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminTextarea } from '@/components/admin/ui/AdminField'
import type { ContactSubmission } from '@/types'

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [notes, setNotes] = useState('')

  const load = async () => {
    if (!supabase) return
    let q = supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (filter === 'unread') q = q.eq('is_read', false)
    const { data } = await q
    setMessages((data as ContactSubmission[]) ?? [])
  }

  useEffect(() => {
    load()
  }, [filter])

  const openMessage = async (msg: ContactSubmission) => {
    setSelected(msg)
    setNotes(msg.notes ?? '')
    if (!msg.is_read && supabase) {
      await supabase.from('contact_submissions').update({ is_read: true }).eq('id', msg.id)
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)))
    }
  }

  const saveNotes = async () => {
    if (!supabase || !selected) return
    await supabase.from('contact_submissions').update({ notes }).eq('id', selected.id)
    setMessages(messages.map((m) => (m.id === selected.id ? { ...m, notes } : m)))
    setSelected({ ...selected, notes })
  }

  const deleteMessage = async () => {
    if (!supabase || !selected) return
    if (!confirm(`"${selected.name}" adlı kişinin mesajı silinsin mi?`)) return

    const { error } = await supabase.from('contact_submissions').delete().eq('id', selected.id)
    if (error) {
      alert('Silinemedi: ' + error.message)
      return
    }

    setMessages(messages.filter((m) => m.id !== selected.id))
    setSelected(null)
    setNotes('')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Gelen Mesajlar</h1>
      <p className="text-slate-500 text-sm mt-1">İletişim formundan gelen talepler</p>

      <div className="mt-4 flex gap-2">
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {f === 'all' ? 'Tümü' : 'Okunmamış'}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">Mesaj bulunamadı</p>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                  selected?.id === msg.id ? 'bg-amber-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {msg.is_read ? (
                    <MailOpen className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  ) : (
                    <Mail className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{msg.name}</p>
                    <p className="text-sm text-slate-500 truncate">{msg.subject}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(msg.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {selected ? (
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-slate-900">{selected.name}</h2>
                <p className="text-sm text-slate-500">{selected.company}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Telefon</span>
                  <p>{selected.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400">E-posta</span>
                  <p>{selected.email}</p>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Konu</span>
                <p className="font-medium">{selected.subject}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Mesaj</span>
                <p className="text-slate-700 whitespace-pre-wrap mt-1">{selected.message}</p>
              </div>
              <AdminField label="Dahili Not">
                <AdminTextarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </AdminField>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={saveNotes}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                >
                  Notu Kaydet
                </button>
                <button
                  type="button"
                  onClick={deleteMessage}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Detay için bir mesaj seçin</p>
          )}
        </div>
      </div>
    </div>
  )
}
