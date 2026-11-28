// Bir kurbanlık hayvanı anlatan tip
export type Hisse = {
  id: number;
  sirtNo: number;
  cins: string;
  foto: string;
  canliMin: number;
  canliMax: number;
  karkasMin: number;
  karkasMax: number;
  hisseToplam: number;
  bosHisse: number;
};

// CSV'den gelen ham satır: her sütun yazı, bazen de eksik olabilir
export type Satir = Record<string, string | undefined>;

export const GEREKLI_SUTUNLAR = [
  "id", "sirtNo", "cins", "foto", "canliMin",
  "canliMax", "karkasMin", "karkasMax", "hisseToplam", "bosHisse",
];

// Tabloda başlığı bulunmayan sütunları döndürür
export function eksikSutunlar(basliklar: string[]): string[] {
  return GEREKLI_SUTUNLAR.filter((sutun) => !basliklar.includes(sutun));
}

// Boş ya da yazı olan hücreyi NaN (geçersiz sayı) yapar
function sayi(deger: string | undefined): number {
  if (deger === undefined || deger.trim() === "") {
    return NaN;
  }
  return Number(deger);
}

// Doğrulama sonucu: ya geçerli bir hisse ya da neden yazan bir hata
export type Dogrulama = { hisse: Hisse } | { hata: string };

// Bir CSV satırını doğrular. Bozuksa nedenini söyler.
export function satiriDogrula(satir: Satir): Dogrulama {
  const hisse: Hisse = {
    id: sayi(satir.id),
    sirtNo: sayi(satir.sirtNo),
    cins: (satir.cins ?? "").trim(),
    foto: (satir.foto ?? "").trim(),
    canliMin: sayi(satir.canliMin),
    canliMax: sayi(satir.canliMax),
    karkasMin: sayi(satir.karkasMin),
    karkasMax: sayi(satir.karkasMax),
    hisseToplam: sayi(satir.hisseToplam),
    bosHisse: sayi(satir.bosHisse),
  };

  const sayiAlanlari: [string, number][] = [
    ["id", hisse.id],
    ["sirtNo", hisse.sirtNo],
    ["canliMin", hisse.canliMin],
    ["canliMax", hisse.canliMax],
    ["karkasMin", hisse.karkasMin],
    ["karkasMax", hisse.karkasMax],
    ["hisseToplam", hisse.hisseToplam],
    ["bosHisse", hisse.bosHisse],
  ];
  const bozuk = sayiAlanlari.filter(([, n]) => !Number.isFinite(n)).map(([ad]) => ad);
  if (bozuk.length > 0) {
    return { hata: "Sayı olması gereken hücre boş ya da yazı: " + bozuk.join(", ") };
  }
  if (hisse.cins === "") {
    return { hata: "cins hücresi boş" };
  }
  if (hisse.foto === "") {
    return { hata: "foto hücresi boş" };
  }
  if (!Number.isInteger(hisse.hisseToplam) || hisse.hisseToplam <= 0) {
    return { hata: "hisseToplam 1 veya daha büyük bir tam sayı olmalı" };
  }
  if (!Number.isInteger(hisse.bosHisse) || hisse.bosHisse < 0 || hisse.bosHisse > hisse.hisseToplam) {
    return { hata: "bosHisse 0 ile hisseToplam arasında bir tam sayı olmalı" };
  }
  return { hisse };
}

// Bir CSV satırını doğrular. Bozuksa null döndürür.
export function satirdanHisse(satir: Satir): Hisse | null {
  const sonuc = satiriDogrula(satir);
  return "hisse" in sonuc ? sonuc.hisse : null;
}

// Sitede kullanılabilecek filtreler. Hepsi isteğe bağlıdır.
export type Filtre = {
  cins?: string;       // cinsin içinde geçen yazı (büyük/küçük harf fark etmez)
  sadeceBos?: boolean; // true ise sadece boş hissesi olanlar
  sirtNo?: number;     // tam eşleşen sırt no
  kiloMin?: number;    // canlı kilosu en az bu değere ulaşabilen hayvanlar
  kiloMax?: number;    // canlı kilosu en fazla bu değerden başlayanlar
  hisseKgMin?: number; // hisse başı yaklaşık kilosu en az bu kadar olanlar
  hisseKgMax?: number; // hisse başı yaklaşık kilosu en fazla bu kadar olanlar
};

// Bir hissenin yaklaşık kilosu: karkas ortalaması / hisse sayısı, yuvarlanmış
export function hisseBasiKg(h: Hisse): number {
  return Math.round((h.karkasMin + h.karkasMax) / 2 / h.hisseToplam);
}

// Hisse listesini verilen filtrelere göre süzer. Filtre boşsa hepsini döndürür.
export function filtrele(hisseler: Hisse[], filtre: Filtre): Hisse[] {
  return hisseler.filter((h) => {
    if (filtre.cins !== undefined) {
      const aranan = filtre.cins.toLocaleLowerCase("tr");
      if (!h.cins.toLocaleLowerCase("tr").includes(aranan)) {
        return false;
      }
    }
    if (filtre.sadeceBos && h.bosHisse === 0) {
      return false;
    }
    if (filtre.sirtNo !== undefined && h.sirtNo !== filtre.sirtNo) {
      return false;
    }
    if (filtre.kiloMin !== undefined && h.canliMax < filtre.kiloMin) {
      return false;
    }
    if (filtre.kiloMax !== undefined && h.canliMin > filtre.kiloMax) {
      return false;
    }
    const kg = hisseBasiKg(h);
    if (filtre.hisseKgMin !== undefined && kg < filtre.hisseKgMin) {
      return false;
    }
    if (filtre.hisseKgMax !== undefined && kg > filtre.hisseKgMax) {
      return false;
    }
    return true;
  });
}

// Adres çubuğundaki yazıyı (?cins=yerli&sadeceBos=1) sayılara ve doğru/yanlışa çevirir
function sayiOku(deger: unknown): number | undefined {
  if (typeof deger !== "string" || deger.trim() === "") {
    return undefined;
  }
  const n = Number(deger);
  return Number.isFinite(n) ? n : undefined;
}

export function filtreyiOku(sorgu: Record<string, unknown>): Filtre {
  const cins = typeof sorgu.cins === "string" ? sorgu.cins.trim() : "";
  return {
    cins: cins === "" ? undefined : cins,
    sadeceBos: sorgu.sadeceBos === "1",
    sirtNo: sayiOku(sorgu.sirtNo),
    kiloMin: sayiOku(sorgu.kiloMin),
    kiloMax: sayiOku(sorgu.kiloMax),
    hisseKgMin: sayiOku(sorgu.hisseKgMin),
    hisseKgMax: sayiOku(sorgu.hisseKgMax),
  };
}