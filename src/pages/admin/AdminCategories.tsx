import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Pencil, FolderTree, ExternalLink } from 'lucide-react'
import { CategorySeoFields } from '@/components/admin/CategorySeoFields'
import { useCategories } from '@/hooks/useCategories'
import {
  buildDefaultCategorySeo,
  emptyCategorySeo,
  type CategorySeoForm,
} from '@/lib/categorySeo'
import { regenerateSeoFiles } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/ui/AdminField'
import { SaveBar } from '@/components/admin/ui/SaveBar'
import {
  MAX_CATEGORY_DEPTH,
  flattenCategoryOptions,
  getCategoryDepth,
  getCategoryPath,
  getLevelMeta,
  slugify,
  suggestCategoryId,
} from '@/lib/categoryTree'
import type { Category } from '@/types'

function hasCustomSeo(seo: CategorySeoForm) {
  return Boolean(
    seo.title?.trim() ||
      seo.meta_description?.trim() ||
      seo.keywords?.trim() ||
      seo.og_title?.trim() ||
      seo.og_description?.trim() ||
      seo.og_image_url?.trim() ||
      seo.canonical_url?.trim(),
  )
}

type NewKind = 'root' | 'child' | 'grandchild'

const NEW_KIND_OPTIONS: { id: NewKind; label: string; hint: string }[] = [
  {
    id: 'root',
    label: 'Ana Ürün Grubu',
    hint: 'En üst seviye — 7 ana grup (Promosyon, Matbaa vb.)',
  },
  {
    id: 'child',
    label: 'Alt Kategori',
    hint: 'Bir ana grubun altında — mega menüde görünür',
  },
  {
    id: 'grandchild',
    label: 'Detay Kategorisi',
    hint: 'Alt kategorinin altında — ürün galerisi burada açılır',
  },
]

function LevelBadge({ depth }: { depth: number }) {
  const meta = getLevelMeta(depth)
  return (
    <span className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${meta.color}`}>
      {meta.short}
    </span>
  )
}

export function AdminCategories() {
  const { categories, getChildren, loading, refetch } = useCategories()
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Partial<Category> | null>(null)
  const [newKind, setNewKind] = useState<NewKind>('child')
  const [seo, setSeo] = useState<CategorySeoForm>(() => emptyCategorySeo(''))
  const [originalSlug, setOriginalSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const roots = categories.filter((c) => !c.parent_id)
  const flatOptions = useMemo(
    () => flattenCategoryOptions(categories, getChildren),
    [categories, getChildren],
  )

  const editingDepth = editing
    ? editing.parent_id == null
      ? 0
      : getCategoryDepth(editing.parent_id, categories) + 1
    : -1

  const editingPath = editing?.parent_id
    ? getCategoryPath(editing.parent_id, categories)
    : []

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const startNew = (kind: NewKind, parentId: string | null = null) => {
    setNewKind(kind)
    setSelectedId(null)
    setMessage(null)
    setError(null)

    let resolvedParent: string | null = parentId
    if (kind === 'root') resolvedParent = null
    if (kind === 'child' && !resolvedParent && roots[0]) resolvedParent = roots[0].id
    if (kind === 'grandchild') {
      const firstChild = categories.find((c) => c.parent_id && getCategoryDepth(c.id, categories) === 1)
      resolvedParent = parentId ?? firstChild?.id ?? null
    }

    setEditing({
      id: '',
      parent_id: resolvedParent,
      name: '',
      slug: '',
      description: '',
      image_url: null,
      sort_order: getChildren(resolvedParent ?? '').length + 1,
      is_featured: kind === 'root',
    })
    setSeo(emptyCategorySeo(''))
    setOriginalSlug('')
  }

  const loadCategorySeo = async (cat: Category) => {
    if (!supabase) {
      setSeo(emptyCategorySeo(cat.slug))
      setOriginalSlug(cat.slug)
      return
    }
    const { data } = await supabase
      .from('category_seo')
      .select('*')
      .eq('category_slug', cat.slug)
      .maybeSingle()
    setSeo(data ? (data as CategorySeoForm) : emptyCategorySeo(cat.slug))
    setOriginalSlug(cat.slug)
  }

  const startEdit = (cat: Category) => {
    setSelectedId(cat.id)
    setEditing({ ...cat })
    setMessage(null)
    setError(null)
    const depth = getCategoryDepth(cat.id, categories)
    setNewKind(depth === 0 ? 'root' : depth === 1 ? 'child' : 'grandchild')
    void loadCategorySeo(cat)
  }

  const onKindChange = (kind: NewKind) => {
    setNewKind(kind)
    if (!editing || editing.id) return
    if (kind === 'root') {
      setEditing({ ...editing, parent_id: null, is_featured: true })
    } else if (kind === 'child') {
      setEditing({ ...editing, parent_id: roots[0]?.id ?? null, is_featured: false })
    } else {
      const first = flatOptions.find((o) => o.depth === 1)
      setEditing({ ...editing, parent_id: first?.category.id ?? null, is_featured: false })
    }
  }

  const save = async () => {
    if (!supabase || !editing?.name?.trim()) {
      setError('Kategori adı zorunludur.')
      return
    }

    const parentId = editing.parent_id ?? null
    const depth = parentId === null ? 0 : getCategoryDepth(parentId, categories) + 1
    if (depth > MAX_CATEGORY_DEPTH) {
      setError('En fazla 3 seviye desteklenir (Ana › Alt › Detay).')
      return
    }

    setSaving(true)
    setMessage(null)
    setError(null)

    const id =
      editing.id ||
      suggestCategoryId(editing.name, parentId, categories)
    const slug = editing.slug?.trim() || slugify(editing.name)

    const row = {
      id,
      parent_id: parentId,
      name: editing.name.trim(),
      slug,
      description: editing.description?.trim() || null,
      image_url: editing.image_url,
      sort_order: editing.sort_order ?? 0,
      is_featured: depth === 0 ? (editing.is_featured ?? false) : false,
    }

    const { error: err } = await supabase.from('categories').upsert(row)

    if (err) {
      setSaving(false)
      setError(err.message)
      return
    }

    const pathNames = [
      ...getCategoryPath(parentId, categories).map((p) => p.name),
      row.name,
    ]
    const seoPayload = hasCustomSeo(seo)
      ? { ...seo, category_slug: slug }
      : buildDefaultCategorySeo(row.name, slug, row.description, pathNames)

    if (originalSlug && originalSlug !== slug) {
      await supabase.from('category_seo').delete().eq('category_slug', originalSlug)
    }

    const { error: seoErr } = await supabase.from('category_seo').upsert({
      ...seoPayload,
      category_slug: slug,
      updated_at: new Date().toISOString(),
    })

    setSaving(false)

    if (seoErr) {
      setError(`Kategori kaydedildi ancak SEO kaydı başarısız: ${seoErr.message}`)
      return
    }

    await regenerateSeoFiles()
    setMessage(editing.id ? 'Kategori ve SEO güncellendi. Sitemap güncellendi.' : 'Kategori eklendi. Sitemap güncellendi.')
    setEditing(null)
    setSeo(emptyCategorySeo(''))
    setOriginalSlug('')
    await refetch?.()
  }

  const remove = async (cat: Category) => {
    if (!supabase) return
    if (getChildren(cat.id).length > 0) {
      alert('Önce alt kategorileri silin veya taşıyın.')
      return
    }
    if (!confirm(`"${cat.name}" silinsin mi?`)) return
    await supabase.from('categories').delete().eq('id', cat.id)
    if (selectedId === cat.id) {
      setSelectedId(null)
      setEditing(null)
    }
    await refetch?.()
  }

  const renderTree = (items: Category[], depth = 0) => (
    <ul className={depth > 0 ? 'ml-4 border-l border-slate-200 pl-2 mt-0.5' : 'space-y-0.5'}>
      {items.map((cat) => {
        const children = getChildren(cat.id)
        const hasChildren = children.length > 0
        const isOpen = expanded.has(cat.id)
        const isSelected = selectedId === cat.id
        const canAddChild = depth < MAX_CATEGORY_DEPTH

        return (
          <li key={cat.id}>
            <div
              className={`group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors ${
                isSelected ? 'bg-amber-50 border border-amber-200' : 'hover:bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => hasChildren && toggleExpand(cat.id)}
                className={`w-5 h-5 flex items-center justify-center shrink-0 ${hasChildren ? 'text-slate-500' : 'invisible'}`}
              >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              <button type="button" onClick={() => startEdit(cat)} className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <LevelBadge depth={depth} />
                  <span className="text-sm font-medium text-slate-800 truncate">{cat.name}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate">/urunlerimiz/{cat.slug}</p>
              </button>

              <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                {canAddChild && (
                  <button
                    type="button"
                    title="Alt kategori ekle"
                    onClick={() =>
                      startNew(
                        depth === 0 ? 'child' : 'grandchild',
                        cat.id,
                      )
                    }
                    className="p-1.5 text-slate-400 hover:text-amber-600 rounded"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Düzenle"
                  onClick={() => startEdit(cat)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Sil"
                  onClick={() => remove(cat)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {hasChildren && isOpen && renderTree(children, depth + 1)}
          </li>
        )
      })}
    </ul>
  )

  const parentOptionsForKind = (kind: NewKind) => {
    if (kind === 'root') return []
    if (kind === 'child') return flatOptions.filter((o) => o.depth === 0)
    return flatOptions.filter((o) => o.depth === 1)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kategoriler</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            3 seviyeli yapı: <strong>Ana grup</strong> → <strong>Alt kategori</strong> → <strong>Detay</strong> (ürün galerisi).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => startNew('root')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-amber-300"
          >
            <Plus className="h-4 w-4" /> Ana Grup
          </button>
          <button
            type="button"
            onClick={() => startNew('child')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-amber-300"
          >
            <Plus className="h-4 w-4" /> Alt Kategori
          </button>
          <button
            type="button"
            onClick={() => startNew('grandchild')}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Detay Kategorisi
          </button>
        </div>
      </div>

      {/* Seviye açıklaması */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[0, 1, 2].map((d) => {
          const meta = getLevelMeta(d)
          return (
            <div key={d} className="rounded-xl border border-slate-200 bg-white p-4">
              <LevelBadge depth={d} />
              <p className="font-medium text-slate-800 text-sm mt-2">{meta.label}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{meta.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <FolderTree className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-medium text-slate-800">Kategori Ağacı</h2>
            <span className="text-xs text-slate-400 ml-auto">{categories.length} kayıt</span>
          </div>
          {loading ? (
            <p className="text-slate-400 text-sm">Yükleniyor...</p>
          ) : roots.length === 0 ? (
            <p className="text-slate-400 text-sm">Henüz kategori yok. Ana grup ekleyerek başlayın.</p>
          ) : (
            renderTree(roots)
          )}
        </div>

        <div className="xl:col-span-3">
          {editing ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 sticky top-6">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {editing.id ? 'Kategori Düzenle' : 'Yeni Kategori'}
                </h2>
                {!editing.id && (
                  <p className="text-xs text-slate-500 mt-1">Önce kategori türünü seçin, sonra üst kategoriyi belirleyin.</p>
                )}
              </div>

              {!editing.id && (
                <AdminField label="Kategori Türü" hint="Hangi seviyede kayıt oluşturduğunuzu seçin">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {NEW_KIND_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onKindChange(opt.id)}
                        className={`text-left rounded-lg border p-3 transition-colors ${
                          newKind === opt.id
                            ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-800">{opt.label}</span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{opt.hint}</p>
                      </button>
                    ))}
                  </div>
                </AdminField>
              )}

              {newKind !== 'root' && (
                <AdminField
                  label={newKind === 'child' ? 'Bağlı Olduğu Ana Grup' : 'Bağlı Olduğu Alt Kategori'}
                  hint={
                    newKind === 'child'
                      ? 'Bu kategori hangi ana grubun altında yer alacak?'
                      : 'Ürün görselleri bu detay kategorisinin sayfasında listelenir.'
                  }
                >
                  <AdminSelect
                    value={editing.parent_id ?? ''}
                    onChange={(e) =>
                      setEditing({ ...editing, parent_id: e.target.value || null })
                    }
                  >
                    <option value="">— Seçin —</option>
                    {parentOptionsForKind(newKind).map(({ category, path }) => (
                      <option key={category.id} value={category.id}>
                        {path}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>
              )}

              {(editingPath.length > 0 || editingDepth >= 0) && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-600 mb-1">Konum önizlemesi</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <LevelBadge depth={editingDepth} />
                    {editingPath.length > 0 ? (
                      <span className="text-sm font-medium text-slate-800">
                        {editingPath.map((p) => p.name).join(' › ')}
                        {!editing.id && editing.name && ` › ${editing.name}`}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-800">{editing.name || 'Yeni ana grup'}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{getLevelMeta(editingDepth).description}</p>
                </div>
              )}

              {!editing.id && editing.name && (
                <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                  Sistem ID:{' '}
                  <code className="text-slate-700">
                    {suggestCategoryId(editing.name, editing.parent_id ?? null, categories)}
                  </code>
                </div>
              )}

              <AdminField label="Kategori Adı">
                <AdminInput
                  value={editing.name ?? ''}
                  onChange={(e) => {
                    const name = e.target.value
                    setEditing({
                      ...editing,
                      name,
                      slug: editing.id ? editing.slug : slugify(name),
                    })
                  }}
                  placeholder="Örn: Kalemler, Kartvizit, Özel Kesim Modeller"
                />
              </AdminField>

              <AdminField
                label="URL Slug"
                hint={`Sayfa adresi: /urunlerimiz/${editing.slug || '...'}`}
              >
                <div className="flex gap-2 items-center">
                  <AdminInput
                    value={editing.slug ?? ''}
                    onChange={(e) => {
                      const slug = e.target.value
                      setEditing({ ...editing, slug })
                      setSeo((prev) => ({ ...prev, category_slug: slug }))
                    }}
                  />
                  {editing.slug && (
                    <a
                      href={`/urunlerimiz/${editing.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 p-2 text-slate-400 hover:text-amber-600"
                      title="Sayfayı aç"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </AdminField>

              <AdminField
                label="Açıklama"
                hint="Ürünler sayfası kartlarında ve arama sonuçlarında kullanılır (meta açıklama için önerilir)"
              >
                <AdminTextarea
                  value={editing.description ?? ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </AdminField>

              <div className="grid grid-cols-2 gap-4">
                <AdminField label="Sıra" hint="Listeleme sırası (küçük önce)">
                  <AdminInput
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, sort_order: Number(e.target.value) })
                    }
                  />
                </AdminField>
                {editingDepth === 0 && (
                  <AdminField label="Ana Sayfa">
                    <label className="flex items-center gap-2 text-sm text-slate-700 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        checked={editing.is_featured ?? false}
                        onChange={(e) =>
                          setEditing({ ...editing, is_featured: e.target.checked })
                        }
                      />
                      Kategori bandında göster
                    </label>
                  </AdminField>
                )}
              </div>

              <div className="border-t border-slate-200 pt-5">
                <CategorySeoFields
                  value={seo}
                  onChange={(patch) => setSeo((prev) => ({ ...prev, ...patch }))}
                  categoryName={editing.name ?? ''}
                  slug={editing.slug || slugify(editing.name ?? '')}
                  description={editing.description}
                  pathNames={[
                    ...editingPath.map((p) => p.name),
                    ...(editing.name ? [editing.name] : []),
                  ]}
                />
              </div>

              <SaveBar
                saving={saving}
                message={message}
                error={error}
                onSave={save}
              />
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setSeo(emptyCategorySeo(''))
                  setOriginalSlug('')
                  setMessage(null)
                  setError(null)
                }}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-1"
              >
                İptal
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
              <FolderTree className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Kategori seçin veya yeni ekleyin</p>
              <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                Ağaçtan bir kategoriye tıklayarak düzenleyin veya üstteki butonlarla yeni seviye ekleyin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
