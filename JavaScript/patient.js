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

// Appeler les fonctions au chargement
document.addEventListener("DOMContentLoaded", function() {
  const isLoggedIn = localStorage.getItem('logged_in') === 'true';
  const guestWarning = document.getElementById('guestWarning');
  const pageLayout = document.querySelector('.layout');

  if (!isLoggedIn) {
    if (guestWarning) {
      guestWarning.style.display = 'flex';
    }
    if (pageLayout) {
      pageLayout.style.display = 'grid';
    }
    return;
  }

  if (guestWarning) {
    guestWarning.style.display = 'none';
  }

  if (pageLayout) {
    pageLayout.style.display = 'grid';
  }

  loadProfile();
  loadRendezVous();
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

    console.log("PROFILE DATA:", result); 

    if (!result.success) return;

    const data = result.data;

    // NAME
    const displayName = [(data.prenom || ''), (data.nom || '')]
      .filter(Boolean)
      .join(' ') || '— Nom non renseigné —';
    document.getElementById('displayName').textContent = displayName;

    const emailEl = document.getElementById('patientEmail');
    const phoneEl = document.getElementById('patientPhone');
    if (emailEl) {
      emailEl.textContent = data.email ? `Email : ${data.email}` : 'Email : —';
    }
    if (phoneEl) {
      phoneEl.textContent = data.telephone ? `Tél : ${data.telephone}` : 'Tél : —';
    }

    // VITALS
    document.getElementById('vPoids').textContent = data.poids || '—';
    document.getElementById('vTaille').textContent = data.taille || '—';
    document.getElementById('vImc').textContent = data.imc
      ? parseFloat(data.imc).toFixed(1)
      : '—';
    document.getElementById('vGroupe').textContent = data.groupe_sanguin || '—';

    const statusText = document.getElementById('statusText');
    if (statusText) {
      const isComplete = data.nom && data.prenom && data.email && data.poids && data.taille && data.groupe_sanguin;
      statusText.textContent = isComplete ? 'Profil complet' : 'Profil incomplet';
    }

  } catch (err) {
    console.error("Erreur loadProfile:", err);
  }
}