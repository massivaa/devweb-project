document.addEventListener("DOMContentLoaded", function () {

  const summary = document.getElementById("orderSummary");

  //  AUTO FILL USER INFO
  const prenom = localStorage.getItem("user_prenom") || "";
  const nom = localStorage.getItem("user_nom") || "";
  const emailLS = localStorage.getItem("user_email") || "";
  const phoneLS = localStorage.getItem("user_phone") || "";

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  if (fullNameInput && (prenom || nom)) {
    fullNameInput.value = (prenom + " " + nom).trim();
  }

  if (emailInput && emailLS) {
    emailInput.value = user.email || "";
  }

  if (phoneInput && phoneLS) {
    phoneInput.value = user.telephone || "";
  }

  //CART
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!summary) return;

  if (cart.length === 0) {
    summary.innerHTML = "<p>Votre panier est vide.</p>";
    return;
  }

  let total = 0;

  const itemsHTML = cart.map(item => {
    const line = item.price * item.qty;
    total += line;

    return `
      <div class="order-item">
        <span>${item.name} (${item.dosage}) x${item.qty}</span>
        <span>${line.toLocaleString("fr-FR")} DA</span>
      </div>
    `;
  }).join("");

  summary.innerHTML = `
    ${itemsHTML}
    <div class="order-total">
      <span>Total:</span>
      <span>${total.toLocaleString("fr-FR")} DA</span>
    </div>
  `;

  window.totalPrice = total;
});



// PAYMENT
function traiterPaiement(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const postalCode = document.getElementById("postalCode").value;
  const country = document.getElementById("country").value;
  const cardName = document.getElementById("cardName").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const expiryMonth = document.getElementById("expiryMonth").value;
  const expiryYear = document.getElementById("expiryYear").value;
  const cvv = document.getElementById("cvv").value;
  const terms = document.getElementById("terms").checked;

  if (!fullName || !email || !phone || !address || !city || !postalCode || !country ||
      !cardName || !cardNumber || !expiryMonth || !expiryYear || !cvv || !terms) {

    showError(" Veuillez remplir tous les champs obligatoires.");
    return;
  }

  if (cardNumber.replace(/\s/g, '').length < 13) {
    showError(" Numéro de carte invalide.");
    return;
  }

  if (cvv.length < 3) {
    showError(" CVV invalide.");
    return;
  }

  document.getElementById("purchaseForm").style.display = "none";

  const success = document.getElementById("successMessage");

  success.style.display = "block";
  success.innerHTML = `
    <h3> Paiement Réussi!</h3>
    <p><strong>Montant payé:</strong> ${window.totalPrice} DA</p>
    <p><strong>Livraison à:</strong> ${fullName}, ${address}, ${postalCode} ${city}, ${country}</p>
    <p><strong>Email:</strong> ${email}</p>
    <button class="back-btn" onclick="goHome()">Retour à l'accueil</button>
  `;

  localStorage.removeItem("cart");
}



// ERROR

function showError(msg) {
  const el = document.getElementById("errorMessage");
  if (!el) return;

  el.style.display = "block";
  el.textContent = msg;

  setTimeout(() => {
    el.style.display = "none";
  }, 4000);
}



// HOME

function goHome() {
  window.location.href = "../index.html";
}