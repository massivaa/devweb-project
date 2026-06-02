// test du lien
console.log("Projet de massiva");

// GLOBAL STATE ──────────────────────
let doctors = [];
let currentDoctor = null;

// LOAD DOCTORS ──────────────────────
async function loadDoctors() {
  try {
    const res = await fetch("https://mknay.alwaysdata.net/php/docteur.php");
    doctors = await res.json();

    renderDoctors(doctors);
  } catch (err) {
    console.error("Erreur chargement docteurs:", err);
  }
}

// RENDER DOCTORS ──────────────────────
function renderDoctors(list) {
  const container = document.getElementById("docteurs");

  container.innerHTML = list.map(doc => `
    <div class="card">
      <div class="card-body">
        <h3>Dr ${doc.prenom} ${doc.nom}</h3>
        <p>${doc.specialite}</p>
      </div>

      <div class="card-footer">
        <button class="btn-savoir" onclick="openModal(${doc.id})">
          Voir le profil →
        </button>
      </div>
    </div>
  `).join("");
}

// MODAL
function openModal(id) {
  const doc = doctors.find(d => d.id == id);

  if (!doc) {
    alert("Médecin introuvable");
    return;
  }

  currentDoctor = doc;

  document.getElementById("name").textContent = doc.nom + " " + doc.prenom;
  document.getElementById("spec").textContent = doc.specialite;

  document.getElementById("modal-cat").textContent = "Médecin";
  document.getElementById("loc").textContent = "Clinique";
  document.getElementById("availb").textContent = "Sur rendez-vous";

  document.getElementById("emailLink").href = "mailto:" + doc.email;
  document.getElementById("whatsappLink").href = "https://wa.me/" + doc.telephone;

  document.getElementById("modal").classList.add("open");

}

// DOM READY ──────────────────────
document.addEventListener("DOMContentLoaded", function () {
  // Charger les médecins au démarrage
  loadDoctors();

  // close modal
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").classList.remove("open");
  });

  document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("open");
  });

  // reservation button
  document.querySelector(".reservation").addEventListener("click", function () {
    if (currentDoctor) {
      window.location.href =
        "../Content/Yrendezvous.html?doctor_id=" + currentDoctor.id +
        "&doctor=" + encodeURIComponent(currentDoctor.nom + " " + currentDoctor.prenom) +
        "&speciality=" + encodeURIComponent(currentDoctor.specialite);
    } else {
      window.location.href = "../Content/Yrendezvous.html";
    }
  });

  // SEARCH
  const searchInput = document.getElementById("searchInput");
  const specialitySelect = document.getElementById("speciality");
  const resultsCount = document.getElementById("results-count");

  function normalize(text) {
    return text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

  function filterDoctors() {
    const q = normalize(searchInput.value.trim());
    const spec = normalize(specialitySelect.value);

    let filtered = doctors.filter(doc => {
      const name = normalize(doc.nom + " " + doc.prenom);
      const speciality = normalize(doc.specialite);

      return (q === "" || name.includes(q)) &&
             (spec === "all" || speciality === spec);
    });

    renderDoctors(filtered);

    resultsCount.textContent =
      filtered.length + " médecin" + (filtered.length > 1 ? "s" : "");
  }

  searchInput.addEventListener("input", filterDoctors);
  specialitySelect.addEventListener("change", filterDoctors);

  // INIT
  loadDoctors();
});