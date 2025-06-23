
import home from "./views/home.js";
import Game_menu from "./views/game-menu.js";
import solo_game_1v1 from "./views/solo-game-1v1.js";
import multi_player_game from "./views/multi-player-game.js";
import tournament from "./views/tournament.js";
import tournament_game from "./views/tournament-game.js";
import PlatformView  from "./views/platformer/PlatformView.js";
import { Route, RouteMatch } from "../../api/types.js";
import { gameMenuView, StorageKeys } from "../../api/utils.js";
import { handleViewTransitions } from "../../srcs/game/gameplay/views/camera.js";
import { leave_Game, leave_Multiplayer_Game, leave_tournament_game } from "../../srcs/game/gameplay/babylon.js";
import { gameState, GameState } from "./views/platformer/constants.js";
import { Setgame_started } from "./views/platformer/PlatformView.js";
import { get_skin_is_init } from "../../srcs/game/gameplay/solo/skin/init_skin_utils.js";
import { disable_skin_perso_player_first_and_seconde } from "../../srcs/game/gameplay/solo/skin/init_skin_player_podium.js";
import { disable_skin_perso_player_first_and_seconde_default } from "../../srcs/game/gameplay/solo/skin/init_skin_player_default.js";
import { setPowerUP_value, setPowerUP_value_multi } from "./views/game-menu.js";
import { disable_skin_multi_podium_default } from "../../srcs/game/gameplay/multiplayer/init_teamPlayer_podium_default.js";
import { disable_skin_multi_podium } from "../../srcs/game/gameplay/multiplayer/init_teamPlayer_podium.js";

let canTransition: boolean = true;
let leave_game_var: boolean = false;
let currentPage: string = location.pathname;
let navigationHistory: string[] = [location.pathname];
let canNavigate = true;

let is_init = get_skin_is_init();

const navigateTo = (url: string): void => {
	const previousPage = currentPage;
	const nextPage = url;

	// Réinitialiser canNavigate à true au début
	canNavigate = true;
	let blockMessage = "";
	
	if (nextPage === "/solo-game-1v1" && !StorageKeys.PLAYER2) {
		canNavigate = false;
		blockMessage = "You don't have opponents to play with";

	}
	
	if (nextPage === "/multi-player-game" && !StorageKeys.PLAYER2 && !StorageKeys.PLAYER3 && !StorageKeys.PLAYER4) {
		canNavigate = false;
		blockMessage = "You don't have opponents to play with";
	}

	else if (nextPage === "/platformer" && !StorageKeys.PLAYER2) {
		canNavigate = false;
		blockMessage = "You don't have opponents to play with";
	}

	else if (nextPage === "/tournament-game" && !StorageKeys.CAN_PLAY) {
		canNavigate = false;
		blockMessage = "You don't have opponents to play with";
	}

	if (!canNavigate)
	{
		console.log(`🚫 Navigation bloquée: ${previousPage} → ${nextPage}`);
		gameMenuView(false, blockMessage);
		return;
	}
	
	navigationHistory.push(nextPage);
	
	logPageTransition(previousPage, nextPage);
	
	history.pushState(null, "", url);
	router();
};

// Exporter navigateTo pour pouvoir l'utiliser dans utils.ts
export { navigateTo };

const logPageTransition = (from: string, to: string): void => {
	if (from === "/")
	{
		if (to === "/game-menu")
			console.log("📱 Transition: Accueil → Menu de jeu");
	}
	
	else if (from === "/game-menu")
	{
		if (to === "/")
		{
			console.log("🏠 Transition: Menu de jeu → Accueil");
		}
		else if (to === "/solo-game-1v1" && StorageKeys.PLAYER2)
		{
			handleViewTransitions("vue2", "vue3");
			canTransition = true;
		}
		else if (to === "/solo-game-1v1" && !StorageKeys.PLAYER2)
		{
			gameMenuView(false, "You dont have oponents to play with");
			canTransition = false;
		}

		else if (to === "/multi-player-game" && (StorageKeys.PLAYER2 && StorageKeys.PLAYER3 && StorageKeys.PLAYER4))
		{
			handleViewTransitions("vue2", "vue3");
			canTransition = true;
		}

		else if (to === "/multi-player-game" && (!StorageKeys.PLAYER2 && !StorageKeys.PLAYER3 && !StorageKeys.PLAYER4))
		{
			gameMenuView(false, "You dont have oponents to play with");
			canTransition = false;
		}
	

		else if (to === "/tournament")
		{
			handleViewTransitions("tournament", "vue2");
			canTransition = true;
		}
		else if (to === "/platformer" && StorageKeys.PLAYER2)
		{
			handleViewTransitions("platformer", "vue2");
			canTransition = true;
		}
		else if (to === "/platformer" && !StorageKeys.PLAYER2)
		{
			gameMenuView(false, "You dont have oponents to play with");
			canTransition = false;
		}

		else {
			console.log(`❓ Transition inconnue: ${from} → ${to}`);
		}
	}

	else if (from === "/solo-game-1v1")
	{
		if (to === "/game-menu")
		{
			handleViewTransitions("vue2", "vue4");
			leave_Game();
			if (is_init === true)
				disable_skin_perso_player_first_and_seconde();
			else
				disable_skin_perso_player_first_and_seconde_default();
			setPowerUP_value(0);
		}
	}
	
	else if (from === "/multi-player-game")
	{
		if (to === "/game-menu")
		{
			handleViewTransitions("vue2", "vue4");
			leave_Multiplayer_Game();
			if (is_init === true)
				disable_skin_multi_podium();
			else
				disable_skin_multi_podium_default();
			setPowerUP_value_multi(0);
		}
	}

	else if (from === "/tournament")
	{
		if (to === "/game-menu")
		{
			StorageKeys.TOURNAMENT_STARTED = false;
			StorageKeys.TOURNAMENT_COUNT = 0;
			StorageKeys.TOURNAMENT_FINISHED = false;
			StorageKeys.SECOND_CHANCE = false;
			StorageKeys.MATCH_RESULT1 = "";
			StorageKeys.MATCH_RESULT2 = "";
			StorageKeys.MATCH_RESULT3 = "";
			StorageKeys.MATCH_RESULT4 = "";
			StorageKeys.MATCH_RESULT5 = "";
			StorageKeys.MATCH_RESULT6 = "";
			StorageKeys.MATCH_RESULT7 = "";
			
			console.log("🏆 Tournoi réinitialisé - Retour au menu");
			
			handleViewTransitions("vue2", "tournament");
		}

		else if (to === "/tournament-game" && StorageKeys.CAN_PLAY)
		{
			handleViewTransitions("tournament", "vue3");
			canTransition = true;

		}
		else if (to === "/tournament-game" && !StorageKeys.CAN_PLAY)
		{
			gameMenuView(false, "You dont have oponents to play with");
			canTransition = false;
		}
	}

	else if (from === "/tournament-game")
	{
		if (to === "/tournament")
		{
			handleViewTransitions("tournament", "vue4");
			leave_tournament_game();
		}
	}

	else if (from === "/platformer" ) {
		if (to === "/game-menu") {
			handleViewTransitions("vue2", "platformer");
			StorageKeys.PLAYER2 = "";
			gameState.previous = null;
			gameState.current = GameState.Menu;
		}
	}

	else {
		console.log(`❓ Transition inconnue: ${from} → ${to}`);
	}
};

const router = async (): Promise<void> => {
	const routes: Route[] = [
		{ path: "/", view: home },
		{ path: "/game-menu", view: Game_menu },
		{ path: "/solo-game-1v1", view: solo_game_1v1 },
		{ path: "/multi-player-game", view: multi_player_game },
		{ path: "/tournament", view: tournament },
		{ path: "/tournament-game", view: tournament_game },
		{ path: "/platformer", view: PlatformView },
	];

	const potentialMatches: RouteMatch[] = routes.map((route) => {
		return {
			route: route,
			isMatch: location.pathname === route.path,
		};
	});

	let match: RouteMatch | undefined = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

	if (!match)
	{
		match = {
			route: routes[0],
			isMatch: true,
		};
	}

	const accessToken = sessionStorage.getItem("accessToken");
	if (match.route.path === "/" && accessToken) {
		console.log("Vue home chargée !");
		gameMenuView(false, "You are already logged in");
		return;
	}

	if (canTransition === false)
	{
		if (navigationHistory.length > 1)
		{
			const previousPage = navigationHistory[navigationHistory.length - 2];
			history.pushState(null, "", previousPage);
			currentPage = previousPage;
		}
		return;
	}

	const previousPage = currentPage;
	currentPage = location.pathname;
	
	if (previousPage !== currentPage) {
		logPageTransition(previousPage, currentPage);
	}
	const app: HTMLElement | null = document.querySelector("#app");
	
	if (!app) {
		console.error("App element not found");
		return;
	}
	
	app.style.display = "none";

	setTimeout(async () => {
		const view = new match.route.view();

		app.innerHTML = await view.getHtml();
		app.style.display = "flex";

		if (typeof view.initEvents === "function") view.initEvents();
		if (typeof view.createAccount === "function") view.createAccount();
		if (typeof view.init_solo_game === "function") view.init_solo_game();
		if (typeof view.Back_to_Menu === "function") view.Back_to_Menu();
		if (typeof view.Back_to_Menu_duo === "function") view.Back_to_Menu_duo();
		if (typeof view.game_menu === "function") view.game_menu();
		if (typeof view.init_solo_game_ai === "function") view.init_solo_game_ai();
		if (typeof view.init_powerUP_player === "function") view.init_powerUP_player();
		if (typeof view.update_power_up_players === "function") view.update_power_up_players();
		if (typeof view.init_powerUP_player_multi === "function") view.init_powerUP_player_multi();
		if (typeof view.event_solo_game === "function") view.event_solo_game();
		if (typeof view.leave_game === "function") view.leave_game();
		if (typeof view.leave_game_2 === "function") view.leave_game_2();
		if (typeof view.leave_game_multi === "function") view.leave_game_multi();
		if (typeof view.event_multiPlayer_game === "function") view.event_multiPlayer_game();
		if (typeof view.leave_game_2_multi === "function") view.leave_game_2_multi();
		if (typeof view.init_tournament === "function") view.init_tournament();
		if (typeof view.tournament_view === "function") view.tournament_view();
		if (typeof view.exit_tournament === "function") view.exit_tournament();
		if (typeof view.start_tournament_game === "function") view.start_tournament_game();
		if (typeof view.checkGameOver_tournament === "function") view.checkGameOver_tournament();
		if (typeof view.event_tournament_game === "function") view.event_tournament_game();
		if (typeof view.tournament_event === "function") view.tournament_event();
		if (typeof view.init_platformer_game === "function") view.init_platformer_game();
		if (typeof view.init_game_platformer === "function") view.init_game_platformer();
		if (typeof view.handleDeconnection === "function") view.handleDeconnection();
	}, 1500);
};

export function getCurrentPage(): string {
	return currentPage;
}

export function getNavigationInfo(): { current: string, previous?: string } {
	return {
		current: currentPage,
		previous: document.referrer ? new URL(document.referrer).pathname : undefined
	};
}

export function disableBackNavigation(): void {
history.pushState(null, "", location.href);
window.onpopstate = function() {
	history.pushState(null, "", location.href);
	console.log("🔒 Navigation arrière bloquée");
};
}

window.removeEventListener("popstate", router);

window.addEventListener("popstate", (e) => {
	const targetPath = location.pathname;
	const previousPath = currentPage;

	let blockNavigation = false;
	let blockMessage = "";

	if (targetPath === "/solo-game-1v1" && !StorageKeys.PLAYER2) {
		blockNavigation = true;
		blockMessage = "You don't have opponents to play with";
	}

	if (targetPath === "/multi-player-game" && !StorageKeys.PLAYER2 && !StorageKeys.PLAYER3 && !StorageKeys.PLAYER4) {
		blockNavigation = true;
		blockMessage = "You don't have opponents to play with";
	}

	if (targetPath === "/platformer" && !StorageKeys.PLAYER2) {
		blockNavigation = true;
		blockMessage = "You don't have opponents to play with";
	}

	if (targetPath === "/tournament-game" && !StorageKeys.CAN_PLAY) {
		blockNavigation = true;
		blockMessage = "You don't have opponents to play with";
	}

	if (blockNavigation)
	{
		console.log(`🚫 Navigation par flèche bloquée: ${previousPath} → ${targetPath}`);
		history.back();
		currentPage = previousPath;
		setTimeout(() => {
			gameMenuView(false, blockMessage);
		}, 100);
		return;
	}
	router();
});

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo((target as HTMLAnchorElement).href);
		}
	});
	
	router();
});

export function getValue_leave_game(): boolean {
	return leave_game_var;
}

export function setLeaveGameVar(value: boolean): void {
	leave_game_var = value;
}


document.addEventListener('DOMContentLoaded', function() {
	const persistentPopup = document.getElementById("persistent-popup");
	const necessaryBtn = document.getElementById("necessary-btn");
	const allowAllBtn = document.getElementById("allow-all-btn");

	necessaryBtn?.addEventListener("click", () => {
		persistentPopup?.classList.remove("active");
		const expires = new Date();
		expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
		document.cookie = `cookieConsent=${encodeURIComponent("necessary")}; expires=${expires.toUTCString()}; path='/'`;
	});
	
	allowAllBtn?.addEventListener("click", () => {
		persistentPopup?.classList.remove("active");
		const expires = new Date();
		expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
		document.cookie = `cookieConsent=${encodeURIComponent("all")}; expires=${expires.toUTCString()}; path='/'`;
	});

	const existingConsent = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));
	if (!existingConsent)
		persistentPopup?.classList.add("active");
	
	window.showPersistentPopup = function() { persistentPopup?.classList.add("active"); };
	window.hidePersistentPopup = function() { persistentPopup?.classList.remove("active"); };

	window.getCookieConsent = function() {
		return document.cookie.split('; ').find(row => row.startsWith('cookieConsent=')) || 'none';
	};
});