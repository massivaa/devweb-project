const form = document.querySelector('form');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const password = document.getElementById('motdepasse').value;
    const confirm  = document.getElementById('confirmer_passe').value;

    if (password !== confirm) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    const body = new URLSearchParams({
        name: form.querySelector('[name="name"]').value,
        surname: form.querySelector('[name="surname"]').value,
        email: form.querySelector('[name="email"]').value,
        password: password,
        confirm_password: confirm,
        date: form.querySelector('[name="date"]').value,
        gender: form.querySelector('[name="gender"]').value,
    });

    try {
        const res = await fetch("https://mknay.alwaysdata.net/php/inscription.php", {
            method: "POST",
            credentials: "include", 
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = "../Content/connexion.html";
        } else {
            alert("Erreur inscription");
        }

    } catch (err) {
        alert("Serveur inaccessible");
    }
});