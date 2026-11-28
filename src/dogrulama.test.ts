import { describe, it, expect } from "vitest";
import { satiriDogrula, Satir } from "./hisse";

const gecerliSatir: Satir = {
  id: "1",
  sirtNo: "15",
  cins: "Holştayn",
  foto: "img/kurban-15.jpg",
  canliMin: "500",
  canliMax: "550",
  karkasMin: "270",
  karkasMax: "300",
  hisseToplam: "7",
  bosHisse: "3",
};

describe("satiriDogrula", () => {
  it("geçerli satır için hisse döndürür", () => {
    const sonuc = satiriDogrula(gecerliSatir);
    expect("hisse" in sonuc).toBe(true);
  });

  it("yazı olan sayı hücresini ismiyle bildirir", () => {
    const sonuc = satiriDogrula({ ...gecerliSatir, canliMin: "abc" });
    expect("hata" in sonuc && sonuc.hata).toContain("canliMin");
  });

  it("boş cins hücresini bildirir", () => {
    const sonuc = satiriDogrula({ ...gecerliSatir, cins: "" });
    expect("hata" in sonuc && sonuc.hata).toContain("cins");
  });

  it("boş hisse sayısı toplamdan büyükse hata verir", () => {
    const sonuc = satiriDogrula({ ...gecerliSatir, bosHisse: "9" });
    expect("hata" in sonuc && sonuc.hata).toContain("bosHisse");
  });
});