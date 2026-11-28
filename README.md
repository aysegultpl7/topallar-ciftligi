# Topallar Çiftliği

Kocaeli Köseköy'de (Kartepe) babamın işlettiği hayvancılık işletmesi için yaptığım çok sayfalı web sitesi. MIS 233 dönem projesi.

**Canlı site:** https://topallar-ciftligi.onrender.com

> Not: Site Render'ın ücretsiz planında çalışıyor. Bir süre kimse girmezse uyku moduna geçer, ilk açılış 30-50 saniye sürebilir.

**Hazırlayan:** Ayşegül Topal

## Neler var?

- Ana sayfa, Hakkımızda, Hayvanlarımız, Kurban ve İletişim sayfaları
- Fotoğraf galerileri (büyütme, ileri/geri gezinme) ve çiftlik videosu
- **Kurban sayfası:** kurbanlıklar bir Google Sheets tablosundan canlı okunur. Filtreler: satılanları gizle, kilo aralığı, hisse başına et miktarı
- Telefona uyumlu görünüm

## Kullanılan teknolojiler

- HTML, CSS, JavaScript (ön yüz)
- Node.js + Express + **TypeScript** (`strict: true`) (sunucu)
- papaparse (CSV okuma), dotenv (ortam değişkeni)
- Vitest (birim testleri)
- Google Sheets ("Web'de yayınla" CSV), Render (yayın), GitHub

## Proje yapısı

```
public/          ön yüz (HTML, CSS, JS, fotoğraflar, video)
src/hisse.ts     Hisse tipi, satır doğrulama, filtreleme (saf fonksiyonlar)
src/server.ts    Express sunucusu, tablo okuma, önbellek, /api/hayvanlar
src/*.test.ts    birim testleri
```

## Bilgisayarda çalıştırma

1. Gerekenler: Node.js 18 veya üstü
2. Paketleri kur:
   ```bash
   npm install
   ```
3. Ana dizinde `.env` dosyası oluştur (`.env.example` dosyasındaki gibi):
   ```
   TABLO_URL=Google Sheets'in yayınlanmış CSV linki
   ```
   Bu link gizli tutulur, depoya yüklenmez (`.gitignore`'da).
4. Çalıştır:
   ```bash
   npm run dev
   ```
5. Tarayıcıda `http://localhost:3000` adresini aç.

Diğer komutlar:

| Komut | Ne yapar |
|---|---|
| `npm test` | Birim testlerini çalıştırır |
| `npm run build` | TypeScript'i `dist/` klasörüne derler |
| `npm start` | Derlenmiş sunucuyu başlatır (Render bunu kullanır) |

## Sunucu mantığı

`GET /api/hayvanlar` tabloyu okuyup kurbanlıkları JSON olarak döndürür. Filtreleme sunucuda (TypeScript) yapılır:

- `sadeceBos=1` satılanları gizler
- `sirtNo=`, `cins=`
- `kiloMin=`, `kiloMax=` canlı kilo aralığı
- `hisseKgMin=`, `hisseKgMax=` hisse başına yaklaşık et (kg)

Örnek: `/api/hayvanlar?sadeceBos=1&hisseKgMin=30`

## Hata durumlarında davranış

- **Tablo okunamazsa:** önbellekte veri varsa onunla devam eder, yoksa HTTP 502 ve anlaşılır bir hata mesajı döner. Sunucu çökmez.
- **Bozuk satır** (sayı yerine yazı, eksik hücre, geçersiz hisse sayısı): satır atlanır, diğer satırlar çalışmaya devam eder.
- **Eksik sütun:** sütun adları kontrol edilir ve eksik varsa hata verilir.
- **Önbellek:** tablo 60 saniye önbellekte tutulur, Google'a her istekte gidilmez.

## Testler

`npm test` ile çalışır. Test edilenler: satır doğrulama (geçerli satır, boş hücre, yanlış tür, sınır değerler), eksik sütun kontrolü ve tüm filtreler.

## Yayın (Render)

- Build: `npm install --include=dev && npm run build`
- Start: `npm start`
- Ortam değişkenleri: `TABLO_URL`, `NODE_VERSION=20`
- `main` dalına her `git push` sonrası site yeniden yayınlanır.

## Kim ne yazdı? Yapay zeka nerede kullanıldı?

**Bana ait olanlar:**
- Sitenin fikri, içeriği, metinleri ve tüm fotoğraf ve videolar (çiftliğimizden)
- Sayfaların HTML ve CSS tasarımı, renkler ve düzen kararları
- Google Sheets tablosunu hazırlamak ve güncel tutmak
- Kodu dosyalara yazmak, çalıştırmak, test etmek, GitHub'a yüklemek ve Render'da yayınlamak

**Yapay zeka (Claude, Anthropic) yardımı:**
- TypeScript sunucu mantığının (CSV okuma, doğrulama, filtreleme, önbellek) tasarımında ve kod örneklerinde
- Birim testlerinin yazılmasında
- Render yayını, Git/GitHub kullanımı ve hataları ayıklamada adım adım yönlendirme
- Telefon görünümü için CSS düzeltmelerinde

Yapay zekanın verdiği kodları anlayıp kendim çalıştırıp test ettim.

## Demo videosu

(Video linki buraya eklenecek)