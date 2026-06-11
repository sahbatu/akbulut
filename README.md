# Akbulut Premium Web Sitesi

Modern, premium kurumsal web sitesi — Vite + React + TypeScript + Supabase.

## Geliştirme

```bash
npm install
npm run dev
```

## Supabase Kurulumu

1. [Supabase](https://supabase.com) üzerinde yeni proje oluşturun
2. SQL Editor'de sırasıyla çalıştırın:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_seed.sql`
   - `supabase/migrations/003_category_images.sql`
   - `supabase/migrations/004_category_image_title.sql`
   - `supabase/migrations/005_admin_foundation.sql`
3. `.env` dosyasını düzenleyin (Vite projesi — `NEXT_PUBLIC_` değil `VITE_` kullanın):

```env
VITE_SUPABASE_URL=https://akbulut.gozcucloud.com
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Yerel Kong: `VITE_SUPABASE_URL=http://127.0.0.1:8012`

4. Migration'ları veritabanına uygulayın:

```bash
# .env.server.example → .env.server (DATABASE_URL + service role)
npm run db:migrate
```

Supabase yapılandırılmazsa site fallback seed verisiyle çalışır.

> **Güvenlik:** `SUPABASE_SERVICE_ROLE_KEY` ve `DATABASE_URL` asla frontend `.env` dosyasına yazılmamalıdır. Sadece `.env.server` (gitignore'da) kullanın.

## Admin Panel Kurulumu

1. Supabase Dashboard → Authentication → Users → yeni kullanıcı oluşturun (e-posta + şifre, **Auto Confirm** açık)
2. Admin yetkisi verin — **yöntem A (terminal, önerilen):**

```bash
npm run admin:grant -- sizin@email.com
```

**yöntem B (SQL Editor):**

```sql
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'sizin@email.com'
ON CONFLICT (user_id) DO NOTHING;
```

3. `/admin/login` adresinden giriş yapın

### Admin Modülleri

- **Panel** — özet ve hızlı erişim
- **Ürünler** — kategori bazlı görsel yükleme, ürün adı, sıralama
- **Kategoriler** — kategori ağacı CRUD
- **İletişim** — adres, telefon, e-posta, harita
- **Mesajlar** — iletişim formu gelen kutusu
- **Logo & Favicon** — marka görselleri
- **Footer** — alt bilgi metinleri
- **SEO** — sayfa bazlı meta, GA4, GTM
- **Duyurular** — ana sayfa duyuruları
- **İçerik** — hero slider, zaman çizelgesi, değerler

## Sayfalar

- `/` — Ana Sayfa
- `/hakkimizda` — Hakkımızda
- `/urunlerimiz` — Ürünlerimiz
- `/urunlerimiz/:slug` — Kategori detay
- `/iletisim` — İletişim
- `/admin` — Yönetim paneli

## Build

```bash
npm run build
npm run preview
```
