async function fillProfileForm() {

  const res = await fetch('https://mknay.alwaysdata.net/php/profile.php', {
    credentials: "include"
  });

  const result = await res.json();

  if (!result.success) return;

  const data = result.data;

  document.getElementById('nom').value = data.nom || '';
  document.getElementById('prenom').value = data.prenom || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('dob').value = data.dob || '';
  document.getElementById('genre').value = data.genre || '';
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