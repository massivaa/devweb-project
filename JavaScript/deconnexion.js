console.log("deconnexion.js loaded");
async function logout() {

    try {

        const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
            method: "POST",
            credentials: "include"
        });

        console.log("STATUS:", res.status);

        const text = await res.text();

        console.log("RESPONSE:", text);

        const data = JSON.parse(text);

        if (data.success) {

            localStorage.removeItem("logged_in");
            localStorage.removeItem("user_nom");
            localStorage.removeItem("user_prenom");

            window.location.href = "/index.html";
        }

    } catch (err) {

        console.error("LOGOUT ERROR:", err);

        alert("Logout failed");
    }
}

window.logout = logout;