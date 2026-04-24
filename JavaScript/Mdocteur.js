//test du lien
console.log('Projet de massiva');

//creation du tableau de docteurs
const doctors = [
  { name: "A.Mastene",  spec: "generaliste",  availb: "Lundi – Mercredi",  cat: "public", loc: "Alger Centre" },
  { name: "B.Amel",     spec: "cardiologue",  availb: "Dimanche – Jeudi",  cat: "privé",  loc: "Bab El Oued, Alger" },
  { name: "M.Yasmine",  spec: "dermatologue", availb: "Mardi – Samedi",    cat: "privé",  loc: "Hydra, Alger" },
  { name: "T.Katia",    spec: "dermatologue", availb: "Lundi – Mercredi",  cat: "privé",  loc: "El Biar, Alger" },
  { name: "S.Nesrine",  spec: "pédiatre",     availb: "Dimanche – Jeudi",  cat: "privé",  loc: "Kouba, Alger" },
  { name: "A.Massiva",  spec: "gynécologue",  availb: "Samedi – Mercredi", cat: "privé",  loc: "Cheraga, Alger" },
];

let currentDoctor = null;

//plus d'infos sur docteurs
function openModal(id) {
  const doc = doctors[id];
  currentDoctor = doc;

  document.getElementById("name").textContent  = doc.name;
  document.getElementById("spec").textContent  = doc.spec;
  document.getElementById("availb").textContent = doc.availb;
  document.getElementById("modal-cat").textContent = doc.cat;
  document.getElementById("loc").textContent   = doc.loc;

  document.getElementById("modal").classList.add("open");
}

// ─── Main logic on DOM ready ──────────────────────
document.addEventListener("DOMContentLoaded", function () {

  // — Modal close —
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").classList.remove("open");
  });

  document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("open");
  });

  // lien de reservation vers lA page rendezvous
  document.querySelector(".reservation").addEventListener("click", function () {
    if (currentDoctor) {
      window.location.href =
        "../Content/Yrendezvous.html?speciality=" + encodeURIComponent(currentDoctor.spec) +
        "&doctor=" + encodeURIComponent(currentDoctor.name);
    } else {
      window.location.href = "../Content/Yrendezvous.html";
    }
  });

  //recherche des docterrs
  const searchInput      = document.getElementById("searchInput");
  const specialitySelect = document.getElementById("speciality");
  const categorieSelect  = document.getElementById("categorie");
  const cards            = document.querySelectorAll("#docteurs .card");
  const resultsCount     = document.getElementById("resultsCount");

  function normalizeText(text) {
    return text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

  function filterDoctors() {
    const q    = normalizeText(searchInput.value.trim());
    const spec = normalizeText(specialitySelect.value);
    const cat  = normalizeText(categorieSelect.value);
    let visible = 0;

    cards.forEach(card => {
      const nameEl = card.querySelector("h3");
      const name   = nameEl ? normalizeText(nameEl.textContent) : "";
      const cs     = normalizeText(card.dataset.speciality || "");
      const cc     = normalizeText(card.dataset.categorie  || "");

      // prefixe du nom 
      let nameMatch = true;
      if (q !== "") {
        const cleanQ      = q.replace(/\.+$/, "");
        const nameTokens  = name.replace(/\bdr\b\s*/g, "").split(/[\.\s\-]+/).filter(Boolean);
        if (q.includes(".")) {
          const parts = cleanQ.split(".").filter(Boolean);
          nameMatch   = parts.every((part, i) => nameTokens[i] && nameTokens[i].startsWith(part));
        } else {
          nameMatch = nameTokens.some(token => token.startsWith(cleanQ));
        }
      }

      const specMatch = spec === "all" || cs === spec;
      const catMatch  = cat  === "all" || cc.includes(cat);
      const show      = nameMatch && specMatch && catMatch;

      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    resultsCount.textContent =
      visible + " médecin" + (visible > 1 ? "s" : "") +
      " disponible" + (visible > 1 ? "s" : "");
  }

  searchInput.addEventListener("input", filterDoctors);
  specialitySelect.addEventListener("change", filterDoctors);
  categorieSelect.addEventListener("change", filterDoctors);

  //animation 
  cards.forEach((card, i) => {
    card.style.animationDelay = (i * 0.07) + "s";
  });

  // execution 
  filterDoctors();
});
