import type { Announcement, Category, SiteSettings } from '@/types'

export const siteSettings: SiteSettings = {
  company_name: 'Akbulut Kırtasiye Malzemeleri İnşaat ve Gıda Paz. Tic. Ltd. Şti.',
  tagline: '18 Yıllık Güven, Sınırsız Çözüm',
  about_short:
    '18 yıldır faaliyette bulunan ve hizmet kalitesindeki titizliği ile memnuniyeti sağlamaya azami özen gösteren firmamız, çalışmalarını başarıyla sürdürmektedir. Eksiksiz olarak zamanında teslimi, titizlikte takip ve kontrol ettiğimiz bir unsurdur.',
  about_full: `18 yıldır faaliyette bulunan ve hizmet kalitesindeki titizliği ile memnuniyeti sağlamaya azami özen gösteren firmamız, çalışmalarını başarıyla sürdürmektedir.

Faaliyet konularımız:
• Tüm Promosyon Malzemeleri, Matbaa ve Reklam işleri
• Işıklı İlan Panoları, Tabela ve Totem işleri
• Bilgisayar Sarf Malzemeleri (Kartuş, Toner, Şerit, vb.)
• Her Türlü Kırtasiye Malzemeleri

Sipariş edilen ürün ve hizmetlerin daima arzu edilen kalitede ve eksiksiz olarak zamanında teslimi, titizlikte takip ve kontrol ettiğimiz bir unsurdur.

Web sayfamızda sunduğumuz hizmetlere ilişkin fiyat teklifleri, yapacağınız talebe göre en kısa sürede ve firmanıza uygun olarak hazırlanıp bilginize sunulacaktır.

Ürün ve Hizmetlerimizin tarafınıza, karşılıklı görüşme ile sunumunu talep etmekteyiz. Bu çerçevede şirketinizin tür ve miktar olarak saptanacak talepleri doğrultusunda, makul olan en ekonomik teklifin verileceğini taahhüt ederiz.

Firmamız kazancı değil başarı ve paylaşımı öncelikli prensip edinmiştir. Firmanıza en iyi hizmeti verebilmek bizleri mutlu edecektir.`,
  address: 'Eğitim mah. Poyraz sk. No:12/B Hasanpaşa / Kadıköy / İstanbul',
  phones: ['0216 449 32 35', '0216 550 46 32', '0216 550 46 33'],
  fax: '0216 449 32 36',
  email: 'info@akbulutltd.com',
  map_embed_url:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.0!2d29.027!3d40.992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU5JzMxLjIiTiAyOcKwMDEnMzcuMiJF!5e0!3m2!1str!2str!4v1',
  years_experience: 18,
  logo_url: '',
  logo_alt: 'Akbulut',
  favicon_url: '',
  ga_measurement_id: '',
  gtm_container_id: '',
  seo_site_name: 'Akbulut',
  seo_default_og_image: '',
  seo_twitter_handle: '',
  robots_txt: 'User-agent: *\nAllow: /\n\nDisallow: /admin/\n\nSitemap: https://akbulutltd.com/sitemap.xml',
}

export const footerSettingsFallback = {
  brand_title: 'Akbulut',
  brand_text: 'Promosyon, matbaa, kırtasiye ve kurumsal çözümlerde 18 yıllık deneyim.',
  copyright_text: `© ${new Date().getFullYear()} Akbulut Reklam & Baskı Org. ve Kırtasiye Mlz. Ltd. Şti. Tüm hakları saklıdır.`,
  extra_links: [] as { label: string; url: string }[],
}

export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Temizlik Malzemeleri',
    excerpt:
      'Sıvı sabun, deterjan, havlu, tuvalet kağıdı gibi temizlik malzemesi ihtiyaçlarınız firmamız tarafından sağlanmaktadır.',
    published_at: '2014-06-09',
  },
  {
    id: '2',
    title: 'Ofis Gıda Malzemeleri',
    excerpt:
      'Çay, şeker, kahve, süt tozu, içecekler ve her türlü ofis gıda malzemeleri satışlarımız başlamıştır.',
    published_at: '2014-06-09',
  },
]

const cat = (
  id: string,
  parent_id: string | null,
  name: string,
  slug: string,
  sort_order: number,
  description: string | null = null,
  is_featured = false,
): Category => ({
  id,
  parent_id,
  name,
  slug,
  description,
  image_url: null,
  sort_order,
  is_featured,
})

export const categories: Category[] = [
  cat('promosyon', null, 'Promosyon Grubu', 'promosyon', 1, 'Kurumsal promosyon ve hediye ürünleri', true),
  cat('matbaa', null, 'Matbaa Grubu', 'matbaa', 2, 'Kartvizit, broşür, katalog ve matbaa hizmetleri', true),
  cat('kirtasiye', null, 'Kırtasiye Grubu', 'kirtasiye', 3, 'Ofis ve kırtasiye malzemeleri', true),
  cat('bilgisayar-sarf', null, 'Bilgisayar Sarf Malz.', 'bilgisayar-sarf', 4, 'Kartuş, toner ve yazıcı sarf malzemeleri', true),
  cat('tabela', null, 'Tabela Grubu', 'tabela', 5, 'Işıklı ve ışıksız tabela çözümleri', true),
  cat('temizlik', null, 'Temizlik Malzemeleri', 'temizlik', 6, 'Ofis temizlik ürünleri', true),
  cat('gida', null, 'Gıda Malzemeleri', 'gida', 7, 'Ofis gıda ve içecek ürünleri', true),

  cat('p-masa-setleri', 'promosyon', 'Masa Setleri', 'masa-setleri', 1),
  cat('p-kristal', 'promosyon', 'Kristal', 'kristal', 2),
  cat('p-duvar-saatleri', 'promosyon', 'Duvar Saatleri', 'duvar-saatleri', 3),
  cat('p-kalemler', 'promosyon', 'Kalemler', 'kalemler', 4),
  cat('p-anahtarliklar', 'promosyon', 'Anahtarlıklar', 'anahtarliklar', 5),
  cat('p-ahsap', 'promosyon', 'Ahşap Ürünler', 'ahsap-urunler', 6),
  cat('p-kartvizitlikler', 'promosyon', 'Kartvizitlikler', 'kartvizitlikler', 7),
  cat('p-cakmak', 'promosyon', 'Çakmak-Küllük', 'cakmak-kulluk', 8),
  cat('p-ajandalar', 'promosyon', 'Ajandalar', 'ajandalar', 9),
  cat('p-fihristler', 'promosyon', 'Fihristler', 'fihristler', 10),
  cat('p-sekreterlik', 'promosyon', 'Sekreterlik', 'sekreterlik', 11),
  cat('p-masa-sumeni', 'promosyon', 'Masa Sümeni', 'masa-sumeni', 12),
  cat('p-takvimler', 'promosyon', 'Takvimler', 'takvimler', 13),
  cat('p-bloknot', 'promosyon', 'Bloknot', 'bloknot-promosyon', 14),
  cat('p-sapkalar', 'promosyon', 'Şapkalar', 'sapkalar', 15),
  cat('p-cantalar', 'promosyon', 'Çantalar', 'cantalar', 16),
  cat('p-ruhsat', 'promosyon', 'Ruhsat Kabı', 'ruhsat-kabi', 17),
  cat('p-usb', 'promosyon', 'Usb Bellek', 'usb-bellek', 18),

  cat('m-kartvizit', 'matbaa', 'Kartvizit', 'kartvizit', 1, 'Özel kesim, gofre ve varak baskı seçenekleriyle kartvizit üretimi'),
  cat('m-kabartma', 'matbaa', 'Kabartma Kartvizit', 'kabartma-kartvizit', 2),
  cat('m-kurumsal', 'matbaa', 'Kurumsal Kimlik Çalışması', 'kurumsal-kimlik', 3),
  cat('m-antetli', 'matbaa', 'Antetli Kağıtlar', 'antetli-kagitlar', 4),
  cat('m-pantone', 'matbaa', 'Pantone Kataloğu', 'pantone-katalogu', 5),
  cat('m-zarflar', 'matbaa', 'Zarflar', 'zarflar', 6),
  cat('m-fatura', 'matbaa', 'Fatura ve Matbuatlar', 'fatura-matbuatlar', 7),
  cat('m-brosur', 'matbaa', 'Broşür & Katalog', 'brosur-katalog', 8),
  cat('m-mucellit', 'matbaa', 'Mücellit Katlama Modelleri', 'mucellit-katlama', 9),
  cat('m-olculer-matbaa', 'matbaa', 'Ölçüler Hakkında', 'olculer-hakkinda-matbaa', 10),
  cat('m-kagitlar-kullanilan', 'matbaa', 'Kullanılan Kağıtlar Hakkında', 'kullanilan-kagitlar-hakkinda', 11),
  cat('m-afis', 'matbaa', 'Afiş & Poster', 'afis-poster', 12),
  cat('m-sunum', 'matbaa', 'Sunum Dosyası', 'sunum-dosyasi', 13),
  cat('m-klasor', 'matbaa', 'Klasör ve Kartela', 'klasor-kartela', 14),
  cat('m-kup-bloknot', 'matbaa', 'Bloknot ve Küp Bloknot', 'kup-bloknot', 15),

  // Matbaa — 3. seviye (Kartvizit)
  cat('m-kartvizit-ornekler', 'm-kartvizit', 'Kartvizitten Örneklemeler', 'kartvizitten-orneklemeler', 1),
  cat('m-kartvizit-ozel-kesim', 'm-kartvizit', 'Özel Kesim Modeller', 'ozel-kesim-modeller', 2),

  // Matbaa — 3. seviye (Zarflar)
  cat('m-zarf-yazisma', 'm-zarflar', 'Yazışma Zarfları', 'yazisma-zarflari', 1),
  cat('m-zarf-torba', 'm-zarflar', 'Torba Zarfı', 'torba-zarfi', 2),
  cat('m-zarf-davetiye', 'm-zarflar', 'Davetiye Zarfı', 'davetiye-zarfi', 3),
  cat('m-zarf-cd', 'm-zarflar', 'CD Zarfı', 'cd-zarfi', 4),
  cat('m-zarf-hava', 'm-zarflar', 'Hava Kabarcıklı Zarf', 'hava-kabarcikli-zarf', 5),
  cat('m-zarf-ipli', 'm-zarflar', 'İpli ve Körüklü Zarf', 'ipli-koruklu-zarf', 6),

  // Matbaa — 3. seviye (Broşür & Katalog)
  cat('m-brosur-modelleri', 'm-brosur', 'Broşür & Katalog Modelleri', 'brosur-katalog-modelleri', 1),

  // Matbaa — 3. seviye (Sunum Dosyası)
  cat('m-sunum-dosya-modelleri', 'm-sunum', 'Dosya Modelleri', 'dosya-modelleri', 1),
  cat('m-sunum-ornek', 'm-sunum', 'Örnek Çalışma', 'ornek-calisma', 2),
  cat('m-sunum-olculer', 'm-sunum', 'Ölçüler Hakkında', 'olculer-hakkinda-sunum', 3),
  cat('m-sunum-kagitlar', 'm-sunum', 'Kağıtlar Hakkında', 'kagitlar-hakkinda-sunum', 4),

  // Matbaa — 3. seviye (Klasör ve Kartela)
  cat('m-klasor-hakkinda', 'm-klasor', 'Klasör Hakkında', 'klasor-hakkinda', 1),
  cat('m-klasor-ornekler', 'm-klasor', 'Örnekler', 'klasor-ornekler', 2),
  cat('m-klasor-aksesuarlar', 'm-klasor', 'Aksesuarlar', 'klasor-aksesuarlar', 3),
  cat('m-klasor-teknik', 'm-klasor', 'Teknik Bilgiler', 'klasor-teknik-bilgiler', 4),

  cat('k-leitz', 'kirtasiye', 'Leitz', 'leitz', 1),
  cat('k-esselte', 'kirtasiye', 'Esselte', 'esselte', 2),
  cat('k-3m', 'kirtasiye', '3M', '3m', 3),
  cat('k-casio', 'kirtasiye', 'Casio', 'casio', 4),
  cat('k-faber', 'kirtasiye', 'Faber Castell', 'faber-castell', 5),
  cat('k-scrikss', 'kirtasiye', 'Scrikss', 'scrikss', 6),
  cat('k-cross', 'kirtasiye', 'Cross', 'cross', 7),
  cat('k-pentel', 'kirtasiye', 'Pentel', 'pentel', 8),
  cat('k-pilot', 'kirtasiye', 'Pilot', 'pilot', 9),
  cat('k-uhu', 'kirtasiye', 'Uhu', 'uhu', 10),
  cat('k-yener', 'kirtasiye', 'Yener', 'yener', 11),
  cat('k-montblanc', 'kirtasiye', 'Mont Blanc', 'mont-blanc', 12),
  cat('k-pritt', 'kirtasiye', 'Pritt', 'pritt', 13),
  cat('k-uni', 'kirtasiye', 'Uni', 'uni', 14),
  cat('k-sarff', 'kirtasiye', 'Sarff', 'sarff', 15),
  cat('k-dahle', 'kirtasiye', 'Dahle', 'dahle', 16),
  cat('k-trodat', 'kirtasiye', 'Trodat', 'trodat', 17),
  cat('k-sirdas', 'kirtasiye', 'Sırdaş', 'sirdas', 18),

  cat('bs-hp', 'bilgisayar-sarf', 'HP', 'hp', 1),
  cat('bs-oki', 'bilgisayar-sarf', 'Oki', 'oki', 2),
  cat('bs-epson', 'bilgisayar-sarf', 'Epson', 'epson', 3),
  cat('bs-panasonic', 'bilgisayar-sarf', 'Panasonic', 'panasonic', 4),
  cat('bs-canon', 'bilgisayar-sarf', 'Canon', 'canon', 5),
  cat('bs-lexmark', 'bilgisayar-sarf', 'Lexmark', 'lexmark', 6),
  cat('bs-brother', 'bilgisayar-sarf', 'Brother', 'brother', 7),
  cat('bs-mita', 'bilgisayar-sarf', 'Mita', 'mita', 8),
  cat('bs-maxell', 'bilgisayar-sarf', 'Maxell', 'maxell', 9),
  cat('bs-minolta', 'bilgisayar-sarf', 'Minolta', 'minolta', 10),
  cat('bs-samsung', 'bilgisayar-sarf', 'Samsung', 'samsung', 11),
  cat('bs-xerox', 'bilgisayar-sarf', 'Xerox', 'xerox', 12),
  cat('bs-a4tech', 'bilgisayar-sarf', 'A4 Tech', 'a4-tech', 13),
  cat('bs-microsoft', 'bilgisayar-sarf', 'Microsoft', 'microsoft', 14),
  cat('bs-dell', 'bilgisayar-sarf', 'Dell', 'dell', 15),
  cat('bs-imation', 'bilgisayar-sarf', 'İmation', 'imation', 16),
  cat('bs-philips', 'bilgisayar-sarf', 'Philips', 'philips', 17),
  cat('bs-ibm', 'bilgisayar-sarf', 'IBM', 'ibm', 18),

  cat('t-aluminyum', 'tabela', 'Alüminyum Dekupe', 'aluminyum-dekupe', 1),
  cat('t-cam-arac', 'tabela', 'Cam, Araç ve Afiş Yazısı', 'cam-arac-afis', 2),
  cat('t-isikli', 'tabela', 'Işıklı Tabela', 'isikli-tabela', 3),
  cat('t-isiksiz', 'tabela', 'Işıksız Tabela', 'isiksiz-tabela', 4),
  cat('t-neon', 'tabela', 'Neon-Let', 'neon-let', 5),
  cat('t-paslanmaz', 'tabela', 'Paslanmaz', 'paslanmaz', 6),
  cat('t-totem', 'tabela', 'Totem', 'totem', 7),
  cat('t-yonlendirme', 'tabela', 'Yönlendirme', 'yonlendirme', 8),

  cat('tm-sivi-sabun', 'temizlik', 'Sıvı Sabun', 'sivi-sabun', 1),
  cat('tm-deterjan', 'temizlik', 'Deterjan', 'deterjan', 2),
  cat('tm-tuvalet', 'temizlik', 'Tuvalet Kağıdı', 'tuvalet-kagidi', 3),
  cat('tm-rulo', 'temizlik', 'Rulo Kağıt', 'rulo-kagit', 4),
  cat('tm-pecete', 'temizlik', 'Peçete', 'pecete', 5),
  cat('tm-havlu', 'temizlik', 'Havlu', 'havlu', 6),

  cat('g-cay', 'gida', 'Çay', 'cay', 1),
  cat('g-seker', 'gida', 'Şeker', 'seker', 2),
  cat('g-kahve', 'gida', 'Kahve', 'kahve', 3),
  cat('g-sut', 'gida', 'Süt Tozu', 'sut-tozu', 4),
  cat('g-icecek', 'gida', 'Sıvı İçecekler', 'sivi-icecekler', 5),
  cat('g-biskuvi', 'gida', 'Bisküvi', 'biskuvi', 6),
  cat('g-bitki', 'gida', 'Bitki Çayları', 'bitki-caylari', 7),
]

export const sliderImages = [
  '/assets/slider/image1.jpg',
  '/assets/slider/image2.jpg',
  '/assets/slider/image3.jpg',
  '/assets/slider/image4.jpg',
  '/assets/slider/image5.jpg',
  '/assets/slider/image6.jpg',
  '/assets/slider/image7.jpg',
]

export const categoryIcons: Record<string, string> = {
  promosyon: '✦',
  matbaa: '◈',
  kirtasiye: '✎',
  'bilgisayar-sarf': '⬡',
  tabela: '▣',
  temizlik: '◉',
  gida: '☕',
}
