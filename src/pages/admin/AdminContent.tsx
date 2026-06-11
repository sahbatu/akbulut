import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { uploadFile } from '@/lib/admin'
import { formatStorageError, imageExtension, validateSlideImage } from '@/lib/imageUpload'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput, AdminTextarea } from '@/components/admin/ui/AdminField'
import { FileDropzone } from '@/components/admin/ui/FileDropzone'
import { SaveBar } from '@/components/admin/ui/SaveBar'
import type { FeaturedShowcase, MediaSlide, TimelineItem, ValueItem } from '@/types'

const defaultFeatured: FeaturedShowcase = {
  eyebrow: 'Öne Çıkan',
  title: 'Mont Blanc',
  subtitle: 'Premium kırtasiye koleksiyonu',
}

export function AdminContent() {
  const [tab, setTab] = useState<'slides' | 'timeline' | 'values'>('slides')
  const [slides, setSlides] = useState<MediaSlide[]>([])
  const [featured, setFeatured] = useState<FeaturedShowcase>(defaultFeatured)
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [values, setValues] = useState<ValueItem[]>([])
  const [saving, setSaving] = useState(false)
  const [uploadingSlide, setUploadingSlide] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [slideMessage, setSlideMessage] = useState<string | null>(null)
  const [slideError, setSlideError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('media_slides').select('*').order('sort_order'),
      supabase.from('page_sections').select('content').eq('section_key', 'featured_showcase').maybeSingle(),
      supabase.from('page_sections').select('content').eq('section_key', 'timeline').maybeSingle(),
      supabase.from('page_sections').select('content').eq('section_key', 'values').maybeSingle(),
    ]).then(([slidesRes, featuredRes, timelineRes, valuesRes]) => {
      setSlides((slidesRes.data as MediaSlide[]) ?? [])
      if (featuredRes.data?.content) {
        setFeatured({ ...defaultFeatured, ...(featuredRes.data.content as FeaturedShowcase) })
      }
      if (timelineRes.data?.content) setTimeline(timelineRes.data.content as TimelineItem[])
      if (valuesRes.data?.content) setValues(valuesRes.data.content as ValueItem[])
    })
  }, [])

  const uploadSlide = async (file: File) => {
    if (!supabase) {
      setSlideError('Supabase yapılandırılmamış.')
      return
    }

    setUploadingSlide(true)
    setSlideError(null)
    setSlideMessage(null)

    try {
      validateSlideImage(file)
      const id = crypto.randomUUID()
      const ext = imageExtension(file)
      const url = await uploadFile('brand', `slides/${id}.${ext}`, file)
      const row: MediaSlide = {
        id,
        image_url: url,
        alt_text: '',
        sort_order: slides.length + 1,
        is_active: true,
      }
      const { error: insertError } = await supabase.from('media_slides').insert(row)
      if (insertError) throw new Error(insertError.message)

      setSlides((prev) => [...prev, row])
      setSlideMessage('Slayt eklendi.')
    } catch (e) {
      setSlideError(formatStorageError(e))
    } finally {
      setUploadingSlide(false)
    }
  }

  const removeSlide = async (id: string) => {
    if (!supabase) return
    if (!confirm('Bu slayt silinsin mi?')) return
    await supabase.from('media_slides').delete().eq('id', id)
    setSlides(slides.filter((s) => s.id !== id))
  }

  const updateSlide = async (id: string, patch: Partial<MediaSlide>) => {
    if (!supabase) return
    const { error: updateError } = await supabase.from('media_slides').update(patch).eq('id', id)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setSlides(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const moveSlide = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= slides.length || !supabase) return

    const client = supabase
    const next = [...slides]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    const withOrder = next.map((s, i) => ({ ...s, sort_order: i + 1 }))
    setSlides(withOrder)

    await Promise.all(
      withOrder.map((s) =>
        client.from('media_slides').update({ sort_order: s.sort_order }).eq('id', s.id),
      ),
    )
  }

  const saveSection = async (key: string, content: unknown) => {
    if (!supabase) return
    await supabase.from('page_sections').upsert({
      section_key: key,
      content,
      updated_at: new Date().toISOString(),
    })
  }

  const save = async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      if (tab === 'slides') await saveSection('featured_showcase', featured)
      if (tab === 'timeline') await saveSection('timeline', timeline)
      if (tab === 'values') await saveSection('values', values)
      setMessage('İçerik kaydedildi.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">İçerik Yönetimi</h1>
      <p className="text-slate-500 text-sm mt-1">
        Ana sayfa öne çıkan alanı, zaman çizelgesi ve değerler
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {([
          ['slides', 'Öne Çıkan'],
          ['timeline', 'Zaman Çizelgesi'],
          ['values', 'Değerler'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key)
              setMessage(null)
              setError(null)
            }}
            className={`px-4 py-2 rounded-lg text-sm ${tab === key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        {tab === 'slides' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Bölüm Başlıkları</h2>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Ana sayfadaki &quot;Öne Çıkan&quot; alanının üst başlık ve açıklama metinleri
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminField label="Üst etiket">
                  <AdminInput
                    value={featured.eyebrow}
                    onChange={(e) => setFeatured({ ...featured, eyebrow: e.target.value })}
                    placeholder="Öne Çıkan"
                  />
                </AdminField>
                <AdminField label="Başlık">
                  <AdminInput
                    value={featured.title}
                    onChange={(e) => setFeatured({ ...featured, title: e.target.value })}
                    placeholder="Mont Blanc"
                  />
                </AdminField>
                <AdminField label="Alt açıklama">
                  <AdminInput
                    value={featured.subtitle}
                    onChange={(e) => setFeatured({ ...featured, subtitle: e.target.value })}
                    placeholder="Premium kırtasiye koleksiyonu"
                  />
                </AdminField>
              </div>
              <SaveBar saving={saving} message={message} error={error} onSave={save} />
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-sm font-semibold text-slate-900">Slayt Görselleri</h2>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Sırayı ok tuşlarıyla değiştirin. Yalnızca &quot;Aktif&quot; işaretli slaytlar sitede görünür.
                PNG, JPG veya WebP — en fazla 5 MB.
              </p>
              <FileDropzone
                label="Yeni slayt görseli yükle"
                accept="image/png,image/jpeg,image/webp"
                busy={uploadingSlide}
                onFile={uploadSlide}
              />
              {slideError && <p className="mt-3 text-sm text-red-600">{slideError}</p>}
              {slideMessage && <p className="mt-3 text-sm text-emerald-600">{slideMessage}</p>}

              {slides.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">Henüz slayt yok. Görsel yükleyin.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={slide.image_url}
                        alt=""
                        className="w-full sm:w-40 aspect-video object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 space-y-3 min-w-0">
                        <AdminField label="Alt metin (SEO)">
                          <AdminInput
                            value={slide.alt_text ?? ''}
                            onChange={(e) =>
                              setSlides(
                                slides.map((s) =>
                                  s.id === slide.id ? { ...s, alt_text: e.target.value } : s,
                                ),
                              )
                            }
                            onBlur={(e) => updateSlide(slide.id, { alt_text: e.target.value })}
                            placeholder="Görsel açıklaması"
                          />
                        </AdminField>
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={slide.is_active}
                            onChange={(e) => updateSlide(slide.id, { is_active: e.target.checked })}
                            className="rounded border-slate-300"
                          />
                          Sitede göster (aktif)
                        </label>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveSlide(index, -1)}
                          disabled={index === 0}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30"
                          aria-label="Yukarı taşı"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSlide(index, 1)}
                          disabled={index === slides.length - 1}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30"
                          aria-label="Aşağı taşı"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSlide(slide.id)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          aria-label="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'timeline' && (
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg">
                <AdminInput placeholder="Yıl" value={item.year} onChange={(e) => {
                  const next = [...timeline]
                  next[i] = { ...item, year: e.target.value }
                  setTimeline(next)
                }} />
                <AdminInput placeholder="Başlık" value={item.title} onChange={(e) => {
                  const next = [...timeline]
                  next[i] = { ...item, title: e.target.value }
                  setTimeline(next)
                }} />
                <AdminInput placeholder="Açıklama" value={item.description} onChange={(e) => {
                  const next = [...timeline]
                  next[i] = { ...item, description: e.target.value }
                  setTimeline(next)
                }} />
              </div>
            ))}
            <button type="button" onClick={() => setTimeline([...timeline, { year: '', title: '', description: '' }])} className="text-sm text-amber-700">
              + Madde Ekle
            </button>
            <SaveBar saving={saving} message={message} error={error} onSave={save} />
          </div>
        )}

        {tab === 'values' && (
          <div className="space-y-4">
            {values.map((item, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg">
                <AdminInput placeholder="İkon" value={item.icon} onChange={(e) => {
                  const next = [...values]
                  next[i] = { ...item, icon: e.target.value }
                  setValues(next)
                }} />
                <AdminInput placeholder="Başlık" value={item.title} onChange={(e) => {
                  const next = [...values]
                  next[i] = { ...item, title: e.target.value }
                  setValues(next)
                }} />
                <AdminTextarea placeholder="Açıklama" value={item.description} onChange={(e) => {
                  const next = [...values]
                  next[i] = { ...item, description: e.target.value }
                  setValues(next)
                }} className="col-span-2" />
              </div>
            ))}
            <button type="button" onClick={() => setValues([...values, { icon: '◆', title: '', description: '' }])} className="text-sm text-amber-700">
              + Değer Ekle
            </button>
            <SaveBar saving={saving} message={message} error={error} onSave={save} />
          </div>
        )}
      </div>
    </div>
  )
}
