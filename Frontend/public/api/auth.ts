import { notif, fetchAPI, homeView, gameMenuView, platformerView, setLocalStorage, updateUI, $, $input, $form } from './utils.js';
import { ApiResponse, LoginRequest, RegisterRequest, User } from './types.js';
import { connectWebSocket, disconnectWebSocket } from './websocket.js';

/**
 * Connect the user to the game menu.
 * If the user has double authentication enabled, it will show the double authentication form.
 * @param event Form submission event
 */
export async function login(event: Event): Promise<void> {
	try {
		event.preventDefault();
		const username = $input("login-username").value;
		const password = $input("login-password").value;
		const data = await fetchAPI('/request/user/login', 'POST', { username, password }, true, false);
		
		if (!data.accessToken && !data.success) {
			notif(`connexion refused : ${data.error}`, false);
		} else if (data.success && data.connection_status === "partially_connected" && data.user.doubleAuth_status) {
			sessionStorage.setItem("userId", data.user.userId);
			updateUI({
				removeClass: [{ id:"doubleAuthForm", className: "hidden" }],
				addClass: ["loginForm", "doubleAuthForm"],
			}); $input("login-title").textContent = "Double Authentication";

			// document.getElementById("doubleAuthForm").classList.remove("hidden");
			// document.getElementById("loginForm").classList.add("active");
			// document.getElementById("doubleAuthForm").classList.add("active");
		} else if (data.success && data.connection_status === "connected") {
			notif(data.message, true);
			setLocalStorage({ "Player1": data.user.username, "profile_picture": data.user.profile_picture });
			connectWebSocket()
			console.debug("Connected, Token :", sessionStorage.getItem("accessToken"));
			// gameMenuView();
			setTimeout(() => {
				gameMenuView();
			}, 2000);
			$form("loginForm").reset();
			$input("login-password").value = "";
		} else {
			notif(data.error, false);
			$input("login-password").value = "";
			console.warn("login : ", data.error);
		}
	} catch (err) {
		notif("Erreur de connexion", false);
		console.error("Erreur lors de la connexion :", err);
	}
}

/**
 * Verify the 2FA code entered by the user.
 * @param event 
 */
export async function verify2FA(event: Event) {
	try {
		event.preventDefault();
		const userId = sessionStorage.getItem("userId");
		const code = $input("verify-2fa-code").value;
		const data = await fetchAPI('/request/user/verify-2fa', 'POST', { userId, code });

		if (data.success) {
			sessionStorage.removeItem("userId")
			setLocalStorage({"Player1": data.username, "profile_picture": data.profile_picture});
			connectWebSocket()
			console.info("2FA code valid!");
			gameMenuView();
		}
	} catch (err) {
		console.error("Erreur lors de la validation du code 2FA :", err);
	}
}

/**
 * Login for 1v1 mode.
 * @param event Form submission, where the second user enters his infos.
 */
export async function login_1v1(event: Event) {
	try {
		event.preventDefault();
		const username = $input("1v1-username2").value;
		const password = $input("1v1-password2").value;
		if (!username || !password)
			return notif("Please fill in all fields", false);

		const data = await fetchAPI('/request/user/login-1v1', 'POST', { username, password }, true, false);
		if (data.success) {
			if (data.player2.username === localStorage.getItem("Player1"))
				return notif("You cannot play against yourself", false);
			notif(data.message, true);
			setLocalStorage({ "Player2": data.player2.username });
			updateUI({
				removeClass: ["choose_your_opponent_1v1_form", "container"],
				addClass: ["back_to_select_mode_view6", "view6"],
				setContent: {"1v1-oponent-username1": localStorage.getItem("Player1"), "1v1-oponent-username2": localStorage.getItem("Player2")}
			});
			// document.getElementById("choose_your_opponent_1v1_form").classList.remove('active');
			// document.getElementById("back_to_select_mode_view6").classList.add('active');
			// document.getElementById("view6").classList.add('active');
			// document.getElementById("container").classList.remove('active');
			// document.getElementById("1v1-oponent-username1").innerHTML = localStorage.getItem("Player1");
			// document.getElementById("1v1-oponent-username2").innerHTML = localStorage.getItem("Player2");
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
	$form("choose_your_opponent_1v1_form").reset();
}

export async function login_2v2(event: Event) {
	event.preventDefault();
	const username1 = localStorage.getItem("Player1");
	const username2 = $input("2v2-username2").value;
	const username3 = $input("2v2-username3").value;
	const username4 = $input("2v2-username4").value;

	const password2 = $input("2v2-password2").value;
	const password3 = $input("2v2-password3").value;
	const password4 = $input("2v2-password4").value;

	if (!username2 || !password2 || !username3 || !password3 || !username4 || !password4)
		return notif("Please fill in all fields", false);

	try {
		const data = await fetchAPI('/request/user/login-2v2', 'POST', { username2, password2, username3, password3, username4, password4 }, true, false);
		if (data.success) {
			if (username1 === username2 || username1 === username3 || username1 === username4 ||
				username2 === username3 || username2 === username4 || username3 === username4)
				return notif("There can't be the same player 2 times", false);
			notif(data.message, true);
			setLocalStorage({"Player2": data.player2.username, "Player3": data.player3.username, "Player4": data.player4.username });
			updateUI({
				removeClass: ["choose_your_opponent_multi_form", "container"],
				addClass: ["back_to_select_mode_view8", "view8"],
				setContent: {
					"2v2-oponent-username1": localStorage.getItem("Player1"),
					"2v2-oponent-username2": localStorage.getItem("Player2"),
					"2v2-oponent-username3": localStorage.getItem("Player3"),
					"2v2-oponent-username4": localStorage.getItem("Player4")
				}
			});
			// document.getElementById("choose_your_opponent_multi_form").classList.remove('active');
			// document.getElementById("back_to_select_mode_view8").classList.add('active');
			// document.getElementById("view8").classList.add('active');
			// document.getElementById("container").classList.remove('active');
			// document.getElementById("2v2-oponent-username1").innerHTML = localStorage.getItem("Player1");
			// document.getElementById("2v2-oponent-username2").innerHTML = localStorage.getItem("Player2");
			// document.getElementById("2v2-oponent-username3").innerHTML = localStorage.getItem("Player3");
			// document.getElementById("2v2-oponent-username4").innerHTML = localStorage.getItem("Player4");
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
	(document.getElementById("choose_your_opponent_1v1_form") as HTMLFormElement).reset();
}

export async function login_tournament(event: Event) {
	event.preventDefault();
	const username1 = localStorage.getItem("Player1");
	const username2 = $input("tournament-username2").value;
	const username3 = $input("tournament-username3").value;
	const username4 = $input("tournament-username4").value;

	const password2 = $input("tournament-password2").value;
	const password3 = $input("tournament-password3").value;
	const password4 = $input("tournament-password4").value;

	if (!username2 || !password2 || !username3 || !password3 || !username4 || !password4)
		return notif("Please fill in all fields", false);

	try {
		const data = await fetchAPI('/request/user/login-2v2', 'POST', { username2, password2, username3, password3, username4, password4 }, true, false);
		if (data.success) {
			if (username1 === username2 || username1 === username3 || username1 === username4 ||
				username2 === username3 || username2 === username4 || username3 === username4)
				return notif("There can't be the same player 2 times", false);
			notif(data.message, true);
			setLocalStorage({"Player2": data.player2.username, "Player3": data.player3.username, "Player4": data.player4.username });
			updateUI({
				setContent: {
					"Player1": localStorage.getItem("Player1"),
					"Player2": localStorage.getItem("Player2"),
					"Player3": localStorage.getItem("Player3"),
					"Player4": localStorage.getItem("Player4")
			}});
			// document.getElementById("Player1").innerHTML = localStorage.getItem("Player1");
			// document.getElementById("Player2").innerHTML = localStorage.getItem("Player2");
			// document.getElementById("Player3").innerHTML = localStorage.getItem("Player3");
			// document.getElementById("Player4").innerHTML = localStorage.getItem("Player4");
			setLocalStorage({"current_player1": localStorage.getItem("Player1"), "current_player2": localStorage.getItem("Player2") });
			const tournamentStarted = true;
			localStorage.setItem('tournamentStarted', tournamentStarted.toString());
			updateUI({ addClass: [{ id: "tournament_graphic_id", className: "active" }, { id: "container_name_player", className: "hidden"}] });
			// document.getElementById("container_name_player").classList.add('hidden');
			// document.getElementById("tournament_graphic_id").classList.add('active');
			document.getElementById("start_tournament").style.display = 'none';
			document.getElementById("back_to_menu_view_tournament").style.display = 'none';
			
			// Mettre en surbrillance les joueurs initiaux
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
}

export async function login_platformer(event: Event) {
	event.preventDefault();
	const username = $input("platformer-username2").value;
	const password = $input("platformer-password2").value;
	console.debug(`username : ${username}, password : ${password}`);
	if (!username || !password)
		return notif("Please fill in all fields", false);

	try {
		const data = await fetchAPI('/request/user/login-1v1', 'POST', { username, password }, true, false);
		if (data.success) {
			if (data.player2.username === localStorage.getItem("Player1"))
				return notif("You cannot play against yourself", false);
			notif(data.message, true);
			localStorage.setItem("Player2", data.player2.username);
			localStorage.setItem("platformer_view", 'true'); //REVIEW - a cause de ts jai du le mettre en string
			$("start-platformer").click();
			// document.getElementById("platformer-oponent-username1").innerHTML = localStorage.getItem("Player1");
			// document.getElementById("platformer-oponent-username2").innerHTML = localStorage.getItem("Player2");
			// PlatformerView(); //TODO
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Erreur lors de la connexion :", err);
		notif("Erreur de connexion", false);
	}
	$form("choose_your_opponent_platformer_form").reset();
}

export async function logout() {
	try {
		disconnectWebSocket()
		await fetchAPI('/request/user/logout', 'POST', {}, false);
		sessionStorage.clear();
		localStorage.clear();
		console.info("Logged out successfully !");
		homeView();
	} catch (err) {
		console.error("Erreur lors de la déconnexion :", err);
	}
}

export async function register(event: Event) {
	try {
		event.preventDefault();

		const username = $input("register-username").value;
		const password = $input("register-password").value;
		const confirmPassword = $input("register-confirm-password").value;

		if (password !== confirmPassword)
			return notif("Passwords are different", false);

		const data = await fetchAPI('/request/user/create-user', 'POST', { username, password });
		
		if (data.success) {
			updateUI({removeClass: ["create_account_id", "loginform_id"], resetForm: "registerForm"});
			// document.getElementById("registerForm").reset();
			// document.getElementById("create_account_id").classList.remove("active");
			// document.getElementById("loginform_id").classList.remove("active");
		}
	} catch (err) {
		console.error("Erreur lors de l'inscription :", err);
	}
}

export async function refreshInfos() {
	try {
		const data = await fetchAPI('/request/user/refresh-infos', 'POST', {}, true, false);

		if (!data.accessToken || data.deleted_account) {
			sessionStorage.clear();
			localStorage.clear();
			homeView(); //TODO - bug de la page de chargement lors de la redirection vers '/' apres une suppression du user par exemple
			notif("Session expired, please log in again", false);
		} else if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("accessToken") !== "undefined") {
			localStorage.clear();
			setLocalStorage({"Player1": data.user.username, "profile_picture": data.user.profile_picture});
			// localStorage.setItem("Player1", data.user.username);
			// localStorage.setItem("profile_picture", data.user.profile_picture);
			gameMenuView();
		}

		if (data.success)
			console.info("Infos refreshed successfully");
		else
			console.warn("Error refreshing infos:", data.error);
	} catch (err) {
		console.error("Erreur lors du rafraîchissement des informations :", err);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	refreshInfos();
	setTimeout(() => { //FIXME - 
		initGoogleSignIn();
	}, 1000);
});

//* ==== GOOGLE SIGN-IN ==== *//

// Types pour Google OAuth
interface GoogleTokenClient {
	requestAccessToken(): void;
}

interface GoogleSignInResponse {
	access_token: string;
	error?: string;
}

// Google API global interface
declare global {
	interface Window {
		google: {
			accounts: {
				oauth2: {
					initTokenClient(config: any): GoogleTokenClient;
				}
			}
		};
		initGoogleSignIn: () => void;
		tokenClient: GoogleTokenClient | null;
	}
} declare const google: Window['google'];

let tokenClient: GoogleTokenClient | null = null;

export async function initGoogleSignIn() {
	console.debug("URL actuelle:", window.location.origin);

	if (typeof google !== 'undefined' && google.accounts?.oauth2) {
		try {
			const config = await fetchAPI('/request/user/google-config', 'GET', null, false);
			
			if (!config.success || !config.client_id) {
				console.warn("Impossible de récupérer la configuration Google");
				return;
			}
			tokenClient = google.accounts.oauth2.initTokenClient({
				// client_id: "947283985561-juoekoaqm73bm3jmtt36j0pa1kmggok3.apps.googleusercontent.com",
				client_id: config.client_id,
				scope: "openid email profile",
				callback: handleGoogleSignIn, // appelée une fois que le user accepte
			});
			localStorage.setItem("googleSignIn", "true"); // REVIEW - a cause de ts jai du le mettre en string
			console.info("Google OAuth Token Client initialisé avec succès");
		} catch (error) {
			console.error("Erreur lors de l'initialisation OAuth:", error);
		}
	} else {
		console.warn("Google OAuth API non disponible");
	}
}

// Make functions available globally for HTML event handlers and TypeScript
if (typeof window !== 'undefined') {
    (window as any).login = login;
	(window as any).login = login;
	(window as any).register = register;
	(window as any).verify2FA = verify2FA;
	(window as any).logout = logout;
	(window as any).login_1v1 = login_1v1;
	(window as any).login_2v2 = login_2v2;
	(window as any).login_tournament = login_tournament;
	(window as any).login_platformer = login_platformer;
}

window.initGoogleSignIn = initGoogleSignIn;
window.tokenClient = tokenClient;
// window.login = login;
// window.register = register;
// window.verify2FA = verify2FA;
// window.logout = logout;
// window.login_1v1 = login_1v1;
// window.login_2v2 = login_2v2;
// window.login_tournament = login_tournament;
// window.login_platformer = login_platformer;

// Fonction de gestion de la réponse Google
export async function handleGoogleSignIn(response: { access_token: string }) {
	try {
		const accessToken = response.access_token;
		const data = await fetchAPI('/request/user/google-signin', 'POST', { access_token: accessToken });

		if (data.success) {
			sessionStorage.setItem("accessToken", data.accessToken);
			localStorage.setItem("Player1", data.user.username);
			if (data.user.profile_picture)
				localStorage.setItem("profile_picture", data.user.profile_picture);
			notif("Connexion Google réussie !", true);
			gameMenuView(); //TODO il y avait un delai de -> 2000
		} else
			notif(data.error || "Erreur lors de la connexion Google", false);
	} catch (err) {
		console.error("Erreur Google Sign In:", err);
		notif("Connexion Google failed", false);
	}
}

window.addEventListener('beforeunload', () => {
	disconnectWebSocket()
});