# 💸 ECHO: Kişisel Finans Yönetimi & Sağlık Asistanı

> **🔗 CANLI UYGULAMA LİNKİ:** [ECHO Dashboard'u Canlı Deneyimleyin](https://echo-finansal-yonetim.vercel.app)

> **Bu çalışma, "Future Talent Program 201 - Yapay Zeka Bitirme Projesi" olarak hazırlanmıştır.**
>
> *Aktüerya Bilimleri ve Yapay Zeka disiplinlerini birleştiren bu proje; bireysel finans yönetimini, veriye dayalı gelecek maliyeti projeksiyonları ve akıllı denetleme mekanizmalarıyla modern bir boyuta taşımayı hedeflemektedir.*

**ECHO**, Aktüerya Bilimleri perspektifiyle geliştirilmiş; kullanıcıların gelir ve giderlerini anlık olarak takip edebildiği, kategori bazlı bütçe limitleri belirleyebildiği, finansal sağlık skorunu izleyebildiği ve verilerini telefon numarasıyla senkronize edebildiği modern bir web uygulamasıdır. 

Uygulamanın temel amacı, kullanıcıların harcama alışkanlıklarını Aktüeryal risk analizi metodolojisiyle (Harcamanın 10 Yıl Sonraki Gelecek Maliyeti) değerlendirerek onlara dijital bir "Finansal Koçluk" yapmaktır.

---

## 🚀 Temel Özellikler

### 1. **📱 Telefon Numarası ile Akıllı Erişim:**
- Kullanıcılar, telefon numaralarını girerek sistemdeki verilerine (`LocalStorage`) güvenli bir şekilde erişebilir.
- **On-Demand Veri Yükleme:** Veriler, kullanıcı etkileşimiyle ("Verileri Getir") dinamik olarak yüklenerek performans ve veri bütünlüğü optimize edilmiştir.

### 2. **Akıllı Veri Girişi (Q-Card Structure):**
- Kullanıcı dostu, "Soru-Kartı" (Q-Card) yapısı ile harcamalar ve gelirler saniyeler içinde girilebilir.
- **Anlık Seçim Butonu:** Her veri girişi, tek bir tıklama ile 'Gelir' (Income) veya 'Harcama' (Expense) olarak sınıflandırılabilir.

### 3. **Aktüeryal Finansal Sağlık Dashboard'u:**
- **Finansal Sağlık Skoru:** Kullanıcının (Gelir - Gider) / Gelir oranına göre hesaplanan, anlık güncellenen bir skor.
- **10 Yıl Sonraki Gelecek Maliyeti (Risk Analizi):** Her harcama kalemi için, yıllık %5 enflasyon oranı varsayımıyla (Aktüeryal projeksiyon) 10 yıl sonraki tahmini maliyeti hesaplanır.

### 4. **Akıllı Bütçe Limitleri & Motivasyon Sistemi:**
- Kullanıcılar 'Market', 'Kozmetik', 'Eğlence' gibi kritik kategoriler için aylık limitler belirleyebilir.
- **Anlık Motivasyon Notu:** Belirlenen limit aşıldığında kullanıcıya "Dur ve Düşün!" diyen, vizyoner bir finansal koç notu belirir.

### 5. **Profesyonel Veri Analiz Tablosu:**
- Girilen TÜM veriler filtreleme ve sıralama özelliklerine sahip profesyonel bir **TanStack Table** bileşeni ile listelenir.
- Gelirler (yeşil) ve Giderler (kırmızı) renk kodlarıyla ayırt edilir.

### 6. **Kullanıcıya Özel QR Kod ile Paylaşım/Yedekle:**
- Uygulamanın sağ üst köşesinde, verileri bir linke (`Base64`) kodlayan özel bir **QR Kod** bulunur.
- Kullanıcı bu QR kodu taratarak verilerini başka bir cihazda görüntüleyebilir veya yedekleyebilir.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React.js, TypeScript (Vite)
- **State Management:** Zustand & LocalStorage Sync
- **Table:** TanStack Table
- **Styling:** Tailwind CSS, Lucide Icons
- **Utility:** clsx, tailwind-merge, QR Code Library

---

## 💻 Kurulum & Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için:

1. **Depoyu Klonlayın:** `git clone https://github.com/sudesert/Echo-Finansal-Yonetim.git`
2. **Kütüphaneleri Yükleyin:** `npm install`
3. **Uygulamayı Başlatın:** `npm run dev`
4. Uygulama `http://localhost:5173` adresinde çalışacaktır.

---

### 🔐 Veri Güvenliği ve Gizliliği
Bu uygulama, **"Privacy by Design"** (Tasarım Gereği Gizlilik) ilkesiyle geliştirilmiştir:
* **Yerel Depolama:** Tüm finansal verileriniz tarayıcınızın `LocalStorage` alanında saklanır. 
* **Sunucu Bağımsız:** Verileriniz hiçbir uzak sunucuya veya veritabanına aktarılmaz.
* **Tam Kontrol:** Kullanıcı sadece kendi numarasıyla eşleşen yerel verilere erişebilir. Tarayıcı verilerini temizlediğinizde tüm kayıtlar silinir.

---

## 🎯 Proje Sahibi

**Sude Sert**
*Selçuk Üniversitesi - Aktüerya Bilimleri Bölümü öğrencisi*

*Bu proje, finansal okuryazarlığı artırmak ve bireysel bütçe yönetimini Aktüeryal projeksiyonlarla güçlendirmek amacıyla geliştirilmiştir.*
