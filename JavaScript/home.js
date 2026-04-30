window.addEventListener('DOMContentLoaded', () => {

    const ctaBtn = document.getElementById('commencer');

    if (!ctaBtn) return;

    const loggedIn = localStorage.getItem('logged_in') === 'true';

    if (loggedIn) {

        ctaBtn.innerHTML = 'Voir mon profil <span class="btn-arrow">→</span>';
        ctaBtn.href = "./Content/patient.html";

    } else {

        ctaBtn.innerHTML = 'Commencer gratuitement <span class="btn-arrow">→</span>';
        ctaBtn.href = "./Content/inscription.html";
    }
});

const observer = new IntersectionObserver((entries) => {

    entries.forEach(e => {

        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }

    });

}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
});