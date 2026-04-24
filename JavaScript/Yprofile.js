async function fillProfileForm() {
  try {
    const res = await fetch('../php/profile.php');
    const data = await res.json();

    console.log("DATA PROFILE =", data);

    if (!data) {
      console.log("Aucune session ou données null");
      return;
    }

    document.getElementById('nom').value = data.nom || '';
    document.getElementById('prenom').value = data.prenom || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('dob').value = data.date_naissance || '';

    if (data.genre === 'Homme') {
      document.querySelector('input[value="Homme"]').checked = true;
    } else if (data.genre === 'Femme') {
      document.querySelector('input[value="Femme"]').checked = true;
    }

    document.getElementById('poids').value = data.poids || '';
    document.getElementById('taille').value = data.taille || '';
    document.getElementById('groupe_sanguin').value = data.groupe_sanguin || '';
    document.getElementById('telephone').value = data.telephone || '';
    document.getElementById('wilaya').value = data.wilaya || '';
    document.getElementById('antecedents').value = data.antecedents || '';

  } catch (e) {
    console.log("ERREUR FETCH:", e);
  }
}

fillProfileForm();