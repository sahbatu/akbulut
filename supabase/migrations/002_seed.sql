-- Site settings
INSERT INTO site_settings (key, value) VALUES
  ('company_name', '"Akbulut Kırtasiye Malzemeleri İnşaat ve Gıda Paz. Tic. Ltd. Şti."'),
  ('tagline', '"18 Yıllık Güven, Sınırsız Çözüm"'),
  ('about_short', '"18 yıldır faaliyette bulunan ve hizmet kalitesindeki titizliği ile memnuniyeti sağlamaya azami özen gösteren firmamız, çalışmalarını başarıyla sürdürmektedir. Eksiksiz olarak zamanında teslimi, titizlikte takip ve kontrol ettiğimiz bir unsurdur."'),
  ('about_full', '"18 yıldır faaliyette bulunan ve hizmet kalitesindeki titizliği ile memnuniyeti sağlamaya azami özen gösteren firmamız, çalışmalarını başarıyla sürdürmektedir. Faaliyet konularımız: Promosyon, Matbaa, Tabela, Bilgisayar Sarf ve Kırtasiye."'),
  ('address', '"Eğitim mah. Poyraz sk. No:12/B Hasanpaşa / Kadıköy / İstanbul"'),
  ('phones', '["0216 449 32 35", "0216 550 46 32", "0216 550 46 33"]'),
  ('fax', '"0216 449 32 36"'),
  ('email', '"info@akbulutltd.com"'),
  ('map_embed_url', '"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.0!2d29.027!3d40.992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU5JzMxLjIiTiAyOcKwMDEnMzcuMiJF!5e0!3m2!1str!2str!4v1"'),
  ('years_experience', '18')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Announcements
INSERT INTO announcements (id, title, excerpt, published_at) VALUES
  ('1', 'Temizlik Malzemeleri', 'Sıvı sabun, deterjan, havlu, tuvalet kağıdı gibi temizlik malzemesi ihtiyaçlarınız firmamız tarafından sağlanmaktadır.', '2014-06-09'),
  ('2', 'Ofis Gıda Malzemeleri', 'Çay, şeker, kahve, süt tozu, içecekler ve her türlü ofis gıda malzemeleri satışlarımız başlamıştır.', '2014-06-09')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt;

-- Root categories
INSERT INTO categories (id, parent_id, name, slug, description, sort_order, is_featured) VALUES
  ('promosyon', NULL, 'Promosyon Grubu', 'promosyon', 'Kurumsal promosyon ve hediye ürünleri', 1, true),
  ('matbaa', NULL, 'Matbaa Grubu', 'matbaa', 'Kartvizit, broşür, katalog ve matbaa hizmetleri', 2, true),
  ('kirtasiye', NULL, 'Kırtasiye Grubu', 'kirtasiye', 'Ofis ve kırtasiye malzemeleri', 3, true),
  ('bilgisayar-sarf', NULL, 'Bilgisayar Sarf Malz.', 'bilgisayar-sarf', 'Kartuş, toner ve yazıcı sarf malzemeleri', 4, true),
  ('tabela', NULL, 'Tabela Grubu', 'tabela', 'Işıklı ve ışıksız tabela çözümleri', 5, true),
  ('temizlik', NULL, 'Temizlik Malzemeleri', 'temizlik', 'Ofis temizlik ürünleri', 6, true),
  ('gida', NULL, 'Gıda Malzemeleri', 'gida', 'Ofis gıda ve içecek ürünleri', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Promosyon subcategories
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
  ('p-masa-setleri', 'promosyon', 'Masa Setleri', 'masa-setleri', 1),
  ('p-kristal', 'promosyon', 'Kristal', 'kristal', 2),
  ('p-duvar-saatleri', 'promosyon', 'Duvar Saatleri', 'duvar-saatleri', 3),
  ('p-kalemler', 'promosyon', 'Kalemler', 'kalemler', 4),
  ('p-anahtarliklar', 'promosyon', 'Anahtarlıklar', 'anahtarliklar', 5),
  ('p-ahsap', 'promosyon', 'Ahşap Ürünler', 'ahsap-urunler', 6),
  ('p-kartvizitlikler', 'promosyon', 'Kartvizitlikler', 'kartvizitlikler', 7),
  ('p-cakmak', 'promosyon', 'Çakmak-Küllük', 'cakmak-kulluk', 8),
  ('p-ajandalar', 'promosyon', 'Ajandalar', 'ajandalar', 9),
  ('p-fihristler', 'promosyon', 'Fihristler', 'fihristler', 10),
  ('p-sekreterlik', 'promosyon', 'Sekreterlik', 'sekreterlik', 11),
  ('p-masa-sumeni', 'promosyon', 'Masa Sümeni', 'masa-sumeni', 12),
  ('p-takvimler', 'promosyon', 'Takvimler', 'takvimler', 13),
  ('p-bloknot', 'promosyon', 'Bloknot', 'bloknot-promosyon', 14),
  ('p-sapkalar', 'promosyon', 'Şapkalar', 'sapkalar', 15),
  ('p-cantalar', 'promosyon', 'Çantalar', 'cantalar', 16),
  ('p-ruhsat', 'promosyon', 'Ruhsat Kabı', 'ruhsat-kabi', 17),
  ('p-usb', 'promosyon', 'Usb Bellek', 'usb-bellek', 18)
ON CONFLICT (id) DO NOTHING;

-- Matbaa subcategories (2. seviye)
INSERT INTO categories (id, parent_id, name, slug, description, sort_order) VALUES
  ('m-kartvizit', 'matbaa', 'Kartvizit', 'kartvizit', 'Özel kesim, gofre ve varak baskı seçenekleriyle kartvizit üretimi', 1),
  ('m-kabartma', 'matbaa', 'Kabartma Kartvizit', 'kabartma-kartvizit', NULL, 2),
  ('m-kurumsal', 'matbaa', 'Kurumsal Kimlik Çalışması', 'kurumsal-kimlik', NULL, 3),
  ('m-antetli', 'matbaa', 'Antetli Kağıtlar', 'antetli-kagitlar', NULL, 4),
  ('m-pantone', 'matbaa', 'Pantone Kataloğu', 'pantone-katalogu', NULL, 5),
  ('m-zarflar', 'matbaa', 'Zarflar', 'zarflar', NULL, 6),
  ('m-fatura', 'matbaa', 'Fatura ve Matbuatlar', 'fatura-matbuatlar', NULL, 7),
  ('m-brosur', 'matbaa', 'Broşür & Katalog', 'brosur-katalog', NULL, 8),
  ('m-mucellit', 'matbaa', 'Mücellit Katlama Modelleri', 'mucellit-katlama', NULL, 9),
  ('m-olculer-matbaa', 'matbaa', 'Ölçüler Hakkında', 'olculer-hakkinda-matbaa', NULL, 10),
  ('m-kagitlar-kullanilan', 'matbaa', 'Kullanılan Kağıtlar Hakkında', 'kullanilan-kagitlar-hakkinda', NULL, 11),
  ('m-afis', 'matbaa', 'Afiş & Poster', 'afis-poster', NULL, 12),
  ('m-sunum', 'matbaa', 'Sunum Dosyası', 'sunum-dosyasi', NULL, 13),
  ('m-klasor', 'matbaa', 'Klasör ve Kartela', 'klasor-kartela', NULL, 14),
  ('m-kup-bloknot', 'matbaa', 'Bloknot ve Küp Bloknot', 'kup-bloknot', NULL, 15)
ON CONFLICT (id) DO NOTHING;

-- Matbaa subcategories (3. seviye)
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
  ('m-kartvizit-ornekler', 'm-kartvizit', 'Kartvizitten Örneklemeler', 'kartvizitten-orneklemeler', 1),
  ('m-kartvizit-ozel-kesim', 'm-kartvizit', 'Özel Kesim Modeller', 'ozel-kesim-modeller', 2),
  ('m-zarf-yazisma', 'm-zarflar', 'Yazışma Zarfları', 'yazisma-zarflari', 1),
  ('m-zarf-torba', 'm-zarflar', 'Torba Zarfı', 'torba-zarfi', 2),
  ('m-zarf-davetiye', 'm-zarflar', 'Davetiye Zarfı', 'davetiye-zarfi', 3),
  ('m-zarf-cd', 'm-zarflar', 'CD Zarfı', 'cd-zarfi', 4),
  ('m-zarf-hava', 'm-zarflar', 'Hava Kabarcıklı Zarf', 'hava-kabarcikli-zarf', 5),
  ('m-zarf-ipli', 'm-zarflar', 'İpli ve Körüklü Zarf', 'ipli-koruklu-zarf', 6),
  ('m-brosur-modelleri', 'm-brosur', 'Broşür & Katalog Modelleri', 'brosur-katalog-modelleri', 1),
  ('m-sunum-dosya-modelleri', 'm-sunum', 'Dosya Modelleri', 'dosya-modelleri', 1),
  ('m-sunum-ornek', 'm-sunum', 'Örnek Çalışma', 'ornek-calisma', 2),
  ('m-sunum-olculer', 'm-sunum', 'Ölçüler Hakkında', 'olculer-hakkinda-sunum', 3),
  ('m-sunum-kagitlar', 'm-sunum', 'Kağıtlar Hakkında', 'kagitlar-hakkinda-sunum', 4),
  ('m-klasor-hakkinda', 'm-klasor', 'Klasör Hakkında', 'klasor-hakkinda', 1),
  ('m-klasor-ornekler', 'm-klasor', 'Örnekler', 'klasor-ornekler', 2),
  ('m-klasor-aksesuarlar', 'm-klasor', 'Aksesuarlar', 'klasor-aksesuarlar', 3),
  ('m-klasor-teknik', 'm-klasor', 'Teknik Bilgiler', 'klasor-teknik-bilgiler', 4)
ON CONFLICT (id) DO NOTHING;

-- Kırtasiye subcategories
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
  ('k-leitz', 'kirtasiye', 'Leitz', 'leitz', 1),
  ('k-esselte', 'kirtasiye', 'Esselte', 'esselte', 2),
  ('k-3m', 'kirtasiye', '3M', '3m', 3),
  ('k-casio', 'kirtasiye', 'Casio', 'casio', 4),
  ('k-faber', 'kirtasiye', 'Faber Castell', 'faber-castell', 5),
  ('k-scrikss', 'kirtasiye', 'Scrikss', 'scrikss', 6),
  ('k-cross', 'kirtasiye', 'Cross', 'cross', 7),
  ('k-pentel', 'kirtasiye', 'Pentel', 'pentel', 8),
  ('k-pilot', 'kirtasiye', 'Pilot', 'pilot', 9),
  ('k-uhu', 'kirtasiye', 'Uhu', 'uhu', 10),
  ('k-yener', 'kirtasiye', 'Yener', 'yener', 11),
  ('k-montblanc', 'kirtasiye', 'Mont Blanc', 'mont-blanc', 12),
  ('k-pritt', 'kirtasiye', 'Pritt', 'pritt', 13),
  ('k-uni', 'kirtasiye', 'Uni', 'uni', 14),
  ('k-sarff', 'kirtasiye', 'Sarff', 'sarff', 15),
  ('k-dahle', 'kirtasiye', 'Dahle', 'dahle', 16),
  ('k-trodat', 'kirtasiye', 'Trodat', 'trodat', 17),
  ('k-sirdas', 'kirtasiye', 'Sırdaş', 'sirdas', 18)
ON CONFLICT (id) DO NOTHING;

-- Bilgisayar sarf subcategories
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
  ('bs-hp', 'bilgisayar-sarf', 'HP', 'hp', 1),
  ('bs-oki', 'bilgisayar-sarf', 'Oki', 'oki', 2),
  ('bs-epson', 'bilgisayar-sarf', 'Epson', 'epson', 3),
  ('bs-panasonic', 'bilgisayar-sarf', 'Panasonic', 'panasonic', 4),
  ('bs-canon', 'bilgisayar-sarf', 'Canon', 'canon', 5),
  ('bs-lexmark', 'bilgisayar-sarf', 'Lexmark', 'lexmark', 6),
  ('bs-brother', 'bilgisayar-sarf', 'Brother', 'brother', 7),
  ('bs-mita', 'bilgisayar-sarf', 'Mita', 'mita', 8),
  ('bs-maxell', 'bilgisayar-sarf', 'Maxell', 'maxell', 9),
  ('bs-minolta', 'bilgisayar-sarf', 'Minolta', 'minolta', 10),
  ('bs-samsung', 'bilgisayar-sarf', 'Samsung', 'samsung', 11),
  ('bs-xerox', 'bilgisayar-sarf', 'Xerox', 'xerox', 12),
  ('bs-a4tech', 'bilgisayar-sarf', 'A4 Tech', 'a4-tech', 13),
  ('bs-microsoft', 'bilgisayar-sarf', 'Microsoft', 'microsoft', 14),
  ('bs-dell', 'bilgisayar-sarf', 'Dell', 'dell', 15),
  ('bs-imation', 'bilgisayar-sarf', 'İmation', 'imation', 16),
  ('bs-philips', 'bilgisayar-sarf', 'Philips', 'philips', 17),
  ('bs-ibm', 'bilgisayar-sarf', 'IBM', 'ibm', 18)
ON CONFLICT (id) DO NOTHING;

-- Tabela subcategories
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
  ('t-aluminyum', 'tabela', 'Alüminyum Dekupe', 'aluminyum-dekupe', 1),
  ('t-cam-arac', 'tabela', 'Cam, Araç ve Afiş Yazısı', 'cam-arac-afis', 2),
  ('t-isikli', 'tabela', 'Işıklı Tabela', 'isikli-tabela', 3),
  ('t-isiksiz', 'tabela', 'Işıksız Tabela', 'isiksiz-tabela', 4),
  ('t-neon', 'tabela', 'Neon-Let', 'neon-let', 5),
  ('t-paslanmaz', 'tabela', 'Paslanmaz', 'paslanmaz', 6),
  ('t-totem', 'tabela', 'Totem', 'totem', 7),
  ('t-yonlendirme', 'tabela', 'Yönlendirme', 'yonlendirme', 8)
ON CONFLICT (id) DO NOTHING;

-- Temizlik subcategories
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
  ('tm-sivi-sabun', 'temizlik', 'Sıvı Sabun', 'sivi-sabun', 1),
  ('tm-deterjan', 'temizlik', 'Deterjan', 'deterjan', 2),
  ('tm-tuvalet', 'temizlik', 'Tuvalet Kağıdı', 'tuvalet-kagidi', 3),
  ('tm-rulo', 'temizlik', 'Rulo Kağıt', 'rulo-kagit', 4),
  ('tm-pecete', 'temizlik', 'Peçete', 'pecete', 5),
  ('tm-havlu', 'temizlik', 'Havlu', 'havlu', 6)
ON CONFLICT (id) DO NOTHING;

-- Gıda subcategories
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
  ('g-cay', 'gida', 'Çay', 'cay', 1),
  ('g-seker', 'gida', 'Şeker', 'seker', 2),
  ('g-kahve', 'gida', 'Kahve', 'kahve', 3),
  ('g-sut', 'gida', 'Süt Tozu', 'sut-tozu', 4),
  ('g-icecek', 'gida', 'Sıvı İçecekler', 'sivi-icecekler', 5),
  ('g-biskuvi', 'gida', 'Bisküvi', 'biskuvi', 6),
  ('g-bitki', 'gida', 'Bitki Çayları', 'bitki-caylari', 7)
ON CONFLICT (id) DO NOTHING;
