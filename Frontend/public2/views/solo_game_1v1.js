"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var AbstractView_js_1 = require("./AbstractView.js");
var Game_menu_js_1 = require("./Game_menu.js");
var babylon_js_1 = require("../../../srcs/game/gameplay/babylon.js");
var camera_js_1 = require("../../../srcs/game/gameplay/views/camera.js");
var index_js_1 = require("../index.js");
var score_js_1 = require("../../../srcs/game/gameplay/score.js");
var init_skin_player_podium_js_1 = require("../../../srcs/game/gameplay/solo/skin/init_skin_player_podium.js");
var score_js_2 = require("../../../srcs/game/gameplay/score.js");
var spacePressed = false;
var solo_game = /** @class */ (function (_super) {
    __extends(solo_game, _super);
    function solo_game() {
        var _this = _super.call(this) || this;
        _this.setTitle("solo_game");
        _this.cooldowns = {};
        _this.cooldownTimes = {
            "z": 15000,
            "x": 20000,
            "c": 15000,
            "1": 15000,
            "2": 20000,
            "3": 15000,
            "t": 1000,
            " ": 1000,
        };
        _this.boundKeyPressHandler = _this.handleKeyPress.bind(_this);
        console.log("solo_game_1v1.js");
        document.addEventListener("keydown", _this.boundKeyPressHandler);
        if (window.location.pathname === "/solo_game_1v1") {
            _this.gameLoop = setInterval(function () { _this.checkGameOver(); 1000; });
        }
        return _this;
    }
    solo_game.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /*html*/ "\n\t\t\t<link rel=\"stylesheet\" href=\"./static/js/css/solo_game_1v1.css\">\n\t\t\t<link href=\"https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap\" rel=\"stylesheet\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"press_space\" >\n\t\t\t\t\t<h1 id=\"press_space_id\">Press SPACE to Start</h1>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"container-leave\">\n\t\t\t\t\t<button class=\"option\" id=\"option_btn\">\n\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/menu.svg\" alt=\"leave\">\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"panel\" id=\"panel_id\">\n\t\t\t\t\t<button class=\"option-in-panel\" id=\"option_btn-remove\">\n\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/menu.svg\" alt=\"leave\">\n\t\t\t\t\t</button>\n\t\t\t\t\t<button class=\"leave_game\" id=\"leave_game_id\">Leave Game</button>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"container-Player1\" id=\"container-player1_id\">\n\t\t\t\t\t<h1>Player 1</h1>\n\t\t\t\t\t<div class=\"container-item_player1\">\n\t\t\t\t\t\t<p id=\"nb-item-grenade-1\"></p>\n\t\t\t\t\t\t<p class=\"touch_player1\">Z</p>\n\t\t\t\t\t\t<div class=\"item-circle\" id=\"item-circle-grenade1\">\n\t\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/grenadeflashTest.jpg\" alt=\"Item 1\">\n\t\t\t\t\t\t\t<div class=\"overlay\" id=\"overlay-grenade-1\"></div>\n\t\t\t\t\t\t\t<div class=\"overlay-reloading\" id=\"overlay-reloading-grenade-1\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p id=\"nb-item-teammate-1\"></p>\n\t\t\t\t\t\t<p class=\"touch_player1\">X</p>\n\t\t\t\t\t\t<div class=\"item-circle\" id=\"item-circle-teammate1\">\n\t\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/teammatev3.png\" alt=\"Item 2\">\n\t\t\t\t\t\t\t<div class=\"overlay\" id=\"overlay-teammate-1\"></div>\n\t\t\t\t\t\t\t<div class=\"overlay-reloading-teammate\" id=\"overlay-reloading-teammate-1\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p id=\"nb-item-autre-1\"></p>\n\t\t\t\t\t\t<p class=\"touch_player1\">C</p>\n\t\t\t\t\t\t<div class=\"item-circle\" id=\"item-circle-inverse1\">\n\t\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/inverse_powerUP.png\" alt=\"Item 3\">\n\t\t\t\t\t\t\t<div class=\"overlay\" id=\"overlay-inverse-1\"></div>\n\t\t\t\t\t\t\t<div class=\"overlay-reloading\" id=\"overlay-reloading-inverse-1\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"container-Player2\" id=\"container-player2_id\">\n\t\t\t\t\t<h1>Player 2</h1>\n\t\t\t\t\t<div class=\"container-item_player2\">\n\t\t\t\t\t\t<p id=\"nb-item-grenade-2\"></p>\n\t\t\t\t\t\t<p class=\"touch_player2\">1</p>\n\t\t\t\t\t\t<div class=\"item-circle\" id=\"item-circle-grenade2\">\n\t\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/grenadeflashTest.jpg\" alt=\"Item 1\">\n\t\t\t\t\t\t\t<div class=\"overlay\" id=\"overlay-grenade-2\"></div>\n\t\t\t\t\t\t\t<div class=\"overlay-reloading\" id=\"overlay-reloading-grenade-2\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p id=\"nb-item-teammate-2\"></p>\n\t\t\t\t\t\t<p class=\"touch_player2\">2</p>\n\t\t\t\t\t\t<div class=\"item-circle\" id=\"item-circle-teammate2\">\n\t\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/teammatev3.png\" alt=\"Item 2\">\n\t\t\t\t\t\t\t<div class=\"overlay\" id=\"overlay-teammate-2\"></div>\n\t\t\t\t\t\t\t<div class=\"overlay-reloading-teammate\" id=\"overlay-reloading-teammate-2\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p id=\"nb-item-autre-2\"></p>\n\t\t\t\t\t\t<p class=\"touch_player2\">3</p>\n\t\t\t\t\t\t<div class=\"item-circle\" id=\"item-circle-inverse2\">\n\t\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/inverse_powerUP.png\" alt=\"Item 3\">\n\t\t\t\t\t\t\t<div class=\"overlay\" id=\"overlay-inverse-2\"></div>\n\t\t\t\t\t\t\t<div class=\"overlay-reloading\" id=\"overlay-reloading-inverse-2\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"container-EndGame\">\n\t\t\t\t\t<div class=\"winner\">\n\t\t\t\t\t\t<h1 id=\"winner_id\"></h1>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"looser\">\n\t\t\t\t\t\t<h1 id=\"looser_id\"></h1>\n\t\t\t\t\t</div>\n\t\t\t\t\t<button class=\"leave_game_2\" id=\"leave_game_2_id\">Quitter la partie</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"];
            });
        });
    };
    solo_game.prototype.cleanup = function () {
        document.removeEventListener("keydown", this.boundKeyPressHandler);
        clearInterval(this.gameLoop);
    };
    solo_game.prototype.leave_game = function () {
        var _this = this;
        document.getElementById("leave_game_id").addEventListener("click", function () {
            _this.cleanup();
            (0, index_js_1.setLeaveGameVar)(true);
            spacePressed = false;
            (0, camera_js_1.handleViewTransitions)("vue2", "vue4");
            setTimeout(function () {
                window.history.back();
                (0, babylon_js_1.leave_Game)();
            }, 1500);
        });
    };
    solo_game.prototype.leave_game_2 = function () {
        var _this = this;
        document.getElementById("leave_game_2_id").addEventListener("click", function () {
            _this.cleanup();
            (0, index_js_1.setLeaveGameVar)(true);
            (0, init_skin_player_podium_js_1.disable_skin_perso_player_first_and_seconde)();
            spacePressed = false;
            (0, camera_js_1.handleViewTransitions)("vue2", "vue4");
            setTimeout(function () {
                window.history.back();
                (0, babylon_js_1.leave_Game)();
            }, 1500);
        });
    };
    solo_game.prototype.init_powerUP_player = function () {
        console.log("powerUP value == ", (0, Game_menu_js_1.getPowerUP_value)());
        var container_player1 = document.getElementById("container-player1_id");
        var container_player2 = document.getElementById("container-player2_id");
        if ((0, Game_menu_js_1.getPowerUP_value)() !== 0) {
            console.log("powerUP valueje reeeeedjkhkjefwhjkewhfkjwe == ", (0, Game_menu_js_1.getPowerUP_value)());
            container_player1.classList.add("active");
            container_player2.classList.add("active");
        }
        else {
            console.log(" else    powerUP valueje reeeeedjkhkjefwhjkewhfkjwe == ", (0, Game_menu_js_1.getPowerUP_value)());
            if (container_player1.classList.contains("active"))
                container_player1.classList.remove("active");
            if (container_player2.classList.contains("active"))
                container_player2.classList.remove("active");
        }
        document.getElementById("nb-item-grenade-1").innerHTML = (0, Game_menu_js_1.getPowerUP_value)().toString();
        document.getElementById("nb-item-teammate-1").innerHTML = (0, Game_menu_js_1.getPowerUP_value)().toString();
        document.getElementById("nb-item-autre-1").innerHTML = (0, Game_menu_js_1.getPowerUP_value)().toString();
        document.getElementById("nb-item-grenade-2").innerHTML = (0, Game_menu_js_1.getPowerUP_value)().toString();
        document.getElementById("nb-item-teammate-2").innerHTML = (0, Game_menu_js_1.getPowerUP_value)().toString();
        document.getElementById("nb-item-autre-2").innerHTML = (0, Game_menu_js_1.getPowerUP_value)().toString();
    };
    solo_game.prototype.updateOverlays = function () {
        var nb_powerUP_grenade_player1 = parseInt(document.getElementById("nb-item-grenade-1").innerHTML, 10);
        var nb_powerUP_grenade_player2 = parseInt(document.getElementById("nb-item-grenade-2").innerHTML, 10);
        var nb_powerUP_teammate_player1 = parseInt(document.getElementById("nb-item-teammate-1").innerHTML, 10);
        var nb_powerUP_teammate_player2 = parseInt(document.getElementById("nb-item-teammate-2").innerHTML, 10);
        var nb_powerUP_inverse_player1 = parseInt(document.getElementById("nb-item-autre-1").innerHTML, 10);
        var nb_powerUP_inverse_player2 = parseInt(document.getElementById("nb-item-autre-2").innerHTML, 10);
        document.getElementById("overlay-grenade-1").classList.toggle("active", nb_powerUP_grenade_player1 === 0);
        document.getElementById("overlay-grenade-2").classList.toggle("active", nb_powerUP_grenade_player2 === 0);
        document.getElementById("overlay-teammate-1").classList.toggle("active", nb_powerUP_teammate_player1 === 0);
        document.getElementById("overlay-teammate-2").classList.toggle("active", nb_powerUP_teammate_player2 === 0);
        document.getElementById("overlay-inverse-1").classList.toggle("active", nb_powerUP_inverse_player1 === 0);
        document.getElementById("overlay-inverse-2").classList.toggle("active", nb_powerUP_inverse_player2 === 0);
    };
    solo_game.prototype.handleKeyPress = function (event) {
        var _this = this;
        console.log("Key pressed:", event.key);
        var key = event.key;
        // Vérifier si la touche a un cooldown défini
        if (!(key in this.cooldownTimes))
            return;
        // Vérifier si la touche est en cooldown
        if (this.cooldowns[key])
            return; // Ignore l'action si en cooldown
        if (key === " ") {
            var press_space = document.getElementById("press_space_id");
            if (press_space) {
                press_space.style.visibility = "hidden";
                press_space.style.animation = "none";
            }
            else {
                console.error("press_space_id introuvable !");
            }
            spacePressed = true;
        }
        if (spacePressed) {
            var elem = null;
            switch (key) {
                case "z":
                    elem = document.getElementById("nb-item-grenade-1");
                    break;
                case "x":
                    elem = document.getElementById("nb-item-teammate-1");
                    break;
                case "c":
                    elem = document.getElementById("nb-item-autre-1");
                    break;
                case "1":
                    elem = document.getElementById("nb-item-grenade-2");
                    break;
                case "2":
                    elem = document.getElementById("nb-item-teammate-2");
                    break;
                case "3":
                    elem = document.getElementById("nb-item-autre-2");
                    break;
            }
            if (elem) {
                var currentValue_1 = parseInt(elem.innerHTML, 10);
                if (currentValue_1 > 0) {
                    elem.innerHTML = (currentValue_1 - 1).toString(); //NOTE - jai changer le type pour que ca passe ici
                    console.log("".concat(key, " utilis\u00E9, cooldown activ\u00E9 pour ").concat(this.cooldownTimes[key], "ms"));
                    // Mettre en cooldown cette touche
                    this.cooldowns[key] = true;
                    // Ajouter la classe d'animation pour démarrer l'overlay reloading
                    var itemCircle_1 = null;
                    var overlayReloading_1 = null;
                    var overlayReloading_teammate_1 = null;
                    switch (key) {
                        case "z":
                            overlayReloading_1 = document.getElementById("overlay-reloading-grenade-1");
                            itemCircle_1 = document.getElementById("item-circle-grenade1");
                            break;
                        case "x":
                            overlayReloading_teammate_1 = document.getElementById("overlay-reloading-teammate-1");
                            itemCircle_1 = document.getElementById("item-circle-teammate1");
                            break;
                        case "c":
                            overlayReloading_1 = document.getElementById("overlay-reloading-inverse-1");
                            itemCircle_1 = document.getElementById("item-circle-inverse1");
                            break;
                        case "1":
                            overlayReloading_1 = document.getElementById("overlay-reloading-grenade-2");
                            itemCircle_1 = document.getElementById("item-circle-grenade2");
                            break;
                        case "2":
                            overlayReloading_teammate_1 = document.getElementById("overlay-reloading-teammate-2");
                            itemCircle_1 = document.getElementById("item-circle-teammate2");
                            break;
                        case "3":
                            overlayReloading_1 = document.getElementById("overlay-reloading-inverse-2");
                            itemCircle_1 = document.getElementById("item-circle-inverse2");
                            break;
                    }
                    if (currentValue_1 - 1 === 0) {
                        itemCircle_1.classList.add("active");
                        this.updateOverlays();
                        return;
                    }
                    if (overlayReloading_1 && currentValue_1 - 1 !== 0) {
                        // Lancer l'animation en ajoutant une classe CSS pour démarrer
                        overlayReloading_1.classList.add("active"); // Assurez-vous que .item-loading est défini dans votre CSS
                    }
                    if (itemCircle_1) {
                        itemCircle_1.classList.add("active");
                    }
                    if (overlayReloading_teammate_1 && currentValue_1 - 1 !== 0) {
                        // Lancer l'animation en ajoutant une classe CSS pour démarrer
                        overlayReloading_teammate_1.classList.add("active"); // Assurez-vous que .item-loading est défini dans votre CSS
                    }
                    // Retirer le cooldown après le délai défini pour cette touche
                    setTimeout(function () {
                        // Terminer le cooldown et arrêter l'animation
                        delete _this.cooldowns[key];
                        console.log("".concat(key, " cooldown termin\u00E9"));
                        // Retirer la classe d'animation après le cooldown
                        if (overlayReloading_1 && currentValue_1 - 1 !== 0) {
                            overlayReloading_1.classList.remove("active");
                        }
                        if (overlayReloading_teammate_1 && currentValue_1 - 1 !== 0) {
                            overlayReloading_teammate_1.classList.remove("active");
                        }
                        if (itemCircle_1 && currentValue_1 - 1 !== 0) {
                            itemCircle_1.classList.remove("active");
                        }
                    }, this.cooldownTimes[key]);
                }
            }
        }
    };
    solo_game.prototype.event_solo_game = function () {
        var option = document.getElementById("option_btn");
        var panel = document.getElementById("panel_id");
        var option_remove = document.getElementById("option_btn-remove");
        option.addEventListener("click", function () {
            console.log("option clicked");
            panel.classList.add("active");
            panel.classList.remove("remove");
            option.classList.add("active");
        });
        option_remove.addEventListener("click", function () {
            console.log("option_remove clicked");
            panel.classList.add("remove");
            option.classList.remove("active");
            setTimeout(function () {
                panel.classList.remove("active");
            }, 1100);
        });
    };
    solo_game.prototype.checkGameOver = function () {
        if (window.location.pathname !== "/solo_game_1v1")
            return;
        var winnerContainer = document.querySelector(".container-EndGame");
        var player_1_win = (0, score_js_2.getPlayer_1_win)();
        var player_2_win = (0, score_js_2.getPlayer_2_win)();
        if (!winnerContainer)
            return;
        if ((0, score_js_1.isGameFinished)()) {
            winnerContainer.classList.add("active");
            clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
            if (player_1_win) {
                document.getElementById("winner_id").innerHTML = "Player 1 Win";
                document.getElementById("looser_id").innerHTML = "Player 2 Loose";
            }
            else if (player_2_win) {
                document.getElementById("winner_id").innerHTML = "Player 2 Win";
                document.getElementById("looser_id").innerHTML = "Player 1 Loose";
            }
        }
        else {
            winnerContainer.classList.remove("active");
        }
    };
    return solo_game;
}(AbstractView_js_1.default));
exports.default = solo_game;
