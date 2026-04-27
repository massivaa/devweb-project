async function logout() {
    try {
        const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
            method: "POST",
            credentials: "include"
        });

        const data = await res.json();

        if (data.success) {
            // 🔥 send signal to navbar system
            localStorage.setItem("auth_event", Date.now());

            // redirect
            window.location.href = "index.html";
        }

    } catch (err) {
        console.error(err);
        alert("Logout failed");
    }
}

window.logout = logout;