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

window.onload = function(){
    if (localStorage.getItem("mode") === "dark"){
       document.body.classList.add("dark-mode"); 
    }
    setContactIconsForMode();
    updateDarkModeToggleButtons();
};

//fonction pour connexion de bar de navigation
const urlParams = new URLSearchParams(window.location.search);
const connected = urlParams.get('connected');
const nom = urlParams.get('nom');
const prenom = urlParams.get('prenom');


if (connected === 'true' && nom) {
    localStorage.setItem('user_nom', nom);
    localStorage.setItem('user_prenom', prenom);
    localStorage.setItem('logged_in', 'true');
}

const loggedIn = localStorage.getItem('logged_in');
const userPrenom = localStorage.getItem('user_prenom');

if (loggedIn === 'true') {
    document.getElementById('nav-guest').style.display = 'none';
    document.getElementById('nav-user').style.display = 'block';
    document.getElementById('nav-nom').textContent = 'Bonjour, ' + userPrenom + ' !';
} else {
    document.getElementById('nav-guest').style.display = 'block';
    document.getElementById('nav-user').style.display = 'none';
}