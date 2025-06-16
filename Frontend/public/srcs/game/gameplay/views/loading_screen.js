import { changeView } from './camera.js';

let loadingOverlay;
let isLoading = false;
let targetView = null;

export function createLoadingOverlay()
{
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
	console.log("Creation of the overlay...");
	document.body.appendChild(loadingOverlay);
}

export function removeLoadingOverlay()
{
	if (loadingOverlay)
	{
		loadingOverlay.style.opacity = '0';
		setTimeout(() =>
		{
			if (loadingOverlay && loadingOverlay.parentNode)
			{
				document.body.removeChild(loadingOverlay);
				loadingOverlay = null;
			}
			isLoading = false;
			if (targetView)
			{
				changeView(targetView);
				targetView = null;
			}
		}, 1000);
	}
}
