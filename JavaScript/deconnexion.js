async function logout() {
    try {
        const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
            method: "POST",
            credentials: "include"
        });

        const data = await res.json();
        console.log("logout:", data);

        // ALWAYS clear client state
        localStorage.removeItem('user_nom');
        localStorage.removeItem('user_prenom');
        localStorage.removeItem('logged_in');

        // redirect cleanly (IMPORTANT FIX)
        window.location.href = "/index.html";

    } catch (err) {
        console.error(err);
        alert("Logout failed");
    }
}

window.logout = logout;