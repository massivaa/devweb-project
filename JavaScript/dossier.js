
const API_BASE = "https://mknay.alwaysdata.net/php";

// ── État global ──
let allEvents   = [];
let typeFilter  = "all";
let sortOrder   = "desc";

// ── Point d'entrée ──
document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("logged_in") === "true";

  if (!isLoggedIn) {
    window.location.href = "connexion.html";
    return;
  }

  loadDossier();
});

async function loadDossier() {
  showLoading(true);

  try {
    // on a besoin de ordonnances, rendez-vous et analyses!!
    const [ordoRes, analyseRes, rdvRes] = await Promise.allSettled([
      fetchOrdonnances(),
      fetchAnalyses(),
      fetchConsultations(),
    ]);

    allEvents = [];

    if (ordoRes.status === "fulfilled") allEvents.push(...ordoRes.value);
    if (analyseRes.status === "fulfilled") allEvents.push(...analyseRes.value);
    if (rdvRes.status === "fulfilled") allEvents.push(...rdvRes.value);

  } catch (err) {
    console.error("Erreur chargement dossier:", err);
  }

  showLoading(false);
  renderTimeline();
}

// ordonnances 
async function fetchOrdonnances() {
  try {
    const res = await fetch(`${API_BASE}/get_ordonnances.php`, { credentials: "include" });
    const json = await res.json();

    if (!json.success || !Array.isArray(json.data)) return [];

    return json.data.map(o => ({
      date:   parseDate(o.date_emission || o.date || o.created_at),
      type:   "ordonnance",
      title:  o.titre || "Ordonnance",
      doctor: formatDoctor(o),
      motif:  o.motif || o.description || "",
      meds:   parseMeds(o.medicaments || o.meds || ""),
      status: o.statut || o.status || "active",
      raw:    o,
    }));
  } catch (err) {
    console.warn("Ordonnances non disponibles:", err);
    return [];
  }
}

//analyses
async function fetchAnalyses() {
  try {
    const res = await fetch(`${API_BASE}/get_analyses.php`, { credentials: "include" });
    const json = await res.json();

    if (!json.success || !Array.isArray(json.data)) return [];

    return json.data.map(a => ({
      date:   parseDate(a.date_analyse || a.date || a.created_at),
      type:   "analyse",
      title:  a.type_analyse || a.nom || "Analyse médicale",
      doctor: a.laboratoire || a.medecin || "",
      motif:  a.resultat || a.description || a.conclusion || "",
      meds:   [],
      status: a.statut || "done",
      raw:    a,
    }));
  } catch (err) {
    console.warn("Analyses non disponibles:", err);
    return [];
  }
}

// consultations ou rendez-vous
async function fetchConsultations() {
  try {
    const res = await fetch(`${API_BASE}/get_rendezvous.php`, { credentials: "include" });
    const json = await res.json();

    if (!json.success || !Array.isArray(json.data)) return [];

    return json.data.map(rdv => ({
      date:   parseDate(rdv.date_rdv || rdv.date || rdv.created_at),
      type:   "consultation",
      title:  "Consultation",
      doctor: `Dr ${rdv.prenom || ""} ${rdv.nom || ""}`.trim(),
      motif:  rdv.motif || rdv.specialite || rdv.notes || "",
      meds:   [],
      status: getConsultStatus(rdv),
      raw:    rdv,
    }));
  } catch (err) {
    console.warn("Consultations non disponibles:", err);
    return [];
  }
}

// Rendu de la timeline 
function renderTimeline() {
  const timeline = document.getElementById("timeline");
  const empty    = document.getElementById("emptyState");

  // Filtre par type
  let events = allEvents.filter(e => typeFilter === "all" || e.type === typeFilter);

  // Supprimer les events sans date valide
  events = events.filter(e => e.date instanceof Date && !isNaN(e.date));

  // Tri
  events.sort((a, b) =>
    sortOrder === "desc"
      ? b.date - a.date
      : a.date - b.date
  );

  if (events.length === 0) {
    timeline.style.display = "none";
    empty.style.display    = "block";
    return;
  }

  timeline.style.display = "block";
  empty.style.display    = "none";

  // Grouper par date
  const groups = groupByDay(events);
  const dates  = Object.keys(groups).sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b) - new Date(a)
      : new Date(a) - new Date(b)
  );

  let html = "";
  dates.forEach((dayKey, idx) => {
    const dayEvents = groups[dayKey];
    const d = new Date(dayKey);

    html += `
      <div class="timeline-group" style="animation-delay:${idx * 0.06}s">
        <div class="timeline-date-label">
          <span class="timeline-date-day">${d.getDate()}</span>
          <span class="timeline-date-month">${monthName(d)} ${d.getFullYear()}</span>
        </div>
        <div class="timeline-events">
          ${dayEvents.map(renderEvent).join("")}
        </div>
      </div>
    `;
  });

  timeline.innerHTML = html;
}

//Rendu d'un événement
function renderEvent(e) {
  const iconMap = {
    ordonnance:   { emoji: "📋", cls: "ordonnance"   },
    analyse:      { emoji: "🔬", cls: "analyse"      },
    consultation: { emoji: "🩺", cls: "consultation" },
  };

  const t = iconMap[e.type] || { emoji: "📄", cls: "ordonnance" };

  const medsHtml = e.meds && e.meds.length
    ? `<div class="event-meds">${e.meds.map(m => `<span class="med-tag">${escHtml(m)}</span>`).join("")}</div>`
    : "";

  const motifHtml = e.motif
    ? `<p class="event-motif">${escHtml(e.motif)}</p>`
    : "";

  const doctorHtml = e.doctor
    ? `<p class="event-doctor">${escHtml(e.doctor)}</p>`
    : "";

  return `
    <div class="event-card">
      <div class="event-icon-wrap ${t.cls}">${t.emoji}</div>
      <div class="event-body">
        <p class="event-title">${escHtml(e.title)}</p>
        ${doctorHtml}
        ${motifHtml}
        ${medsHtml}
      </div>
      <div class="event-status-wrap">
        <span class="status-pill ${statusClass(e.status)}">${statusLabel(e.status)}</span>
      </div>
    </div>
  `;
}

// ── Contrôles ──
function setTypeFilter(btn, filter) {
  typeFilter = filter;
  document.querySelectorAll(".type-chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderTimeline();
}

function setSortOrder(val) {
  sortOrder = val;
  renderTimeline();
}

// ── Helpers ──
function showLoading(show) {
  document.getElementById("loadingState").style.display  = show ? "flex"  : "none";
  document.getElementById("timeline").style.display      = show ? "none"  : "";
  document.getElementById("emptyState").style.display    = "none";
}

function parseDate(raw) {
  if (!raw) return new Date(NaN);
  // Accepte "YYYY-MM-DD", "YYYY-MM-DD HH:MM:SS", timestamps
  const d = new Date(raw);
  return isNaN(d) ? new Date(NaN) : d;
}

function groupByDay(events) {
  const groups = {};
  events.forEach(e => {
    const key = e.date.toISOString().slice(0, 10); // "YYYY-MM-DD"
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return groups;
}

const MONTHS = [
  "janvier","février","mars","avril","mai","juin",
  "juillet","août","septembre","octobre","novembre","décembre"
];

function monthName(d) { return MONTHS[d.getMonth()]; }

function formatDoctor(o) {
  if (o.medecin_nom || o.medecin_prenom)
    return `Dr ${o.medecin_prenom || ""} ${o.medecin_nom || ""}`.trim();
  if (o.docteur) return o.docteur;
  return "";
}

function parseMeds(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  // Cas chaîne séparée par virgule ou point-virgule
  return raw.split(/[,;]/).map(s => s.trim()).filter(Boolean);
}

function getConsultStatus(rdv) {
  if (!rdv.date_rdv) return "done";
  const d = new Date(rdv.date_rdv);
  return d >= new Date() ? "pending" : "done";
}

function statusClass(s) {
  return { active: "active", done: "done", expired: "expired", pending: "pending" }[s] || "done";
}

function statusLabel(s) {
  return {
    active:  "Active",
    done:    "Effectué",
    expired: "Expirée",
    pending: "À venir",
  }[s] || s;
}

function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
