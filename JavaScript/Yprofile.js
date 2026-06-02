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

    // helper sécurisé
    const setValue = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = value ?? '';
    };

    // identité
    setValue('nom', data.nom);
    setValue('prenom', data.prenom);
    setValue('email', data.email);

    if (data.date_naissance) {
      setValue('dob', data.date_naissance.split(' ')[0]);
    }

    // infos perso
    setValue('telephone', data.telephone);
    setValue('wilaya', data.wilaya);

    // biométrie
    setValue('taille', data.taille);
    setValue('poids', data.poids);
    setValue('groupe_sanguin', data.groupe_sanguin);

    // médical
    setValue('antecedents', data.antecedents);

    // urgence
    setValue('tel', data.urgence_tel);

    // GENRE (radio buttons)
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


// Appeler la fonction au chargement
document.addEventListener("DOMContentLoaded", function() {
  fillProfileForm();
});

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("profile-form");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        formData.append('user_id', storedUserId);
      }
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

});