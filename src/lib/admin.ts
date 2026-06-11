import { supabase } from '@/lib/supabase'

export async function upsertSiteSetting(key: string, value: unknown) {
  if (!supabase) throw new Error('Supabase yapılandırılmamış')
  const { error } = await supabase.from('site_settings').upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function upsertSiteSettings(entries: Record<string, unknown>) {
  for (const [key, value] of Object.entries(entries)) {
    await upsertSiteSetting(key, value)
  }
}

/** Dev sunucusunda public/robots.txt ve sitemap.xml dosyalarını yeniden üretir */
export async function regenerateSeoFiles(): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch('/__seo/regenerate', { method: 'POST' })
    const data = (await res.json()) as { ok?: boolean; error?: string }
    if (res.ok && data.ok) {
      return { ok: true, detail: 'robots.txt ve sitemap.xml dosyaları güncellendi.' }
    }
    return { ok: false, detail: data.error ?? 'Dosya üretimi başarısız.' }
  } catch {
    return {
      ok: false,
      detail: 'Canlı site için deploy öncesi npm run seo:generate çalıştırın.',
    }
  }
}

export async function uploadFile(
  bucket: 'brand' | 'products',
  path: string,
  file: File,
) {
  if (!supabase) throw new Error('Supabase yapılandırılmamış')
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type || undefined,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteStorageFile(bucket: 'brand' | 'products', path: string) {
  if (!supabase) throw new Error('Supabase yapılandırılmamış')
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!supabase || !userId) return false

  const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin')
  if (!rpcError && typeof rpcData === 'boolean') return rpcData

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (import.meta.env.DEV && error) {
    console.warn('[admin] checkIsAdmin:', error.message)
  }

  return !error && Boolean(data)
}
