window.addEventListener('DOMContentLoaded', () => {
    const ctaBtn = document.getElementById('commencer');
    const loggedIn = localStorage.getItem('logged_in') === 'true';

    if (!ctaBtn) return;

    if (loggedIn) {
        ctaBtn.textContent = "Voir mon profil →";
        ctaBtn.href = "./Content/patient.html";
    } else {
        ctaBtn.textContent = "Commencer gratuitement →";
        ctaBtn.href = "./Content/inscription.html";
    }
});

 const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });