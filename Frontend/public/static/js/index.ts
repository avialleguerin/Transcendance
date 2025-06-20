
import home from "./views/home.js";
import Game_menu from "./views/game-menu.js";
import solo_game_1v1 from "./views/solo-game-1v1.js";
import multi_player_game from "./views/multi-player-game.js";
import tournament from "./views/tournament.js";
import tournament_game from "./views/tournament-game.js";
import PlatformView  from "./views/platformer/PlatformView.js";
import { Route, RouteMatch } from "../../api/types.js";
import { gameMenuView } from "../../api/utils.js";
import { handleViewTransitions } from "../../srcs/game/gameplay/views/camera.js";
import { leave_Game, leave_Multiplayer_Game, leave_tournament_game } from "../../srcs/game/gameplay/babylon.js";
import { c } from "./views/platformer/constants.js";

let canTransition: boolean = true; // Variable pour contrôler les transitions de page
let leave_game_var: boolean = false;
let currentPage: string = location.pathname; // Variable pour tracker la page actuelle

const navigateTo = (url: string): void => {
	const previousPage = currentPage; // Sauvegarde de la page précédente
	const nextPage = url; // Page de destination
	console.log("je suis laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
	// Log de la transition
	console.log(`🔄 Navigation: ${previousPage} → ${nextPage}`);
	console.log(`🔄 URL: ${url}`)
	console.log(`🔄 Current Page: ${currentPage}`)
	console.log(`🔄 Previous Page: ${previousPage}`);
	console.log(`🔄 Next Page: ${nextPage}`);
	logPageTransition(previousPage, nextPage);
	
	history.pushState(null, "", url);
	router();
};

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
		else if (to === "/solo-game-1v1")
		{
			console.log("🎮 Transition: Menu de jeu → Jeu solo 1v1");
			gameMenuView(false, "You dont have oponents to play with");
		}
		else if (to === "/multi-player-game")
		{
			console.log("👥 Transition: Menu de jeu → Jeu multijoueur");
			gameMenuView(false, "You dont have oponents to play with");
		}
		else if (to === "/tournament")
		{
			console.log("🏆 Transition: Menu de jeu → Tournoi");
			console.log("handleViewTransitions('tournament', 'vue2')");
			handleViewTransitions("tournament", "vue2");
		}
		else if (to === "/platformer")
		{
			console.log("🏃 Transition: Menu de jeu → Platformer");
			handleViewTransitions("platformer", "vue2");
		}
	}

	else if (from === "/solo-game-1v1")
	{
		if (to === "/game-menu") {
			console.log("📱 Transition: Jeu solo 1v1 → Menu de jeu");
			handleViewTransitions("vue2", "vue4");
			leave_Game();
		}
	}
	
	else if (from === "/multi-player-game") {
		if (to === "/game-menu") {
			console.log("📱 Transition: Jeu multijoueur → Menu de jeu");
			handleViewTransitions("vue2", "vue4");
			leave_Multiplayer_Game();
		}
	}

	else if (from === "/tournament") {
		if (to === "/game-menu") {
			console.log("📱 Transition: Tournoi → Menu de jeu");
			console.log("handleViewTransitions(vue2, tournament");
			handleViewTransitions("vue2", "tournament");
		} else if (to === "/tournament-game") {
			console.log("🎯 Transition: Tournoi → Jeu de tournoi");
		}
	}

	else if (from === "/tournament-game") {
		if (to === "/tournament") {
			console.log("🏆 Transition: Jeu de tournoi → Tournoi");

		}
	}

	else if (from === "/platformer") {
		if (to === "/game-menu") {
			console.log("📱 Transition: Platformer → Menu de jeu");
			handleViewTransitions("vue2", "platformer");
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

	if (canTransition === false && currentPage === "/game-menu" && to ) {
		gameMenuView(false, "You dont have oponents to play with");
		return;
	}

	const potentialMatches: RouteMatch[] = routes.map((route) => {
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

	// Mise à jour de la page actuelle
	const previousPage = currentPage;
	currentPage = location.pathname;
	
	// Si on vient d'une navigation directe (back/forward), on log aussi
	if (previousPage !== currentPage) {
		logPageTransition(previousPage, currentPage);
	}
	
	console.log(`📍 Page actuelle: ${currentPage}`);
	console.log(`📍 Page précédente: ${previousPage}`);

	const view = new match.route.view();
	const app: HTMLElement | null = document.querySelector("#app");
	
	app.style.opacity = "0";

	setTimeout(async () => {
		const view = new match.route.view();
		const accessToken = sessionStorage.getItem("accessToken");
		if (match.route.path === "/" && accessToken) {
			console.log("Vue home chargée !");
			gameMenuView(false, "You are already logged in");
		}
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
		
		console.log(`✅ Page chargée: ${currentPage}`);
	}, 1500);
};

// Fonction pour obtenir la page actuelle
export function getCurrentPage(): string {
	return currentPage;
}

// Fonction pour obtenir des informations de navigation
export function getNavigationInfo(): { current: string, previous?: string } {
	return {
		current: currentPage,
		previous: document.referrer ? new URL(document.referrer).pathname : undefined
	};
}

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

	necessaryBtn.addEventListener("click", () => {
		persistentPopup?.classList.remove("active");
		localStorage.setItem('cookieConsent', 'necessary');
	});
	
	allowAllBtn?.addEventListener("click", () => {
		persistentPopup?.classList.remove("active");
		localStorage.setItem('cookieConsent', 'all');
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