import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import Papa from "papaparse";
import {
  Hisse,
  Satir,
  eksikSutunlar,
  satirdanHisse,
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

let onbellek: Hisse[] | null = null;
let sonOkuma = 0;

async function tablodanOku(): Promise<Hisse[]> {
  const simdi = Date.now();
  if (onbellek && simdi - sonOkuma < BEKLEME_MS) {
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
  sonuc.data.forEach((satir, i) => {
    const hisse = satirdanHisse(satir);
    if (hisse === null) {
      console.warn("Bozuk satır atlandı (tablo satırı " + (i + 2) + "):", satir);
    } else {
      hisseler.push(hisse);
    }
  });

  onbellek = hisseler;
  sonOkuma = simdi;
  return hisseler;
}

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/hayvanlar", async (req: Request, res: Response) => {
  const filtre = filtreyiOku(req.query);
  try {
    const hisseler = await tablodanOku();
    res.json(filtrele(hisseler, filtre));
  } catch (hata) {
    console.error("Tablo hatası:", hata);
    if (onbellek) {
      res.json(filtrele(onbellek, filtre));
      return;
    }
    res.status(502).json({ hata: "Veriler şu an alınamıyor" });
  }
});

app.listen(PORT, () => {
  console.log("Sunucu çalışıyor: http://localhost:" + PORT);
});