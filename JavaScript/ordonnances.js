const ordonnances = [
{
id:"2026-001",
date:"12/03/2026",
doctor:"Dr Ahmed Benali",
speciality:"Cardiologue",
status:"active",

medicaments:[
{
nom:"Cardioaspirine",
dose:"100mg"
},
{
nom:"Atorvastatine",
dose:"20mg"
}
]
},

{
id:"2026-002",
date:"01/03/2026",
doctor:"Dr Sara Mansouri",
speciality:"Généraliste",
status:"pending",

medicaments:[
{
nom:"Paracétamol",
dose:"500mg"
},
{
nom:"Vitamine C",
dose:"1000mg"
}
]
},

{
id:"2026-003",
date:"15/01/2026",
doctor:"Dr Yacine Benaissa",
speciality:"Pneumologue",
status:"expired",

medicaments:[
{
nom:"Amoxicilline",
dose:"1g"
}
]
}
];

let currentFilter = "all";

renderOrdonnances();
updateCount();

function updateCount(){
document.getElementById("totalOrdonnances").textContent =
ordonnances.length;
}

function getStatusClass(status){

switch(status){

case "active":
return "status-active";

case "expired":
return "status-expired";

case "pending":
return "status-pending";

default:
return "";
}
}

function getStatusText(status){

switch(status){

case "active":
return "Active";

case "expired":
return "Expirée";

case "pending":
return "En attente";

default:
return status;
}
}

function renderOrdonnances(list = ordonnances){

const grid =
document.getElementById("ordoGrid");

grid.innerHTML = "";

if(list.length === 0){

grid.innerHTML = `
<div style="
grid-column:1/-1;
text-align:center;
padding:50px;">
Aucune ordonnance trouvée
</div>
`;

return;
}

list.forEach((ordo)=>{

const meds =
ordo.medicaments
.map(m=>`<span class="med-tag">${m.nom}</span>`)
.join("");

grid.innerHTML += `
<div
class="ordo-card"
onclick="openOrdonnance('${ordo.id}')">

<div class="ordo-header">

<div class="ordo-num">
#${ordo.id}
</div>

<div class="status-badge ${getStatusClass(ordo.status)}">
${getStatusText(ordo.status)}
</div>

</div>

<div class="ordo-doctor">
${ordo.doctor}
</div>

<div class="ordo-speciality">
${ordo.speciality}
</div>

<div class="ordo-meds">
${meds}
</div>

<div class="ordo-footer">

<div class="ordo-date">
${ordo.date}
</div>

<div>
📋
</div>

</div>

</div>
`;
});
}

function openOrdonnance(id){

const ordonnance =
ordonnances.find(o => o.id === id);

if(!ordonnance) return;

document.getElementById("modalOrdoTitle").innerHTML =
`Ordonnance #${ordonnance.id}`;

document.getElementById("modalOrdoSub").innerHTML =
`${ordonnance.date} • ${ordonnance.speciality}`;

let medsHtml = "";

ordonnance.medicaments.forEach((med)=>{

medsHtml += `
<div class="med-item">

<div>

<div class="med-name">
${med.nom}
</div>

<div class="med-dose">
${med.dose}
</div>

</div>

</div>
`;
});

document.getElementById("modalOrdoBody").innerHTML = `

<div class="modal-section">

<div class="modal-section-title">
INFORMATIONS
</div>

<div class="info-grid">

<div>
<div class="info-label">
Médecin
</div>

<div class="info-value">
${ordonnance.doctor}
</div>
</div>

<div>
<div class="info-label">
Spécialité
</div>

<div class="info-value">
${ordonnance.speciality}
</div>
</div>

<div>
<div class="info-label">
Date
</div>

<div class="info-value">
${ordonnance.date}
</div>
</div>

<div>
<div class="info-label">
Statut
</div>

<div class="info-value">
${getStatusText(ordonnance.status)}
</div>
</div>

</div>

</div>

<div class="modal-section">

<div class="modal-section-title">
MÉDICAMENTS
</div>

<div class="meds-list">

${medsHtml}

</div>

</div>
`;

document
.getElementById("modalOrdo")
.classList.add("open");
}

function closeModal(id){

document
.getElementById(id)
.classList.remove("open");
}

function filterOrdo(btn,status){

document
.querySelectorAll(".filter-chip")
.forEach(chip =>
chip.classList.remove("active")
);

btn.classList.add("active");

currentFilter = status;

applyFilters();
}

function searchOrdo(value){

window.searchValue =
value.toLowerCase();

applyFilters();
}

function applyFilters(){

let results = [...ordonnances];

if(currentFilter !== "all"){

results =
results.filter(
o => o.status === currentFilter
);
}

if(window.searchValue){

results =
results.filter(o =>

o.doctor.toLowerCase()
.includes(window.searchValue)

||

o.speciality.toLowerCase()
.includes(window.searchValue)

||

o.id.toLowerCase()
.includes(window.searchValue)

);
}

renderOrdonnances(results);
}

function handleFileUpload(input){

if(!input.files.length) return;

const file = input.files[0];

const newOrdonnance = {

id:`2026-00${ordonnances.length+1}`,

date:new Date()
.toLocaleDateString("fr-FR"),

doctor:"Document ajouté",

speciality:file.name,

status:"pending",

medicaments:[
{
nom:"Document importé",
dose:file.name
}
]
};

ordonnances.unshift(newOrdonnance);

updateCount();

applyFilters();

alert(
"Ordonnance ajoutée avec succès"
);
}

function toggleTheme(){

const html =
document.documentElement;

const current =
html.getAttribute("data-theme");

if(current === "light"){

html.setAttribute(
"data-theme",
"dark"
);

}else{

html.setAttribute(
"data-theme",
"light"
);

}
}

window.onclick = function(event){

const modal =
document.getElementById("modalOrdo");

if(event.target === modal){

closeModal("modalOrdo");

}
};