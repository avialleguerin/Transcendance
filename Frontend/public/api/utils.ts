import { handleViewTransitions } from '../srcs/game/gameplay/views/camera.js';
import { ClassModification, UIConfig } from './types.js';

export function notif(message: string, success = true) {
	const notification = document.getElementById('resultMessage');
	if (notification) {
		const notificationContainer = document.getElementById('notification-container');
		if (!notificationContainer)
			return;
		notificationContainer.style.display = 'flex';
		notification.innerHTML = message;
		notification.classList.remove('hidden');
		notification.classList.add(`${success ? 'bg-green-500' : 'bg-red-500'}`);
		if (success)
			notification.className = `success_notif`
		else
			notification.className = `failure_notif`;

		setTimeout(() => {
			notification.style.opacity = '1';
		}, 10);

		setTimeout(() => {
			notification.style.opacity = '0';
			notificationContainer.style.display = 'none';
		}, 3000);
	}
}

export async function fetchAPI(url: string, method: string, body: any = null, showNotification = true, formData: boolean | FormData | null = null): Promise<any> {
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
		let data = await response.json();
		if (!response.ok) {
			data = {
				success: false,
				error: `HTTP ${response.status}: ${response.statusText}`,
				...data
			};
		}
		if (data.accessToken)
			sessionStorage.setItem('accessToken', data.accessToken);

		if (data.success && showNotification)
			notif(data.message, true);
		else if (data.error && showNotification)
			notif(data.error, false);
		return data;
	} catch (err) {
		console.error("Error in fetchAPI:", err);
		if (showNotification)
			notif("Une erreur s'est produite lors de la communication avec le serveur", false);
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

export function gameMenuView(changeView: boolean, txt: string): void {
	if (changeView)
	{
		handleViewTransitions("vue1", "default");
		import('../static/js/index.js').then(module => {
			if (module.navigateTo) {
				module.navigateTo('/game-menu');
			}
		});
	}
	else 
	{
		notif(txt, false);
		if (txt === "You are already logged in") {
			import('../static/js/index.js').then(module => {
				if (module.navigateTo) {
					module.navigateTo('/game-menu');
				}
			});
		}
	}
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


export function sanitizeInput(input: string, type: string) : { success: boolean, input?: string, error?: string } {
	if (type === "username") {
		const regex = /^[A-Za-z0-9._-]{3,10}$/;
		if (!regex.test(input))
			return { success: false, error: "Username must contain 3-10 characters and can only contain letters, numbers, dots, underscores, and hyphens" };
		const sanitizedUsername = input.replace(/[^A-Za-z0-9._-]/g, '')
		return { success: true, input: sanitizedUsername };
	} else if (type === "password") {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@&*#])[A-Za-z\d!?@&*#]{8,20}$/;
		if (!regex.test(input)) {
			return { success: false, error: "Password must contain 8-20 characters, one lowercase, one uppercase, one number, and one special character (!?@&*#)" };
		}
		return { success: true };
	} else if (type === "score") {
		const regex = /^[0-9]{1,4}$/;
		if (!regex.test(input)) {
			return { success: false, error: "Invalid characters in score" };
		}
		return { success: true };
	}
	return { success: false, error: "Invalid type specified" };
}

export const StorageKeys = {
	AUTH_TICKET: "" as string,
	PROFILE_PICTURE: "" as string,
	TOURNAMENT_COUNT: 0 as number,
	TOURNAMENT_STARTED: false as boolean, 
	TOURNAMENT_FINISHED: false as boolean,
	GAME_HISTORY: "" as string,
	SECOND_CHANCE: false as boolean,
	CAN_PLAY: false as boolean,
	SCORE_LEFT: 0 as number,
	SCORE_RIGHT: 0 as number,
	MATCH_RESULT1: "" as string,
	MATCH_RESULT2: "" as string,
	MATCH_RESULT3: "" as string,
	MATCH_RESULT4: "" as string,
	MATCH_RESULT5: "" as string,
	MATCH_RESULT6: "" as string,
	MATCH_RESULT7: "" as string, 
	PLAYER1: "" as string,
	PLAYER2: "" as string,
	PLAYER3: "" as string,
	PLAYER4: "" as string,
	CURRENT_PLAYER1: "" as string,
	CURRENT_PLAYER2: "" as string,
	SCORE_PLAYER1: 0 as number,
	SCORE_PLAYER2: 0 as number,
	MATCH1_WINNER: "" as string,
	MATCH2_WINNER: "" as string,
	MATCH3_WINNER: "" as string,
	MATCH4_WINNER: "" as string,
	MATCH5_WINNER: "" as string,
	MATCH6_WINNER: "" as string,
	MATCH7_WINNER: "" as string,
	MATCH1_LOSER: "" as string,
	MATCH2_LOSER: "" as string,
	MATCH3_LOSER: "" as string,
	MATCH4_LOSER: "" as string,
	MATCH5_LOSER: "" as string,
	MATCH6_LOSER: "" as string,
	MATCH7_LOSER: "" as string,
	HISTORY_VISIBLE: false as boolean,
	HISTORY_IS_VISIBLE: false as boolean,
	BOOL: false as boolean,
	TOURNAMENT_FIRST_PLACE: "" as string,
	TOURNAMENT_SECOND_PLACE: "" as string,
	TOURNAMENT_THIRD_PLACE: "" as string,
	TOURNAMENT_FOURTH_PLACE: "" as string,
};