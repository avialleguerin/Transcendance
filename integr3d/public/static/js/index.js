import Home from "./views/Home.js";
import jouer from "./views/jouer.js";
import settings from "./views/settings.js";
import Game_menu from "./views/Game_menu.js";


const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: Home },
		{ path: "/jouer", view: jouer },
		{ path: "/settings", view: settings },
		{ path: "/Game_menu", view: Game_menu },
		// { path: "/solo_game_1v1", view: SoloGame1v1 },  // Ajoutez cette route
		// { path: "/solo_game_ai", view: SoloGameAI },    // Ajoutez cette route
		// { path: "/multiplayer_2v2", view: Multiplayer2v2 }  // Ajoutez cette route
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

	if (typeof view.initEvents === 'function') {
        view.initEvents();
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

// document.addEventListener("DOMContentLoaded", () => {
//     document.body.addEventListener("click", (e) => {
//         if (e.target.matches("[data-link]")) {
//             e.preventDefault();
//             navigateTo(e.target.getAttribute("data-link"));  // Utilisez getAttribute au lieu de href
//         }
//     });

//     router();
// });


