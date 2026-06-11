import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnvServer() {
  try {
    const raw = readFileSync(join(__dirname, '../.env.server'), 'utf8')
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

loadEnvServer()

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL gerekli (.env.server)')
  process.exit(1)
}

const migrationsDir = join(__dirname, '../supabase/migrations')
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

const client = new pg.Client({ connectionString: databaseUrl })

try {
  await client.connect()
  console.log('Connected to database')

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    console.log(`Running ${file}...`)
    await client.query(sql)
    console.log(`  OK`)
  }

  console.log(`Done: ${files.length} migrations`)
} catch (e) {
  console.error('Migration failed:', e.message)
  process.exit(1)
} finally {
  await client.end()
}
