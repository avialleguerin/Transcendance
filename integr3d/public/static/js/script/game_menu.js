
// Utilise 'DOMContentLoaded' pour attendre que tout le DOM soit chargé

console.log('Game Menu Script Loading');


document.addEventListener('DOMContentLoaded', function () {
	const btn_jouer = document.getElementById('btn_jouer');
	const btn_container = document.querySelector('.button-container');

	if (!btn_jouer) {
		console.error("ERREUR: #btn_jouer introuvable !");
		return;
	}

	btn_jouer.addEventListener('click', () => {
		console.log('JOUER button clicked');
		btn_container.style.display = 'block';
		btn_jouer.style.display = 'none';
	});
});
