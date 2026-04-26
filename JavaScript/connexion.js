document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form"); // or use your form's id: document.getElementById("yourFormId")

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // stop the HTML form from submitting the old way

        const email    = form.querySelector('[name="email"]').value;
        const password = form.querySelector('[name="password"]').value;

        try {
            const res = await fetch("https://mknay.alwaysdata.net/php/connexion.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            });

            const data = await res.json();

            if (data.success) {
                window.location.href = `../index.html?connected=true&nom=${encodeURIComponent(data.nom)}&prenom=${encodeURIComponent(data.prenom)}`;
            } else {
                const messages = {
                    'email_introuvable': 'Aucun compte trouvé avec cet email.',
                    'mauvais_mdp': 'Mot de passe incorrect.',
                    'db_error': 'Erreur serveur, réessayez.'
                };
                alert(messages[data.message] || 'Une erreur est survenue.');
            }

        } catch (err) {
            alert("Impossible de contacter le serveur.");
            console.error(err);
        }
    });

});