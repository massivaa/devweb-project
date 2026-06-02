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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email    = form.querySelector('[name="email"]').value;
        const password = form.querySelector('[name="password"]').value;

        try {
            const res = await fetch("../php/connexion.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                window.location.href = `../index.html?connected=true&nom=${encodeURIComponent(data.nom)}&prenom=${encodeURIComponent(data.prenom)}`;
            } else {
                alert(data.message ? `Erreur : ${data.message}` : "Erreur login");
            }

        } catch (err) {
            console.error(err);
            alert("Serveur inaccessible. Vérifiez que la page est servie depuis votre serveur local et que ../php/connexion.php est accessible.");
        }

        return;
    });
});