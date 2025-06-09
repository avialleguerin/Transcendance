export function notif(message, success = true) {
	const notification = document.getElementById('resultMessage');
	console.log("notif:", message, "success:", success);
	if (notification) {
		document.getElementById('notification-container').style.display = 'flex';
		const icon = success ?
			`<img src='/assets/image/success.png' style='width:20px; height:20px; margin-right:5px;'>` :
			`<img src='/assets/image/failure.png' style='width:20px; height:20px; margin-right:5px;'>`;

		notification.innerHTML = `<div style='display:flex; align-items:center;'>${icon}<span>${message}</span></div>`;
		if (success)
			notification.className = `success_notif`
		else
			notification.className = `failure_notif`;

		setTimeout(() => {
			notification.style.opacity = '1';
		}, 10);

		setTimeout(() => {
			notification.style.opacity = '0';
			document.getElementById('notification-container').style.display = 'none';
		}, 3000);
	}
}

export async function fetchAPI(url, method, body = null, showNotification = true, formData = null) {
	try {
		let accessToken = sessionStorage.getItem('accessToken');

		const headers = {
			"Authorization": `Bearer ${accessToken}`
		};

		if (body && !formData)
			headers["Content-Type"] = "application/json";

		const options = {
			method,
			headers,
			credentials: 'include'
		};

		if (body && !formData)
			options.body = JSON.stringify(body);
		else if (formData)
			options.body = formData;

		const response = await fetch(url, options);
		const data = await response.json();
		if (data.accessToken)
			sessionStorage.setItem('accessToken', data.accessToken);

		if (data.success && showNotification)
			notif(data.message, true);
		else if (data.error && showNotification)
			notif(data.error, false);
		console.log("fetchAPI: data:", data.error ? data.error : data);
		return data;
	} catch (err) {
		console.error(`Error in API call to ${url}:`, err.message);
		if (showNotification)
			notif("Une erreur s'est produite lors de la communication avec le serveur", false);
		throw err;
	}
}

import { handleViewTransitions } from '../srcs/game/gameplay/views/camera.js';

export function homeView() {
	handleViewTransitions("default", "vue1");
	history.pushState({}, '', '/');
	import('../static/js/views/Home.js').then((module) => {
		const Home = module.default;
		const homeInstance = new Home();
		homeInstance.getHtml().then((html) => {
			const appElement = document.getElementById('app');
			if (appElement) {
				appElement.innerHTML = html;
				if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
					homeInstance.createAccount();
				}
			}
		});
	});
}

export function gameMenuView() {
	handleViewTransitions("vue1", "default");
	history.pushState({}, '', '/Game_menu');
	import('../static/js/views/Game_menu.js').then(module => {
		const GameMenu = module.default;
		const gameMenuInstance = new GameMenu();
		gameMenuInstance.getHtml().then(html => {
			document.getElementById('app').innerHTML = html;
			if (gameMenuInstance.game_menu) {
				gameMenuInstance.game_menu();
			}
		});
	});
}

export function platformerView() {
	history.pushState({}, '', '/platformer');
	import('../static/js/views/platformer/PlatformView.js').then((module) => {
		console.log("Home module loaded");
		const PlatformerView = module.default;
		const platformerInstance = new PlatformerView();
		platformerInstance.getHtml().then((html) => {
			const appElement = document.getElementById('app');
			if (appElement) {
				appElement.innerHTML = html;
				if (platformerInstance.createAccount && typeof platformerInstance.createAccount === 'function') {
					platformerInstance.init_game_platformer();
				}
			}
		});
	});
}

export const setLocalStorage = (items) => {
	Object.entries(items).forEach(([key, value]) => {
		localStorage.setItem(key, value);
	});
};

// export function updateUI(config) {
//     // Gestion des classes
//     if (config.removeClass) {
//         config.removeClass.forEach(id => {
//             document.getElementById(id)?.classList.remove('active');
//         });
//     }

//     if (config.addClass) {
//         config.addClass.forEach(id => {
//             document.getElementById(id)?.classList.add('active');
//         });
//     }

//     // Gestion du contenu innerHTML
//     if (config.setContent) {
//         Object.entries(config.setContent).forEach(([id, content]) => {
//             const element = document.getElementById(id);
//             if (element) element.innerHTML = content;
//         });
//     }
// }

export function updateUI(config) {
	if (config.removeClass) {
		config.removeClass.forEach(item => {
			if (typeof item === 'string')
				document.getElementById(item)?.classList.remove('active');
			else if (typeof item === 'object')
				document.getElementById(item.id)?.classList.remove(item.className || 'active');
		});
	}

	if (config.addClass) {
		config.addClass.forEach(item => {
			if (typeof item === 'string')
				document.getElementById(item)?.classList.add('active');
			else if (typeof item === 'object')
				document.getElementById(item.id)?.classList.add(item.className || 'active');
		});
	}

	if (config.setContent) {
		Object.entries(config.setContent).forEach(([id, content]) => {
			const element = document.getElementById(id);
			if (element) element.innerHTML = content;
		});
	}

	if (config.resetForms) {
		config.resetForms.forEach(formId => {
			const form = document.getElementById(formId);
			if (form && typeof form.reset === 'function')
				form.reset();
		});
	}
}