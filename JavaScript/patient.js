async function loadProfile() {
  const res = await fetch('https://mknay.alwaysdata.net/php/profile.php', {
    credentials: "include" // 🔥 SINON SESSION MORTE
  });

  const result = await res.json();

  if (!result.success) return;

  const p = result.data;

  document.getElementById('displayName').textContent =
    (p.prenom || '') + ' ' + (p.nom || '');
}

async function loadRendezVous() {
  const res = await fetch('https://mknay.alwaysdata.net/php/get_rendezvous.php', {
    credentials: "include"
  });

  const result = await res.json();

  if (!result.success) return;

  const data = result.data;

  const list = document.getElementById('rdvList');

  list.innerHTML = data.map(rdv => `
    <div>
      Dr ${rdv.prenom} ${rdv.nom} - ${rdv.date_rdv}
      <button onclick="deleteRdv(${rdv.id})">Annuler</button>
    </div>
  `).join('');
}

async function deleteRdv(id) {

  const formData = new FormData();
  formData.append("rdv_id", id);

  const res = await fetch("https://mknay.alwaysdata.net/php/annuler_rndv.php", {
    method: "POST",
    credentials: "include", // 🔥
    body: formData
  });

  const data = await res.json();

  if (data.success) {
    loadRendezVous();
  } else {
    alert("Erreur suppression");
  }
}