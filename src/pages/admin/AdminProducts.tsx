import { useCallback, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ExternalLink, GripVertical, Trash2, Plus } from 'lucide-react'
import { CategorySeoFields } from '@/components/admin/CategorySeoFields'
import { useCategories } from '@/hooks/useCategories'
import { uploadFile } from '@/lib/admin'
import {
  buildDefaultCategorySeo,
  categoryPagePath,
  emptyCategorySeo,
  type CategorySeoForm,
} from '@/lib/categorySeo'
import { getCategoryPath } from '@/lib/categoryTree'
import { blobToFile, resizeImage } from '@/lib/imageResize'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput } from '@/components/admin/ui/AdminField'
import { FileDropzone } from '@/components/admin/ui/FileDropzone'
import type { CategoryImage } from '@/types'

function SortableProduct({
  image,
  onDelete,
  onTitleChange,
}: {
  image: CategoryImage
  onDelete: () => void
  onTitleChange: (title: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <img src={image.thumb_url} alt="" className="w-full h-full object-cover" />
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-md cursor-grab"
        >
          <GripVertical className="h-4 w-4 text-slate-500" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3">
        <AdminInput
          value={image.title ?? ''}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Örn: Promosyon Kalem Seti Klasik"
          className="text-sm"
        />
        <p className="text-[11px] text-slate-500 mt-1.5">
          Görsel alt metni (alt) ve kart başlığı — anlamlı ürün adı SEO için önemlidir.
        </p>
      </div>
    </div>
  )
}

export function AdminProducts() {
  const { categories, getChildren, loading: catsLoading } = useCategories()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [images, setImages] = useState<CategoryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [seo, setSeo] = useState<CategorySeoForm>(() => emptyCategorySeo(''))
  const [seoSaving, setSeoSaving] = useState(false)
  const [seoMessage, setSeoMessage] = useState<string | null>(null)
  const [seoError, setSeoError] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const leafCategories = categories.filter(
    (c) => getChildren(c.id).length === 0,
  )

  const selectedCat = categories.find((c) => c.id === selectedId)

  const loadImages = useCallback(async (categoryId: string) => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase
      .from('category_images')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order')
    setImages((data as CategoryImage[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (selectedId) loadImages(selectedId)
  }, [selectedId, loadImages])

  const loadCategorySeo = useCallback(
    async (
      slug: string,
      catName: string,
      description: string | null,
      parentId: string | null,
    ) => {
      if (!supabase) return
      const { data } = await supabase
        .from('category_seo')
        .select('*')
        .eq('category_slug', slug)
        .maybeSingle()
      if (data) {
        setSeo(data as CategorySeoForm)
        return
      }
      const path = getCategoryPath(parentId, categories)
      setSeo(buildDefaultCategorySeo(catName, slug, description, [...path.map((p) => p.name), catName]))
    },
    [categories],
  )

  useEffect(() => {
    if (!selectedCat) return
    setSeoMessage(null)
    setSeoError(null)
    void loadCategorySeo(
      selectedCat.slug,
      selectedCat.name,
      selectedCat.description,
      selectedCat.parent_id,
    )
  }, [selectedCat, loadCategorySeo])

  useEffect(() => {
    if (!selectedId && leafCategories.length > 0) {
      setSelectedId(leafCategories[0].id)
    }
  }, [leafCategories, selectedId])

  const handleUpload = async (file: File) => {
    if (!supabase || !selectedId) return
    setUploading(true)
    try {
      const id = crypto.randomUUID()
      const fullBlob = await resizeImage(file, 1200)
      const thumbBlob = await resizeImage(file, 480)
      const fullFile = blobToFile(fullBlob, `${id}-full.webp`)
      const thumbFile = blobToFile(thumbBlob, `${id}-thumb.webp`)
      const basePath = `${selectedId}/${id}`
      const [fullUrl, thumbUrl] = await Promise.all([
        uploadFile('products', `${basePath}-full.webp`, fullFile),
        uploadFile('products', `${basePath}-thumb.webp`, thumbFile),
      ])
      const sortOrder = images.length + 1
      const row = {
        id: `${selectedId}-${id}`,
        category_id: selectedId,
        thumb_url: thumbUrl,
        full_url: fullUrl,
        title: newTitle || null,
        sort_order: sortOrder,
      }
      const { error } = await supabase.from('category_images').insert(row)
      if (error) throw error
      setImages([...images, row])
      setNewTitle('')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (image: CategoryImage) => {
    if (!supabase || !confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    await supabase.from('category_images').delete().eq('id', image.id)
    setImages(images.filter((i) => i.id !== image.id))
  }

  const handleTitleChange = async (imageId: string, title: string) => {
    setImages(images.map((i) => (i.id === imageId ? { ...i, title } : i)))
    if (!supabase) return
    await supabase.from('category_images').update({ title: title || null }).eq('id', imageId)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = images.findIndex((i) => i.id === active.id)
    const newIndex = images.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({
      ...img,
      sort_order: idx + 1,
    }))
    setImages(reordered)
    if (!supabase) return
    await Promise.all(
      reordered.map((img) =>
        supabase!.from('category_images').update({ sort_order: img.sort_order }).eq('id', img.id),
      ),
    )
  }

  const saveCategorySeo = async () => {
    if (!supabase || !selectedCat) return
    setSeoSaving(true)
    setSeoMessage(null)
    setSeoError(null)
    const { error: err } = await supabase.from('category_seo').upsert({
      ...seo,
      category_slug: selectedCat.slug,
      updated_at: new Date().toISOString(),
    })
    setSeoSaving(false)
    if (err) {
      setSeoError(err.message)
      return
    }
    setSeoMessage('Kategori SEO ayarları kaydedildi.')
  }

  const useFirstImageAsOg = () => {
    const first = images[0]
    if (!first) return
    setSeo((prev) => ({ ...prev, og_image_url: first.full_url }))
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Ürün Yönetimi</h1>
      <p className="text-slate-600 text-sm mt-1">
        Detay kategorisi seçin, anlamlı ürün adlarıyla görsel yükleyin ve sayfa SEO ayarlarını düzenleyin.
      </p>

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0 bg-white rounded-xl border border-slate-200 p-4 max-h-[70vh] overflow-y-auto">
          <p className="text-xs font-medium text-slate-500 uppercase mb-3">Kategoriler</p>
          {catsLoading ? (
            <p className="text-sm text-slate-400">Yükleniyor...</p>
          ) : (
            <ul className="space-y-0.5">
              {leafCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedId === cat.id
                        ? 'bg-amber-50 text-amber-900 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {selectedCat && (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="font-medium text-slate-800">{selectedCat.name}</h2>
                <a
                  href={categoryPagePath(selectedCat.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700"
                >
                  Sayfayı görüntüle <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
                <AdminField
                  label="Yeni ürün adı"
                  hint="Yüklemeden önce girin — görsel alt metni ve ürün kartı başlığı olarak kullanılır"
                >
                  <AdminInput
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Örn: Promosyon Kalem Seti Klasik Model"
                  />
                </AdminField>
                <div className="mt-4">
                  <FileDropzone
                    label={uploading ? 'Yükleniyor...' : 'Ürün görseli yükle'}
                    onFile={handleUpload}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
                <CategorySeoFields
                  value={seo}
                  onChange={(patch) => setSeo((prev) => ({ ...prev, ...patch }))}
                  categoryName={selectedCat.name}
                  slug={selectedCat.slug}
                  description={selectedCat.description}
                  pathNames={[
                    ...getCategoryPath(selectedCat.parent_id, categories).map((p) => p.name),
                    selectedCat.name,
                  ]}
                  compact
                />
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={useFirstImageAsOg}
                    className="mt-3 text-xs text-amber-800 hover:text-amber-900 underline underline-offset-2"
                  >
                    İlk ürün görselini paylaşım görseli (OG) yap
                  </button>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="text-sm">
                    {seoError && <span className="text-red-600">{seoError}</span>}
                    {!seoError && seoMessage && <span className="text-emerald-600">{seoMessage}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={saveCategorySeo}
                    disabled={seoSaving}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {seoSaving ? 'Kaydediliyor...' : 'SEO Kaydet'}
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-slate-400 text-sm">Görseller yükleniyor...</p>
              ) : images.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                  <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Bu kategoride henüz ürün yok</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img) => (
                        <SortableProduct
                          key={img.id}
                          image={img}
                          onDelete={() => handleDelete(img)}
                          onTitleChange={(title) => handleTitleChange(img.id, title)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
