import { handleViewTransitions } from '../srcs/game/gameplay/views/camera.js';
import { ClassModification, UIConfig } from './types.js';

export function notif(message: string, success = true) {
	const notification = document.getElementById('resultMessage');
	console.log("notif:", message, "success:", success);
	console.debug(`notification : ${notification}`)
	if (notification) {
		console.debug("je passe dans le if (notif)")
		document.getElementById('notification-container').style.display = 'flex';
		notification.innerHTML = `<div style='display:flex; align-items:center;'><span>${message}</span></div>`;
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

export async function fetchAPI(url: string, method: string, body: any = null, showNotification = true, formData: boolean | FormData | null = null): Promise<any> {
	console.debug(`fetchAPI: ${url}:[${method}] - body: ${body} - Notif: ${showNotification} - formData: ${formData}.`);
	try {
		const accessToken = sessionStorage.getItem('accessToken');

		const headers: Record<string, string> = {
			"Authorization": `Bearer ${accessToken}`
		};

		if (body && !formData)
			headers["Content-Type"] = "application/json";

		const options: RequestInit = {
			method,
			headers: {
				"Authorization": `Bearer ${accessToken}`,
				...(body && !formData ? { "Content-Type": "application/json" } : {})
			},
			credentials: 'include'
		};

		if (body && !formData)
			options.body = JSON.stringify(body);
		else if (formData && formData instanceof FormData) // instanceof FormData)
			options.body = formData;

		const response = await fetch(url, options);
		const data = await response.json();
		if (data.accessToken)
			sessionStorage.setItem('accessToken', data.accessToken);

		if (data.success && showNotification)
			notif(data.message, true);
		else if (data.error && showNotification)
			notif(data.error, false);
		console.log("fetchAPI: data.error:", data.error);
		return data;
	} catch (err) {
		console.error(`Error in API call to ${url}: ${err}`);
		if (showNotification)
			notif("Une erreur s'est produite lors de la communication avec le serveur", false);
		throw err;
	}
}

export function homeView(): void {
	handleViewTransitions("vue1", "vue2");
	history.pushState({}, '', '/');
	import('../static/js/views/home.js').then((module) => {
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

export function gameMenuView(): void {
	handleViewTransitions("vue1", "default");
	history.pushState({}, '', '/game-menu');
	setTimeout(() => {
		import('../static/js/views/game-menu.js').then(module => {
			const GameMenu = module.default;
			const gameMenuInstance = new GameMenu();
			gameMenuInstance.getHtml().then(html => {
				document.getElementById('app').innerHTML = html;
				if (gameMenuInstance.game_menu) {
					gameMenuInstance.game_menu();
				}
			});
		});
	}, 2000);
}

export function platformerView(): void {
	history.pushState({}, '', '/platformer');
	import('../static/js/views/platformer/PlatformView.js').then((module) => {
		const PlatformerView = module.default;
		const platformerInstance = new PlatformerView();
		platformerInstance.getHtml().then((html) => {
			const appElement = document.getElementById('app');
			if (appElement) {
				appElement.innerHTML = html;
				// if (platformerInstance.createAccount && typeof platformerInstance.createAccount === 'function') {
				//todo: changer init to createAccount je crois
				if (platformerInstance.init_game_platformer && typeof platformerInstance.init_game_platformer === 'function') {
					platformerInstance.init_game_platformer();
				}
			}
		});
	});
}

export const setLocalStorage = (items: Record<string, any>) => {
	Object.entries(items).forEach(([key, value]) => {
		localStorage.setItem(key, value);
	});
};

export function getLocalStorage(key: string): string | null {
	return localStorage.getItem(key);
}

/**
 * function facilitating UI updates by adding/removing classes, setting content, and resetting forms
 * @param config Configuration object for updating the UI
 */
export function updateUI(config: UIConfig): void {
  if (config.removeClass) {
	config.removeClass.forEach((item: string | ClassModification) => {
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
	  const form = document.getElementById(formId) as HTMLFormElement | null;
	  if (form && typeof form.reset === 'function')
		form.reset();
	});
  }
}

/**
 * Shorthand for document.getElementById with type casting
 * @param id Element ID
 * @returns HTML element with the specified type or null if not found
 */
export function $(id: string): HTMLElement | null { return document.getElementById(id); }
export function $input(id: string): HTMLInputElement { return document.getElementById(id) as HTMLInputElement; }
export function $form(id: string): HTMLFormElement { return document.getElementById(id) as HTMLFormElement; }

export function onSubmit(formId: string, handler: (event: Event) => void) {
	const form = document.getElementById(formId);
	form?.addEventListener("submit", handler);
}
