import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import Papa from "papaparse";
import {
  Hisse,
  Satir,
  eksikSutunlar,
  satiriDogrula,
  filtrele,
  filtreyiOku,
} from "./hisse";

function ortamDegiskeni(ad: string): string {
  const deger = process.env[ad];
  if (!deger) {
    console.error(ad + " ortam değişkeni tanımlı değil. .env dosyasını kontrol edin.");
    process.exit(1);
  }
  return deger;
}

const TABLO_URL = ortamDegiskeni("TABLO_URL");
const PORT = Number(process.env.PORT) || 3000;
const BEKLEME_MS = 60 * 1000;
// Önizleme sayfasının gizli anahtarı. Tanımlı değilse sayfa kapalı kalır.
const ONIZLEME_ANAHTAR = process.env.ONIZLEME_ANAHTAR;

type Atlanan = {
  tabloSatiri: number; // Google Sheets'teki satır numarası (başlık 1. satır)
  neden: string;
  satir: Satir;
};

type Okuma = {
  hisseler: Hisse[];
  atlananlar: Atlanan[];
  toplamSatir: number;
  okumaZamani: number;
};

let onbellek: Okuma | null = null;

async function tablodanOku(zorla = false): Promise<Okuma> {
  const simdi = Date.now();
  if (!zorla && onbellek && simdi - onbellek.okumaZamani < BEKLEME_MS) {
    return onbellek;
  }

  const cevap = await fetch(TABLO_URL);
  if (!cevap.ok) {
    throw new Error("Tablo okunamadı: HTTP " + cevap.status);
  }
  const metin = await cevap.text();

  const sonuc = Papa.parse<Satir>(metin, { header: true, skipEmptyLines: true });
  const eksik = eksikSutunlar(sonuc.meta.fields ?? []);
  if (eksik.length > 0) {
    throw new Error("Tabloda eksik sütun var: " + eksik.join(", "));
  }

  const hisseler: Hisse[] = [];
  const atlananlar: Atlanan[] = [];
  sonuc.data.forEach((satir, i) => {
    const dogrulama = satiriDogrula(satir);
    if ("hisse" in dogrulama) {
      hisseler.push(dogrulama.hisse);
    } else {
      console.warn("Bozuk satır atlandı (tablo satırı " + (i + 2) + "):", dogrulama.hata);
      atlananlar.push({ tabloSatiri: i + 2, neden: dogrulama.hata, satir });
    }
  });

  onbellek = {
    hisseler,
    atlananlar,
    toplamSatir: sonuc.data.length,
    okumaZamani: simdi,
  };
  return onbellek;
}

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/hayvanlar", async (req: Request, res: Response) => {
  const filtre = filtreyiOku(req.query);
  try {
    const okuma = await tablodanOku();
    res.json(filtrele(okuma.hisseler, filtre));
  } catch (hata) {
    console.error("Tablo hatası:", hata);
    if (onbellek) {
      res.json(filtrele(onbellek.hisseler, filtre));
      return;
    }
    res.status(502).json({ hata: "Veriler şu an alınamıyor" });
  }
});

// Yönetici önizlemesi: tablodaki satırlar ve atlanan bozuk satırlar.
// Adres: /api/onizleme?anahtar=...  (&yenile=1 önbelleği atlar)
app.get("/api/onizleme", async (req: Request, res: Response) => {
  if (!ONIZLEME_ANAHTAR || req.query.anahtar !== ONIZLEME_ANAHTAR) {
    res.status(404).json({ hata: "Bulunamadı" });
    return;
  }
  try {
    const okuma = await tablodanOku(req.query.yenile === "1");
    res.json(okuma);
  } catch (hata) {
    console.error("Önizleme tablo hatası:", hata);
    res.status(502).json({ hata: "Tablo şu an okunamıyor" });
  }
});

app.listen(PORT, () => {
  console.log("Sunucu çalışıyor: http://localhost:" + PORT);
});