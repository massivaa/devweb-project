document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email    = form.querySelector('[name="email"]').value;
        const password = form.querySelector('[name="password"]').value;

        try {
            const res = await fetch("https://mknay.alwaysdata.net/php/connexion.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            });

            const data = await res.json();

            if (data.success) {
                window.location.href = `../index.html?connected=true&nom=${encodeURIComponent(data.nom)}&prenom=${encodeURIComponent(data.prenom)}`;
            } else {
                alert("Erreur login");
            }

        } catch (err) {
            alert("Serveur inaccessible");
        }
    });
});