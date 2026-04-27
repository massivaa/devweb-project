document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("logoutBtn");

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
        method: "POST",
        credentials: "include"
      });

      const text = await res.text();   

      console.log("RAW RESPONSE:", text);

      const data = JSON.parse(text);  

      if (data.success) {
        window.location.href = "/index.html";
      } else {
        alert("Logout failed");
      }

    } catch (err) {
      console.error("REAL ERROR:", err);
      alert(err.message);
    }
  });

});