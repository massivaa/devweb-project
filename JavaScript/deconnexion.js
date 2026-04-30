async function logout() {

    try {

        await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
            method: "POST",
            credentials: "include"
        });

        // clear storage FIRST
        localStorage.clear();

        // force clean reload
        window.location.href = window.location.origin + "/index.html";

    } catch (err) {

        console.error(err);
        alert("Logout failed");
    }
}

window.logout = logout;