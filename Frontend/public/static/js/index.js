import Home from "./views/Home.js";
import jouer from "./views/jouer.js";
import settings from "./views/settings.js";
import Game_menu from "./views/Game_menu.js";
import solo_game_1v1 from "./views/solo_game_1v1.js";
import duo_game from "./views/duo_game.js";
import multi_player_game from "./views/multi_player_game.js";
import tournament from "./views/tournament.js";
import tournament_game from "./views/tournament_game.js";

let leave_game_var = false;

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Home },
        // { path: "/", view: Game_menu },
        { path: "/settings", view: settings },
        { path: "/Game_menu", view: Game_menu },
        { path: "/solo_game_1v1", view: solo_game_1v1 },
        { path: "/duo_game", view: duo_game },
        { path: "/multi_player_game", view: multi_player_game },
        { path: "/tournament", view: tournament },
        { path: "/tournament_game", view: tournament_game },
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

    const app = document.querySelector("#app");

    app.style.opacity = "0";

    setTimeout(async () => {
        const view = new match.route.view();
        app.innerHTML = await view.getHtml();
        app.style.transition = "opacity 0.5s ease-in-out";
        app.style.opacity = "1";
        
        // Exécute les fonctions si elles existent
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
    }, 1500); // Attente de 1,5 seconde avant le changement de page
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