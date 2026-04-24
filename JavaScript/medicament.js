document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeUp 0.8s ease forwards";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".prod-card, .pharm-card").forEach((el) => {
    observer.observe(el);
  });

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const originalText = this.textContent;
      this.textContent = "✓ Ajouté";
      setTimeout(() => {
        this.textContent = originalText;
      }, 1500);
    });
  });

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const button = newsletterForm.querySelector("button");
      const originalText = button.textContent;
      button.textContent = "✓ Abonné";
      setTimeout(() => {
        button.textContent = originalText;
        newsletterForm.reset();
      }, 1500);
    });
  }

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});
