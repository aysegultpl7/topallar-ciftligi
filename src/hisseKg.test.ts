import { describe, it, expect } from "vitest";
import { filtrele, filtreyiOku, hisseBasiKg, Hisse } from "./hisse";

function hayvan(ozellikler: Partial<Hisse>): Hisse {
  return {
    id: 1,
    sirtNo: 1,
    cins: "Simental",
    foto: "img/a.jpg",
    canliMin: 300,
    canliMax: 350,
    karkasMin: 170,
    karkasMax: 190,
    hisseToplam: 7,
    bosHisse: 3,
    ...ozellikler,
  };
}

// Hisse başı kilolar: A = 28, B = 37, C = 26
const A = hayvan({ sirtNo: 22, karkasMin: 186, karkasMax: 203 });
const B = hayvan({ sirtNo: 15, karkasMin: 250, karkasMax: 270 });
const C = hayvan({ sirtNo: 29, karkasMin: 170, karkasMax: 190 });
const liste = [A, B, C];

describe("hisseBasiKg", () => {
  it("karkas ortalamasını hisse sayısına bölüp yuvarlar", () => {
    expect(hisseBasiKg(A)).toBe(28);
  });
});

describe("hisse başı kilo filtresi", () => {
  it("hisseKgMin ile hafif hisseleri eler", () => {
    expect(filtrele(liste, { hisseKgMin: 30 }).map((h) => h.sirtNo)).toEqual([15]);
  });

  it("hisseKgMax ile ağır hisseleri eler", () => {
    expect(filtrele(liste, { hisseKgMax: 30 }).map((h) => h.sirtNo)).toEqual([22, 29]);
  });

  it("alt ve üst sınırı birlikte uygular", () => {
    const sonuc = filtrele(liste, { hisseKgMin: 27, hisseKgMax: 30 });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([22]);
  });

  it("adres parametrelerinden okur", () => {
    const filtre = filtreyiOku({ hisseKgMin: "25", hisseKgMax: "30" });
    expect(filtre).toEqual({ sadeceBos: false, hisseKgMin: 25, hisseKgMax: 30 });
  });
});