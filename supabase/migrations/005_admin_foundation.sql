-- Admin foundation: auth helpers, SEO, footer, RLS write policies, storage

-- Admin users (single admin: insert UUID after creating user in Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Contact submissions extensions
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- SEO pages
CREATE TABLE IF NOT EXISTS seo_pages (
  page_key TEXT PRIMARY KEY,
  title TEXT,
  meta_description TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  robots_index BOOLEAN NOT NULL DEFAULT true,
  robots_follow BOOLEAN NOT NULL DEFAULT true,
  json_ld JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Category SEO overrides
CREATE TABLE IF NOT EXISTS category_seo (
  category_slug TEXT PRIMARY KEY,
  title TEXT,
  meta_description TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  robots_index BOOLEAN NOT NULL DEFAULT true,
  robots_follow BOOLEAN NOT NULL DEFAULT true,
  json_ld JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Footer settings (single row)
CREATE TABLE IF NOT EXISTS footer_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_title TEXT NOT NULL DEFAULT 'Akbulut',
  brand_text TEXT NOT NULL DEFAULT '',
  copyright_text TEXT NOT NULL DEFAULT '',
  extra_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO footer_settings (id, brand_title, brand_text, copyright_text)
VALUES (
  1,
  'Akbulut',
  'Promosyon, matbaa, kırtasiye ve kurumsal çözümlerde 18 yıllık deneyim.',
  '© Akbulut Kırtasiye & Matbaa. Tüm hakları saklıdır.'
) ON CONFLICT (id) DO NOTHING;

-- Media slides (hero carousel)
CREATE TABLE IF NOT EXISTS media_slides (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Page sections (timeline, values, etc.)
CREATE TABLE IF NOT EXISTS page_sections (
  section_key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO page_sections (section_key, content) VALUES
  ('timeline', '[
    {"year":"2006","title":"Kuruluş","description":"Kadıköy Hasanpaşa''da faaliyete başladık."},
    {"year":"2010","title":"Matbaa Genişlemesi","description":"Tam kapsamlı matbaa hizmetleri eklendi."},
    {"year":"2015","title":"Kurumsal Çözümler","description":"B2B kurumsal müşteri portföyü genişledi."},
    {"year":"2020","title":"Dijital Dönüşüm","description":"Online katalog ve hızlı teklif süreçleri."},
    {"year":"2024","title":"Premium Hizmet","description":"Mont Blanc ve premium marka distribütörlüğü."}
  ]'::jsonb),
  ('values', '[
    {"icon":"◆","title":"Kalite","description":"Her ürün ve hizmette en yüksek standart."},
    {"icon":"◇","title":"Güven","description":"18 yıllık sektör deneyimi ve referanslar."},
    {"icon":"○","title":"Hız","description":"Hızlı üretim ve teslimat süreçleri."},
    {"icon":"□","title":"Çözüm","description":"İhtiyaca özel kurumsal çözümler."}
  ]'::jsonb),
  ('category_icons', '{"promosyon":"✦","matbaa":"◈","kirtasiye":"✎","bilgisayar-sarf":"⬡","tabela":"▣","temizlik":"◉","gida":"☕"}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- Default SEO pages
INSERT INTO seo_pages (page_key, title, meta_description, keywords) VALUES
  ('home', 'Akbulut | Kırtasiye, Matbaa & Promosyon', 'Akbulut Kırtasiye — Promosyon, Matbaa, Kırtasiye, Tabela ve Kurumsal Çözümler. Kadıköy İstanbul.', 'akbulut, kırtasiye, matbaa, promosyon, istanbul'),
  ('about', 'Hakkımızda | Akbulut', 'Akbulut Kırtasiye ve Matbaa hakkında bilgi edinin. Yılların deneyimi ile kurumsal çözümler.', 'hakkımızda, akbulut, kırtasiye'),
  ('products', 'Ürünlerimiz | Akbulut', 'Promosyon, matbaa, kırtasiye ve daha fazlası. Geniş ürün yelpazemizi keşfedin.', 'ürünler, katalog, promosyon'),
  ('contact', 'İletişim | Akbulut', 'Akbulut ile iletişime geçin. Teklif alın, sorularınızı iletin.', 'iletişim, teklif, adres'),
  ('category_template', '{category_name} | Akbulut', '{category_name} ürünlerimizi inceleyin. Akbulut kurumsal çözümler.', '{category_name}, akbulut')
ON CONFLICT (page_key) DO NOTHING;

-- Extended site settings
INSERT INTO site_settings (key, value) VALUES
  ('logo_url', '""'::jsonb),
  ('logo_alt', '"Akbulut"'::jsonb),
  ('favicon_url', '""'::jsonb),
  ('ga_measurement_id', '""'::jsonb),
  ('gtm_container_id', '""'::jsonb),
  ('seo_site_name', '"Akbulut"'::jsonb),
  ('seo_default_og_image', '""'::jsonb),
  ('seo_twitter_handle', '""'::jsonb),
  ('robots_txt', '"User-agent: *\nAllow: /"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS: admin_users
CREATE POLICY "Admin read own admin_users" ON admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- RLS: seo_pages
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read seo_pages" ON seo_pages FOR SELECT USING (true);
CREATE POLICY "Admin all seo_pages" ON seo_pages FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Public read category_seo" ON category_seo FOR SELECT USING (true);
CREATE POLICY "Admin all category_seo" ON category_seo FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Public read footer_settings" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Admin all footer_settings" ON footer_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Public read media_slides" ON media_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all media_slides" ON media_slides FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Public read page_sections" ON page_sections FOR SELECT USING (true);
CREATE POLICY "Admin all page_sections" ON page_sections FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Admin write policies on existing tables
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all site_settings" ON site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all announcements" ON announcements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all category_images" ON category_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin read contact_submissions" ON contact_submissions FOR SELECT USING (is_admin());
CREATE POLICY "Admin update contact_submissions" ON contact_submissions FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('brand', 'brand', true, 2097152, ARRAY['image/png','image/jpeg','image/webp','image/svg+xml','image/x-icon','image/vnd.microsoft.icon']),
  ('products', 'products', true, 5242880, ARRAY['image/png','image/jpeg','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read brand" ON storage.objects FOR SELECT USING (bucket_id = 'brand');
CREATE POLICY "Admin upload brand" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand' AND is_admin());
CREATE POLICY "Admin update brand" ON storage.objects FOR UPDATE USING (bucket_id = 'brand' AND is_admin());
CREATE POLICY "Admin delete brand" ON storage.objects FOR DELETE USING (bucket_id = 'brand' AND is_admin());

CREATE POLICY "Public read products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin upload products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND is_admin());
CREATE POLICY "Admin update products" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND is_admin());
CREATE POLICY "Admin delete products" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND is_admin());
