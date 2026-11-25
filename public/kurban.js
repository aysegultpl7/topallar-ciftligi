const kiloSecim = document.getElementById("hisse-kilo");
const kutu = document.getElementById("satilanlari-gizle");
const kartAlani = document.getElementById("kartlar");
const sonucYok = document.getElementById("sonuc-yok");

const TELEFON = "905052586957";
let sonIstekNo = 0;

// Bir hayvan için kartın HTML'ini üretir
function kartHtml(h) {
  const satildi = h.bosHisse === 0;
  const hisseBasi = Math.round((h.karkasMin + h.karkasMax) / 2 / h.hisseToplam);
  const mesaj = encodeURIComponent("Merhaba, Sırt No " + h.sirtNo + " için bilgi almak istiyorum.");

  return `
    <article class="kart" data-durum="${satildi ? "satildi" : "musait"}" data-hisse-kg="${hisseBasi}">
      <div class="kart-foto">
        <img src="${h.foto}" alt="Sırt No ${h.sirtNo}">
        <span class="kilo-etiket">${h.canliMin}-${h.canliMax} Kg</span>
        ${satildi ? '<span class="satildi-serit">SATILDI</span>' : ""}
      </div>
      <div class="kart-icerik">
        <h3>Sırt No: ${h.sirtNo}</h3>
        <p class="cins">${h.cins}</p>
        <div class="satir"><span>Canlı Kilo Aralığı:</span><span>${h.canliMin}-${h.canliMax} Kg</span></div>
        <div class="satir"><span>Karkas:</span><span>${h.karkasMin}-${h.karkasMax} Kg</span></div>
        <div class="satir"><span>Hisse Başı (yaklaşık):</span><span>${hisseBasi} Kg</span></div>
        <div class="satir"><span>Boş Hisse:</span><span>${h.bosHisse}</span></div>
        <a class="buton buton-wp" target="_blank" rel="noopener" href="https://wa.me/${TELEFON}?text=${mesaj}">WhatsApp'tan Yaz</a>
        <a class="buton buton-ara" href="tel:+${TELEFON}">Bilgi Al (Ara)</a>
      </div>
    </article>
  `;
}

// Seçili filtreleri adres parametrelerine çevirir (örn. sadeceBos=1&hisseKgMin=25)
function sorguOlustur() {
  const parametreler = new URLSearchParams();

  if (kutu.checked) {
    parametreler.set("sadeceBos", "1");
  }

  if (kiloSecim.value !== "hepsi") {
    const parcalar = kiloSecim.value.split("-");
    parametreler.set("hisseKgMin", parcalar[0]);
    parametreler.set("hisseKgMax", parcalar[1]);
  }

  return parametreler.toString();
}

// Filtrelenmiş hayvanları sunucudan ister ve kartları çizer
function hayvanlariYukle() {
  const istekNo = ++sonIstekNo;

  fetch("/api/hayvanlar?" + sorguOlustur())
    .then(function (cevap) {
      if (!cevap.ok) {
        throw new Error("Sunucu hatası: " + cevap.status);
      }
      return cevap.json();
    })
    .then(function (veri) {
      if (istekNo !== sonIstekNo) {
        return; // daha yeni bir istek varsa bu cevabı yok say
      }
      kartAlani.innerHTML = veri.map(kartHtml).join("");
      sonucYok.hidden = veri.length > 0;
    })
    .catch(function () {
      if (istekNo !== sonIstekNo) {
        return;
      }
      kartAlani.innerHTML = "<p>Hayvanlar şu an yüklenemedi. Lütfen bizi arayın.</p>";
      sonucYok.hidden = true;
    });
}

kutu.addEventListener("change", hayvanlariYukle);
kiloSecim.addEventListener("change", hayvanlariYukle);

// Sayfa açılınca veriyi sunucudan iste
hayvanlariYukle();