const params = new URLSearchParams(window.location.search);
const message = params.get('message');

if (message) {
    const messages = {
        'email_introuvable': 'Aucun compte trouvé avec cet email.',
        'mauvais_mdp': 'Mot de passe incorrect.'
    };

    alert(messages[message] || 'Une erreur est survenue.');
}