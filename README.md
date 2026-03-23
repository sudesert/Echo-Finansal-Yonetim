# ECHO: Kişisel Finans Yönetimi & Sağlık Asistanı

> **Bu çalışma, "Future Talent Program 201 - Yapay Zeka Bitirme Projesi" olarak hazırlanmıştır.**
>
> *Aktüerya Bilimleri ve Yapay Zeka disiplinlerini birleştiren bu proje; bireysel finans yönetimini, veriye dayalı gelecek maliyeti projeksiyonları ve akıllı denetleme mekanizmalarıyla modern bir boyuta taşımayı hedeflemektedir.*

**ECHO**, Aktüerya Bilimleri perspektifiyle geliştirilmiş, kullanıcıların gelir ve giderlerini anlık olarak takip edebildiği, kategori bazlı bütçe limitleri belirleyebildiği ve finansal sağlık skorunu izleyebildiği modern bir web uygulamasıdır. 

Uygulamanın temel amacı, kullanıcıların harcama alışkanlıklarını Aktüeryal risk analizi metodolojisiyle (Harcamanın 10 Yıl Sonraki Gelecek Maliyeti) değerlendirerek, onlara "Finansal Koçluk" yapmaktır.

---

## 🚀 Temel Özellikler

### 1. **Akıllı Veri Girişi (Q-Card Structure):**
- Kullanıcı dostu, "Soru-Kartı" (Q-Card) yapısı ile harcamalar ve gelirler saniyeler içinde girilebilir.
- **Anlık Seçim Butonu:** Her veri girişi, tek bir tıklama ile 'Gelir' (Income) veya 'Harcama' (Expense) olarak sınıflandırılabilir.

### 2. **Aktüeryal Finansal Sağlık Dashboard'u:**
- **Finansal Sağlık Skoru:** Kullanıcının (Gelir - Gider) / Gelir oranına göre hesaplanan, anlık güncellenen bir skor.
- **10 Yıl Sonraki Gelecek Maliyeti (Risk Analizi):** Her harcama kalemi için, yıllık %5 enflasyon oranı varsayımıyla (Aktüeryal projeksiyon) 10 yıl sonraki tahmini maliyeti hesaplanır.

### 3. **Akıllı Bütçe Limitleri & Motivasyon Sistemi:**
- Kullanıcılar 'Market', 'Kozmetik', 'Eğlence' gibi kritik kategoriler için aylık limitler belirleyebilir.
- **Anlık Motivasyon Notu:** Belirlenen limit aşıldığında veya sınıra yaklaşıldığında, veri giriş kartının altında kullanıcıya "Dur ve Düşün!" diyen, vizyoner bir motivasyonel uyarı (Finansal Koç) notu belirir.

### 4. **Profesyonel Veri Analiz Tablosu:**
- Girilen TÜM veriler (Tarih, Açıklama, Kategori, Tür, Tutar) filtreleme ve sıralama özelliklerine sahip profesyonel bir **TanStack Table** bileşeni ile listelenir.
- Gelirler (yeşil) ve Giderler (kırmızı) renk kodlarıyla ayırt edilir.

### 5. **Kullanıcıya Özel QR Kod ile Paylaşım/Yedekle:**
- Uygulamanın sağ üst köşesinde, kullanıcının mevcut verilerini LocalStorage (telefon hafızası) üzerinden bir linke (Base64) kodlayan özel bir **QR Kod** bulunur.
- Kullanıcı bu QR kodu taratarak verilerini başka bir cihazda görüntüleyebilir veya yedekleyebilir.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React.js, TypeScript
- **State Management:** Zustand
- **Table:** TanStack Table
- **Styling:** Tailwind CSS, Lucid Icons
- **Utility:** clsx, tailwind-merge, QR Code Library

---

## 💻 Kurulum & Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için:

1.  **Depoyu Klonlayın:** `git clone https://github.com/sudesert/Echo-Finansal-Yonetim.git`
2.  **Klasöre Girin:** `cd Echo-Finansal-Yonetim`
3.  **Kütüphaneleri Yükleyin:** `npm install`
4.  **Uygulamayı Başlatın:** `npm run dev`
5.  Uygulamanız `http://localhost:5173` adresinde çalışacaktır.

---

**Teknik Not**: QR Kod sistemi, yerel geliştirme ortamında (localhost) Base64 veri aktarımı prensibiyle çalışmaktadır. Canlı sunucu (Vercel/Netlify) kurulumunda tam performansla senkronizasyon sağlayacaktır.

---

## 🎯 Proje Sahibi

**Sude Sert**
*Aktüerya Bilimleri Bölümü öğrencisi*

*Bu proje, finansal okuryazarlığı artırmak ve bireysel bütçe yönetimini Aktüeryal projeksiyonlarla güçlendirmek amacıyla geliştirilmiştir.*
