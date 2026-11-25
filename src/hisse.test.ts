import { describe, it, expect } from "vitest";
import { eksikSutunlar, satirdanHisse, Satir } from "./hisse";

// Her testte kullanacağımız geçerli bir tablo satırı
const gecerliSatir: Satir = {
  id: "1",
  sirtNo: "58",
  cins: "Simental",
  foto: "img/kurban-15.jpg",
  canliMin: "450",
  canliMax: "480",
  karkasMin: "250",
  karkasMax: "270",
  hisseToplam: "7",
  bosHisse: "3",
};

describe("satirdanHisse", () => {
  it("geçerli satırı sayılara çevirerek Hisse yapar", () => {
    expect(satirdanHisse(gecerliSatir)).toEqual({
      id: 1,
      sirtNo: 58,
      cins: "Simental",
      foto: "img/kurban-15.jpg",
      canliMin: 450,
      canliMax: 480,
      karkasMin: 250,
      karkasMax: 270,
      hisseToplam: 7,
      bosHisse: 3,
    });
  });

  it("boş bir sayı hücresi olan satırı reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, canliMin: "" })).toBeNull();
  });

  it("sayı yerine yazı olan hücreyi reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, canliMin: "abc" })).toBeNull();
  });

  it("cins boşsa reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, cins: "" })).toBeNull();
  });

  it("foto boşsa reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, foto: "" })).toBeNull();
  });

  it("hisseToplam sıfırsa reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, hisseToplam: "0" })).toBeNull();
  });

  it("hisseToplam tam sayı değilse reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, hisseToplam: "7.5" })).toBeNull();
  });

  it("bosHisse toplamdan büyükse reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, bosHisse: "8" })).toBeNull();
  });

  it("bosHisse negatifse reddeder", () => {
    expect(satirdanHisse({ ...gecerliSatir, bosHisse: "-1" })).toBeNull();
  });

  it("bosHisse sıfırsa (hepsi satılmış) geçerlidir", () => {
    expect(satirdanHisse({ ...gecerliSatir, bosHisse: "0" })).not.toBeNull();
  });
});

describe("eksikSutunlar", () => {
  it("tüm başlıklar varsa boş liste döndürür", () => {
    expect(eksikSutunlar(Object.keys(gecerliSatir))).toEqual([]);
  });

  it("foto başlığı yoksa sadece foto'yu döndürür", () => {
    const basliklar = Object.keys(gecerliSatir).filter((s) => s !== "foto");
    expect(eksikSutunlar(basliklar)).toEqual(["foto"]);
  });

  it("başlık listesi boşsa 10 sütunun hepsini döndürür", () => {
    expect(eksikSutunlar([])).toHaveLength(10);
  });
});