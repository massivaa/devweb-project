const API_BASE = "https://mknay.alwaysdata.net/php";

// ── État global ──
let allOrdonnances = [];
let activeFilter   = "all";
let sortOrder      = "desc";
let searchQuery    = "";
let currentOrdonnance = null;

// Allergies connues du patient
let knownAllergies = [];

document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("logged_in") === "true";

  if (!isLoggedIn) {
    window.location.href = "connexion.html";
    return;
  }

  loadProfile();
  loadOrdonnances();
});

// Charger le profil 
async function loadProfile() {
  try {
    const storedUserId = localStorage.getItem("user_id");
    const url = storedUserId
      ? `${API_BASE}/profile.php?user_id=${encodeURIComponent(storedUserId)}`
      : `${API_BASE}/profile.php`;

    const res  = await fetch(url, { credentials: "include" });
    const json = await res.json();

    if (json.success && json.data) {
      const raw = json.data.allergies || json.data.allergie || "";
      knownAllergies = raw
        ? raw.split(/[,;]/).map(s => s.trim().toLowerCase()).filter(Boolean)
        : [];
    }
  } catch (err) {
    console.warn("Profil non disponible:", err);
  }
}

// Charger les ordonnances 
async function loadOrdonnances() {
  showLoading(true);

  try {
    const res  = await fetch(`${API_BASE}/ordonnance.php`, { credentials: "include" });
    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {
      allOrdonnances = json.data.map(normalizeOrdonnance);
    } else {
      allOrdonnances = [];
    }
  } catch (err) {
    console.error("Erreur chargement ordonnances:", err);
    allOrdonnances = [];
  }

  showLoading(false);
  updateStats();
  renderGrid();
}

// Normaliser une ordonnance 
function normalizeOrdonnance(o) {
  return {
    id:           o.id,
    ref:          o.reference || o.ref || o.numero || `ORD-${o.id}`,
    date:         parseDate(o.date_emission || o.date || o.created_at),
    validite:     parseDate(o.date_validite || o.validite || o.date_fin || null),
    status:       resolveStatus(o),
    doctor:       formatDoctor(o),
    specialty:    o.specialite || o.specialty || "",
    etablissement:o.etablissement || o.clinique || o.hopital || "",
    motif:        o.motif || o.description || o.indication || "",
    meds:         parseMeds(o.medicaments || o.meds || o.medications || []),
    notes:        o.notes || o.remarques || o.commentaire || "",
    raw:          o,
  };
}

// statut 
function resolveStatus(o) {
  if (o.statut || o.status) return o.statut || o.status;
  // Déduire depuis date de validité
  if (o.date_validite || o.validite || o.date_fin) {
    const fin = new Date(o.date_validite || o.validite || o.date_fin);
    if (!isNaN(fin)) return fin < new Date() ? "expired" : "active";
  }
  return "active";
}

// Parser les médicaments
function parseMeds(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(m => {
      if (typeof m === "string") return { name: m, dose: "", duration: "", instructions: "" };
      return {
        name:         m.nom || m.name || m.medicament || "—",
        dose:         m.dose || m.posologie || "",
        duration:     m.duree || m.duration || "",
        instructions: m.instructions || m.indication || "",
      };
    });
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return parseMeds(parsed);
    } catch {
      return raw.split(/[,;]/).map(s => ({ name: s.trim(), dose: "", duration: "", instructions: "" })).filter(m => m.name);
    }
  }
  return [];
}

// Mettre à jour les stats
function updateStats() {
  const row = document.getElementById("statsRow");
  if (!allOrdonnances.length) { row.style.display = "none"; return; }

  row.style.display = "flex";
  document.getElementById("statTotal").textContent   = allOrdonnances.length;
  document.getElementById("statActive").textContent  = allOrdonnances.filter(o => o.status === "active").length;
  document.getElementById("statPending").textContent = allOrdonnances.filter(o => o.status === "pending").length;
  document.getElementById("statExpired").textContent = allOrdonnances.filter(o => o.status === "expired").length;
}

// Rendu grille
function renderGrid() {
  const grid  = document.getElementById("ordoGrid");
  const empty = document.getElementById("emptyState");

  let data = allOrdonnances.filter(o => {
    const matchStatus = activeFilter === "all" || o.status === activeFilter;
    const q = searchQuery;
    const matchSearch = !q
      || o.doctor.toLowerCase().includes(q)
      || o.specialty.toLowerCase().includes(q)
      || o.motif.toLowerCase().includes(q)
      || o.ref.toLowerCase().includes(q)
      || o.meds.some(m => m.name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  data.sort((a, b) =>
    sortOrder === "desc" ? b.date - a.date : a.date - b.date
  );

  if (!data.length) {
    grid.style.display  = "none";
    empty.style.display = "block";
    return;
  }

  grid.style.display  = "grid";
  empty.style.display = "none";

  grid.innerHTML = data.map((o, idx) => renderCard(o, idx)).join("");
}

//Rendu d'une carte
function renderCard(o, idx) {
  const dateStr     = isValidDate(o.date)     ? formatDate(o.date)     : "—";
  const validiteStr = isValidDate(o.validite) ? formatDate(o.validite) : "—";

  const medsPreview = o.meds.slice(0, 3);
  const extra       = o.meds.length > 3 ? o.meds.length - 3 : 0;

  const medsHtml = medsPreview.length
    ? `<div class="ordo-card-meds">
        ${medsPreview.map(m => `<span class="med-tag">${escHtml(shortMedName(m.name))}</span>`).join("")}
        ${extra ? `<span class="med-tag">+${extra}</span>` : ""}
       </div>`
    : "";

  return `
    <div class="ordo-card" data-status="${o.status}" style="animation-delay:${idx * 0.05}s" onclick="openModal(${o.id})">
      <div class="ordo-card-header">
        <span class="ordo-card-id">${escHtml(o.ref)}</span>
        <span class="status-pill ${o.status}">${statusLabel(o.status)}</span>
      </div>
      <div>
        <div class="ordo-card-doctor">${escHtml(o.doctor) || "Médecin inconnu"}</div>
        ${o.specialty ? `<div class="ordo-card-specialty">🏥 ${escHtml(o.specialty)}</div>` : ""}
        <div class="ordo-card-date">📅 ${dateStr}</div>
      </div>
      ${medsHtml}
      <div class="ordo-card-footer">
        <div class="ordo-card-validity">
          Valide jusqu'au <span>${validiteStr}</span>
        </div>
        <span class="ordo-card-arrow">›</span>
      </div>
    </div>
  `;
}

// Modal détail 
function openModal(id) {
  const o = allOrdonnances.find(x => x.id == id);
  if (!o) return;
  currentOrdonnance = o;
  document.getElementById("modalTitle").textContent = o.ref;
  document.getElementById("modalSub").textContent   = [
    isValidDate(o.date) ? `Émise le ${formatDate(o.date)}` : "",
    o.specialty,
    isValidDate(o.validite) ? `Valide jusqu'au ${formatDate(o.validite)}` : "",
  ].filter(Boolean).join(" · ");

  let html = "";

  // Alerte allergie si médicament correspond
  const allergyMeds = o.meds.filter(m =>
    knownAllergies.some(a => m.name.toLowerCase().includes(a) || a.includes(m.name.toLowerCase().slice(0, 5)))
  );

  if (allergyMeds.length) {
    html += `
      <div class="allergy-alert">
        ⚠️ Attention : ${escHtml(allergyMeds.map(m => m.name).join(", "))} — allergie connue du patient
      </div>
    `;
  }

  // Informations générales
  html += `
    <div class="modal-section">
      <div class="modal-section-title">Prescripteur</div>
      <div class="modal-info-grid">
        <div class="modal-info-item">
          <div class="modal-info-label">Médecin</div>
          <div class="modal-info-value">${escHtml(o.doctor) || "—"}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Spécialité</div>
          <div class="modal-info-value">${escHtml(o.specialty) || "—"}</div>
        </div>
        ${o.etablissement ? `
        <div class="modal-info-item">
          <div class="modal-info-label">Établissement</div>
          <div class="modal-info-value">${escHtml(o.etablissement)}</div>
        </div>` : ""}
        <div class="modal-info-item">
          <div class="modal-info-label">Date d'émission</div>
          <div class="modal-info-value">${isValidDate(o.date) ? formatDate(o.date) : "—"}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Validité</div>
          <div class="modal-info-value">${isValidDate(o.validite) ? formatDate(o.validite) : "—"}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Statut</div>
          <div class="modal-info-value"><span class="status-pill ${o.status}">${statusLabel(o.status)}</span></div>
        </div>
      </div>
    </div>
  `;

  // Motif
  if (o.motif) {
    html += `
      <div class="modal-section">
        <div class="modal-section-title">Motif de la prescription</div>
        <div class="modal-text-block">${escHtml(o.motif)}</div>
      </div>
    `;
  }

  // Médicaments
  if (o.meds.length) {
    html += `
      <div class="modal-section">
        <div class="modal-section-title">Médicaments prescrits (${o.meds.length})</div>
        <div class="meds-list">
          ${o.meds.map(m => `
            <div class="med-item">
              <div class="med-item-left">
                <div class="med-item-name">${escHtml(m.name)}</div>
                ${m.instructions ? `<div class="med-item-instruction">${escHtml(m.instructions)}</div>` : ""}
              </div>
              <div class="med-item-right">
                ${m.dose     ? `<div class="med-item-dose">${escHtml(m.dose)}</div>` : ""}
                ${m.duration ? `<div class="med-item-duration">Durée : ${escHtml(m.duration)}</div>` : ""}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Notes
  if (o.notes) {
    html += `
      <div class="modal-section">
        <div class="modal-section-title">Notes du médecin</div>
        <div class="modal-text-block">${escHtml(o.notes)}</div>
      </div>
    `;
  }

  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(e) {
  if (e.target === document.getElementById("modalOverlay")) closeModalBtn();
}

function closeModalBtn() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Contrôles ──
function setFilter(btn, filter) {
  activeFilter = filter;
  document.querySelectorAll(".type-chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGrid();
}

function setSort(val) {
  sortOrder = val;
  renderGrid();
}

function setSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderGrid();
}

// ── Helpers ──
function showLoading(show) {
  document.getElementById("loadingState").style.display = show ? "flex" : "none";
  document.getElementById("ordoGrid").style.display     = "none";
  document.getElementById("emptyState").style.display   = "none";
  if (!show) renderGrid();
}

function parseDate(raw) {
  if (!raw) return new Date(NaN);
  return new Date(raw);
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

function formatDate(d) {
  if (!isValidDate(d)) return "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDoctor(o) {
  if (o.medecin_prenom || o.medecin_nom)
    return `Dr ${o.medecin_prenom || ""} ${o.medecin_nom || ""}`.trim();
  if (o.medecin) return o.medecin;
  if (o.docteur) return o.docteur;
  if (o.prescripteur) return o.prescripteur;
  return "";
}

function shortMedName(name) {
  // Affiche seulement le nom principal (avant le premier espace ou chiffre)
  return name.split(/\s+/).slice(0, 2).join(" ");
}

function statusLabel(s) {
  return { active: "Active", pending: "En attente", done: "Dispensée", expired: "Expirée" }[s] || s;
}

function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
//fontion acheter 
function acheterOrdonnance() {

  if (!currentOrdonnance) return;

  const panier = currentOrdonnance.meds.map(m => ({
    nom: m.name,
    dose: m.dose,
    quantite: 1
  }));

  localStorage.setItem(
    "ordonnance_panier",
    JSON.stringify(panier)
  );

  window.location.href = "achat.html";
}