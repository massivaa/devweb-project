document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("logoutBtn");

  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
        method: "POST",
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/index.html";
      } else {
        alert("Erreur déconnexion");
      }

    } catch (err) {
      console.error(err);
      alert("Serveur inaccessible");
    }
  });

});