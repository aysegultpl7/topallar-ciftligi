import { describe, it, expect } from "vitest";
import { filtrele, filtreyiOku, Hisse } from "./hisse";

// Sadece değiştirmek istediğimiz alanları yazarak hayvan üretir
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

const liste: Hisse[] = [
  hayvan({ id: 1, sirtNo: 15, cins: "Simental", canliMin: 450, canliMax: 480, bosHisse: 3 }),
  hayvan({ id: 2, sirtNo: 22, cins: "%100 Yerli Besi Tosun", canliMin: 320, canliMax: 350, bosHisse: 0 }),
  hayvan({ id: 3, sirtNo: 29, cins: "Holstein", canliMin: 250, canliMax: 280, bosHisse: 7 }),
];

describe("filtrele", () => {
  it("filtre yoksa hepsini döndürür", () => {
    expect(filtrele(liste, {})).toHaveLength(3);
  });

  it("cinse göre büyük küçük harf fark etmeden süzer", () => {
    const sonuc = filtrele(liste, { cins: "simental" });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([15]);
  });

  it("cinsin bir parçasıyla da bulur", () => {
    const sonuc = filtrele(liste, { cins: "yerli" });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([22]);
  });

  it("sadeceBos true ise boş hissesi kalmayanları çıkarır", () => {
    const sonuc = filtrele(liste, { sadeceBos: true });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([15, 29]);
  });

  it("sırt no ile tek hayvan bulur", () => {
    const sonuc = filtrele(liste, { sirtNo: 22 });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([22]);
  });

  it("kiloMin ile hafif hayvanları eler", () => {
    const sonuc = filtrele(liste, { kiloMin: 400 });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([15]);
  });

  it("kiloMax ile ağır hayvanları eler", () => {
    const sonuc = filtrele(liste, { kiloMax: 300 });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([29]);
  });

  it("hiçbiri uymuyorsa boş liste döndürür", () => {
    expect(filtrele(liste, { cins: "Angus" })).toEqual([]);
  });

  it("birden fazla filtreyi birlikte uygular", () => {
    const sonuc = filtrele(liste, { sadeceBos: true, kiloMin: 300 });
    expect(sonuc.map((h) => h.sirtNo)).toEqual([15]);
  });
});

describe("filtreyiOku", () => {
  it("boş sorguda filtre uygulamaz", () => {
    expect(filtreyiOku({})).toEqual({ sadeceBos: false });
  });

  it("adres parametrelerini doğru türlere çevirir", () => {
    const filtre = filtreyiOku({ cins: " Holstein ", sadeceBos: "1", kiloMin: "300" });
    expect(filtre).toEqual({ cins: "Holstein", sadeceBos: true, kiloMin: 300 });
  });

  it("geçersiz ya da boş sayıyı yok sayar", () => {
    const filtre = filtreyiOku({ sirtNo: "abc", kiloMin: "" });
    expect(filtre.sirtNo).toBeUndefined();
    expect(filtre.kiloMin).toBeUndefined();
  });
});