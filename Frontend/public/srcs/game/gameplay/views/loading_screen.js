import { changeView } from './camera.js';

let loadingOverlay;
let isLoading = false;
let targetView = null;
let overlayRemovalTimeout = null;

export function createLoadingOverlay()
{
	const existingOverlay = document.getElementById('loadingOverlay');
	if (existingOverlay) {
		console.log("Loading overlay déjà présent, extension de la durée");
		return;
	}
	isLoading = true;

	loadingOverlay = document.createElement('div');
	loadingOverlay.id = 'loadingOverlay';
	loadingOverlay.innerHTML = `
		<link rel="stylesheet" href="./static/js/css/test.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<h1>TRANSCENDENCE</h1>
		<div class="loading-container">
			<div class="progress-container">
				<div class="progress-bar"></div>
			</div>
		</div>
	`;
	document.body.appendChild(loadingOverlay);
	
	console.log("Loading overlay créé");
}

export function removeLoadingOverlay()
{
	if (!loadingOverlay && !document.getElementById('loadingOverlay'))
	{
		isLoading = false;
		return;
	}
	if (overlayRemovalTimeout)
		clearTimeout(overlayRemovalTimeout);

	const overlay = loadingOverlay || document.getElementById('loadingOverlay');
	
	if (overlay)
	{
		overlay.style.opacity = '0';
		
		overlayRemovalTimeout = setTimeout(() => {
			if (overlay && overlay.parentNode) {
				document.body.removeChild(overlay);
				console.log("Loading overlay supprimé");
			}
			
			loadingOverlay = null;
			isLoading = false;
			overlayRemovalTimeout = null;

			if (targetView)
			{
				changeView(targetView);
				targetView = null;
			}
		}, 1000);
	}
	else
	{
		isLoading = false;
		overlayRemovalTimeout = null;
		if (targetView) {
			changeView(targetView);
			targetView = null;
		}
	}
}

export function showLoadingScreen(duration = 3000, nextView = null)
{
	if (isLoading)
	{
		if (overlayRemovalTimeout)
		{
			clearTimeout(overlayRemovalTimeout);
			overlayRemovalTimeout = null;
		}
		if (nextView) {
			targetView = nextView;
		}
		setTimeout(() => {
			removeLoadingOverlay();
		}, duration);
		
	}
	else
	{
		if (nextView) {
			targetView = nextView;
		}
		
		// createLoadingOverlay();
		
		setTimeout(() => {
			removeLoadingOverlay();
		}, duration);
	}
}

export function forceRemoveLoadingOverlay()
{
	const overlay = document.getElementById('loadingOverlay');
	if (overlay && overlay.parentNode) {
		document.body.removeChild(overlay);
	}
	loadingOverlay = null;
	isLoading = false;
	targetView = null;
	
	if (overlayRemovalTimeout) {
		clearTimeout(overlayRemovalTimeout);
		overlayRemovalTimeout = null;
	}
}

export function resetLoadingScreen()
{
	forceRemoveLoadingOverlay();
}

export function getLoadingStatus() {
	return {
		isLoading: isLoading,
		hasOverlay: !!loadingOverlay,
		hasOverlayInDOM: !!document.getElementById('loadingOverlay'),
		targetView: targetView,
		hasTimeout: !!overlayRemovalTimeout
	};
}
export function getIsloading() {
	return isLoading;
}