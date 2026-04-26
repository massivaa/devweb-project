// 1. Password strength bar
const passwordInput = document.getElementById('motdepasse');
const bar = document.getElementById('strength-bar');
const text = document.getElementById('strength-text');

passwordInput.addEventListener('input', function() {
  const len = passwordInput.value.length;

  if (len === 0) {
    bar.style.width = '0%';
    text.textContent = 'Entrez un mot de passe';
    text.style.color = 'gray';
  } else if (len < 5) {
    bar.style.width = '25%';
    bar.style.background = 'red';
    text.textContent = 'Mot de passe trop court';
    text.style.color = 'red';
  } else if (len < 8) {
    bar.style.width = '60%';
    bar.style.background = 'orange';
    text.textContent = 'Toujours trop court...';
    text.style.color = 'orange';
  } else {
    bar.style.width = '100%';
    bar.style.background = 'green';
    text.textContent = 'Mot de passe valide !';
    text.style.color = 'green';
  }
});

// 2. Form submit — fetch instead of HTML redirect
const form = document.querySelector('form');

form.addEventListener('submit', async function(e) {
    e.preventDefault(); // always stop the HTML form

    const password = document.getElementById('motdepasse').value;
    const confirm  = document.getElementById('confirmer_passe').value;

    // client-side check first
    if (password !== confirm) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    const body = new URLSearchParams({
        name:             form.querySelector('[name="name"]').value,
        surname:          form.querySelector('[name="surname"]').value,
        email:            form.querySelector('[name="email"]').value,
        password:         password,
        confirm_password: confirm,
        date:             form.querySelector('[name="date"]').value,
        gender:           form.querySelector('[name="gender"]').value,
    });

    try {
        const res  = await fetch("https://mknay.alwaysdata.net/php/inscription.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = "../Content/connexion.html";
        } else {
            const messages = {
                'mots_de_passe':  'Les mots de passe ne correspondent pas.',
                'email_invalide': 'Email non valide.',
                'email_existe':   'Cet email est déjà utilisé.',
                'db_error':       'Erreur serveur, réessayez.'
            };
            alert(messages[data.message] || 'Une erreur est survenue.');
        }

    } catch (err) {
        alert("Impossible de contacter le serveur.");
        console.error(err);
    }
});