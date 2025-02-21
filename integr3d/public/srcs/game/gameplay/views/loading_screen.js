import { changeView } from './camera.js';

let loadingOverlay;
let isLoading = false;
let targetView = null;

export function createLoadingOverlay() {
	loadingOverlay = document.createElement('div');
	loadingOverlay.id = 'loadingOverlay';
	loadingOverlay.innerHTML = `
		<link rel="stylesheet" href="./static/js/css/test.css">
		<div class="loading-container">
			<div class="spinner"></div>
			<div class="loading-text">Chargement<span>.</span><span>.</span><span>.</span></div>
		</div>
	`;
	document.body.appendChild(loadingOverlay);
}

export function removeLoadingOverlay() {
	if (loadingOverlay) {
		console.log("Suppression de l'overlay...");
		loadingOverlay.style.opacity = '0';
		setTimeout(() => {
			if (loadingOverlay && loadingOverlay.parentNode) {
				document.body.removeChild(loadingOverlay);
				console.log("Overlay supprimé");
			}
			isLoading = false;
			console.log("isLoading:", isLoading);
			if (targetView) {
				changeView(targetView);
				targetView = null;
			}
		}, 1000);
	}
}