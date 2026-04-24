
// ── State ──────────────────────────────────────
const state = {
  patient: JSON.parse(localStorage.getItem('patient') || 'null'),
  rdvList: JSON.parse(localStorage.getItem('rdvList') || 'null'),
  ordoList: JSON.parse(localStorage.getItem('ordoList') || 'null'),
};

// ── DOM refs ───────────────────────────────────
const DOM = {
  avatarWrap:       document.getElementById('avatarWrap'),
  avatarCircle:     document.getElementById('avatarCircle'),
  avatarInitials:   document.getElementById('avatarInitials'),
  avatarImg:        document.getElementById('avatarImg'),
  fileInput:        document.getElementById('fileInput'),
  displayName:      document.getElementById('displayName'),
  badgeStatus:      document.getElementById('badgeStatus'),
  statusText:       document.getElementById('statusText'),
  btnAddInfo:       document.getElementById('btnAddInfo'),

  // vitals
  vPoids:           document.getElementById('vPoids'),
  vTaille:          document.getElementById('vTaille'),
  vImc:             document.getElementById('vImc'),
  vGroupe:          document.getElementById('vGroupe'),
  vitalsHint:       document.getElementById('vitalsHint'),

  // antecedents
  antecedentsEmpty: document.getElementById('antecedentsEmpty'),
  antecedentsList:  document.getElementById('antecedentsList'),

  // alert
  alertCard:        document.getElementById('alertCard'),
  alertDate:        document.getElementById('alertDate'),

  // traitement
  traitementEmpty:  document.getElementById('traitementEmpty'),
  traitementList:   document.getElementById('traitementList'),

  // rdv
  rdvEmpty:         document.getElementById('rdvEmpty'),
  rdvList:          document.getElementById('rdvList'),

  // ordo
  ordoEmpty:        document.getElementById('ordoEmpty'),
  ordoList:         document.getElementById('ordoList'),

  // modal
  infoModal:        document.getElementById('infoModal'),
  modalClose:       document.getElementById('modalClose'),
  btnCancel:        document.getElementById('btnCancel'),
  btnSave:          document.getElementById('btnSave'),

  // form fields
  fPrenom:          document.getElementById('fPrenom'),
  fNom:             document.getElementById('fNom'),
  fDob:             document.getElementById('fDob'),
  fSexe:            document.getElementById('fSexe'),
  fPoids:           document.getElementById('fPoids'),
  fTaille:          document.getElementById('fTaille'),
  fGroupe:          document.getElementById('fGroupe'),
  fTel:             document.getElementById('fTel'),
  fWilaya:          document.getElementById('fWilaya'),
  fAntecedents:     document.getElementById('fAntecedents'),
  fMutuelle:        document.getElementById('fMutuelle'),
};

// ── Sample data (only shown once patient fills info) ──────
const sampleRdv = [
  {
    id: 1,
    doc: 'Dr. Meriem Benali',
    spec: 'Cardiologie · Clinique El Azhar',
    date: '25 avr.',
    heure: '10h00',
    status: 'upcoming',
    icon: '📅',
  },
  {
    id: 2,
    doc: 'Dr. Yacine Hadj',
    spec: 'Médecine générale · Cabinet privé',
    date: '12 avr.',
    heure: '09h30',
    status: 'done',
    icon: '🩺',
  },
  {
    id: 3,
    doc: 'Dr. Samira Tazi',
    spec: 'Endocrinologie · CHU Mustapha',
    date: '2 avr.',
    heure: '14h00',
    status: 'done',
    icon: '🩺',
  },
];

const sampleOrdo = [
  {
    id: 'ORD-2026-041',
    meds: 'Metformine 500mg · Amlodipine 5mg · Vit D3',
    doc: 'Dr. Hadj',
    date: '12 avr. 2026',
    status: 'active',
  },
  {
    id: 'ORD-2026-029',
    meds: 'Amoxicilline 1g · Ibuprofène 400mg',
    doc: 'Dr. Tazi',
    date: '2 avr. 2026',
    status: 'expired',
  },
];

const sampleTraitement = [
  { name: 'Metformine 500mg', jour: 14, total: 30 },
  { name: 'Amlodipine 5mg',   jour: 22, total: 30 },
];

// ── Avatar upload ──────────────────────────────
DOM.avatarWrap.addEventListener('click', () => DOM.fileInput.click());
DOM.fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    DOM.avatarImg.src = ev.target.result;
    DOM.avatarImg.style.display = 'block';
    DOM.avatarInitials.style.display = 'none';
    localStorage.setItem('avatarSrc', ev.target.result);
  };
  reader.readAsDataURL(file);
});

// ── Modal open/close ───────────────────────────
DOM.btnAddInfo.addEventListener('click', openModal);
DOM.modalClose.addEventListener('click', closeModal);
DOM.btnCancel.addEventListener('click', closeModal);
DOM.infoModal.addEventListener('click', (e) => { if (e.target === DOM.infoModal) closeModal(); });

function openModal() {
  DOM.infoModal.classList.add('open');
  if (state.patient) prefillForm(state.patient);
}
function closeModal() {
  DOM.infoModal.classList.remove('open');
}

function prefillForm(p) {
  DOM.fPrenom.value      = p.prenom     || '';
  DOM.fNom.value         = p.nom        || '';
  DOM.fDob.value         = p.dob        || '';
  DOM.fSexe.value        = p.sexe       || '';
  DOM.fPoids.value       = p.poids      || '';
  DOM.fTaille.value      = p.taille     || '';
  DOM.fGroupe.value      = p.groupe     || '';
  DOM.fTel.value         = p.tel        || '';
  DOM.fWilaya.value      = p.wilaya     || '';
  DOM.fAntecedents.value = p.antecedents || '';
  DOM.fMutuelle.value    = p.mutuelle   || '';
}

// ── Save form ──────────────────────────────────
DOM.btnSave.addEventListener('click', () => {
  const poids  = parseFloat(DOM.fPoids.value);
  const taille = parseFloat(DOM.fTaille.value);
  const imc    = (poids && taille) ? (poids / ((taille / 100) ** 2)).toFixed(1) : '';

  const patient = {
    prenom:       DOM.fPrenom.value.trim(),
    nom:          DOM.fNom.value.trim(),
    dob:          DOM.fDob.value,
    sexe:         DOM.fSexe.value,
    poids:        poids || '',
    taille:       taille || '',
    imc,
    groupe:       DOM.fGroupe.value,
    tel:          DOM.fTel.value.trim(),
    wilaya:       DOM.fWilaya.value,
    antecedents:  DOM.fAntecedents.value.trim(),
    mutuelle:     DOM.fMutuelle.value.trim(),
  };

  state.patient = patient;
  localStorage.setItem('patient', JSON.stringify(patient));

  renderAll();
  closeModal();
});

// ── Render functions ───────────────────────────
function renderAll() {
  renderProfile();
  renderVitals();
  renderAntecedents();
  renderRdv();
  renderOrdo();
  renderTraitement();
}

function renderProfile() {
  const p = state.patient;
  if (!p || (!p.prenom && !p.nom)) {
    DOM.displayName.textContent = '— Nom non renseigné —';
    DOM.displayName.classList.add('unnamed');
    DOM.badgeStatus.className = 'badge-status incomplete';
    DOM.statusText.textContent = 'Profil incomplet';
    DOM.avatarInitials.textContent = '?';
    return;
  }

  const fullName = [p.prenom, p.nom].filter(Boolean).join(' ');
  DOM.displayName.textContent = fullName;
  DOM.displayName.classList.remove('unnamed');
  DOM.badgeStatus.className = 'badge-status active';
  DOM.statusText.textContent = 'Suivi actif';

  const initials = [p.prenom?.[0], p.nom?.[0]].filter(Boolean).join('').toUpperCase();
  DOM.avatarInitials.textContent = initials || '?';
}

function renderVitals() {
  const p = state.patient;
  const vitals = document.querySelectorAll('.vital-item');

  if (!p || (!p.poids && !p.taille && !p.imc && !p.groupe)) {
    DOM.vPoids.textContent  = '—';
    DOM.vTaille.textContent = '—';
    DOM.vImc.textContent    = '—';
    DOM.vGroupe.textContent = '—';
    vitals.forEach(v => v.classList.add('empty-vital'));
    DOM.vitalsHint.style.display = 'flex';
    return;
  }

  DOM.vPoids.textContent  = p.poids  ? p.poids + ' kg'  : '—';
  DOM.vTaille.textContent = p.taille ? p.taille + ' cm' : '—';
  DOM.vImc.textContent    = p.imc    || '—';
  DOM.vGroupe.textContent = p.groupe || '—';

  vitals.forEach(v => v.classList.remove('empty-vital'));
  DOM.vitalsHint.style.display = 'none';
}

function renderAntecedents() {
  const p = state.patient;
  if (!p || !p.antecedents) {
    DOM.antecedentsEmpty.style.display = 'flex';
    DOM.antecedentsList.style.display  = 'none';
    return;
  }

  const items = p.antecedents.split(',').map(s => s.trim()).filter(Boolean);
  if (!items.length) {
    DOM.antecedentsEmpty.style.display = 'flex';
    DOM.antecedentsList.style.display  = 'none';
    return;
  }

  DOM.antecedentsEmpty.style.display = 'none';
  DOM.antecedentsList.style.display  = 'flex';

  // First item gets warning style, rest get info
  DOM.antecedentsList.innerHTML = items.map((item, i) => `
    <span class="antecedent-tag ${i === 0 ? 'warning' : 'info'}">
      ${i === 0 ? '⚠' : '•'} ${item}
    </span>
  `).join('');

  // Show renewal alert after profile is filled
  DOM.alertCard.style.display  = 'flex';
  DOM.alertDate.textContent    = '28 avr. 2026';
}

function renderRdv() {
  const p = state.patient;
  if (!p || (!p.prenom && !p.nom)) {
    DOM.rdvEmpty.style.display = 'flex';
    DOM.rdvList.style.display  = 'none';
    return;
  }

  DOM.rdvEmpty.style.display = 'none';
  DOM.rdvList.style.display  = 'flex';

  DOM.rdvList.innerHTML = sampleRdv.map(rdv => `
    <div class="rdv-item">
      <div class="rdv-icon ${rdv.status}">${rdv.icon}</div>
      <div class="rdv-info">
        <div class="rdv-doc">${rdv.doc}</div>
        <div class="rdv-spec">${rdv.spec}</div>
      </div>
      <div class="rdv-right">
        <span class="rdv-date-main">${rdv.date}</span>
        <span class="rdv-date-time">${rdv.heure}</span>
        <span class="pill ${rdv.status}">${rdv.status === 'upcoming' ? 'À venir' : 'Effectué'}</span>
      </div>
    </div>
  `).join('');
}

function renderOrdo() {
  const p = state.patient;
  if (!p || (!p.prenom && !p.nom)) {
    DOM.ordoEmpty.style.display = 'flex';
    DOM.ordoList.style.display  = 'none';
    return;
  }

  DOM.ordoEmpty.style.display = 'none';
  DOM.ordoList.style.display  = 'flex';

  DOM.ordoList.innerHTML = sampleOrdo.map(ordo => `
    <div class="ordo-item">
      <div class="ordo-badge">Rx</div>
      <div class="ordo-info">
        <div class="ordo-title">Ordonnance #${ordo.id}</div>
        <div class="ordo-meds">${ordo.meds}</div>
        <div class="ordo-meta">Prescrit par ${ordo.doc} — ${ordo.date}</div>
        <div class="ordo-actions">
          <button class="btn-sm green">Voir détails</button>
          <button class="btn-sm gold">Télécharger PDF</button>
        </div>
      </div>
      <span class="pill ${ordo.status === 'active' ? 'active' : 'expired'}" style="flex-shrink:0">
        ${ordo.status === 'active' ? 'Actif' : 'Expiré'}
      </span>
    </div>
  `).join('');
}

function renderTraitement() {
  const p = state.patient;
  if (!p || (!p.prenom && !p.nom)) {
    DOM.traitementEmpty.style.display = 'flex';
    DOM.traitementList.style.display  = 'none';
    return;
  }

  DOM.traitementEmpty.style.display = 'none';
  DOM.traitementList.style.display  = 'block';

  DOM.traitementList.innerHTML = sampleTraitement.map(t => {
    const pct = Math.round((t.jour / t.total) * 100);
    return `
      <div class="progress-item">
        <div class="prog-header">
          <span class="prog-name">${t.name}</span>
          <span class="prog-days">Jour ${t.jour}/${t.total}</span>
        </div>
        <div class="prog-bar">
          <div class="prog-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Restore avatar from localStorage ──────────
function restoreAvatar() {
  const src = localStorage.getItem('avatarSrc');
  if (src) {
    DOM.avatarImg.src = src;
    DOM.avatarImg.style.display = 'block';
    DOM.avatarInitials.style.display = 'none';
  }
}

// ── Init ───────────────────────────────────────
restoreAvatar();
renderAll();
