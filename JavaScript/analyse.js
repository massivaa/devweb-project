const analyses = [

{
id:"ANA-001",
titre:"Bilan sanguin complet",
type:"sanguin",
date:"08/03/2026",
medecin:"Laboratoire Central",
resultat:"Normal"
},

{
id:"ANA-002",
titre:"Radiographie thoracique",
type:"radio",
date:"20/02/2026",
medecin:"Dr Mourad",
resultat:"Aucune anomalie"
},

{
id:"ANA-003",
titre:"Échographie abdominale",
type:"echographie",
date:"15/01/2026",
medecin:"Dr Karim",
resultat:"RAS"
}

];

let analyseFilter = "all";

renderAnalyses();
updateCount();

function updateCount(){

document.getElementById(
"totalAnalyses"
).textContent = analyses.length;

}

function renderAnalyses(list = analyses){

const container =
document.getElementById("analysesList");

container.innerHTML = "";

list.forEach(analyse => {

container.innerHTML += `

<div
class="ordo-card"
onclick="openAnalyse('${analyse.id}')">

<div class="ordo-header">

<div class="ordo-num">
${analyse.id}
</div>

</div>

<div class="ordo-doctor">
${analyse.titre}
</div>

<div class="ordo-speciality">
${analyse.medecin}
</div>

<div class="ordo-footer">

<div class="ordo-date">
${analyse.date}
</div>

<div>
🔬
</div>

</div>

</div>

`;

});

}

function openAnalyse(id){

const analyse =
analyses.find(a => a.id === id);

document.getElementById(
"modalAnalyseTitle"
).innerHTML = analyse.titre;

document.getElementById(
"modalAnalyseSub"
).innerHTML =
`${analyse.medecin} • ${analyse.date}`;

document.getElementById(
"modalAnalyseBody"
).innerHTML = `

<div class="modal-section">

<div class="modal-section-title">
INFORMATIONS
</div>

<div class="info-grid">

<div>
<div class="info-label">ID</div>
<div class="info-value">${analyse.id}</div>
</div>

<div>
<div class="info-label">Type</div>
<div class="info-value">${analyse.type}</div>
</div>

<div>
<div class="info-label">Date</div>
<div class="info-value">${analyse.date}</div>
</div>

<div>
<div class="info-label">Résultat</div>
<div class="info-value">${analyse.resultat}</div>
</div>

</div>

</div>

<div class="modal-section">

<div class="modal-section-title">
APERÇU
</div>

<img
src="https://via.placeholder.com/600x300"
style="
width:100%;
border-radius:12px;
">

</div>

`;

document
.getElementById("modalAnalyse")
.classList.add("open");

}

function closeModal(id){

document
.getElementById(id)
.classList.remove("open");

}

function filterAnalyse(btn,type){

document
.querySelectorAll(".filter-chip")
.forEach(chip =>
chip.classList.remove("active"));

btn.classList.add("active");

analyseFilter = type;

applyAnalyseFilters();

}

function searchAnalyse(value){

window.searchAnalyseValue =
value.toLowerCase();

applyAnalyseFilters();

}

function applyAnalyseFilters(){

let result = [...analyses];

if(analyseFilter !== "all"){

result =
result.filter(
a => a.type === analyseFilter
);

}

if(window.searchAnalyseValue){

result =
result.filter(a =>

a.titre.toLowerCase()
.includes(window.searchAnalyseValue)

||

a.medecin.toLowerCase()
.includes(window.searchAnalyseValue)

);

}

renderAnalyses(result);

}

function handleFileUpload(input){

if(!input.files.length) return;

const file = input.files[0];

analyses.unshift({

id:`ANA-00${analyses.length+1}`,

titre:file.name,

type:"autre",

date:new Date()
.toLocaleDateString("fr-FR"),

medecin:"Document importé",

resultat:"En attente"

});

updateCount();

applyAnalyseFilters();

alert("Analyse ajoutée avec succès");

}

function toggleTheme(){

const html =
document.documentElement;

const current =
html.getAttribute("data-theme");

html.setAttribute(
"data-theme",
current === "dark"
? "light"
: "dark"
);

}