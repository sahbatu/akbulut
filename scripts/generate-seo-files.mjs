/**
 * Google uyumlu robots.txt ve sitemap.xml üretir → public/
 * Çalıştırma: npm run seo:generate
 * Build öncesi otomatik çalışır.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '../public')

function loadEnvFile(filename) {
  try {
    const raw = readFileSync(join(__dirname, '..', filename), 'utf8')
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const i = t.indexOf('=')
      if (i === -1) continue
      const key = t.slice(0, i).trim()
      const val = t.slice(i + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    /* optional */
  }
}

loadEnvFile('.env')
loadEnvFile('.env.server')

const SITE_URL = (process.env.VITE_SITE_URL || 'https://akbulutltd.com').replace(/\/$/, '')

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/hakkimizda', priority: '0.8', changefreq: 'monthly' },
  { path: '/urunlerimiz', priority: '0.9', changefreq: 'weekly' },
  { path: '/iletisim', priority: '0.7', changefreq: 'monthly' },
  { path: '/kvkk', priority: '0.3', changefreq: 'yearly' },
  { path: '/cerez-politikasi', priority: '0.3', changefreq: 'yearly' },
]

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastmod(date) {
  return new Date(date).toISOString().slice(0, 10)
}

function parseJsonSetting(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value.replace(/^"|"$/g, '')
  return String(value)
}

function buildRobotsTxt(customContent) {
  let robots = customContent?.trim() || 'User-agent: *\nAllow: /'

  if (!/^User-agent:/im.test(robots)) {
    robots = `User-agent: *\nAllow: /\n\n${robots}`
  }

  if (!/Disallow:\s*\/admin\/?/im.test(robots)) {
    robots += '\n\nDisallow: /admin/'
  }

  const sitemapLine = `Sitemap: ${SITE_URL}/sitemap.xml`
  if (!/^Sitemap:/im.test(robots)) {
    robots += `\n\n${sitemapLine}`
  } else {
    robots = robots.replace(/^Sitemap:.*$/gim, sitemapLine)
  }

  return `${robots.trim()}\n`
}

function buildSitemap(categories) {
  const today = formatLastmod(new Date())
  const urls = STATIC_PAGES.map((page) => ({
    loc: `${SITE_URL}${page.path}`,
    lastmod: today,
    changefreq: page.changefreq,
    priority: page.priority,
  }))

  for (const cat of categories) {
    urls.push({
      loc: `${SITE_URL}/urunlerimiz/${cat.slug}`,
      lastmod: formatLastmod(cat.created_at || new Date()),
      changefreq: 'weekly',
      priority: '0.6',
    })
  }

  const body = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

function loadCategoriesFromSeedFallback() {
  try {
    const sql = readFileSync(join(__dirname, '../supabase/migrations/002_seed.sql'), 'utf8')
    const slugs = new Set()
    const blocks = sql.match(/INSERT INTO categories[\s\S]*?;/g) || []
    const re = /\('[^']+',\s*(?:NULL|'[^']*'),\s*'[^']*',\s*'([^']+)'/g
    for (const block of blocks) {
      let match
      while ((match = re.exec(block)) !== null) {
        const slug = match[1]
        if (!/^\d{4}-\d{2}-\d{2}$/.test(slug)) slugs.add(slug)
      }
    }
    return [...slugs].map((slug) => ({ slug, created_at: new Date() }))
  } catch {
    return []
  }
}

async function fetchFromDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return null

  const client = new pg.Client({ connectionString: databaseUrl })
  await client.connect()

  try {
    const [categoriesRes, robotsRes] = await Promise.all([
      client.query('SELECT slug, created_at FROM categories ORDER BY sort_order'),
      client.query(`SELECT value FROM site_settings WHERE key = 'robots_txt'`),
    ])

    const robotsTxt = robotsRes.rows[0]
      ? parseJsonSetting(robotsRes.rows[0].value)
      : null

    return { categories: categoriesRes.rows, robotsTxt }
  } finally {
    await client.end()
  }
}

async function fetchFromSupabaseApi() {
  const baseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !anonKey) return null

  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  }

  const [categoriesRes, robotsRes] = await Promise.all([
    fetch(`${baseUrl}/rest/v1/categories?select=slug,created_at&order=sort_order`, { headers }),
    fetch(`${baseUrl}/rest/v1/site_settings?key=eq.robots_txt&select=value`, { headers }),
  ])

  if (!categoriesRes.ok) throw new Error(`categories: ${categoriesRes.status}`)
  if (!robotsRes.ok) throw new Error(`site_settings: ${robotsRes.status}`)

  const categories = await categoriesRes.json()
  const robotsRows = await robotsRes.json()

  return {
    categories,
    robotsTxt: robotsRows[0] ? parseJsonSetting(robotsRows[0].value) : null,
  }
}

async function main() {
  console.log(`SEO dosyaları üretiliyor (site: ${SITE_URL})`)

  let categories = []
  let robotsTxt = null

  try {
    const dbData = await fetchFromDatabase()
    if (dbData) {
      categories = dbData.categories
      robotsTxt = dbData.robotsTxt
      console.log(`  ${categories.length} kategori (PostgreSQL)`)
    } else {
      throw new Error('DATABASE_URL tanımlı değil')
    }
  } catch (dbErr) {
    console.warn(`  PostgreSQL: ${dbErr instanceof Error ? dbErr.message : dbErr}`)
    try {
      const apiData = await fetchFromSupabaseApi()
      if (apiData) {
        categories = apiData.categories
        robotsTxt = apiData.robotsTxt
        console.log(`  ${categories.length} kategori (Supabase API)`)
      } else {
        throw new Error('Supabase API yapılandırılmamış')
      }
    } catch (apiErr) {
      console.warn(`  Supabase API: ${apiErr instanceof Error ? apiErr.message : apiErr}`)
      categories = loadCategoriesFromSeedFallback()
      console.log(`  ${categories.length} kategori (seed yedek)`)
    }
  }

  const robots = buildRobotsTxt(robotsTxt)
  const sitemap = buildSitemap(categories)

  writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf8')
  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')

  console.log('  ✓ public/robots.txt')
  console.log('  ✓ public/sitemap.xml')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
