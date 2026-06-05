/* ══════════════════════════════════════════
   analyse.js — Page Analyses Médicales
   Charge les analyses depuis l'API,
   filtre par catégorie, tri et recherche,
   et affiche un modal de détail.
══════════════════════════════════════════ */

const API_BASE = "https://mknay.alwaysdata.net/php";

// ── État global ──
let allAnalyses  = [];
let activeFilter = "all";
let sortOrder    = "desc";
let searchQuery  = "";

// ── Mapping catégories ──
// On détecte la catégorie depuis le nom ou type de l'analyse
const CATEGORY_RULES = [
  { key: "sanguin",      keywords: ["sanguin","sang","nfs","crp","hba1c","glycem","cholest","ldl","hdl","triglyc","hemoglobin","plaquette","globule","ferrit","bilan bio","ionogramme","urée","creatinine","albumi","protéine","transamin","ast","alt","ggt","phosphat","bilirub","tsh","t3","t4","insuline","cortisol","vitamine","hémato","coagulat","tp","tca","fibrinogène"], emoji: "🩸" },
  { key: "radiographie", keywords: ["radio","radiograph","thorac","pulmon","rx","cliché","rayon x","os","fracture","rachis","colonne","lomba","cervical","dorsal","poumon"], emoji: "🫁" },
  { key: "echographie",  keywords: ["echo","échograph","ultrason","abdomin","pelvien","thyroid","sein","rein","foie","rate","pancr","vessel","doppler","cardiaque","cardiac","cardiolo"], emoji: "📡" },
  { key: "scanner",      keywords: ["scanner","scan","irm","mri","tomodensito","tdm","pet","scintigraph","cérébr","cerveau","crân","thorac scanner","abdo scanner"], emoji: "🧠" },
];

// ── Init ──
document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("logged_in") === "true";

  if (!isLoggedIn) {
    window.location.href = "connexion.html";
    return;
  }

  loadAnalyses();
});

// ── Chargement depuis l'API ──
async function loadAnalyses() {
  showLoading(true);

  try {
    const res  = await fetch(`${API_BASE}/get_analyses.php`, { credentials: "include" });
    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {
      allAnalyses = json.data.map(normalizeAnalyse);
    } else {
      allAnalyses = [];
    }
  } catch (err) {
    console.error("Erreur chargement analyses:", err);
    allAnalyses = [];
  }

  showLoading(false);
  updateStats();
  renderList();
}

// ── Normaliser une analyse depuis l'API ──
function normalizeAnalyse(a) {
  const name = a.type_analyse || a.nom || a.titre || a.libelle || "Analyse";
  const cat  = detectCategory(name, a.type || a.categorie || "");

  return {
    id:          a.id,
    name,
    category:    cat.key,
    emoji:       cat.emoji,
    date:        parseDate(a.date_analyse || a.date || a.created_at),
    laboratoire: a.laboratoire || a.centre || a.lieu || "",
    prescripteur:a.medecin || a.prescripteur || a.medecin_nom || "",
    status:      a.statut || "done",
    description: a.description || a.indication || "",
    conclusion:  a.conclusion || a.compte_rendu || a.resultat_texte || "",
    resultats:   parseResultats(a.resultats || a.valeurs || null),
    isImage:     Boolean(a.fichier || a.image || a.is_image),
    fichier:     a.fichier || a.image || null,
    raw:         a,
  };
}

// ── Détecter la catégorie ──
function detectCategory(name, typeField) {
  const text = (name + " " + typeField).toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "");

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => text.includes(k))) {
      return { key: rule.key, emoji: rule.emoji };
    }
  }

  return { key: "autre", emoji: "🔬" };
}

// ── Parser les résultats (si JSON ou tableau) ──
function parseResultats(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return null; }
  }
  return null;
}

// ── Mettre à jour les stats ──
function updateStats() {
  const row = document.getElementById("statsRow");

  if (!allAnalyses.length) { row.style.display = "none"; return; }

  row.style.display = "flex";

  document.getElementById("statTotal").textContent   = allAnalyses.length;
  document.getElementById("statSanguin").textContent = allAnalyses.filter(a => a.category === "sanguin").length;
  document.getElementById("statImaging").textContent = allAnalyses.filter(a => ["radiographie","echographie","scanner"].includes(a.category)).length;
  document.getElementById("statAutre").textContent   = allAnalyses.filter(a => a.category === "autre").length;
}

// ── Rendu de la liste ──
function renderList() {
  const list  = document.getElementById("analysesList");
  const empty = document.getElementById("emptyState");

  // Filtre
  let data = allAnalyses.filter(a => {
    const matchCat    = activeFilter === "all" || a.category === activeFilter;
    const matchSearch = !searchQuery
      || a.name.toLowerCase().includes(searchQuery)
      || a.laboratoire.toLowerCase().includes(searchQuery)
      || a.prescripteur.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  // Tri par date
  data.sort((a, b) =>
    sortOrder === "desc" ? b.date - a.date : a.date - b.date
  );

  if (!data.length) {
    list.style.display  = "none";
    empty.style.display = "block";
    return;
  }

  list.style.display  = "flex";
  empty.style.display = "none";

  list.innerHTML = data.map((a, idx) => renderCard(a, idx)).join("");
}

// ── Rendu d'une carte ──
function renderCard(a, idx) {
  const dateStr = a.date instanceof Date && !isNaN(a.date)
    ? formatDate(a.date)
    : "—";

  const metaParts = [dateStr, a.laboratoire, a.prescripteur ? `Prescrit par ${a.prescripteur}` : ""].filter(Boolean);

  return `
    <div class="analyse-card" style="animation-delay:${idx * 0.05}s" onclick="openModal(${a.id})">
      <div class="analyse-icon-wrap ${a.category}">${a.emoji}</div>
      <div class="analyse-body">
        <p class="analyse-name">${escHtml(a.name)}</p>
        <p class="analyse-meta">${escHtml(metaParts.join(" · "))}</p>
        ${a.description ? `<p class="analyse-desc">${escHtml(a.description)}</p>` : ""}
        <span class="cat-badge ${a.category}">${catLabel(a.category)}</span>
      </div>
      <div class="analyse-right">
        <span class="status-pill ${statusClass(a.status)}">${statusLabel(a.status)}</span>
        <span class="arrow-icon">›</span>
      </div>
    </div>
  `;
}

// ── Modal détail ──
function openModal(id) {
  const a = allAnalyses.find(x => x.id == id);
  if (!a) return;

  document.getElementById("modalIcon").textContent  = a.emoji;
  document.getElementById("modalTitle").textContent = a.name;

  const sub = [
    a.date instanceof Date && !isNaN(a.date) ? formatDate(a.date) : "",
    a.laboratoire,
  ].filter(Boolean).join(" · ");

  document.getElementById("modalSub").textContent = sub || "—";

  // Construire le body
  let html = "";

  // Section infos générales
  html += `
    <div class="modal-section">
      <div class="modal-section-title">Informations générales</div>
      <div class="modal-info-grid">
        <div class="modal-info-item">
          <div class="modal-info-label">Type d'examen</div>
          <div class="modal-info-value">${escHtml(a.name)}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Date</div>
          <div class="modal-info-value">${a.date instanceof Date && !isNaN(a.date) ? formatDate(a.date) : "—"}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Laboratoire / Centre</div>
          <div class="modal-info-value">${escHtml(a.laboratoire) || "—"}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Prescripteur</div>
          <div class="modal-info-value">${escHtml(a.prescripteur) || "—"}</div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Catégorie</div>
          <div class="modal-info-value"><span class="cat-badge ${a.category}">${catLabel(a.category)}</span></div>
        </div>
        <div class="modal-info-item">
          <div class="modal-info-label">Statut</div>
          <div class="modal-info-value"><span class="status-pill ${statusClass(a.status)}">${statusLabel(a.status)}</span></div>
        </div>
      </div>
    </div>
  `;

  // Description / indication
  if (a.description) {
    html += `
      <div class="modal-section">
        <div class="modal-section-title">Description / Indication</div>
        <div class="modal-text-block">${escHtml(a.description)}</div>
      </div>
    `;
  }

  // Résultats tabulaires (bilans sanguins)
  if (a.resultats && Array.isArray(a.resultats) && a.resultats.length) {
    html += `
      <div class="modal-section">
        <div class="modal-section-title">Résultats</div>
        <table class="results-table">
          <thead>
            <tr>
              <th>Paramètre</th>
              <th>Référence</th>
              <th>Valeur</th>
            </tr>
          </thead>
          <tbody>
            ${a.resultats.map(r => {
              const status = r.status || r.statut || detectResultStatus(r);
              return `
                <tr>
                  <td>${escHtml(r.param || r.parametre || r.nom || "—")}</td>
                  <td><span class="result-ref">${escHtml(r.ref || r.reference || r.valeur_ref || "—")}</span></td>
                  <td>
                    <span class="result-val ${status}">${escHtml(String(r.value || r.valeur || "—"))}</span>
                    <span class="result-ref">${escHtml(r.unit || r.unite || "")}</span>
                    <span class="result-indicator" style="color:${status==='high'?'#a33a3a':status==='low'?'#8a6214':'#1f5c47'}">
                      ${status === 'high' ? '↑' : status === 'low' ? '↓' : '✓'}
                    </span>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // Compte-rendu / conclusion (imagerie)
  if (a.conclusion) {
    html += `
      <div class="modal-section">
        <div class="modal-section-title">Compte-rendu</div>
        <div class="modal-text-block">${escHtml(a.conclusion)}</div>
      </div>
    `;
  }

  // Fichier image
  if (a.isImage || ["radiographie","echographie","scanner"].includes(a.category)) {
    html += `
      <div class="modal-section">
        <div class="modal-section-title">Document / Image</div>
        <div class="image-placeholder">
          <div class="image-placeholder-icon">${a.emoji}</div>
          <div class="image-placeholder-text">${escHtml(a.name)}</div>
          <div class="image-placeholder-sub">
            ${a.fichier
              ? `<a href="${escHtml(a.fichier)}" target="_blank" style="color:#3a8a63;font-weight:500;">Ouvrir le fichier →</a>`
              : "Aucun fichier joint"
            }
          </div>
        </div>
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
  renderList();
}

function setSort(val) {
  sortOrder = val;
  renderList();
}

function setSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderList();
}

// ── Helpers ──
function showLoading(show) {
  document.getElementById("loadingState").style.display  = show ? "flex"  : "none";
  document.getElementById("analysesList").style.display  = "none";
  document.getElementById("emptyState").style.display    = "none";
  if (!show) renderList();
}

function parseDate(raw) {
  if (!raw) return new Date(NaN);
  return new Date(raw);
}

const MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function catLabel(cat) {
  return {
    sanguin:      "Bilan sanguin",
    radiographie: "Radiographie",
    echographie:  "Échographie",
    scanner:      "Scanner / IRM",
    autre:        "Autre",
  }[cat] || cat;
}

function statusClass(s) {
  return { done: "done", pending: "pending", expired: "expired", active: "done" }[s] || "done";
}

function statusLabel(s) {
  return { done: "Reçu", pending: "En attente", expired: "Expiré", active: "Reçu" }[s] || s;
}

function detectResultStatus(r) {
  // Essaie de détecter si la valeur est hors norme depuis les champs
  if (r.status) return r.status;
  if (r.anormal !== undefined) return r.anormal ? "high" : "normal";
  return "normal";
}

function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
