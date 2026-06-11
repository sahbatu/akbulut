export function getSiteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined
  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://akbulutltd.com'
}

export function parseSettingValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value.replace(/^"|"$/g, '')
  return String(value)
}

/** Google uyumlu robots.txt — Sitemap ve /admin/ disallow her zaman eklenir/güncellenir */
export function buildRobotsTxt(customContent: string | null | undefined, siteUrl?: string) {
  const origin = (siteUrl || getSiteOrigin()).replace(/\/$/, '')
  let robots = customContent?.trim() || 'User-agent: *\nAllow: /'

  if (!/^User-agent:/im.test(robots)) {
    robots = `User-agent: *\nAllow: /\n\n${robots}`
  }

  if (!/Disallow:\s*\/admin\/?/im.test(robots)) {
    robots += '\n\nDisallow: /admin/'
  }

  const sitemapLine = `Sitemap: ${origin}/sitemap.xml`
  if (!/^Sitemap:/im.test(robots)) {
    robots += `\n\n${sitemapLine}`
  } else {
    robots = robots.replace(/^Sitemap:.*$/gim, sitemapLine)
  }

  return `${robots.trim()}\n`
}
