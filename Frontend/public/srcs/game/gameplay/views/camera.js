import { createLoadingOverlay, removeLoadingOverlay } from './loading_screen.js';

const views = {
	default:
	{
		position: new BABYLON.Vector3(-46.5848927854827, 7.033186073453854, -36.673950554376425),
		rotation: new BABYLON.Vector3(-0.06270675424618415, -2.546876145234487, 0)
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

export function smoothTransition(targetPosition, targetRotation, duration = 1.5)
{
	if (currentTransitionAnimation) {
		scene.onBeforeRenderObservable.remove(currentTransitionAnimation);
	}

	const startPosition = camera.position.clone();
	const startRotation = camera.rotation.clone();
	const startTime = performance.now();

	const tempPosition = new BABYLON.Vector3();
	const tempRotation = new BABYLON.Vector3();

	function easeInOutCubic(t)
	{
		if (t < 0.5)
			return 4 * t * t * t;
		else
			return 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

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

		const easedT = easeInOutCubic(t);
		
		BABYLON.Vector3.LerpToRef(startPosition, targetPosition, easedT, tempPosition);
		camera.position.copyFrom(tempPosition);
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
	if (viewName === 'winner')
		changeView('winner', true);
	if (viewName === 'tournament')
		changeView('tournament', true);
	if (viewName === 'vue2' && previousView === 'tournament')
		changeView('vue2', true);
	if (viewName === 'platformer' && previousView === 'vue2')
		changeView('platformer', true);
	if (viewName === 'vue2' && previousView === 'platformer')
		changeView('vue2', true);
}