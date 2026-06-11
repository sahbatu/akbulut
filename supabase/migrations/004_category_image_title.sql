-- Ürün adı alanı
ALTER TABLE category_images ADD COLUMN IF NOT EXISTS title TEXT;
