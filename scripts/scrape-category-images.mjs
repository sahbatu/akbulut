import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const map = JSON.parse(readFileSync(join(__dirname, 'legacy-category-map.json'), 'utf8'))
const BASE = 'http://akbulutltd.com'

async function scrapeImages(legacyId) {
  const res = await fetch(`${BASE}/icerik.aspx?id=${legacyId}`)
  const html = await res.text()
  const images = []
  const re =
    /href=['"]galeri\/buyuk\/([^'"]+)['"][^>]*>[\s\S]*?src=['"]galeri\/kucuk\/([^'"]+)['"]/gi
  let m
  while ((m = re.exec(html)) !== null) {
    images.push({
      full: `${BASE}/galeri/buyuk/${m[1]}`,
      thumb: `${BASE}/galeri/kucuk/${m[2]}`,
    })
  }
  return images
}

const rows = []
let sort = 0

for (const [categoryId, legacyId] of Object.entries(map)) {
  try {
    const images = await scrapeImages(legacyId)
    images.forEach((img, i) => {
      const id = `${categoryId}-${i + 1}`
      rows.push({ id, category_id: categoryId, thumb_url: img.thumb, full_url: img.full, sort_order: i + 1 })
    })
    console.log(`${categoryId}: ${images.length} images`)
  } catch (e) {
    console.error(`${categoryId}: failed`, e.message)
  }
}

const sql = [
  '-- Auto-generated category images from akbulutltd.com',
  'CREATE TABLE IF NOT EXISTS category_images (',
  '  id TEXT PRIMARY KEY,',
  '  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,',
  '  thumb_url TEXT NOT NULL,',
  '  full_url TEXT NOT NULL,',
  '  sort_order INT NOT NULL DEFAULT 0,',
  '  created_at TIMESTAMPTZ NOT NULL DEFAULT now()',
  ');',
  'CREATE INDEX IF NOT EXISTS idx_category_images_category ON category_images(category_id);',
  'ALTER TABLE category_images ENABLE ROW LEVEL SECURITY;',
  'DROP POLICY IF EXISTS "Public read category_images" ON category_images;',
  'CREATE POLICY "Public read category_images" ON category_images FOR SELECT USING (true);',
  '',
  'DELETE FROM category_images;',
  '',
]

for (const row of rows) {
  sql.push(
    `INSERT INTO category_images (id, category_id, thumb_url, full_url, sort_order) VALUES (` +
      `'${row.id}', '${row.category_id}', '${row.thumb_url}', '${row.full_url}', ${row.sort_order}` +
      `) ON CONFLICT (id) DO NOTHING;`,
  )
}

writeFileSync(
  join(__dirname, '../supabase/migrations/003b_category_images_seed.sql'),
  sql.join('\n'),
)
writeFileSync(join(__dirname, '../src/data/category-images.json'), JSON.stringify(rows, null, 2))
console.log(`Done: ${rows.length} images → 003b_category_images_seed.sql (opsiyonel)`)
