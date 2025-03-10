import Home from "./views/Home.js";
import jouer from "./views/jouer.js";
import settings from "./views/settings.js";
import Game_menu from "./views/Game_menu.js";
import solo_game_1v1 from "./views/solo_game_1v1.js";
import duo_game from "./views/duo_game.js";
import multi_player_game from "./views/multi_player_game.js";

let leave_game_var = false;

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: Home },
		// { path: "/", view: solo_game_1v1 },
		{ path: "/jouer", view: jouer },
		{ path: "/settings", view: settings },
		{ path: "/Game_menu", view: Game_menu },
		{ path: "/solo_game_1v1", view: solo_game_1v1 },
		{ path: "/duo_game", view: duo_game },
		{ path: "/multi_player_game", view: multi_player_game },
	];

	const potentialMatches = routes.map((route) => {
		return {
			route: route,
			isMatch: location.pathname === route.path,
		};
	});

	let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

	if (!match) {
		match = {
			route: routes[0],
			isMatch: true,
		};
	}

	const view = new match.route.view();

	document.querySelector("#app").innerHTML = await view.getHtml();

	const myScript = document.querySelector("#menu_btn");

	console.log(myScript);




	if (typeof view.initEvents === 'function') {
        view.initEvents();
    }

	if (typeof view.init_solo_game === 'function') {
		view.init_solo_game();
	}

	if (typeof view.Back_to_Menu === 'function') {
		view.Back_to_Menu();
	}

	if (typeof view.Back_to_Menu_duo === 'function') {
		view.Back_to_Menu_duo();
	}

	if (typeof view.game_menu === 'function') {
		view.game_menu();
	}

	if (typeof view.init_solo_game_ai === 'function') {
		view.init_solo_game_ai();
	}

	if (typeof view.init_powerUP_player === 'function') {
		view.init_powerUP_player();
	}

	if (typeof view.update_power_up_players === 'function') {
		view.update_power_up_players();
	}

	if (typeof view.init_powerUP_player_multi === 'function') {
		view.init_powerUP_player_multi();
	}

	if (typeof view.event_solo_game === 'function') {
		view.event_solo_game();
	}

	if (typeof view.leave_game === 'function') {
		view.leave_game();
	}

	if (typeof view.leave_game_multi === 'function') {
		view.leave_game_multi();
	}

	if (typeof view.event_multiPlayer_game === 'function') {
		view.event_multiPlayer_game();
	}

};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});


export function getValue_leave_game() {
	return leave_game_var;
}

export function setLeaveGameVar(value) {
    leave_game_var = value;
}