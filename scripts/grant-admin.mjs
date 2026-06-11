/**
 * Admin yetkisi verir.
 * Kullanım: npm run admin:grant -- email@ornek.com
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv(path) {
  try {
    const raw = readFileSync(path, 'utf8')
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const i = t.indexOf('=')
      if (i === -1) continue
      const key = t.slice(0, i)
      const val = t.slice(i + 1)
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    /* optional */
  }
}

loadEnv(join(__dirname, '../.env'))
loadEnv(join(__dirname, '../.env.server'))

const email = process.argv[2]
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://akbulut.gozcucloud.com'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const databaseUrl = process.env.DATABASE_URL

if (!email) {
  console.error('Kullanım: npm run admin:grant -- email@ornek.com')
  process.exit(1)
}

async function viaPostgres() {
  if (!databaseUrl) return false
  const client = new pg.Client({ connectionString: databaseUrl })
  await client.connect()

  const userRes = await client.query(
    'SELECT id, email FROM auth.users WHERE email = $1',
    [email],
  )
  if (userRes.rows.length === 0) {
    console.error(`Kullanıcı bulunamadı: ${email}`)
    console.log('\nMevcut kullanıcılar:')
    const all = await client.query('SELECT id, email FROM auth.users ORDER BY created_at')
    all.rows.forEach((r) => console.log(`  - ${r.email} (${r.id})`))
    await client.end()
    process.exit(1)
  }

  const userId = userRes.rows[0].id
  await client.query(
    'INSERT INTO admin_users (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
    [userId],
  )

  const check = await client.query('SELECT * FROM admin_users WHERE user_id = $1', [userId])
  await client.end()

  console.log(`Admin yetkisi verildi: ${email}`)
  console.log(`UUID: ${userId}`)
  console.log('admin_users kaydı:', check.rows[0])
  return true
}

async function viaServiceRole() {
  if (!serviceKey) return false
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: users, error: listErr } = await admin.auth.admin.listUsers()
  if (listErr) throw listErr

  const user = users.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
  if (!user) {
    console.error(`Kullanıcı bulunamadı: ${email}`)
    console.log('\nMevcut kullanıcılar:')
    users.users.forEach((u) => console.log(`  - ${u.email} (${u.id})`))
    process.exit(1)
  }

  const { error } = await admin.from('admin_users').upsert({ user_id: user.id })
  if (error) throw error

  console.log(`Admin yetkisi verildi: ${email}`)
  console.log(`UUID: ${user.id}`)
  return true
}

try {
  if (await viaPostgres()) process.exit(0)
  if (await viaServiceRole()) process.exit(0)
  console.error('.env.server içinde DATABASE_URL veya SUPABASE_SERVICE_ROLE_KEY gerekli')
  process.exit(1)
} catch (e) {
  console.error('Hata:', e.message)
  if (e.message?.includes('admin_users')) {
    console.error('\nÖnce migration çalıştırın: npm run db:migrate')
  }
  process.exit(1)
}
