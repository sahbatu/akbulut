import { Link } from 'react-router-dom'
import { LegalPageLayout, LegalSection } from '@/components/legal/LegalPageLayout'
import { useSiteData } from '@/hooks/useSiteData'

export function CookiePolicy() {
  const { settings } = useSiteData()
  const company = settings.company_name || 'Akbulut Kırtasiye Malzemeleri İnşaat ve Gıda Paz. Tic. Ltd. Şti.'

  return (
    <LegalPageLayout
      title="Çerez Politikası"
      description="Web sitemizde kullanılan çerezler ve tercihleriniz hakkında bilgilendirme metni."
    >
      <LegalSection title="1. Çerez Nedir?">
        <p>
          Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin
          dosyalarıdır. Siteyi çalıştırmak, tercihlerinizi hatırlamak ve (onay vermeniz halinde)
          kullanım istatistikleri oluşturmak için kullanılabilir.
        </p>
      </LegalSection>

      <LegalSection title="2. Hangi Çerezleri Kullanıyoruz?">
        <p>
          <strong className="text-paper/80">Zorunlu / işlevsel çerezler:</strong> Oturumun sürdürülmesi,
          çerez tercihinizin hatırlanması ve sitenin temel işlevleri için kullanılır. Bu çerezler
          olmadan site düzgün çalışmayabilir.
        </p>
        <p>
          <strong className="text-paper/80">Analitik çerezler (isteğe bağlı):</strong> Yalnızca çerez
          bildiriminde &quot;Kabul Et&quot; seçeneğini onaylamanız halinde Google Analytics ve/veya Google
          Tag Manager üzerinden anonim kullanım istatistikleri toplanabilir. Bu çerezler site
          performansını ölçmemize ve iyileştirmemize yardımcı olur.
        </p>
        <p>
          Sitemizde reklam veya hedefleme amaçlı üçüncü taraf pazarlama çerezleri
          kullanılmamaktadır.
        </p>
      </LegalSection>

      <LegalSection title="3. Çerez Tercihinizi Yönetme">
        <p>
          İlk ziyaretinizde gösterilen çerez bildirimi üzerinden analitik çerezleri kabul edebilir
          veya reddedebilirsiniz. Tercihiniz tarayıcınızın yerel depolama alanında saklanır.
        </p>
        <p>
          Daha önce verdiğiniz onayı geri almak için tarayıcı ayarlarınızdan site verilerini
          temizleyebilir veya çerezleri silebilirsiniz. Tarayıcı ayarlarından tüm çerezleri
          engellemeniz halinde sitenin bazı özellikleri kısıtlanabilir.
        </p>
      </LegalSection>

      <LegalSection title="4. Saklama Süreleri">
        <p>
          Çerez tercih kaydınız, siz silene kadar veya tarayıcı verilerini temizleyene kadar cihazınızda
          kalır. Analitik çerezlerin saklama süreleri ilgili hizmet sağlayıcının (Google) politikalarına
          tabidir; genellikle birkaç aydan iki yıla kadar değişebilir.
        </p>
      </LegalSection>

      <LegalSection title="5. Kişisel Veriler ve KVKK">
        <p>
          Çerezler aracılığıyla işlenen veriler hakkında ayrıntılı bilgi için{' '}
          <Link to="/kvkk" className="text-gold hover:underline">
            KVKK Aydınlatma Metni
          </Link>
          &apos;mizi inceleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="6. Veri Sorumlusu ve İletişim">
        <p>
          <strong className="text-paper/80">Veri sorumlusu:</strong> {company}
          <br />
          <strong className="text-paper/80">Adres:</strong> {settings.address}
          <br />
          <strong className="text-paper/80">E-posta:</strong>{' '}
          <a href={`mailto:${settings.email}`} className="text-gold hover:underline">
            {settings.email}
          </a>
        </p>
        <p className="text-paper/40 text-xs">Son güncelleme: Haziran 2026</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
