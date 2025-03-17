export function game_menu()
{
	const btn_jouer = document.getElementById('btn_jouer');
	const view1 = document.getElementById('view1');
	const view2 = document.getElementById('view2');
	const view3 = document.getElementById('view3');
	const view4 = document.getElementById('view4');
	const view1_btn = document.getElementById('view1_btn');
	const settings_btn = document.getElementById('settings_btn');
	const solo = document.getElementById('solo');
	const multiplayer = document.getElementById('multiplayer');
	const back_to_menu_view3 = document.getElementById('back_to_menu_view3');
	const back_to_menu_view4 = document.getElementById('back_to_menu_view4');
	const btn_back_home = document.getElementById('back-home');
	const view5 = document.getElementById('view5');
	const view6 = document.getElementById('view6');
	const view7 = document.getElementById('view7');
	const view8 = document.getElementById('view8');
	const prepar_game_1v1 = document.getElementById('prepar_game_1v1');
	const prepar_gane_ai = document.getElementById('prepar_gane_ai');
	const prepar_game_multi = document.getElementById('prepar_game_multi');
	const back_to_menu_view6 = document.getElementById('back_to_menu_view6');
	const back_to_menu_view7 = document.getElementById('back_to_menu_view7');
	const back_to_menu_view8 = document.getElementById('back_to_menu_view8');
	const powerUP = document.getElementById('powerUP');
	const number_powerUP_1 = document.getElementById('number_powerUP_1');
	const number_powerUP_3 = document.getElementById('number_powerUP_3');
	const number_powerUP_5 = document.getElementById('number_powerUP_5');
	const power_selector = document.getElementById('power_selector');
	const skin_perso = document.getElementById('skin_perso');
	const back_to_select_mode_view6 = document.getElementById('back_to_select_mode_view6');
	const back_to_select_mode_view7 = document.getElementById('back_to_select_mode_view7');
	const back_to_select_mode_view8 = document.getElementById('back_to_select_mode_view8');
	const nb_powerUP = 0;

	// Afficher view1 quand on clique sur JOUER
	btn_jouer.addEventListener('click', () => {
		console.log('JOUER button clicked');
		view1.classList.add('active');
		view2.classList.add('active');
		btn_back_home.classList.add('active');
		btn_jouer.style.display = 'none';
	});

	view1_btn.addEventListener('click', () => {
		console.log('Mode de jeux button clicked');
		
		// Vérifier si on est sur la vue5
		if (view5.classList.contains('active')) {
			// Si on est sur vue5, on la désactive et active vue2
			view5.classList.remove('active');
			view2.classList.add('active');
		} 
		// Si on n'est pas sur la vue2 (et pas sur la vue5 non plus)
		else if (!view2.classList.contains('active')) {
			// Activer la vue2
			view2.classList.add('active');
		}
	});



	// Retourner à l'écran principal quand on clique sur SETTINGS
	settings_btn.addEventListener('click', () => {
		view2.classList.remove('active');
		view5.classList.add('active');
	});

	// Afficher view3 quand on clique sur SOLO
	solo.addEventListener('click', () => {
		view2.classList.remove('active');
		view3.classList.add('active');
		view1.classList.remove('active');
		btn_back_home.classList.remove('active');
	});

	// Afficher view4 quand on clique sur MULTIPLAYER
	multiplayer.addEventListener('click', () => {
		view2.classList.remove('active');
		view4.classList.add('active');
		view1.classList.remove('active');
		btn_back_home.classList.remove('active');
	});

	// Retourner à l'écran principal quand on clique sur BACK TO MENU
	if (!view3.classList.contains('active')) {
		console.log('view3 is active');
		back_to_menu_view3.addEventListener('click', () => {
			view3.classList.remove('active');
			view2.classList.add('active');
			view1.classList.add('active');
			btn_back_home.classList.add('active');
		});
	}

	// Retourner à l'écran principal quand on clique sur BACK TO MENU
	if (!view4.classList.contains('active')) {
		console.log('view4 is active');
		back_to_menu_view4.addEventListener('click', () => {
			view4.classList.remove('active');
			view2.classList.add('active');
			view1.classList.add('active');
			btn_back_home.classList.add('active');
		});
	}

	// Retourner à l'écran principal quand on clique sur ACCUEIL
	btn_back_home.addEventListener('click', () => {
		if (view2.classList.contains('active')) {
			view2.classList.remove('active');
			view1.classList.remove('active');
			btn_back_home.classList.remove('active');
			btn_jouer.style.display = 'block';
		}
		if (view5.classList.contains('active')) {
			view5.classList.remove('active');
			view1.classList.remove('active');
			btn_back_home.classList.remove('active');
			btn_jouer.style.display = 'block';
		}
	});

	// Afficher view6 quand on clique
	prepar_game_1v1.addEventListener('click', () => {
		view3.classList.remove('active');
		view6.classList.add('active');
		back_to_select_mode_view6.classList.add('active');
	});

	// Afficher view7 quand on clique

	prepar_gane_ai.addEventListener('click', () => {
		view3.classList.remove('active');
		view7.classList.add('active');
		back_to_select_mode_view7.classList.add('active');
	});

	// Afficher view8 quand on clique
	prepar_game_multi.addEventListener('click', () => {
		view4.classList.remove('active');
		view8.classList.add('active');
		back_to_select_mode_view8.classList.add('active');
	});

	back_to_menu_view6.addEventListener('click', () => {
		view6.classList.remove('active');
		view3.classList.add('active');
		back_to_select_mode_view6.classList.remove('active');
	});

	back_to_menu_view7.addEventListener('click', () => {
		console.log('Back to menu view7 clicked');
		view3.classList.add('active');
		view7.classList.remove('active');
		back_to_select_mode_view7.classList.remove('active');
	});

	back_to_menu_view8.addEventListener('click', () => {
		view8.classList.remove('active');
		view4.classList.add('active');
		back_to_select_mode_view8.classList.remove('active');
	});

	// Activer/désactiver le powerUP
	powerUP.addEventListener('click', () => {
		powerUP.classList.toggle('checked');

		if (powerUP.classList.contains('checked')) {
			console.log('PowerUP is active');
			power_selector.classList.add('active');
		}
		else {
			console.log('PowerUP is inactive');
			power_selector.classList.remove('active');
			reset_powerUP_grenade();
			reset_powerUP_teammate();
		}
	});

	// Sélectionner le nombre de powerUP

	number_powerUP_1.addEventListener('click', () => {
		number_powerUP_1.classList.toggle('checked')
		number_powerUP_3.classList.remove('checked');
		number_powerUP_5.classList.remove('checked');
		console.log('1 powerUP selected and 3 and 5 unselected');
		init_nb_powerUP_grenadeFlash(1);
		init_nb_powerUP_teammate(1);
		nb_powerUP = 1;

	});

	number_powerUP_3.addEventListener('click', () => {
		number_powerUP_3.classList.toggle('checked')
		number_powerUP_1.classList.remove('checked');
		number_powerUP_5.classList.remove('checked');
		console.log('3 powerUP selected and 1 and 5 unselected');
		init_nb_powerUP_grenadeFlash(3);
		init_nb_powerUP_teammate(3);
		nb_powerUP = 3;
	});

	number_powerUP_5.addEventListener('click', () => {
		number_powerUP_5.classList.toggle('checked')
		number_powerUP_1.classList.remove('checked');
		number_powerUP_3.classList.remove('checked');
		console.log('5 powerUP selected and 1 and 3 unselected');
		init_nb_powerUP_grenadeFlash(5);
		init_nb_powerUP_teammate(5);
		nb_powerUP = 5;
	});

	skin_perso.addEventListener('click', () => {
		skin_perso.classList.toggle('checked');
		console.log('Skin perso selected');
	});
	return { nb_powerUP };

}
