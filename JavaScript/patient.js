async function loadRendezVous() {
  const res = await fetch('https://mknay.alwaysdata.net/php/get_rendezvous.php', {
    credentials: "include"
  });

  const result = await res.json();

  if (!result.success) return;

  const data = result.data;

  const list = document.getElementById('rdvList');
  const empty = document.getElementById('rdvEmpty');

  if (data.length === 0) {
    empty.style.display = 'block';
    list.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  list.style.display = 'block';

  list.innerHTML = data.map(rdv => `
    <div class="rdv-item">
      <strong>Dr ${rdv.prenom} ${rdv.nom}</strong><br>
      ${rdv.date_rdv} à ${rdv.heure}
      <br>
      <button class="cancel-btn" onclick="deleteRdv(${rdv.id})">Annuler</button>
    </div>
  `).join('');
}

async function deleteRdv(id) {
  const formData = new FormData();
  formData.append("rdv_id", id);

  const res = await fetch("https://mknay.alwaysdata.net/php/annuler_rndv.php", {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const data = await res.json();

  if (data.success) {
    loadRendezVous();
  } else {
    alert("Erreur suppression");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem('logged_in') === 'true';
  const guestWarning = document.getElementById('guestWarning');
  const pageLayout = document.querySelector('.layout');

  if (!isLoggedIn) {
    if (guestWarning) guestWarning.style.display = 'flex';
    if (pageLayout) pageLayout.style.display = 'grid';
    return;
  }

  if (guestWarning) guestWarning.style.display = 'none';
  if (pageLayout) pageLayout.style.display = 'grid';

  loadProfile();
  loadRendezVous();
  loadOrdonnances();
});


async function loadProfile() {
  try {
    const storedUserId = localStorage.getItem('user_id');

    const profileUrl = storedUserId
      ? `https://mknay.alwaysdata.net/php/profile.php?user_id=${encodeURIComponent(storedUserId)}`
      : 'https://mknay.alwaysdata.net/php/profile.php';

    const res = await fetch(profileUrl, {
      credentials: "include"
    });

    const result = await res.json();

    if (!result.success) return;

    const data = result.data;

    const displayName = [(data.prenom || ''), (data.nom || '')]
      .filter(Boolean)
      .join(' ') || '— Nom non renseigné —';

    document.getElementById('displayName').textContent = displayName;

    document.getElementById('vPoids').textContent = data.poids || '—';
    document.getElementById('vTaille').textContent = data.taille || '—';
    document.getElementById('vImc').textContent = data.imc
      ? parseFloat(data.imc).toFixed(1)
      : '—';
    document.getElementById('vGroupe').textContent = data.groupe_sanguin || '—';

    const statusText = document.getElementById('statusText');
    if (statusText) {
      const isComplete =
        data.nom &&
        data.prenom &&
        data.email &&
        data.poids &&
        data.taille &&
        data.groupe_sanguin;

      statusText.textContent = isComplete ? 'Profil complet' : 'Profil incomplet';
    }

    renderAntecedents(data.antecedents);

  } catch (err) {
    console.error("Erreur loadProfile:", err);
  }
}

function renderAntecedents(text) {
  const empty = document.getElementById('antecedentsEmpty');
  const list = document.getElementById('antecedentsList');

  if (!text || text.trim() === "") {
    if (empty) empty.style.display = 'block';
    if (list) list.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (list) list.style.display = 'block';

  const items = text.split(',').map(e => e.trim()).filter(Boolean);

  list.innerHTML = items.map(item => `
    <div class="antecedent-item">
      🩺 ${item}
    </div>
  `).join('');
}

async function loadOrdonnances() {
  try {
    const res = await fetch('https://mknay.alwaysdata.net/php/ordonnance.php', {
      credentials: "include"
    });

    const result = await res.json();
    console.log("ORDO PATIENT:", result);

    if (!result.success || !Array.isArray(result.data)) {
      renderOrdonnances([]);
      return;
    }

    renderOrdonnances(result.data);

  } catch (err) {
    console.error("Erreur loadOrdonnances:", err);
    renderOrdonnances([]);
  }
}
function renderOrdonnances(data) {
  const empty = document.getElementById('ordoEmpty');
  const list  = document.getElementById('ordoList');

  if (!list || !empty) return;

  if (!data || data.length === 0) {
    empty.style.display = 'block';
    list.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  list.style.display = 'block';

  list.innerHTML = data.map(ordo => {
    const date = ordo.date || ordo.date_emission || "—";
    const medecin = ordo.medecin || ordo.doctor || ordo.nom_medecin || "";

    return `
      <div class="ordo-item">
        <div class="ordo-title">
          📄 Ordonnance du ${date}
        </div>

        <div class="ordo-body">
          ${medecin ? `<strong>Dr ${medecin}</strong><br>` : ""}
          ${ordo.description || ordo.motif || ""}
        </div>

        ${ordo.fichier ? `
          <a href="${ordo.fichier}" target="_blank" class="ordo-btn">
            Voir PDF
          </a>
        ` : ""}
      </div>
    `;
  }).join('');
}