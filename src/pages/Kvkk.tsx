import { Link } from 'react-router-dom'
import { LegalPageLayout, LegalSection } from '@/components/legal/LegalPageLayout'
import { useSiteData } from '@/hooks/useSiteData'

export function Kvkk() {
  const { settings } = useSiteData()
  const company = settings.company_name || 'Akbulut Kırtasiye Malzemeleri İnşaat ve Gıda Paz. Tic. Ltd. Şti.'

  return (
    <LegalPageLayout
      title="KVKK Aydınlatma Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni."
    >
      <LegalSection title="1. Veri Sorumlusu">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca kişisel verileriniz;
          veri sorumlusu sıfatıyla <strong className="text-paper/80">{company}</strong> (&quot;Şirket&quot;)
          tarafından aşağıda açıklanan kapsamda işlenebilmektedir.
        </p>
        <p>
          <strong className="text-paper/80">Adres:</strong> {settings.address}
          <br />
          <strong className="text-paper/80">Telefon:</strong> {settings.phones.join(' · ')}
          <br />
          <strong className="text-paper/80">E-posta:</strong>{' '}
          <a href={`mailto:${settings.email}`} className="text-gold hover:underline">
            {settings.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. İşlenen Kişisel Veriler">
        <p>Web sitemiz ve iletişim kanallarımız üzerinden aşağıdaki kişisel veriler işlenebilir:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Kimlik ve iletişim bilgileri (ad, soyad, firma adı, telefon, e-posta)</li>
          <li>Talep ve mesaj içeriği (iletişim formu, teklif talepleri)</li>
          <li>İşlem güvenliği verileri (IP adresi, tarayıcı bilgisi, log kayıtları)</li>
          <li>Çerez verileri (onayınız halinde analitik kullanım verileri)</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Kişisel Verilerin İşlenme Amaçları">
        <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>İletişim taleplerinin alınması ve yanıtlanması</li>
          <li>Teklif hazırlanması ve ticari ilişkinin yürütülmesi</li>
          <li>Müşteri memnuniyeti ve hizmet kalitesinin artırılması</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>Web sitesi güvenliği ve (onayınız halinde) istatistiksel analiz</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Hukuki Sebepler">
        <p>
          Kişisel verileriniz KVKK&apos;nın 5. ve 6. maddelerinde belirtilen; bir sözleşmenin kurulması
          veya ifası, hukuki yükümlülüğün yerine getirilmesi, meşru menfaat ve açık rızanızın bulunması
          hallerine dayanılarak işlenebilir. Analitik çerezler için açık rızanız alınmaktadır.
        </p>
      </LegalSection>

      <LegalSection title="5. Kişisel Verilerin Aktarılması">
        <p>
          Verileriniz; yalnızca hizmetin gerektirdiği ölçüde ve yasal zorunluluklar çerçevesinde
          barındırma / altyapı sağlayıcıları, e-posta hizmetleri ve (onayınız halinde) analitik
          hizmet sağlayıcıları ile paylaşılabilir. Yurt dışına aktarım söz konusu olduğunda KVKK&apos;da
          öngörülen şartlara uyulur.
        </p>
      </LegalSection>

      <LegalSection title="6. Toplama Yöntemi">
        <p>
          Kişisel verileriniz; web sitemizdeki iletişim formu, e-posta, telefon, çerezler ve benzeri
          elektronik ortamlar aracılığıyla otomatik veya otomatik olmayan yollarla toplanmaktadır.
        </p>
      </LegalSection>

      <LegalSection title="7. KVKK Kapsamındaki Haklarınız">
        <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>KVKK&apos;da öngörülen şartlarda silinmesini veya yok edilmesini isteme</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle
            aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
        </ul>
        <p>
          Taleplerinizi <a href={`mailto:${settings.email}`} className="text-gold hover:underline">{settings.email}</a>{' '}
          adresine iletebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılır.
        </p>
      </LegalSection>

      <LegalSection title="8. Çerezler">
        <p>
          Çerez kullanımına ilişkin ayrıntılar için{' '}
          <Link to="/cerez-politikasi" className="text-gold hover:underline">
            Çerez Politikası
          </Link>
          &apos;nı inceleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="9. Yürürlük">
        <p className="text-paper/40 text-xs">Son güncelleme: Haziran 2026</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
