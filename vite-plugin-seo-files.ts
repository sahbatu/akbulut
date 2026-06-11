import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

export function seoFilesPlugin(rootDir: string): Plugin {
  const publicDir = join(rootDir, 'public')
  const robotsPath = join(publicDir, 'robots.txt')
  const sitemapPath = join(publicDir, 'sitemap.xml')

  const runGenerate = (quiet = false) => {
    execSync('node scripts/generate-seo-files.mjs', {
      cwd: rootDir,
      stdio: quiet ? 'ignore' : 'inherit',
    })
  }

  const seoFilesExist = () => existsSync(robotsPath) && existsSync(sitemapPath)

  const serveFile = (res: import('http').ServerResponse, filename: 'robots.txt' | 'sitemap.xml') => {
    const filePath = join(publicDir, filename)
    if (!existsSync(filePath)) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    const content = readFileSync(filePath, 'utf8')
    res.setHeader(
      'Content-Type',
      filename === 'robots.txt' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8',
    )
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.end(content)
  }

  let command: 'build' | 'serve' = 'serve'

  return {
    name: 'seo-files',
    configResolved(config) {
      command = config.command
    },
    buildStart() {
      // Dev'de her açılışta üretme — eskisi gibi hızlı ve sessiz başlasın.
      // Build'de her zaman güncelle; dev'de yalnızca dosyalar yoksa bir kez üret.
      if (command === 'build') {
        runGenerate()
        return
      }
      if (!seoFilesExist()) {
        runGenerate(true)
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]

        if (url === '/robots.txt') {
          serveFile(res, 'robots.txt')
          return
        }

        if (url === '/sitemap.xml') {
          serveFile(res, 'sitemap.xml')
          return
        }

        if (url === '/__seo/regenerate' && req.method === 'POST') {
          try {
            runGenerate()
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                ok: false,
                error: err instanceof Error ? err.message : 'Üretim başarısız',
              }),
            )
          }
          return
        }

        next()
      })
    },
  }
}
