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
    text.textContent = 'mot de passe Trop court';
    text.style.color = 'red';
  } else if (len < 8) {
    bar.style.width = '60%';
    bar.style.background = 'orange';
    text.textContent = ' !toujours court ...';
    text.style.color = 'orange';
  } else {
    bar.style.width = '100%';
    bar.style.background = 'green';
    text.textContent = ' Mot de passe valide !';
    text.style.color = 'green';
  }
});

// lecture de message de URL
const params = new URLSearchParams(window.location.search);
const message = params.get('message');

if (message) {
    const messages = {
        'mots_de_passe': 'Les mots de passe ne correspondent pas.',
        'email_invalide': 'Email non valide.',
        'email_existe': 'Cet email est déjà utilisé.',
        'succes': 'Inscription réussie !'
    };

    alert(messages[message] || ' Une erreur est survenue.');
}

//voir si les mdps correspondent 
const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
    const password = document.getElementById('motdepasse').value;
    const confirm = document.getElementById('confirmer_passe').value;

    if (password !== confirm) {
        e.preventDefault(); 
        alert('Les mots de passe ne correspondent pas.');
    }
});