import { createLoadingOverlay, removeLoadingOverlay } from './loading_screen.js';
import { create_environment_view1, create_environment_view2 } from '../init_game.js';
import { init_skins_perso_player1, init_skins_perso_player2 } from '../solo/skin/init_skin_perso.js';
import { init_skins_perso_player1_multi, init_skins_perso_player2_multi, init_skins_perso_player3_multi, init_skins_perso_player4_multi } from '../multiplayer/init_skin_perso_multi.js';
import { destroy_all_by_metadata_skin } from '../solo/skin/init_skin_perso.js';
import { init_skins_perso_first, init_skins_perso_seconde } from '../solo/skin/init_skin_player_podium.js';
import { init_skins_perso_player1_multi_podium, init_skins_perso_player2_multi_podium, init_skins_perso_player3_multi_podium, init_skins_perso_player4_multi_podium } from '../multiplayer/init_teamPlayer_podium.js';
import { getSoloGameStart, getAIGameStart, getMultiGameStart } from '../babylon.js';


const views = {
	default:
	{
		position: new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313),
		rotation: new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0)
	},
	vue1:
	{
		position: new BABYLON.Vector3(-121.10280824924784, 24.6207952767514, -174.07209971938224),
		rotation: new BABYLON.Vector3(-0.11883037823762914, -2.5943873381271416, 0)
	},
	vue2:
	{
		position: new BABYLON.Vector3(-18.357281595831136, 108.16606578413405, 28.68168026688079),
		rotation: new BABYLON.Vector3(-0.029563678231847475, -3.12412425038244, 0)
	},
	vue3:
	{
		position: new BABYLON.Vector3(-54.75561421839585, 323.8935256263618, -69.46923226717574),
		rotation: new BABYLON.Vector3(0.04110218558828448, -1.5940112517089828, 0)
	},
	vue4:
	{
		position: new BABYLON.Vector3(86.16210646582958, 341.93369480348, -72.48687267164757),
		rotation: new BABYLON.Vector3(0.27911301240509906, -1.572511251708983, 0)
	},
	aerienne:
	{
		position: new BABYLON.Vector3(0, 100, 0),
		rotation: new BABYLON.Vector3(Math.PI/2, 0, 0)
	},
	winner:
	{
		position: new BABYLON.Vector3(-30, 309, -55),
		rotation: new BABYLON.Vector3(0.04585831303667534, -1.5694725474476896, 0)
	},
	tournament:
	{
		position: new BABYLON.Vector3(-18.428470385182532, 107.62138152604801, -14.139896745255728),
		rotation: new BABYLON.Vector3(-0.03079079706537804, -3.1248471752812232, 0)
	},
	platformer:
	{
		position: new BABYLON.Vector3(-6.5182094677032865, 105.9949400814292, -3.0295165949940666),
		rotation: new BABYLON.Vector3(0.30031205500253655, -4.721353872946304, 0)
	}
};

let currentTransitionAnimation = null;
let isLoading = false;
let targetView = null;
// Fonction de transition améliorée avec courbe d'animation
export function smoothTransition(targetPosition, targetRotation, duration = 1.5)
{
	// Annuler l'animation précédente si elle existe
	if (currentTransitionAnimation) {
		scene.onBeforeRenderObservable.remove(currentTransitionAnimation);
	}

	const startPosition = camera.position.clone();
	const startRotation = camera.rotation.clone();
	const startTime = performance.now();

	// Créer des vecteurs temporaires pour éviter la création d'objets pendant l'animation
	const tempPosition = new BABYLON.Vector3();
	const tempRotation = new BABYLON.Vector3();

	// Fonction d'ease (lissage)
	const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

	currentTransitionAnimation = scene.onBeforeRenderObservable.add(() => {
		const currentTime = performance.now();
		let t = (currentTime - startTime) / (duration * 1000);

		if (t >= 1) {
			camera.position.copyFrom(targetPosition);
			camera.rotation.copyFrom(targetRotation);
			scene.onBeforeRenderObservable.remove(currentTransitionAnimation);
			currentTransitionAnimation = null;
			return;
		}

		// Appliquer la fonction d'ease
		const easedT = easeInOutCubic(t);

		// Interpolation de la position
		BABYLON.Vector3.LerpToRef(startPosition, targetPosition, easedT, tempPosition);
		camera.position.copyFrom(tempPosition);

		// Interpolation de la rotation
		BABYLON.Vector3.LerpToRef(startRotation, targetRotation, easedT, tempRotation);
		camera.rotation.copyFrom(tempRotation);
	});
}


export function changeView(viewName, force = false) {
	const view = views[viewName];
	if (!view || (window.currentView === viewName && !force)) return;
	
	const previousView = window.currentView;
	if (!isLoading || force) {
		window.currentView = viewName;
		targetView = viewName;
		smoothTransition(view.position, view.rotation, 1.5);
	}
	
	if (!force) {
		handleViewTransitions(viewName, previousView);
	}
}


export function handleViewTransitions(viewName, previousView)
{
	console.log("je rentre dans handleViewTransitions");
	console.log(viewName, previousView);
	if (isLoading)
	return;
if (!previousView)
previousView = 'default';

if (viewName === 'vue1' && previousView === 'default')
{
	changeView('vue1', true);
	setTimeout(() =>
	{
		window.currentView = 'vue1';
		createLoadingOverlay();
	}, 1200);
	setTimeout(() =>
	{
			changeView('vue2', true);
		}, 3500);
		setTimeout(() => removeLoadingOverlay(), 5000);
	}
	if (viewName === 'vue3' && previousView === 'vue2')
	{
		createLoadingOverlay();
		setTimeout(() =>
		{
			changeView('vue3', true);
			window.currentView = 'vue3';
		}, 1500);
		setTimeout(() => 
		{
			removeLoadingOverlay();
			changeView('vue4', true);
		}, 5000);
	}
	if (viewName === 'vue2' && (previousView === 'vue4' || previousView === 'winner')) {
		isLoading = true;
		changeView('vue3', true);
		setTimeout(() => {
			createLoadingOverlay();
		}, 1500);
		setTimeout(() => {
			changeView('vue2', true);
			window.currentView = 'vue2'; 

		}, 2000);
		
		setTimeout(() => {
			removeLoadingOverlay();
			isLoading = false;
		}, 5000);
	}
	if (viewName === 'vue1' && previousView === 'vue2')
	{
		console.log('je suis la ');
		isLoading = true;
		createLoadingOverlay();
		
		setTimeout(() => {
			changeView('vue1', true);
		}, 1500);
		setTimeout(() => {
			removeLoadingOverlay();
			changeView('default', true);
			isLoading = false;
		}, 5000);
	}
	if (viewName === 'winner')
	{
		changeView('winner', true);
	}
	if (viewName === 'tournament')
	{
		changeView('tournament', true);
	}
	if (viewName === 'vue2' && previousView === 'tournament')
	{
		changeView('vue2', true);
	}
	if (viewName === 'tournament_game_start' && previousView === 'tournament')
	{
		createLoadingOverlay();
		setTimeout(() =>
		{
			changeView('vue3', true);
			window.currentView = 'vue3';
		}, 1500);
		setTimeout(() => 
		{
			removeLoadingOverlay();
			changeView('vue4', true);
		}, 5000);
	}
	if (viewName === 'tournament' && previousView === 'vue4')
	{
		isLoading = true;
		changeView('vue3', true);
		setTimeout(() => {
			createLoadingOverlay();
		}, 1500);
		setTimeout(() => {
			changeView('tournament', true);
			window.currentView = 'tournament'; 

		}, 3500);
		
		setTimeout(() => {
			removeLoadingOverlay();
			isLoading = false;
		}, 5000);
	}
	if (viewName === 'platformer' && previousView === 'vue2')
	{
		changeView('platformer', true);
	}
	if (viewName === 'vue2' && previousView === 'platformer')
	{
		changeView('vue2', true);
	}
}