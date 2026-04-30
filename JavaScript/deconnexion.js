document.getElementById("logoutBtn").addEventListener("click", function(e){
    e.preventDefault();
    logout();
});
async function logout() {
    try {
        const res = await fetch("https://mknay.alwaysdata.net/php/deconnexion.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (data.success) {

            localStorage.removeItem("logged_in");
            localStorage.removeItem("user_nom");
            localStorage.removeItem("user_prenom");

            localStorage.setItem("auth_event", Date.now());

            window.location.href = "../index.html";
        }

    } catch (err) {
        console.error(err);
        alert("Logout failed");
    }
}

window.logout = logout;