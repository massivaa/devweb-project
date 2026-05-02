async function fillProfileForm() {

  try {
    const res = await fetch('https://mknay.alwaysdata.net/php/profile.php', {
      credentials: "include"
    });

    const result = await res.json();
    console.log("DATA:", result); // debug

    if (!result.success) return;

    const data = result.data;

    
    document.getElementById('nom').value = data.nom || '';
    document.getElementById('prenom').value = data.prenom || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('dob').value = data.date_naissance ? data.date_naissance.split(' ')[0] : '';
    document.getElementById('telephone').value = data.telephone || '';
    document.getElementById('wilaya').value = data.wilaya || '';

    document.getElementById('taille').value = data.taille || '';
    document.getElementById('poids').value = data.poids || '';
    document.getElementById('groupe_sanguin').value = data.groupe_sanguin || '';

    document.getElementById('antecedents').value = data.antecedents || '';

    document.getElementById('tel').value = data.urgence_tel || '';
    if (data.genre) {
      if (data.genre === "Homme") {
        document.getElementById("gender_homme").checked = true;
      } else if (data.genre === "Femme") {
        document.getElementById("gender_femme").checked = true;
      }
    }
  } catch (err) {
    console.error("Erreur:", err);
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