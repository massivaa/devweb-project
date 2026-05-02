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
  document.getElementById('dob').value = data.date || '';
}

// Appeler la fonction au chargement
document.addEventListener("DOMContentLoaded", function() {
  fillProfileForm();
});