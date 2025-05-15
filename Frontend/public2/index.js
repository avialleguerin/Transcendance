"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue_leave_game = getValue_leave_game;
exports.setLeaveGameVar = setLeaveGameVar;
var Home_js_1 = require("Home.js");
var settings_js_1 = require("settings.js");
var Game_menu_js_1 = require("Game_menu.js");
var solo_game_1v1_js_1 = require("solo_game_1v1.js");
var duo_game_js_1 = require("duo_game.js");
var multi_player_game_js_1 = require("multi_player_game.js");
var tournament_js_1 = require("tournament.js");
var tournament_game_js_1 = require("tournament_game.js");
var PlatformView_js_1 = require("../src/game/platformer/PlatformView.js");
var leave_game_var = false;
var navigateTo = function (url) {
    history.pushState(null, "", url);
    router();
};
var router = function () { return __awaiter(void 0, void 0, void 0, function () {
    var routes, potentialMatches, match, view, app;
    return __generator(this, function (_a) {
        routes = [
            { path: "/", view: Home_js_1.default },
            // { path: "/", view: platformer },
            { path: "/settings", view: settings_js_1.default },
            { path: "/Game_menu", view: Game_menu_js_1.default },
            { path: "/solo_game_1v1", view: solo_game_1v1_js_1.default },
            { path: "/duo_game", view: duo_game_js_1.default },
            { path: "/multi_player_game", view: multi_player_game_js_1.default },
            { path: "/tournament", view: tournament_js_1.default },
            { path: "/tournament_game", view: tournament_game_js_1.default },
            { path: "/PlatformView", view: PlatformView_js_1.default },
            // { path: "/PlatformView", view: platformer },
        ];
        potentialMatches = routes.map(function (route) {
            return {
                route: route,
                isMatch: location.pathname === route.path,
            };
        });
        match = potentialMatches.find(function (potentialMatch) { return potentialMatch.isMatch; });
        if (!match) {
            match = {
                route: routes[0],
                isMatch: true,
            };
        }
        view = new match.route.view();
        app = document.querySelector("#app");
        app.style.opacity = "0";
        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        view = new match.route.view();
                        _a = app;
                        return [4 /*yield*/, view.getHtml()];
                    case 1:
                        _a.innerHTML = _b.sent();
                        app.style.transition = "opacity 0.5s ease-in-out";
                        app.style.opacity = "1";
                        // Exécute les fonctions si elles existent
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
                        return [2 /*return*/];
                }
            });
        }); }, 1500); // Attente de 1,5 seconde avant le changement de page
        return [2 /*return*/];
    });
}); };
window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        var target = e.target;
        if (target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(target.href);
        }
    });
    router();
});
function getValue_leave_game() {
    return leave_game_var;
}
function setLeaveGameVar(value) {
    leave_game_var = value;
}
