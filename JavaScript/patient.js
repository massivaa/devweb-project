const state = { patient: null };

async function loadProfile() {
  try {
    const res = await fetch('../php/profile.php');
    const data = await res.json();

    if (!data) return;

    state.patient = data;

    renderAll();
  } catch (e) {
    console.log("Erreur profil:", e);
  }
}

function renderAll() {
  const p = state.patient;
  if (!p) return;

  document.getElementById('displayName').textContent =
    (p.prenom || '') + ' ' + (p.nom || '');

  document.getElementById('nav-nom').textContent =
    'Bonjour, ' + (p.prenom || '') + ' !';

  document.getElementById('vPoids').textContent = p.poids ? p.poids + ' kg' : '—';
  document.getElementById('vTaille').textContent = p.taille ? p.taille + ' cm' : '—';
  document.getElementById('vImc').textContent = p.imc || '—';
  document.getElementById('vGroupe').textContent = p.groupe_sanguin || '—';

  if (p.antecedents) {
    document.getElementById('antecedentsEmpty').style.display = 'none';
    document.getElementById('antecedentsList').style.display = 'block';

    document.getElementById('antecedentsList').innerHTML =
      p.antecedents.split(',').map(a =>
        `<span class="antecedent-tag">${a.trim()}</span>`
      ).join('');
  }
}

loadProfile();

async function loadRendezVous() {
  const res = await fetch('../php/get_rendezvous.php');
  const data = await res.json();

  const list = document.getElementById('rdvList');
  const empty = document.getElementById('rdvEmpty');

  if (!data.length) {
    empty.style.display = 'flex';
    list.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  list.style.display = 'block';

  list.innerHTML = data.map(rdv => `
    <div class="rdv-item">

      <div class="rdv-info">
        <div class="rdv-doc">Dr ${rdv.prenom} ${rdv.nom}</div>
        <div class="rdv-spec">${rdv.specialite}</div>
      </div>

      <div class="rdv-right">
        <span class="rdv-date-main">${rdv.date_rdv}</span>
        <span class="rdv-date-time">${rdv.heure}</span>

        <button onclick="deleteRdv(${rdv.id})" class="btn-sm gold">
          Annuler
        </button>
      </div>

    </div>
  `).join('');
}
loadRendezVous();


async function deleteRdv(id) {

  if (!confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) return;

  const formData = new FormData();
  formData.append("rdv_id", id);

  const res = await fetch("../php/annuler_rndv.php", {
    method: "POST",
    body: formData
  });

  const text = await res.text();

  if (text === "success") {
    loadRendezVous();
  } else {
    alert("Erreur suppression");
  }
}