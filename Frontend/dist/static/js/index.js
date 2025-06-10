import Home from "./views/Home.js";
import Game_menu from "./views/Game_menu.js";
import solo_game_1v1 from "./views/solo_game_1v1.js";
import multi_player_game from "./views/multi_player_game.js";
import tournament from "./views/tournament.js";
import tournament_game from "./views/tournament_game.js";
import PlatformView from "./views/platformer/PlatformView.js";
let leave_game_var = false;
const navigateTo = (url) => {
    history.pushState(null, "", url);
    router();
};
const router = async () => {
    const routes = [
        { path: "/", view: Home },
        { path: "/Game_menu", view: Game_menu },
        { path: "/solo_game_1v1", view: solo_game_1v1 },
        { path: "/multi_player_game", view: multi_player_game },
        { path: "/tournament", view: tournament },
        { path: "/tournament_game", view: tournament_game },
        { path: "/PlatformView", view: PlatformView },
    ];
    const potentialMatches = routes.map((route) => {
        console.log(`Router is running ${route}||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||`);
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
    const app = document.querySelector("#app");
    app.style.opacity = "0";
    setTimeout(async () => {
        const view = new match.route.view();
        app.innerHTML = await view.getHtml();
        app.style.transition = "opacity 0.5s ease-in-out";
        app.style.opacity = "1";
        if (typeof view.initEvents === "function")
            view.initEvents();
        if (typeof view.createAccount === "function")
            view.createAccount();
        if (typeof view.init_solo_game === "function")
            view.init_solo_game();
        if (typeof view.Back_to_Menu === "function")
            view.Back_to_Menu();
        if (typeof view.Back_to_Menu_duo === "function")
            view.Back_to_Menu_duo();
        if (typeof view.game_menu === "function")
            view.game_menu();
        if (typeof view.init_solo_game_ai === "function")
            view.init_solo_game_ai();
        if (typeof view.init_powerUP_player === "function")
            view.init_powerUP_player();
        if (typeof view.update_power_up_players === "function")
            view.update_power_up_players();
        if (typeof view.init_powerUP_player_multi === "function")
            view.init_powerUP_player_multi();
        if (typeof view.event_solo_game === "function")
            view.event_solo_game();
        if (typeof view.leave_game === "function")
            view.leave_game();
        if (typeof view.leave_game_2 === "function")
            view.leave_game_2();
        if (typeof view.leave_game_multi === "function")
            view.leave_game_multi();
        if (typeof view.event_multiPlayer_game === "function")
            view.event_multiPlayer_game();
        if (typeof view.leave_game_2_multi === "function")
            view.leave_game_2_multi();
        if (typeof view.init_tournament === "function")
            view.init_tournament();
        if (typeof view.tournament_view === "function")
            view.tournament_view();
        if (typeof view.exit_tournament === "function")
            view.exit_tournament();
        if (typeof view.start_tournament_game === "function")
            view.start_tournament_game();
        if (typeof view.checkGameOver_tournament === "function")
            view.checkGameOver_tournament();
        if (typeof view.event_tournament_game === "function")
            view.event_tournament_game();
        if (typeof view.tournament_event === "function")
            view.tournament_event();
        if (typeof view.init_platformer_game === "function")
            view.init_platformer_game();
        if (typeof view.init_game_platformer === "function")
            view.init_game_platformer();
        if (typeof view.handleDeconnection === "function")
            view.handleDeconnection();
    }, 1500);
};
window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        const target = e.target;
        if (target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(target.href);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wdWJsaWMvc3RhdGljL2pzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLGlCQUFpQixDQUFDO0FBQ25DLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFDO0FBQzdDLE9BQU8sYUFBYSxNQUFNLDBCQUEwQixDQUFDO0FBQ3JELE9BQU8saUJBQWlCLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxVQUFVLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxlQUFlLE1BQU0sNEJBQTRCLENBQUM7QUFDekQsT0FBTyxZQUFZLE1BQU8sb0NBQW9DLENBQUM7QUFhL0QsSUFBSSxjQUFjLEdBQVksS0FBSyxDQUFDO0FBRXBDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBVyxFQUFRLEVBQUU7SUFDeEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sRUFBRSxDQUFDO0FBQ1YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsS0FBSyxJQUFtQixFQUFFO0lBQ3hDLE1BQU0sTUFBTSxHQUFZO1FBQ3ZCLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQ3pCLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO1FBQ3ZDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7UUFDL0MsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1FBQ3ZELEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO1FBQ3pDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUU7UUFDbkQsRUFB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VTtZQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ2pGLElBQUksT0FBTyxJQUFJLENBQUMsa0JBQWtCLEtBQUssVUFBVTtZQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ2pGLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFNUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNsRCxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQWEsRUFBRSxFQUFFO1FBQ3pELE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFxQixDQUFDO1FBQ3ZDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO1lBQ25DLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNuQixVQUFVLENBQUUsTUFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLEVBQUUsQ0FBQztBQUNWLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVLG1CQUFtQjtJQUNsQyxPQUFPLGNBQWMsQ0FBQztBQUN2QixDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxLQUFjO0lBQzdDLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIb21lIGZyb20gXCIuL3ZpZXdzL0hvbWUuanNcIjtcbmltcG9ydCBHYW1lX21lbnUgZnJvbSBcIi4vdmlld3MvR2FtZV9tZW51LmpzXCI7XG5pbXBvcnQgc29sb19nYW1lXzF2MSBmcm9tIFwiLi92aWV3cy9zb2xvX2dhbWVfMXYxLmpzXCI7XG5pbXBvcnQgbXVsdGlfcGxheWVyX2dhbWUgZnJvbSBcIi4vdmlld3MvbXVsdGlfcGxheWVyX2dhbWUuanNcIjtcbmltcG9ydCB0b3VybmFtZW50IGZyb20gXCIuL3ZpZXdzL3RvdXJuYW1lbnQuanNcIjtcbmltcG9ydCB0b3VybmFtZW50X2dhbWUgZnJvbSBcIi4vdmlld3MvdG91cm5hbWVudF9nYW1lLmpzXCI7XG5pbXBvcnQgUGxhdGZvcm1WaWV3ICBmcm9tIFwiLi92aWV3cy9wbGF0Zm9ybWVyL1BsYXRmb3JtVmlldy5qc1wiO1xuXG4vLyBEw6lmaW5pdGlvbiBkJ2ludGVyZmFjZXNcbmludGVyZmFjZSBSb3V0ZSB7XG5cdHBhdGg6IHN0cmluZztcblx0dmlldzogYW55OyAvLyBJZMOpYWxlbWVudCBvbiBkZXZyYWl0IGTDqWZpbmlyIHVuIHR5cGUgcGx1cyBwcsOpY2lzIGljaVxufVxuXG5pbnRlcmZhY2UgUm91dGVNYXRjaCB7XG5cdHJvdXRlOiBSb3V0ZTtcblx0aXNNYXRjaDogYm9vbGVhbjtcbn1cblxubGV0IGxlYXZlX2dhbWVfdmFyOiBib29sZWFuID0gZmFsc2U7XG5cbmNvbnN0IG5hdmlnYXRlVG8gPSAodXJsOiBzdHJpbmcpOiB2b2lkID0+IHtcblx0aGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgXCJcIiwgdXJsKTtcblx0cm91dGVyKCk7XG59O1xuXG5jb25zdCByb3V0ZXIgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG5cdGNvbnN0IHJvdXRlczogUm91dGVbXSA9IFtcblx0XHR7IHBhdGg6IFwiL1wiLCB2aWV3OiBIb21lIH0sXG5cdFx0eyBwYXRoOiBcIi9HYW1lX21lbnVcIiwgdmlldzogR2FtZV9tZW51IH0sXG5cdFx0eyBwYXRoOiBcIi9zb2xvX2dhbWVfMXYxXCIsIHZpZXc6IHNvbG9fZ2FtZV8xdjEgfSxcblx0XHR7IHBhdGg6IFwiL211bHRpX3BsYXllcl9nYW1lXCIsIHZpZXc6IG11bHRpX3BsYXllcl9nYW1lIH0sXG5cdFx0eyBwYXRoOiBcIi90b3VybmFtZW50XCIsIHZpZXc6IHRvdXJuYW1lbnQgfSxcblx0XHR7IHBhdGg6IFwiL3RvdXJuYW1lbnRfZ2FtZVwiLCB2aWV3OiB0b3VybmFtZW50X2dhbWUgfSxcblx0XHR7IHBhdGg6IFwiL1BsYXRmb3JtVmlld1wiLCB2aWV3OiBQbGF0Zm9ybVZpZXcgfSxcblx0XTtcblxuXHRjb25zdCBwb3RlbnRpYWxNYXRjaGVzOiBSb3V0ZU1hdGNoW10gPSByb3V0ZXMubWFwKChyb3V0ZSkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKGBSb3V0ZXIgaXMgcnVubmluZyAke3JvdXRlfXx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHxgKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyb3V0ZTogcm91dGUsXG5cdFx0XHRpc01hdGNoOiBsb2NhdGlvbi5wYXRobmFtZSA9PT0gcm91dGUucGF0aCxcblx0XHR9O1xuXHR9KTtcblxuXHRsZXQgbWF0Y2g6IFJvdXRlTWF0Y2ggfCB1bmRlZmluZWQgPSBwb3RlbnRpYWxNYXRjaGVzLmZpbmQoKHBvdGVudGlhbE1hdGNoKSA9PiBwb3RlbnRpYWxNYXRjaC5pc01hdGNoKTtcblxuXHRpZiAoIW1hdGNoKSB7XG5cdFx0bWF0Y2ggPSB7XG5cdFx0XHRyb3V0ZTogcm91dGVzWzBdLFxuXHRcdFx0aXNNYXRjaDogdHJ1ZSxcblx0XHR9O1xuXHR9XG5cblx0Y29uc3QgdmlldyA9IG5ldyBtYXRjaC5yb3V0ZS52aWV3KCk7XG5cdGNvbnN0IGFwcDogSFRNTEVsZW1lbnQgfCBudWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcHBcIik7XG5cdFxuICAgIGFwcC5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG5cbiAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgdmlldyA9IG5ldyBtYXRjaC5yb3V0ZS52aWV3KCk7XG4gICAgICAgIGFwcC5pbm5lckhUTUwgPSBhd2FpdCB2aWV3LmdldEh0bWwoKTtcbiAgICAgICAgYXBwLnN0eWxlLnRyYW5zaXRpb24gPSBcIm9wYWNpdHkgMC41cyBlYXNlLWluLW91dFwiO1xuICAgICAgICBhcHAuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5pbml0RXZlbnRzID09PSBcImZ1bmN0aW9uXCIpIHZpZXcuaW5pdEV2ZW50cygpO1xuICAgICAgICBpZiAodHlwZW9mIHZpZXcuY3JlYXRlQWNjb3VudCA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LmNyZWF0ZUFjY291bnQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LmluaXRfc29sb19nYW1lID09PSBcImZ1bmN0aW9uXCIpIHZpZXcuaW5pdF9zb2xvX2dhbWUoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LkJhY2tfdG9fTWVudSA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LkJhY2tfdG9fTWVudSgpO1xuICAgICAgICBpZiAodHlwZW9mIHZpZXcuQmFja190b19NZW51X2R1byA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LkJhY2tfdG9fTWVudV9kdW8oKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LmdhbWVfbWVudSA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LmdhbWVfbWVudSgpO1xuICAgICAgICBpZiAodHlwZW9mIHZpZXcuaW5pdF9zb2xvX2dhbWVfYWkgPT09IFwiZnVuY3Rpb25cIikgdmlldy5pbml0X3NvbG9fZ2FtZV9haSgpO1xuICAgICAgICBpZiAodHlwZW9mIHZpZXcuaW5pdF9wb3dlclVQX3BsYXllciA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LmluaXRfcG93ZXJVUF9wbGF5ZXIoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LnVwZGF0ZV9wb3dlcl91cF9wbGF5ZXJzID09PSBcImZ1bmN0aW9uXCIpIHZpZXcudXBkYXRlX3Bvd2VyX3VwX3BsYXllcnMoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LmluaXRfcG93ZXJVUF9wbGF5ZXJfbXVsdGkgPT09IFwiZnVuY3Rpb25cIikgdmlldy5pbml0X3Bvd2VyVVBfcGxheWVyX211bHRpKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5ldmVudF9zb2xvX2dhbWUgPT09IFwiZnVuY3Rpb25cIikgdmlldy5ldmVudF9zb2xvX2dhbWUoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LmxlYXZlX2dhbWUgPT09IFwiZnVuY3Rpb25cIikgdmlldy5sZWF2ZV9nYW1lKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5sZWF2ZV9nYW1lXzIgPT09IFwiZnVuY3Rpb25cIikgdmlldy5sZWF2ZV9nYW1lXzIoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LmxlYXZlX2dhbWVfbXVsdGkgPT09IFwiZnVuY3Rpb25cIikgdmlldy5sZWF2ZV9nYW1lX211bHRpKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5ldmVudF9tdWx0aVBsYXllcl9nYW1lID09PSBcImZ1bmN0aW9uXCIpIHZpZXcuZXZlbnRfbXVsdGlQbGF5ZXJfZ2FtZSgpO1xuICAgICAgICBpZiAodHlwZW9mIHZpZXcubGVhdmVfZ2FtZV8yX211bHRpID09PSBcImZ1bmN0aW9uXCIpIHZpZXcubGVhdmVfZ2FtZV8yX211bHRpKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5pbml0X3RvdXJuYW1lbnQgPT09IFwiZnVuY3Rpb25cIikgdmlldy5pbml0X3RvdXJuYW1lbnQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LnRvdXJuYW1lbnRfdmlldyA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LnRvdXJuYW1lbnRfdmlldygpO1xuICAgICAgICBpZiAodHlwZW9mIHZpZXcuZXhpdF90b3VybmFtZW50ID09PSBcImZ1bmN0aW9uXCIpIHZpZXcuZXhpdF90b3VybmFtZW50KCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5zdGFydF90b3VybmFtZW50X2dhbWUgPT09IFwiZnVuY3Rpb25cIikgdmlldy5zdGFydF90b3VybmFtZW50X2dhbWUoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3LmNoZWNrR2FtZU92ZXJfdG91cm5hbWVudCA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LmNoZWNrR2FtZU92ZXJfdG91cm5hbWVudCgpO1xuICAgICAgICBpZiAodHlwZW9mIHZpZXcuZXZlbnRfdG91cm5hbWVudF9nYW1lID09PSBcImZ1bmN0aW9uXCIpIHZpZXcuZXZlbnRfdG91cm5hbWVudF9nYW1lKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy50b3VybmFtZW50X2V2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHZpZXcudG91cm5hbWVudF9ldmVudCgpO1xuXHRcdGlmICh0eXBlb2Ygdmlldy5pbml0X3BsYXRmb3JtZXJfZ2FtZSA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LmluaXRfcGxhdGZvcm1lcl9nYW1lKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5pbml0X2dhbWVfcGxhdGZvcm1lciA9PT0gXCJmdW5jdGlvblwiKSB2aWV3LmluaXRfZ2FtZV9wbGF0Zm9ybWVyKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlldy5oYW5kbGVEZWNvbm5lY3Rpb24gPT09IFwiZnVuY3Rpb25cIikgdmlldy5oYW5kbGVEZWNvbm5lY3Rpb24oKTtcbiAgICB9LCAxNTAwKTtcbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgcm91dGVyKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuXHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZTogTW91c2VFdmVudCkgPT4ge1xuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXHRcdGlmICh0YXJnZXQubWF0Y2hlcyhcIltkYXRhLWxpbmtdXCIpKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRuYXZpZ2F0ZVRvKCh0YXJnZXQgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWYpO1xuXHRcdH1cblx0fSk7XG5cdFxuXHRyb3V0ZXIoKTtcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVfbGVhdmVfZ2FtZSgpOiBib29sZWFuIHtcblx0cmV0dXJuIGxlYXZlX2dhbWVfdmFyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TGVhdmVHYW1lVmFyKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG5cdGxlYXZlX2dhbWVfdmFyID0gdmFsdWU7XG59Il19