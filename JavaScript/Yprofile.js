async function fillProfileForm() {
  try {
    const storedUserId = localStorage.getItem('user_id');
    const url = storedUserId
      ? `https://mknay.alwaysdata.net/php/profile.php?user_id=${encodeURIComponent(storedUserId)}`
      : 'https://mknay.alwaysdata.net/php/profile.php';

    const res = await fetch(url, {
      credentials: "include"
    });

    const result = await res.json();
    console.log("PROFILE DATA:", result);

    if (!result || !result.success || !result.data) return;

    const data = result.data || {};

    const setValue = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = value ?? '';
    };

    setValue('nom', data.nom);
    setValue('prenom', data.prenom);
    setValue('email', data.email);

    if (data.date_naissance) {
      setValue('dob', data.date_naissance.split(' ')[0]);
    }

    setValue('telephone', data.telephone);
    setValue('wilaya', data.wilaya);

    setValue('taille', data.taille);
    setValue('poids', data.poids);
    setValue('groupe_sanguin', data.groupe_sanguin);

    setValue('antecedents', data.antecedents);
    syncAntecedentsCheckboxes(data.antecedents);

    setValue('tel', data.urgence_tel);

    if (data.genre) {
      const male = document.getElementById('gender_homme');
      const female = document.getElementById('gender_femme');

      if (male && female) {
        male.checked = data.genre === "Homme";
        female.checked = data.genre === "Femme";
      }
    }

  } catch (err) {
    console.error("Erreur chargement profil:", err);
  }
}


// ===== ANTECEDENTS (AJOUT) =====
function updateAntecedents() {
  const antecedents = [];

  if (document.getElementById("maladie_diabete")?.checked) {
    antecedents.push("Diabète");
  }

  if (document.getElementById("maladie_asthme")?.checked) {
    antecedents.push("Asthme");
  }

  if (document.getElementById("maladie_hypertension")?.checked) {
    antecedents.push("Hypertension");
  }

  if (document.getElementById("maladie_autre")?.checked) {
    antecedents.push("Autre maladie chronique");
  }

  const field = document.getElementById("antecedents");
  if (field) field.value = antecedents.join(", ");
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", function () {
  fillProfileForm();

  const form = document.getElementById("profile-form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        formData.append('user_id', storedUserId);
      }

      try {
        const res = await fetch("https://mknay.alwaysdata.net/php/sauvgarder_profile.php", {
          method: "POST",
          credentials: "include",
          body: formData
        });

        const data = await res.json();

        if (data.success) {
          alert("Profil enregistré avec succès !");
          window.location.href = "patient.html";
        } else {
          alert("Erreur: " + (data.message || "échec"));
        }

      } catch (err) {
        console.error(err);
        alert("Erreur serveur");
      }
    });

    // ===== listeners checkbox =====
    [
      "maladie_diabete",
      "maladie_asthme",
      "maladie_hypertension",
      "maladie_autre"
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", updateAntecedents);
      }
    });
  }
});
function syncAntecedentsCheckboxes(antecedentsText) {
  if (!antecedentsText) return;

  const list = antecedentsText.toLowerCase();

  const map = {
    "diabète": "maladie_diabete",
    "diabete": "maladie_diabete",
    "asthme": "maladie_asthme",
    "hypertension": "maladie_hypertension",
    "autre": "maladie_autre"
  };

  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.checked = list.includes(key);
  });
}