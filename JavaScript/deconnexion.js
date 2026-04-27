window.logout = async function () {
  try {
    const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
      method: "POST",
      credentials: "include"
    });

    const data = await res.json();

    if (data.success) {

      // 🔥 FORCE UI RESET
      localStorage.removeItem("user"); // if you store user
      sessionStorage.clear();

      // reload page to refresh navbar state
      window.location.href = "/index.html";

    }

  } catch (err) {
    console.error(err);
    alert("Logout failed");
  }
};