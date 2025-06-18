import home from "./views/home.js";
import Game_menu from "./views/game-menu.js";
import solo_game_1v1 from "./views/solo-game-1v1.js";
import multi_player_game from "./views/multi-player-game.js";
import tournament from "./views/tournament.js";
import tournament_game from "./views/tournament-game.js";
import PlatformView  from "./views/platformer/PlatformView.js";
import { Route, RouteMatch } from "../../api/types.js";



let leave_game_var: boolean = false;

const navigateTo = (url: string): void => {
	history.pushState(null, "", url);
	router();
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
		console.log(`Router is running ${route.path}`);

		return {
			route: route,
			isMatch: location.pathname === route.path,
		};
	});

	let match: RouteMatch | undefined = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

	if (!match) {
		match = {
			route: routes[0],
			isMatch: true,
		};
	}

	const view = new match.route.view();
	const app: HTMLElement | null = document.querySelector("#app");
	
	app.style.opacity = "0";

	setTimeout(async () => {
		const view = new match.route.view();
		app.innerHTML = await view.getHtml();
		app.style.transition = "opacity 0.5s ease-in-out";
		app.style.opacity = "1";

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

window.addEventListener("popstate", router);

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

//*POPUP COOKIE
document.addEventListener('DOMContentLoaded', function() {
	const persistentPopup = document.getElementById("persistent-popup");
	const necessaryBtn = document.getElementById("necessary-btn");
	const allowAllBtn = document.getElementById("allow-all-btn");

	necessaryBtn?.addEventListener("click", () => {
		persistentPopup?.classList.remove("active");
		localStorage.setItem('cookieConsent', 'necessary');
		console.log('Cookies: Only necessary cookies accepted');
	});
	
	allowAllBtn?.addEventListener("click", () => {
		persistentPopup?.classList.remove("active");
		localStorage.setItem('cookieConsent', 'all');
		console.log('Cookies: All cookies accepted');
	});
	
	const existingConsent = localStorage.getItem('cookieConsent');
	if (!	existingConsent)
		persistentPopup?.classList.add("active");
	
	window.showPersistentPopup = function() { persistentPopup?.classList.add("active"); };
	window.hidePersistentPopup = function() { persistentPopup?.classList.remove("active"); };

	window.getCookieConsent = function() {
		return localStorage.getItem('cookieConsent') || 'none';
	};
});