document.addEventListener('DOMContentLoaded', function () {

  const params = new URLSearchParams(window.location.search);

  const spec = params.get('speciality');
  const doctorId = params.get('doctor_id');

  // spécialité
  if (spec) {
    document.getElementById('speciality').value = spec;
  }

  // médecin (ID)
  if (doctorId) {
    document.getElementById('doctor').value = doctorId;
  }

  updateSummary();
});


// ==========================
// QUICK SLOT SELECTION FIX
// ==========================
function selectSlot(btn, time) {
  // reset all buttons
  document.querySelectorAll('.time-slot').forEach(s => {
    s.classList.remove('selected');
  });

  // select clicked
  btn.classList.add('selected');

  // FIX: auto fill input
  const heureInput = document.getElementById('heureRdv');
  heureInput.value = time;

  updateSummary();
}


// ==========================
// LIVE SUMMARY FIXED
// ==========================
function updateSummary() {

  const doctorSelect = document.getElementById('doctor');
  const docId = doctorSelect.value;

  // 🔥 GET DOCTOR NAME FROM SELECT TEXT
  const doctorText = doctorSelect.options[doctorSelect.selectedIndex]?.text;

  const date = document.getElementById('dateRdv').value;
  const heure = document.getElementById('heureRdv').value;
  const type = document.querySelector('input[name="type_consult"]:checked');
  const sum = document.getElementById('rdv-summary');

  if (docId || date || heure) {
    sum.style.display = 'block';

    // ✔ DOCTOR NAME FIX
    document.getElementById('sum-doctor').textContent =
      doctorText || '—';

    // DATE
    document.getElementById('sum-date').textContent =
      date
        ? new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : '—';

    // HEURE
    document.getElementById('sum-heure').textContent =
      heure || '—';

    // TYPE
    document.getElementById('sum-type').textContent =
      type ? (type.value === 'cabinet' ? 'En cabinet' : 'Téléconsultation') : '—';
  }
}


// ==========================
// LISTENERS
// ==========================
document.getElementById('doctor').addEventListener('change', updateSummary);
document.getElementById('dateRdv').addEventListener('change', updateSummary);
document.getElementById('heureRdv').addEventListener('input', updateSummary); // 🔥 FIX IMPORTANT

document.querySelectorAll('input[name="type_consult"]').forEach(r =>
  r.addEventListener('change', updateSummary)
);