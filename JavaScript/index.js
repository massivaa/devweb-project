//fonction pour le mode nuit
function toggleMenu(){
    document.getElementById('nav-liens').classList.toggle('active');
    document.getElementById('nav-overlay').classList.toggle('active');
}

function setContactIconsForMode() {
    const emailIcon = document.querySelector('.icon-contact a[href^="mailto"] img');
    const phoneIcon = document.querySelector('.icon-contact a[href^="https://wa.me"] img');
    if (!emailIcon || !phoneIcon) return;

    if (document.body.classList.contains('dark-mode')) {
        emailIcon.src = '../images/emailb.png';
        phoneIcon.src = '../images/phoneb.png';
    } else {
        emailIcon.src = '../images/email.png';
        phoneIcon.src = '../images/phone.png';
    }
}

function updateDarkModeToggleButtons() {
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const icon = mode === 'dark' ? '☀️' : '🌘';
    document.querySelectorAll('button[onclick="toggleMode()"]').forEach(btn => {
        btn.textContent = icon;
    });
}

function toggleMode(){
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
    setContactIconsForMode();
    updateDarkModeToggleButtons();
}


//fonction pour connexion de bar de navigation
const urlParams = new URLSearchParams(window.location.search);
const connected = urlParams.get('connected');
const nom = urlParams.get('nom');
const prenom = urlParams.get('prenom');


if (connected === 'true' && nom) {
    localStorage.setItem('user_nom', nom);
    localStorage.setItem('user_prenom', prenom);
    localStorage.setItem('logged_in', 'true');
    window.history.replaceState({}, '', window.location.pathname);
}

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem("mode") === "dark") {
        document.body.classList.add("dark-mode");
    }
    setContactIconsForMode();
    updateDarkModeToggleButtons();

    const loggedIn = localStorage.getItem('logged_in') === 'true';
    const userPrenom = localStorage.getItem('user_prenom');

    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const navNom = document.getElementById('nav-nom');
    const commencer = document.getElementById('commencer');

    if (loggedIn) {
        if (navGuest) navGuest.style.display = 'none';
        if (navUser) navUser.style.display = 'flex';
        if (navNom) navNom.textContent = 'Bonjour, ' + userPrenom + ' !';
    } else {
        if (navGuest) navGuest.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
    }

    if (commencer) {
        if (loggedIn) {
            commencer.innerHTML = 'Voir mon profil <span class="btn-arrow">→</span>';
            commencer.href = './Content/patient.html';
        } else {
            commencer.innerHTML = 'Commencer gratuitement <span class="btn-arrow">→</span>';
            commencer.href = './Content/inscription.html';
        }
    }
    
});
if (window.location.pathname.includes("connexion.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get('connected');
    const nom = urlParams.get('nom');
    const prenom = urlParams.get('prenom');

    if (connected === 'true' && nom) {
        localStorage.setItem('user_nom', nom);
        localStorage.setItem('user_prenom', prenom);
        localStorage.setItem('logged_in', 'true');
        window.history.replaceState({}, '', window.location.pathname);
    }
}