/* 
   DONNÉES — tirées de tes ordonnances
    */

var AVEC_ORDONNANCE = [
  // Hypertension
  { id:"a1",  name:"Lisinopril",          dosage:"10mg",          cat:"Hypertension",    posologie:"1 comprimé par jour",                       img:"../../images/medicaments/Lisinopril.webp" },
  { id:"a2",  name:"Amlodipine",          dosage:"5mg",           cat:"Hypertension",    posologie:"1 comprimé par jour",                       img:"../images/medicaments/amlodipine.jpg" },
  { id:"a3",  name:"Perindopril",         dosage:"4mg – 8mg",     cat:"Hypertension",    posologie:"4–8mg une fois par jour, le matin",         img:"../images/medicaments/perindopril.webp" },
  { id:"a4",  name:"Hydrochlorothiazide", dosage:"12.5mg – 50mg", cat:"Hypertension",    posologie:"12.5–50mg une fois par jour, le matin",     img:"../images/medicaments/Hydrochlorothiazide.jpg" },
  { id:"a5",  name:"Bisoprolol",          dosage:"2.5mg – 10mg",  cat:"Hypertension",    posologie:"2.5–10mg une fois par jour",                img:"../images/medicaments/Bisoprolol.png" },
  // Diabète
  { id:"a6",  name:"Metformine",          dosage:"500mg",         cat:"Diabète type 2",  posologie:"2 comprimés 2 fois par jour",               img:"../images/medicaments/Metformine.png" },
  { id:"a7",  name:"Glibenclamide",       dosage:"5mg",           cat:"Diabète type 2",  posologie:"1 comprimé par jour",                       img:"../images/medicaments/Glibenclamide.webp" },
  { id:"a8",  name:"Gliclazide",          dosage:"30mg – 80mg",   cat:"Diabète type 2",  posologie:"30–240mg en 1–2 prises pendant les repas",  img:"../images/medicaments/Gliclazide.jpg" },
  { id:"a9",  name:"Sitagliptine",        dosage:"50mg – 100mg",  cat:"Diabète type 2",  posologie:"50–100mg une fois par jour",                img:"../images/medicaments/Sitagliptine.webp" },
  // Asthme
  { id:"a10", name:"Salbutamol",          dosage:"100mcg",        cat:"Asthme",          posologie:"2 inhalations 3 fois par jour",             img:"../images/medicaments/Salbutamol.jpg" },
  { id:"a11", name:"Fluticasone",         dosage:"250mcg",        cat:"Asthme",          posologie:"2 inhalations 2 fois par jour",             img:"../images/medicaments/Fluticasone.jpg" },
  { id:"a12", name:"Béclométhasone",      dosage:"50µg/dose",     cat:"Asthme",          posologie:"100–250µg 2 fois par jour",                 img:"../images/medicaments/Béclométhasone.jpg" },
  // Rhumatologie
  { id:"a13", name:"Méthotrexate",        dosage:"7.5mg",         cat:"Rhumatologie",    posologie:"1 comprimé une fois par semaine",           img:"../images/medicaments/Méthotrexate.jpg" },
  { id:"a14", name:"Ibuprofène",          dosage:"400mg",         cat:"Rhumatologie",    posologie:"1 comprimé 3 fois par jour",                img:"../images/medicaments/ibuprofene.webp" },
  // Psychiatrie
  { id:"a15", name:"Sertraline",          dosage:"50mg",          cat:"Psychiatrie",     posologie:"1 comprimé par jour",                       img:"../images/medicaments/Sertraline.jpeg" },
  { id:"a16", name:"Paroxétine",          dosage:"20mg",          cat:"Psychiatrie",     posologie:"1 comprimé par jour",                       img:"../images/medicaments/Paroxétine.jpeg" }
];

var SANS_ORDONNANCE = [
  { id:"s1", name:"Doliprane 1000mg",  dosage:"1000mg", cat:"Antidouleur",        posologie:"1 comprimé toutes les 6h max",      price:250, oldPrice:320,  img:"../images/medicaments/doliprane.jpg" },
  { id:"s2", name:"Ibuprofène 200mg",  dosage:"200mg",  cat:"Anti-inflammatoire", posologie:"1 comprimé 3 fois par jour",        price:310, oldPrice:null, img:"../images/medicaments/ibuprofene.webp" },
  { id:"s3", name:"Vitamine C 500mg",  dosage:"500mg",  cat:"Vitamines",          posologie:"1 comprimé par jour",               price:180, oldPrice:220,  img:"../images/medicaments/VitamineC.jpg" },
  { id:"s4", name:"Strepsils Citron",  dosage:"—",      cat:"ORL",                posologie:"1 pastille toutes les 2–3h",        price:150, oldPrice:null, img:"../images/medicaments/strepsils.webp" },
  { id:"s5", name:"Smecta 3g",         dosage:"3g",     cat:"Gastro",             posologie:"1 sachet 3 fois par jour",          price:200, oldPrice:250,  img:"../images/medicaments/smecta.png" },
  { id:"s6", name:"Gaviscon Menthe",   dosage:"—",      cat:"Gastro",             posologie:"2–4 comprimés après chaque repas",  price:290, oldPrice:null, img:"../images/medicaments/gaviscon.jpg" },
  { id:"s7", name:"Zinc + Sélénium",   dosage:"—",      cat:"Compléments",        posologie:"1 comprimé par jour",               price:420, oldPrice:null, img:"../images/medicaments/zinc.jpg" }
];

/* 
   PANIER
    */
var cart = [];

function addToCart(id, btn) {
  var product = null;
  for (var i = 0; i < SANS_ORDONNANCE.length; i++) {
    if (SANS_ORDONNANCE[i].id === id) { product = SANS_ORDONNANCE[i]; break; }
  }
  if (!product) return;

  var found = false;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].id === id) { cart[j].qty++; found = true; break; }
  }
  if (!found) {
    cart.push({ id: product.id, name: product.name, dosage: product.dosage,
                price: product.price, img: product.img, qty: 1 });
  }

  btn.textContent = "✓ Ajouté";
  btn.classList.add("added");
  var b = btn;
  setTimeout(function() { b.textContent = "+ Panier"; b.classList.remove("added"); }, 1200);

  renderPanier();
}

function changeQty(id, delta) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty += delta;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      break;
    }
  }
  renderPanier();
}

function removeItem(id) {
  var next = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) next.push(cart[i]);
  }
  cart = next;
  renderPanier();
}

function renderPanier() {
  var countEl  = document.getElementById("cartCount");
  var itemsEl  = document.getElementById("panierItems");
  var footerEl = document.getElementById("panierFooter");
  if (!countEl || !itemsEl || !footerEl) return;

  var totalQty = 0;
  for (var k = 0; k < cart.length; k++) totalQty += cart[k].qty;
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML =
      '<div class="panier-empty">' +
        '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>' +
        '<p>Votre panier est vide</p>' +
      '</div>';
    footerEl.style.display = "none";
    return;
  }

  var html = "";
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var lineTotal = (item.price * item.qty).toLocaleString("fr-FR");
    html +=
      '<div class="panier-item">' +
        '<div class="panier-item-img">' +
          '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="panier-item-info">' +
          '<div class="panier-item-name">' + item.name + '</div>' +
          '<div class="panier-item-dosage">' + item.dosage + '</div>' +
          '<div class="panier-item-price">' + lineTotal + ' DA</div>' +
          '<div class="panier-item-qty">' +
            '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\',-1)">−</button>' +
            '<span class="qty-val">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\',+1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="item-remove" onclick="removeItem(\'' + item.id + '\')" title="Supprimer">✕</button>' +
      '</div>';
  }
  itemsEl.innerHTML = html;

  var subtotal = 0;
  for (var j = 0; j < cart.length; j++) subtotal += cart[j].price * cart[j].qty;
  document.getElementById("subtotal").textContent = subtotal.toLocaleString("fr-FR") + " DA";
  document.getElementById("total").textContent    = subtotal.toLocaleString("fr-FR") + " DA";
  footerEl.style.display = "block";
}

/* 
   DRAWER
    */
function togglePanier() {
  var panier  = document.getElementById("panier");
  var overlay = document.getElementById("overlay");
  if (panier.classList.contains("open")) {
    panier.classList.remove("open");
    overlay.classList.remove("show");
  } else {
    panier.classList.add("open");
    overlay.classList.add("show");
  }
}

/* 
   MODAL ORDONNANCE
    */
function showModal() {
  document.getElementById("modal").classList.add("show");
  document.getElementById("modalOverlay").classList.add("show");
}
function closeModal() {
  document.getElementById("modal").classList.remove("show");
  document.getElementById("modalOverlay").classList.remove("show");
}

/* 
   RENDU GRILLES
    */
function renderSans() {
  var grid = document.getElementById("grid-sans");
  if (!grid) return;
  var html = "";
  for (var i = 0; i < SANS_ORDONNANCE.length; i++) {
    var p = SANS_ORDONNANCE[i];
    var oldP = p.oldPrice ? '<small>' + p.oldPrice + ' DA</small>' : '';
    html +=
      '<div class="product-card" data-name="' + p.name.toLowerCase() + '">' +
        '<div class="product-img">' +
          '<img src="' + p.img + '" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
          '<div class="img-fallback"></div>' +
        '</div>' +
        '<div class="product-body">' +
          '<div class="product-cat">' + p.cat + '</div>' +
          '<div class="product-name">' + p.name + '</div>' +
          '<div class="product-desc">' + p.posologie + '</div>' +
        '</div>' +
        '<div class="product-footer">' +
          '<div class="product-price">' + p.price + ' DA ' + oldP + '</div>' +
          '<button class="btn-add" onclick="addToCart(\'' + p.id + '\', this)">+ Panier</button>' +
        '</div>' +
      '</div>';
  }
  grid.innerHTML = html;
}

function renderAvec() {
  var grid = document.getElementById("grid-avec");
  if (!grid) return;
  var html = "";
  for (var i = 0; i < AVEC_ORDONNANCE.length; i++) {
    var p = AVEC_ORDONNANCE[i];
    html +=
      '<div class="product-card locked" data-name="' + p.name.toLowerCase() + '">' +
        '<div class="product-img">' +
          '<img src="' + p.img + '" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
          '<div class="img-fallback"></div>' +
          '<div class="lock-badge">🔒 Ordonnance</div>' +
        '</div>' +
        '<div class="product-body">' +
          '<div class="product-cat">' + p.cat + '</div>' +
          '<div class="product-name">' + p.name + ' <span class="dosage-tag">' + p.dosage + '</span></div>' +
          '<div class="product-desc">' + p.posologie + '</div>' +
        '</div>' +
        '<div class="product-footer">' +
          '<div class="product-price ordo-label">Sur ordonnance</div>' +
          '<button class="btn-locked" onclick="showModal()">🔒 Ordonnance</button>' +
        '</div>' +
      '</div>';
  }
  grid.innerHTML = html;
}

/* 
   FILTRES
    */
var activeTab = "tous";

function setTab(btn, tab) {
  activeTab = tab;
  var tabs = document.querySelectorAll(".tab");
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");
  btn.classList.add("active");
  applyFilters();
}

function filterProducts() { applyFilters(); }

function applyFilters() {
  var query   = document.getElementById("searchInput").value.toLowerCase().trim();
  var secSans = document.getElementById("sec-sans");
  var secAvec = document.getElementById("sec-avec");

  secSans.style.display = (activeTab === "avec") ? "none" : "";
  secAvec.style.display = (activeTab === "sans") ? "none" : "";

  var cards = document.querySelectorAll(".product-card");
  for (var i = 0; i < cards.length; i++) {
    var name = cards[i].getAttribute("data-name") || "";
    cards[i].style.display = (!query || name.indexOf(query) !== -1) ? "" : "none";
  }
}

/* 
   INIT
    */
document.addEventListener("DOMContentLoaded", function() {
  renderSans();
  renderAvec();
  renderPanier();
});

function goToCheckout() {
  if (cart.length === 0) return;

  // sauvgarde 
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "formulaireAchat.html";
}