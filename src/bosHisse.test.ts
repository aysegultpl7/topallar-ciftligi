import { describe, it, expect } from "vitest";
import { filtrele, filtreyiOku, Hisse } from "./hisse";

function hayvan(sirtNo: number, bosHisse: number): Hisse {
  return {
    id: sirtNo,
    sirtNo,
    cins: "Yerli",
    foto: "img/a.jpg",
    canliMin: 300,
    canliMax: 330,
    karkasMin: 170,
    karkasMax: 190,
    hisseToplam: 7,
    bosHisse,
  };
}

// Boş hisseleri: 0, 2, 3, 5
const liste = [hayvan(1, 0), hayvan(2, 2), hayvan(3, 3), hayvan(4, 5)];

describe("enAzBosHisse filtresi", () => {
  it("2 ve daha fazla boş hissesi olanları getirir", () => {
    expect(filtrele(liste, { enAzBosHisse: 2 }).map((h) => h.sirtNo)).toEqual([2, 3, 4]);
  });

  it("3 ve daha fazla boş hissesi olanları getirir", () => {
    expect(filtrele(liste, { enAzBosHisse: 3 }).map((h) => h.sirtNo)).toEqual([3, 4]);
  });

  it("yeterli boş hissesi olan yoksa boş liste döner", () => {
    expect(filtrele(liste, { enAzBosHisse: 6 })).toEqual([]);
  });

  it("filtre verilmezse hepsini getirir", () => {
    expect(filtrele(liste, {})).toHaveLength(4);
  });

  it("adres parametresini sayıya çevirir", () => {
    expect(filtreyiOku({ enAzHisse: "2" }).enAzBosHisse).toBe(2);
  });

  it("geçersiz değerde filtre uygulamaz", () => {
    expect(filtreyiOku({ enAzHisse: "abc" }).enAzBosHisse).toBeUndefined();
  });
});