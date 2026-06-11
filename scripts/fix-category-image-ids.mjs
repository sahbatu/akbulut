/**
 * legacy-category-map slug ID'lerini seed.ts category id'lerine çevirir.
 * 003_category_images.sql ve category-images.json dosyalarını günceller.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const ID_MAP = {
  'p-ahsap-urunler': 'p-ahsap',
  'p-cakmak-kulluk': 'p-cakmak',
  'p-bloknot-promosyon': 'p-bloknot',
  'p-ruhsat-kabi': 'p-ruhsat',
  'p-usb-bellek': 'p-usb',
  'm-kabartma-kartvizit': 'm-kabartma',
  'm-kurumsal-kimlik': 'm-kurumsal',
  'm-antetli-kagitlar': 'm-antetli',
  'm-pantone-katalogu': 'm-pantone',
  'm-fatura-matbuatlar': 'm-fatura',
  'm-brosur-katalog': 'm-brosur',
  'm-mucellit-katlama': 'm-mucellit',
  'm-afis-poster': 'm-afis',
  'm-sunum-dosyasi': 'm-sunum',
  'm-klasor-kartela': 'm-klasor',
  'k-faber-castell': 'k-faber',
  'k-mont-blanc': 'k-montblanc',
  'bs-a4-tech': 'bs-a4tech',
  't-aluminyum-dekupe': 't-aluminyum',
  't-cam-arac-afis': 't-cam-arac',
  't-isikli-tabela': 't-isikli',
  't-isiksiz-tabela': 't-isiksiz',
  't-neon-let': 't-neon',
  'tm-tuvalet-kagidi': 'tm-tuvalet',
  'tm-rulo-kagit': 'tm-rulo',
  'g-sut-tozu': 'g-sut',
  'g-sivi-icecekler': 'g-icecek',
  'g-bitki-caylari': 'g-bitki',
}

function replaceIds(content) {
  let out = content
  for (const [wrong, right] of Object.entries(ID_MAP)) {
    out = out.replaceAll(`'${wrong}'`, `'${right}'`)
    out = out.replaceAll(`"${wrong}"`, `"${right}"`)
    out = out.replaceAll(`${wrong}-`, `${right}-`)
  }
  return out
}

const sqlPath = join(__dirname, '../supabase/migrations/003_category_images.sql')
const jsonPath = join(__dirname, '../src/data/category-images.json')

writeFileSync(sqlPath, replaceIds(readFileSync(sqlPath, 'utf8')))
writeFileSync(jsonPath, replaceIds(readFileSync(jsonPath, 'utf8')))

console.log('Fixed category IDs in:')
console.log(' -', sqlPath)
console.log(' -', jsonPath)
console.log('Mappings applied:', Object.keys(ID_MAP).length)
