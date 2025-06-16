import { notif, fetchAPI, homeView, gameMenuView, platformerView, setLocalStorage, updateUI, $, $input, $form } from './utils.js';
import { ApiResponse, LoginRequest, RegisterRequest, User, GoogleTokenClient, GoogleSignInResponse,  } from './types.js';
import { connectWebSocket, disconnectWebSocket } from './websocket.js';

export let tokenClient: GoogleTokenClient | null = null;

if (typeof window !== 'undefined') {
	window.login = login;
	window.register = register;
	window.verify2FA = verify2FA;
	window.logout = logout;
	window.login_1v1 = login_1v1;
	window.login_2v2 = login_2v2;
	window.login_tournament = login_tournament;
	window.login_platformer = login_platformer;
	window.initGoogleSignIn = initGoogleSignIn;
	window.tokenClient = tokenClient;
}

//* ==== LOG-INs ==== *//

/**
 * Connect the user to the game menu.
 * If the user has double authentication enabled, it will show the double authentication form.
 * @param event Form submission event
 */
export async function login(event: Event): Promise<void> {
	event.preventDefault();
	const username = $input("login-username").value;
	const password = $input("login-password").value;

	try {
		const data: ApiResponse = await fetchAPI('/request/user/login', 'POST', { username, password }, true, false);
		
		if (!data.accessToken && !data.success)
			console.debug(`${data.function}: ${data.error} - ${data.message}`);
		else if (data.success && data.connection_status === "partially_connected" && data.user.doubleAuth_status) {
			sessionStorage.setItem("userId", data.user.userId); // todo change userid to id
			updateUI({ removeClass: [{ id:"doubleAuthForm", className: "hidden" }], addClass: ["loginForm", "doubleAuthForm"] });
			$input("login-title").textContent = "Double Authentication";
		} else if (data.success && data.connection_status === "connected") {
			console.debug(`${data.function}: ${data.message}. Logged with User: ${data.user.username}`);
			setLocalStorage({ "Player1": data.user.username, "profile_picture": data.user.profile_picture });
			connectWebSocket()
			gameMenuView();
			$form("loginForm").reset();
			$input("login-password").value = "";
		} else {
			$input("login-password").value = "";
			console.warn("login : ", data.error);
		}
	} catch (err) { notif(`Connexion failed`, false); console.error(`login: ${err}`); }
}

/**
 * Connect the user and the opeponent in 1v1 mode.
 * @param event Form submission, where the second user enters his infos.
 */
export async function login_1v1(event: Event) {
	console.debug(`function called: login_1v1`);
	event.preventDefault();
	const username = $input("1v1-username2").value;
	const password = $input("1v1-password2").value;
	if (!username || !password)	return notif("Please fill in all fields", false);
	if (username === localStorage.getItem("Player1")) return notif("You cannot play against yourself", false);

	try {
		const data: ApiResponse  = await fetchAPI('/request/user/login-1v1', 'POST', { username, password }, true, false);

		if (data.success) {
			console.debug(`${data.function}: ${data.message}. Player2 ${data.player2.username} logged in successfully`);
			setLocalStorage({ "Player2": data.player2.username });
			updateUI({
				removeClass: ["choose_your_opponent_1v1_form", "container"],
				addClass: ["back_to_select_mode_view6", "view6"],
				setContent: {"1v1-oponent-username1": localStorage.getItem("Player1"), "1v1-oponent-username2": localStorage.getItem("Player2")}
			});
		}
	} catch (err) { notif("Connexion to 1v1 failed", false); console.error(`login_1v1: ${err}`); }
	$form("choose_your_opponent_1v1_form").reset();
}

/**
 * Connect all the users in 2v2 mode.
 * @param event Form submission, where all the users enter their infos.
 */
export async function login_2v2(event: Event): Promise<void> {
	console.debug(`function called: login_2v2`);
	event.preventDefault();
	const username1 = localStorage.getItem("Player1");
	const username2 = $input("2v2-username2").value, password2 = $input("2v2-password2").value;
	const username3 = $input("2v2-username3").value, password3 = $input("2v2-password3").value;
	const username4 = $input("2v2-username4").value, password4 = $input("2v2-password4").value;
	if (!username2 || !password2 || !username3 || !password3 || !username4 || !password4)	return notif("Please fill in all fields", false);
	if (username1 === username2 || username1 === username3 || username1 === username4 ||
		username2 === username3 || username2 === username4 || username3 === username4)		return notif("There can't be the same player 2 times", false);

	try {
		const data: ApiResponse = await fetchAPI('/request/user/login-2v2', 'POST', { username2, password2, username3, password3, username4, password4 }, true, false);

		if (data.success) {
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
		}
	} catch (err) { notif("Connexion to 2v2 failed", false); console.error(`login_2v2: ${err}`); }
	$form("choose_your_opponent_multi_form").reset();
}

/**
 * Connect all the users in tournament mode.
 * @param event Form submission, where all the users enter their infos.
 */
export async function login_tournament(event: Event): Promise<void> {
	console.debug(`function called: login_tournament`);
	event.preventDefault();
	const username1 = localStorage.getItem("Player1");
	const username2 = $input("tournament-username2").value, password2 = $input("tournament-password2").value;
	const username3 = $input("tournament-username3").value, password3 = $input("tournament-password3").value;
	const username4 = $input("tournament-username4").value, password4 = $input("tournament-password4").value;
	if (!username2 || !password2 || !username3 || !password3 || !username4 || !password4)	return notif("Please fill in all fields", false);
	if (username1 === username2 || username1 === username3 || username1 === username4 ||
		username2 === username3 || username2 === username4 || username3 === username4)		return notif("There can't be the same player 2 times", false);

	try {
		const data = await fetchAPI('/request/user/login-2v2', 'POST', { username2, password2, username3, password3, username4, password4 }, true, false);		

		if (data.success) {
			setLocalStorage({"Player2": data.player2.username, "Player3": data.player3.username, "Player4": data.player4.username });
			updateUI({ setContent: { "Player1": localStorage.getItem("Player1"), "Player2": localStorage.getItem("Player2"), "Player3": localStorage.getItem("Player3"), "Player4": localStorage.getItem("Player4") }});
			setLocalStorage({"current_player1": localStorage.getItem("Player1"), "current_player2": localStorage.getItem("Player2") });
			const tournamentStarted = true;
			localStorage.setItem('tournamentStarted', tournamentStarted.toString());
			updateUI({ addClass: [{ id: "tournament_graphic_id", className: "active" }, { id: "container_name_player", className: "hidden"}] });
			$("start_tournament").style.display = 'none';
			$("back_to_menu_view_tournament").style.display = 'none';
		}
	} catch (err) { notif("Connexion to tournament failed", false); console.error(`login_tournament: ${err}`); }
}

/**
 * Connect the user to the platformer game.
 * @param event Form submission, where the second user enters his infos.
 */
export async function login_platformer(event: Event) {
	console.debug(`function called: login_platformer`);
	event.preventDefault();
	const username = $input("platformer-username2").value;
	const password = $input("platformer-password2").value;
	if (!username || !password)	return notif("Please fill in all fields", false);
	if (username === localStorage.getItem("Player1")) return notif("You cannot play against yourself", false);

	try {
		const data = await fetchAPI('/request/user/login-1v1', 'POST', { username, password }, true, false);

		if (data.success) {
			setLocalStorage({"Player1": localStorage.getItem("Player1"), "Player2": data.player2.username, "platformer_view": true });
			$("start-platformer").click();
			// PlatformerView(); //TODO
		}
	} catch (err) { notif("Connexion to platformer failed", false); console.error(`login_platformer: ${err}`); }
	$form("choose_your_opponent_platformer_form").reset();
}

//* ==== OTHER ==== *//

/**
 * Log out the user, clear session and local storage, and redirect to home view.
 */
export async function logout() {
	console.debug(`function called: logout`);

	try {
		disconnectWebSocket()
		await fetchAPI('/request/user/logout', 'POST', {}, true);
		sessionStorage.clear();
		localStorage.clear();
		homeView();
	} catch (err) { console.error(`logout: ${err}`); }
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
	} catch (err) { console.error(`verify2FA: ${err}`); }
}



/**
 * Register a new user.
 * @param event User infos
 */
export async function register(event: Event) {
	event.preventDefault();
	const username = $input("register-username").value;
	const password = $input("register-password").value;
	const confirmPassword = $input("register-confirm-password").value;
	if (password !== confirmPassword) return notif("Passwords are different", false);

	try {
		const data = await fetchAPI('/request/user/create-user', 'POST', { username, password });
		
		if (data.success)
			updateUI({removeClass: ["create_account_id", "loginform_id"], resetForms: ["registerForm"]});
	} catch (err) { console.error(`register: ${err}`); }
}

/**
 * Refresh user infos by making an API call.
 */
export async function refreshInfos() { //REVIEW - maybe put in utils
	try {
		const data = await fetchAPI('/request/user/refresh-infos', 'POST', {}, false, false);

		if (!data.accessToken || data.deleted_account) {
			console.warn(`Session expired or account deleted`);
			sessionStorage.clear();
			localStorage.clear();
			homeView();
		} else if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("accessToken") !== "undefined") {
			console.debug(`Access token found, refreshing user infos`);
			// localStorage.clear();
			setLocalStorage({"Player1": data.user.username, "profile_picture": data.user.profile_picture});
			connectWebSocket();
			gameMenuView();
		}

		if (data.success)
			console.info(`${data.function}: ${data.message}. User: ${data.user.username}`);
		else
			console.debug(`${data.function}: ${data.error} - ${data.message}. If you are not logged in, this is normal.`);
	} catch (err) { console.error(`refreshInfos: ${err}`); }
}

//* ==== GOOGLE SIGN-IN ==== *//

/**
 * Initialize Google Sign-In by fetching the client ID and setting up the token client.
 * This function is called when the DOM is fully loaded.
 * It checks if the Google OAuth API is available and initializes the token client.
 * If the client ID is not available, it logs a warning.
 * @returns {Promise<void>}
 */
export async function initGoogleSignIn(): Promise<void> {
	console.trace("- `initGoogleSignIn()` called");

	if (typeof google !== 'undefined' && google.accounts?.oauth2) {
		try {
			const data = await fetchAPI('/request/user/google-config', 'GET', null, false);
			
			if (!data.success || !data.client_id) {
				console.warn("Impossible de récupérer la configuration Google");
				return;
			}
			tokenClient = google.accounts.oauth2.initTokenClient({
				client_id: data.client_id,
				scope: "openid email profile",
				callback: handleGoogleSignIn,
			});
			localStorage.setItem("googleSignIn", "true"); // REVIEW - a cause de ts jai du le mettre en string
			console.info("Google OAuth Token Client initialised successfully");
		} catch (error) {
			console.error("Erreur lors de l'initialisation OAuth:", error);
		}
	} else {
		console.warn("Google OAuth API non disponible");
	}
}

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
			gameMenuView();
		} else
			notif(data.error || "Erreur lors de la connexion Google", false);
	} catch (err) {
		console.error("Erreur Google Sign In:", err);
		notif("Connexion Google failed", false);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	refreshInfos();
	setTimeout(() => { initGoogleSignIn(); }, 1000);
});

//* ==== WEB SOCKET ==== *//

window.addEventListener('beforeunload', () => {
	disconnectWebSocket()
});