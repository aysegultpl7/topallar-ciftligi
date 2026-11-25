const lightbox = document.getElementById("lightbox");
const buyukFoto = document.getElementById("lightbox-img");
const kapatDugmesi = document.getElementById("lightbox-kapat");
const oncekiDugmesi = document.getElementById("lightbox-onceki");
const sonrakiDugmesi = document.getElementById("lightbox-sonraki");
const fotolar = document.querySelectorAll(".galeri img, .ciftlik-galeri img");

let suankiIndex = 0;

function goster(index) {
  suankiIndex = (index + fotolar.length) % fotolar.length;
  const foto = fotolar[suankiIndex];
  buyukFoto.src = foto.src;
  buyukFoto.alt = foto.alt;
  lightbox.hidden = false;
}

function onceki() {
  goster(suankiIndex - 1);
}

function sonraki() {
  goster(suankiIndex + 1);
}

function kapat() {
  lightbox.hidden = true;
}

fotolar.forEach(function (foto, index) {
  foto.addEventListener("click", function () {
    goster(index);
  });
});

kapatDugmesi.addEventListener("click", kapat);
oncekiDugmesi.addEventListener("click", onceki);
sonrakiDugmesi.addEventListener("click", sonraki);

lightbox.addEventListener("click", function (olay) {
  if (olay.target === lightbox) {
    kapat();
  }
});

document.addEventListener("keydown", function (olay) {
  if (lightbox.hidden) {
    return;
  }
  if (olay.key === "Escape") {
    kapat();
  }
  if (olay.key === "ArrowLeft") {
    onceki();
  }
  if (olay.key === "ArrowRight") {
    sonraki();
  }
});
