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
      <button onclick="deleteRdv(${rdv.id})">Annuler</button>
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

// Appeler les fonctions au chargement
document.addEventListener("DOMContentLoaded", function() {
  loadProfile();
  loadRendezVous();
});
async function loadProfile() {
  try {
    const res = await fetch('https://mknay.alwaysdata.net/php/profile.php', {
      credentials: "include"
    });

    const result = await res.json();

    console.log("PROFILE DATA:", result); // 🔥 DEBUG

    if (!result.success) return;

    const data = result.data;

    // NAME
    document.getElementById('displayName').textContent =
      (data.nom || '') + ' ' + (data.prenom || '');

    // VITALS
    document.getElementById('vPoids').textContent = data.poids || '—';
    document.getElementById('vTaille').textContent = data.taille || '—';
    document.getElementById('vImc').textContent = data.imc
      ? parseFloat(data.imc).toFixed(1)
      : '—';
    document.getElementById('vGroupe').textContent = data.groupe_sanguin || '—';

  } catch (err) {
    console.error("Erreur loadProfile:", err);
  }
}