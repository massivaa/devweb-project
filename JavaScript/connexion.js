document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const passwordInput = document.querySelector('#motdepasse');
    const togglePassword = document.querySelector('#togglePassword');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const visible = passwordInput.type === 'text';
            passwordInput.type = visible ? 'password' : 'text';
            togglePassword.textContent = visible ? '⌣' : '👁';
        });
    }

    if (window.location.protocol === 'file:') {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Ouvrez cette page depuis votre serveur local XAMPP, par exemple : http://localhost/devwebprojet/Content/connexion.html");
        });
        return;
    }

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