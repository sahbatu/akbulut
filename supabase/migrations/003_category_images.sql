-- category_images tablosu (görseller admin panelden veya scrape script ile eklenir)
CREATE TABLE IF NOT EXISTS category_images (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  thumb_url TEXT NOT NULL,
  full_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_category_images_category ON category_images(category_id);

ALTER TABLE category_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read category_images" ON category_images;
CREATE POLICY "Public read category_images" ON category_images FOR SELECT USING (true);
