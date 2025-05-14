import Home from "./views/Home";
import jouer from "./views/jouer";
import settings from "./views/settings";
import Game_menu from "./views/Game_menu";
import solo_game_1v1 from "./views/solo_game_1v1";
import duo_game from "./views/duo_game";
import multi_player_game from "./views/multi_player_game";
//news
import tournament from "./views/tournament";
import tournament_game from "./views/tournament_game";
import  PlatformView  from "./views/platformer/PlatformView"

// Définition d'interfaces
interface Route {
  path: string;
  view: any; // Idéalement on devrait définir un type plus précis ici
}

interface RouteMatch {
  route: Route;
  isMatch: boolean;
}

let leave_game_var: boolean = false;

const navigateTo = (url: string): void => {
  history.pushState(null, "", url);
  router();
};

const router = async (): Promise<void> => {
  const routes: Route[] = [
    { path: "/", view: Home },
    { path: "/jouer", view: jouer },
    { path: "/settings", view: settings },
    { path: "/Game_menu", view: Game_menu },
    { path: "/solo_game_1v1", view: solo_game_1v1 },
    { path: "/duo_game", view: duo_game },
    { path: "/multi_player_game", view: multi_player_game },
  ];

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

  const view = new match.route.view();
  const appElement: HTMLElement | null = document.querySelector("#app");
  
  if (appElement) {
    appElement.innerHTML = await view.getHtml();
  }
  
  const myScript = document.querySelector("#menu_btn");
  console.log(myScript);

  // On peut utiliser une interface pour typer view
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