
async function logout() {
  try {
    const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
      method: "POST",
      credentials: "include"
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/index.html";
    }

  } catch (err) {
    alert("Erreur déconnexion");
  }
}