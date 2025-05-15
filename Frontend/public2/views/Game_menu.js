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
exports.getPowerUP_value = getPowerUP_value;
exports.getPowerUP_value_multi = getPowerUP_value_multi;
var AbstractView_js_1 = require("./AbstractView.js");
var babylon_js_1 = require("../../../srcs/game/gameplay/babylon.js");
var babylon_js_2 = require("../../../srcs/game/gameplay/babylon.js");
var camera_js_1 = require("../../../srcs/game/gameplay/views/camera.js");
var init_powerUP_GrenadeFlash_js_1 = require("../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_GrenadeFlash.js");
var init_powerUP_teammate_js_1 = require("../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_teammate.js");
var init_powerUP_inverse_js_1 = require("../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_inverse.js");
var init_powerUP_GernadeFlash_multi_js_1 = require("../../../srcs/game/gameplay/multiplayer/2v2_game/init_powerUP_GernadeFlash_multi.js");
var init_power_up_freeze_js_1 = require("../../../srcs/game/gameplay/multiplayer/2v2_game/init_power_up_freeze.js");
var index_js_1 = require("../index.js");
var init_skin_perso_js_1 = require("../../../srcs/game/gameplay/solo/skin/init_skin_perso.js");
var init_skin_perso_multi_js_1 = require("../../../srcs/game/gameplay/multiplayer/init_skin_perso_multi.js");
var powerUP_nb = 0;
var powerUP_nb_multi = 0;
var Game_menu = /** @class */ (function (_super) {
    __extends(Game_menu, _super);
    function Game_menu() {
        var _this = _super.call(this) || this;
        _this.setTitle("Game_menu");
        // Get accessToken from localStorage or other source
        var accessToken = localStorage.getItem('accessToken');
        if (!accessToken || accessToken === undefined) {
            history.pushState({}, '', '/');
            Promise.resolve().then(function () { return require('./Home.js'); }).then(function (module) {
                var Home = module.default;
                var homeInstance = new Home();
                homeInstance.getHtml().then(function (html) {
                    var appElement = document.getElementById('app');
                    if (appElement) {
                        appElement.innerHTML = html;
                        if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
                            homeInstance.createAccount();
                        }
                    }
                });
            });
        }
        return _this;
    }
    Game_menu.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /*html*/ "\n\t\t<link rel=\"stylesheet\" href=\"./static/js/css/game_menu.css\">\n\t\t<link href=\"https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap\" rel=\"stylesheet\">\n\t\t<div class=\"view1\" id=\"view1\">\n\t\t\t<div class=\"view1-content\">\n\t\t\t\t<button id=\"view1_btn\" class=\"btn\">GAME MODE</button>\n\t\t\t\t<button id=\"settings_btn\" class=\"btn\">SETTINGS</button>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"back-home\" id=\"back-home\">\n\t\t\t<button id=\"btn_back_home\" class=\"btn\">BACK</button>\n\t\t</div>\n\t\t\t<div id=\"container\" class=\"container_menu\">\n\t\t\t\t<button id=\"btn_jouer\">\n\t\t\t\t\t<h1>PLAY</h1>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"view2\" id=\"view2\">\n\t\t\t\t\t<div class=\"view2-content\">\n\t\t\t\t\t\t<h1>CHOOSE YOUR GAME MODE</h1>\n\t\t\t\t\t\t<div id=\"game_mode_btn\" class=\"game_mode_btn\">\n\t\t\t\t\t\t\t<button id=\"solo\" class=\"btn\">SOLO</button>\n\t\t\t\t\t\t\t<button id=\"multiplayer\" class=\"btn\">MULTIPLAYER</button>\n\t\t\t\t\t\t\t<button id=\"tournament_view\" class=\"btn_tournament\">\n\t\t\t\t\t\t\t<a href=\"/tournament\" class=\"nav-link\" data-link>TOURNAMENT</a>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button id=\"platformer_view\" class=\"btn_platformer\">\n\t\t\t\t\t\t\t\t<a href=\"/PlatformView\" class=\"nav-link\" data-link>PLATFORMER</a>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"view3\" id=\"view3\">\n\t\t\t\t\t<div class=\"view3-content\">\n\t\t\t\t\t\t<h1>SOLO GAME MODE</h1>\n\t\t\t\t\t\t<div id=\"game_mode_btn\" class=\"game_mode_btn\">\n\t\t\t\t\t\t\t<button id=\"prepar_game_1v1\" class=\"btn\">1v1</button>\n\t\t\t\t\t\t\t<button id=\"prepar_gane_ai\" class=\"btn\">ai</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button id=\"back_to_menu_view3\" class=\"btn\">BACK TO MENU</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"view4\" id=\"view4\">\n\t\t\t\t\t<div class=\"view4-content\">\n\t\t\t\t\t\t<h1>MULTIPLAYER GAME MODE</h1>\n\t\t\t\t\t\t<div id=\"game_mode_btn\" class=\"game_mode_btn\">\n\t\t\t\t\t\t\t<button id=\"prepar_game_multi\" class=\"btn\">2v2</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button id=\"back_to_menu_view4\" class=\"btn\">BACK TO MENU</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"view5\" id=\"view5\">\n\t\t\t\t\t<div class=\"view5-content\">\n\t\t\t\t\t\t<h1>SETTINGS</h1>\n\t\t\t\t\t\t<div id=\"select_parametres\" class=\"select_parametres\">\n\t\t\t\t\t\t\t<button id=\"profile_parrametre_btn\" class=\"btn\">PROFILE</button>\n\t\t\t\t\t\t\t<button id=\"parrametre_jeux_btn\" class=\"btn\">GAME</button>\n\t\t\t\t\t\t\t<button class=\"option\" id=\"option_btn\">\n\t\t\t\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/menu.svg\" alt=\"leave\">\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"option_deconnect\" id=\"option_deconnect\">\n\t\t\t\t\t<div class=\"option_deconnect_content\">\n\t\t\t\t\t\t<h1>OPTIONS</h1>\n\t\t\t\t\t\t<button id=\"deconnect_btn\" class=\"option_deconnect_btn\">LOG OUT</button>\n\t\t\t\t\t\t<button id=\"option_deconnected_btn\" class=\"option_deconnected_btn_back\">X</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"parametres_jeu\" id=\"parametres_jeu\">\n\t\t\t\t\t<div class=\"parametres_jeu_content\" id=\"parametre_jeux_content\">\n\t\t\t\t\t\t<h1>GAME SETTINGS</h1>\n\t\t\t\t\t\t<h2>PONG</h2>\n\t\t\t\t\t\t<div class=\"parametre_mode_jeu\">\n\t\t\t\t\t\t\t<div class=\"mode_de_jeu_solo_parametre\">\n\t\t\t\t\t\t\t<h3>Solo Game Mode</h3>\n\n\t\t\t\t\t\t\t<div class=\"joueur_touch\">\n\t\t\t\t\t\t\t\t<div class=\"joueur\" id=\"joueur1\">\n\t\t\t\t\t\t\t\t\t<p>Player 1</p>\n\t\t\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t\t\t<p>Movement: W / S</p>\n\t\t\t\t\t\t\t\t\t\t<p>PowerUP: Z / X / C</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"joueur\" id=\"joueur2\">\n\t\t\t\t\t\t\t\t\t<p>Player 2</p>\n\t\t\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t\t\t<p>Movement: \u2B06 / \u2B07</p>\n\t\t\t\t\t\t\t\t\t\t<p>PowerUP: 1 / 2 / 3</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class=\"mode_de_jeu_multi_parametre\">\n\t\t\t\t\t\t\t\t<h3>Multiplayer Game Mode</h3>\n\t\t\t\t\t\t\t\t<div class=\"joueur_touch\">\n\t\t\t\t\t\t\t\t\t<div class=\"joueur\" id=\"joueur1\">\n\t\t\t\t\t\t\t\t\t\t<p>Player 1</p>\n\t\t\t\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t\t\t\t<p>Movement: W / S</p>\n\t\t\t\t\t\t\t\t\t\t\t<p>PowerUP: Z / X / C</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"joueur\" id=\"joueur2\">\n\t\t\t\t\t\t\t\t\t\t<p>Player 2</p>\n\t\t\t\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t\t\t\t<p>Movement: E / D</p>\n\t\t\t\t\t\t\t\t\t\t\t<p>PowerUP: Z / X / C</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"joueur\" id=\"joueur3\">\n\t\t\t\t\t\t\t\t\t\t<p>Player 3</p>\n\t\t\t\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t\t\t\t<p>Movement: O / L</p>\n\t\t\t\t\t\t\t\t\t\t\t<p>PowerUP: 1 / 2 / 3</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"joueur\" id=\"joueur4\">\n\t\t\t\t\t\t\t\t\t\t<p>Player 4</p>\n\t\t\t\t\t\t\t\t\t\t<div class=\"controls\">\n\t\t\t\t\t\t\t\t\t\t\t<p>Movement: \u2B06 / \u2B07</p>\n\t\t\t\t\t\t\t\t\t\t\t<p>PowerUP: 1 / 2 / 3</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t  </div>\n\n\t\t\t\t<div class=\"parrametres_profile\" id=\"parametres_profile\">\n\t\t\t\t\t<div class=\"parametres_profile_content\">\n\t\t\t\t\t\t<h1>PROFILE SETTINGS</h1>\n\t\t\t\t\t\t<form id=\"modif_profil\" class=\"modif_profile\" onsubmit=\"accessProfileInfo(event)\">\n\t\t\t\t\t\t\t<label for=\"mdp\">Password</label>\n\t\t\t\t\t\t\t<input type=\"password\" id=\"password\" name=\"password\" placeholder=\"Password\" required>\n\t\t\t\t\t\t\t<button type=\"submit\" class=\"btn_valider_mdp\">Valider</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t\t<div class=\"profile_param_unlocked\" id=\"profile_param_unlocked_id\">\n\t\t\t\t\t\t\t<div class=\"photo_profile\">\n\t\t\t\t\t\t\t\t<div class=\"profile_photo_container\">\n\t\t\t\t\t\t\t\t\t<div class=\"profile_photo_circle\" id=\"profile_photo_circle\"></div>\n\t\t\t\t\t\t\t\t\t<form id=\"uploadForm\" enctype=\"multipart/form-data\" onsubmit=\"changeProfilePicture(event)\">\n\t\t\t\t\t\t\t\t\t\t<label for=\"profile_photo_input\" class=\"photo_upload_icon\"></label>\n\t\t\t\t\t\t\t\t\t\t<input type=\"file\" name=\"image\" id=\"profile_photo_input\" style=\"color:white\"/>\n\t\t\t\t\t\t\t\t\t\t<button type=\"submit\">Upload</button>\n\t\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<form onsubmit=\"updateProfileInfo(event)\">\n\t\t\t\t\t\t\t\t<div class=\"input_container\">\n\t\t\t\t\t\t\t\t\t<label for=\"username\">Change username</label>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" id=\"change_username\" name=\"username\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"input_container\">\n\t\t\t\t\t\t\t\t\t<label for=\"email\">Change email</label>\n\t\t\t\t\t\t\t\t\t<input type=\"email\" id=\"change_email\" name=\"email\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"input_container\">\n\t\t\t\t\t\t\t\t\t<label for=\"password\">Change password</label>\n\t\t\t\t\t\t\t\t\t<input type=\"password\" id=\"change_password\" name=\"password\" placeholder=\"******\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"input_container\">\n\t\t\t\t\t\t\t\t\t<label for=\"confirm_password\">Confirm new password</label>\n\t\t\t\t\t\t\t\t\t<input type=\"password\" id=\"confirm_change_password\" name=\"confirm_password\" placeholder=\"******\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div id=\"fa_selector\" class=\"fa_selector\">\n\t\t\t\t\t\t\t\t<p>2FA :<span id=\"active_fa\" class=\"active_fa\"></span></p>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<button type=\"submit\" id=\"valid_profile_info\" class=\"valid_profile_info_btn\">Valider</button>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t<div class=\"btn_deconnect\">\n\t\t\t\t\t\t\t\t<button id=\"deconnect_btn\" class=\"btn_deconnect_btn\" onclick=\"logout()\">Deconnexion</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"btn_delete\">\n\t\t\t\t\t\t\t\t<button id=\"delete_btn\" class=\"btn_delete_btn\" onclick=\"unregister()\">Delete account</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<p id=\"updateProfile-resultMessage\" class=\"resultMessage\" style=\"color:white\"></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"view6\" id=\"view6\">\n\t\t\t\t\t<div class=\"view6-content\">\n\t\t\t\t\t\t<h1 id=\"custom_ta_game\">CUSTOMIZE YOUR GAME</h1>\n\t\t\t\t\t\t<div class=\"powerUP\">\n\t\t\t\t\t\t\t<p>PowerUP: <span id=\"power_up_info_id\" class=\"power_up_info\"></span><span id=\"powerUP\" class=\"active_powerUP\"></span></p>\n\t\t\t\t\t\t\t<div id=\"power_selector\" class=\"power_selector\">\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>1</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_1\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>3</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_3\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>5</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_5\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"skin\">\n\t\t\t\t\t\t\t<p>Custom Skin: <span id=\"skin_perso\" class=\"skin_perso\"></span></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button id=\"solo_1v1_btn\" class=\"btn\">\n\t\t\t\t\t\t\t<a href=\"/solo_game_1v1\" class=\"nav-link\" data-link>Start Game</a>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\n\t\t\t\t<div class=\"view7\" id=\"view7\">\n\t\t\t\t\t<div class=\"view7-content\">\n\t\t\t\t\t\t<h1>CUSTOMISE TA GAME CONTRE L'IA</h1>\n\t\t\t\t\t\t<div class=\"powerUP\">\n\t\t\t\t\t\t\t<p>PowerUP :<span id=\"powerUP\" class=\"active_powerUP\"></span></p>\n\t\t\t\t\t\t\t<div id=\"power_selector\" class=\"power_selector\">\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>1</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_1\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>3</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_3\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>5</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_5\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"skin\">\n\t\t\t\t\t\t\t<p>Skin Personnalise :<span id=\"skin_perso\" class=\"skin_perso\"</span></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button id=\"solo_ai_btn\" class=\"btn\">\n\t\t\t\t\t\t\t<a href=\"/solo_game_ai\" class=\"nav-link\" data-link>Lancer la partie</a>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"view8\" id=\"view8\">\n\t\t\t\t\t<div class=\"view8-content\">\n\t\t\t\t\t\t<h1 id=\"custom_ta_game_multi\">CUSTOMIZE YOUR MULTIPLAYER GAME</h1>\n\t\t\t\t\t\t<div class=\"powerUP\">\n\t\t\t\t\t\t\t<p>PowerUP: <span id=\"power_up_info_id_multi\" class=\"power_up_info\"></span><span id=\"powerUP_multi\" class=\"active_powerUP\"></span></p>\n\t\t\t\t\t\t\t<div id=\"power_selector_game_multi\" class=\"power_selector\">\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>1</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_1_game_multi\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>3</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_3_game_multi\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"powerUP_number\">\n\t\t\t\t\t\t\t\t\t<p>5</p>\n\t\t\t\t\t\t\t\t\t<span id=\"number_powerUP_5_game_multi\" class=\"number_powerUP\"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"skin\">\n\t\t\t\t\t\t\t<p>Custom Skin: <span id=\"skin_perso_game_multi\" class=\"skin_perso\"></span></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button id=\"multiplayer_btn\" class=\"btn\">\n\t\t\t\t\t\t\t<a href=\"/multi_player_game\" class=\"nav-link\" data-link>Start Game</a>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"back\" id=\"back_to_select_mode_view6\">\n\t\t\t\t<button id=\"back_to_menu_view6\" class=\"btn_back\">BACK</button>\n\t\t\t</div>\n\t\t\t<div class=\"back\" id=\"back_to_select_mode_view7\">\n\t\t\t\t<button id=\"back_to_menu_view7\" class=\"btn_back\">BACK</button>\n\t\t\t</div>\n\t\t\t<div class=\"back\" id=\"back_to_select_mode_view8\">\n\t\t\t\t<button id=\"back_to_menu_view8\" class=\"btn_back\">BACK</button>\n\t\t\t</div>\n\t\t\t<div class=\"choose_your_skin\" id=\"choose_your_skin\">\n\t\t\t\t<h1>CUSTOMIZE YOUR SKIN</h1>\n\t\t\t\t<div class=\"player1\">\n\t\t\t\t\t<button class=\"switch_skin_left\" id=\"switch_skn_left_id1\"></button>\n\t\t\t\t\t<button class=\"switch_skin_right\" id=\"switch_skn_right_id1\"></button>\n\t\t\t\t\t<p>Player 1</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"player2\">\n\t\t\t\t\t<button class=\"switch_skin_left\" id=\"switch_skn_left_id2\"></button>\n\t\t\t\t\t<button class=\"switch_skin_right\" id=\"switch_skn_right_id2\"></button>\n\t\t\t\t\t<p>Player 2</p>\n\t\t\t\t</div>\n\t\t\t\t<button id=\"valide_ton_skin\" class=\"btn\">Confirm</button>\n\t\t\t</div>\n\n\t\t\t<div class=\"choose_your_skin_game_multi\" id=\"choose_your_skin_game_multi\">\n\t\t\t\t<h1>CUSTOMIZE YOUR SKIN</h1>\n\t\t\t\t<div class=\"player1_game_multi\">\n\t\t\t\t\t<button class=\"switch_skin_left\" id=\"switch_skn_left_id1_game_multi\"></button>\n\t\t\t\t\t<button class=\"switch_skin_right\" id=\"switch_skn_right_id1_game_multi\"></button>\n\t\t\t\t\t<p>Player 1</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"player2_game_multi\">\n\t\t\t\t\t<button class=\"switch_skin_left\" id=\"switch_skn_left_id2_game_multi\"></button>\n\t\t\t\t\t<button class=\"switch_skin_right\" id=\"switch_skn_right_id2_game_multi\"></button>\n\t\t\t\t\t<p>Player 2</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"player3_game_multi\">\n\t\t\t\t\t<button class=\"switch_skin_left\" id=\"switch_skn_left_id3_game_multi\"></button>\n\t\t\t\t\t<button class=\"switch_skin_right\" id=\"switch_skn_right_id3_game_multi\"></button>\n\t\t\t\t\t<p>Player 3</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"player4_game_multi\">\n\t\t\t\t\t<button class=\"switch_skin_left\" id=\"switch_skn_left_id4_game_multi\"></button>\n\t\t\t\t\t<button class=\"switch_skin_right\" id=\"switch_skn_right_id4_game_multi\"></button>\n\t\t\t\t\t<p>Player 4</p>\n\t\t\t\t</div>\n\t\t\t\t<button id=\"valide_ton_skin_game_multi\" class=\"btn\">Confirm</button>\n\t\t\t</div>\n\t\t\t<div id=\"container_info_power_up\" class=\"container_info_power_up\">\n\t\t\t<div class=\"text_powerUP\">\n\t\t\t\t<h1>Power-UP</h1>\n\t\t\t\t<p class=\"explication_general\">The Power-Up is a bonus that gives you an advantage over your opponent. By enabling this option, you will start the match with at least one Power-Up of each type. You can also customize this amount and start with three or five of each.</p>\n\t\t\t\t<p class=\"explication_powerUP_grenade\">The Flash Grenade Power-Up allows you to throw a grenade that will blind your opponent. But be careful! It works in a simple way: it completely darkens the game screen, meaning even the one who throws it gets blinded.</p>\n\t\t\t\t<p class=\"explication_powerUP_teammate\">The Teammate Power-Up lets you call in a new player to join the game for a short time. You can move them using E/D for player 1 and O/L for player 2.</p>\n\t\t\t\t<p class=\"explication_powerUP_inverse\">The Reverse Power-Up lets you invert your opponent\u2019s controls for a short duration.</p>\n\t\t\t\t<div class=\"delay_powerUP_1\">\n\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/timer-reset.svg\" alt=\"delay\">\n\t\t\t\t\t<p>COOLDOWN TIME: 10s</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"delay_powerUP_2\">\n\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/timer-reset.svg\" alt=\"delay\">\n\t\t\t\t\t<p>COOLDOWN TIME: 15s</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"delay_powerUP_3\">\n\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/timer-reset.svg\" alt=\"delay\">\n\t\t\t\t\t<p>COOLDOWN TIME: 10s</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"container_image_powerUP\">\n\t\t\t\t<img src=\"../../../srcs/game/assets/image/grenade_no_bg.png\" alt=\"grenade\" class=\"grenade\">\n\t\t\t\t<img src=\"../../../srcs/game/assets/image/teammate_no_bg.png\" alt=\"teammate\" class=\"teammate\">\n\t\t\t\t<img src=\"../../../srcs/game/assets/image/reverse_no_bg.png\" alt=\"inverse_player\" class=\"inverse_player\">\n\t\t\t</div>\n\t\t\t<div id=\"exit_powerUP_info\" class=\"exit_powerUP_info\">\n\t\t\t\t<button id=\"exit_powerUP_info_btn\" class=\"btn\">\n\t\t\t\t\tX\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div id=\"container_info_power_up_multi\" class=\"container_info_power_up\">\n\t\t\t<div class=\"text_powerUP\">\n\t\t\t\t<h1>Power-UP</h1>\n\t\t\t\t<p class=\"explication_general\">The Power-Up is a bonus that gives you an advantage over your opponent. By enabling this option, you will start the match with at least one Power-Up of each type. You can also customize this amount and start with three or five of each.</p>\n\t\t\t\t<p class=\"explication_powerUP_grenade_multi\">The Flash Grenade Power-Up lets you throw a grenade that blinds your opponent. But be careful! It works simply: it completely darkens the game screen, meaning even the one who throws it is blinded.</p>\n\t\t\t\t<p class=\"explication_powerUP_freeze\">The Freeze Power-Up temporarily immobilizes the opposing team.</p>\n\t\t\t\t<div class=\"delay_powerUP_1_multi\">\n\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/timer-reset.svg\" alt=\"delay\">\n\t\t\t\t\t<p>COOLDOWN TIME: 10s</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"delay_powerUP_2_multi\">\n\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/timer-reset.svg\" alt=\"delay\">\n\t\t\t\t\t<p>COOLDOWN TIME: 10s</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"container_image_powerUP_multi\">\n\t\t\t\t<img src=\"../../../srcs/game/assets/image/grenade_no_bg.png\" alt=\"grenade\" class=\"grenade\">\n\t\t\t\t<img src=\"../../../srcs/game/assets/image/freeze_no_bg.png\" alt=\"freeze\" class=\"freeze\">\n\t\t\t</div>\n\t\t\t<div id=\"exit_powerUP_info_multi\" class=\"exit_powerUP_info\">\n\t\t\t\t<button id=\"exit_powerUP_info_btn_multi\" class=\"btn\">\n\t\t\t\t\tX\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t"];
            });
        });
    };
    Game_menu.prototype.init_solo_game = function () {
        document.getElementById("solo_1v1_btn").addEventListener("click", function () {
            // console.log("Solo 1v1 game started");
            (0, babylon_js_1.startGame)();
            (0, camera_js_1.handleViewTransitions)("vue3", "vue2");
        });
    };
    Game_menu.prototype.initEvents = function () {
        document.getElementById("multiplayer_btn").addEventListener("click", function () {
            // console.log("Multiplayer 2v2 game started");
            (0, babylon_js_2.startMultiGame)();
            (0, camera_js_1.handleViewTransitions)("vue3", "vue2");
        });
    };
    Game_menu.prototype.init_solo_game_ai = function () {
        document.getElementById("solo_ai_btn").addEventListener("click", function () {
            // console.log("Solo AI game started");
            (0, babylon_js_1.startAI_Game)();
            (0, camera_js_1.handleViewTransitions)("vue3", "vue2");
        });
    };
    Game_menu.prototype.tournament_view = function () {
        document.getElementById("tournament_view").addEventListener("click", function () {
            // console.log("Tournament view started");
            (0, camera_js_1.handleViewTransitions)("tournament");
        });
    };
    Game_menu.prototype.handleDeconnection = function () {
        var deconnect_btn = document.getElementById("deconnect_btn");
        deconnect_btn.addEventListener("click", function () {
            (0, camera_js_1.handleViewTransitions)("vue1", "vue2");
            // console.log("Back to home page");
            window.history.back();
        });
    };
    Game_menu.prototype.game_menu = function () {
        var btn_jouer = document.getElementById('btn_jouer');
        var view1 = document.getElementById('view1');
        var view2 = document.getElementById('view2');
        var view3 = document.getElementById('view3');
        var view4 = document.getElementById('view4');
        var view1_btn = document.getElementById('view1_btn');
        var settings_btn = document.getElementById('settings_btn');
        var solo = document.getElementById('solo');
        var multiplayer = document.getElementById('multiplayer');
        var back_to_menu_view3 = document.getElementById('back_to_menu_view3');
        var back_to_menu_view4 = document.getElementById('back_to_menu_view4');
        var btn_back_home = document.getElementById('back-home');
        var view5 = document.getElementById('view5');
        var view6 = document.getElementById('view6');
        var view7 = document.getElementById('view7');
        var view8 = document.getElementById('view8');
        var prepar_game_1v1 = document.getElementById('prepar_game_1v1');
        var prepar_gane_ai = document.getElementById('prepar_gane_ai');
        var prepar_game_multi = document.getElementById('prepar_game_multi');
        var back_to_menu_view6 = document.getElementById('back_to_menu_view6');
        var back_to_menu_view7 = document.getElementById('back_to_menu_view7');
        var back_to_menu_view8 = document.getElementById('back_to_menu_view8');
        var powerUP = document.getElementById('powerUP');
        var number_powerUP_1 = document.getElementById('number_powerUP_1');
        var number_powerUP_3 = document.getElementById('number_powerUP_3');
        var number_powerUP_5 = document.getElementById('number_powerUP_5');
        var power_selector = document.getElementById('power_selector');
        var skin_perso = document.getElementById('skin_perso');
        var back_to_select_mode_view6 = document.getElementById('back_to_select_mode_view6');
        var back_to_select_mode_view7 = document.getElementById('back_to_select_mode_view7');
        var back_to_select_mode_view8 = document.getElementById('back_to_select_mode_view8');
        // const back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
        btn_jouer.addEventListener('click', function () {
            console.log('JOUER button clicked');
            view1.classList.add('active');
            view2.classList.add('active');
            btn_back_home.classList.add('active');
            btn_jouer.style.display = 'none';
        });
        view1_btn.addEventListener('click', function () {
            console.log('Mode de jeux button clicked');
            if (view5.classList.contains('active')) {
                view5.classList.remove('active');
                view2.classList.add('active');
            }
            else if (!view2.classList.contains('active')) {
                view2.classList.add('active');
            }
        });
        /***********************************************************************/
        /**************************SETTINGS************************************/
        /***********************************************************************/
        settings_btn.addEventListener('click', function () {
            view2.classList.remove('active');
            view5.classList.add('active');
        });
        /***********************************************************************/
        /**************************MODE_DE_JEUX********************************/
        /***********************************************************************/
        solo.addEventListener('click', function () {
            view2.classList.remove('active');
            view3.classList.add('active');
            view1.classList.remove('active');
            btn_back_home.classList.remove('active');
        });
        multiplayer.addEventListener('click', function () {
            view2.classList.remove('active');
            view4.classList.add('active');
            view1.classList.remove('active');
            btn_back_home.classList.remove('active');
        });
        /***********************************************************************/
        /**************************BACK_TO_MENU********************************/
        /***********************************************************************/
        if (!view3.classList.contains('active')) {
            console.log('view3 is active');
            back_to_menu_view3.addEventListener('click', function () {
                view3.classList.remove('active');
                view2.classList.add('active');
                view1.classList.add('active');
                btn_back_home.classList.add('active');
            });
        }
        if (!view4.classList.contains('active')) {
            console.log('view4 is active');
            back_to_menu_view4.addEventListener('click', function () {
                view4.classList.remove('active');
                view2.classList.add('active');
                view1.classList.add('active');
                btn_back_home.classList.add('active');
            });
        }
        // back_to_menu_view_tournament.addEventListener('click', () => {
        // 	handleViewTransitions("vue2", "tournament");
        // 	tournament_view.classList.remove('active');
        // 	setTimeout(() => {
        // 		view2.classList.add('active');
        // 		view1.classList.add('active');
        // 		btn_back_home.classList.add('active');
        // 	} , 1000);
        // });
        /***********************************************************************/
        /**************************BACK_HOME************************************/
        /***********************************************************************/
        btn_back_home.addEventListener('click', function () {
            if (view2.classList.contains('active')) {
                view2.classList.remove('active');
                view1.classList.remove('active');
                btn_back_home.classList.remove('active');
                btn_jouer.style.display = 'block';
            }
            if (view5.classList.contains('active')) {
                view5.classList.remove('active');
                view1.classList.remove('active');
                btn_back_home.classList.remove('active');
                btn_jouer.style.display = 'block';
            }
        });
        prepar_game_1v1.addEventListener('click', function () {
            view3.classList.remove('active');
            view6.classList.add('active');
            back_to_select_mode_view6.classList.add('active');
        });
        prepar_gane_ai.addEventListener('click', function () {
            view3.classList.remove('active');
            view7.classList.add('active');
            back_to_select_mode_view7.classList.add('active');
        });
        prepar_game_multi.addEventListener('click', function () {
            view4.classList.remove('active');
            view8.classList.add('active');
            back_to_select_mode_view8.classList.add('active');
        });
        /***********************************************************************/
        /**************************BACK_TO_MENU********************************/
        /***********************************************************************/
        back_to_menu_view6.addEventListener('click', function () {
            view6.classList.remove('active');
            view3.classList.add('active');
            back_to_select_mode_view6.classList.remove('active');
            if (skin_perso.classList.contains('checked')) {
                skin_perso.classList.remove('checked');
                if (choose_your_skin.classList.contains('active')) {
                    choose_your_skin.classList.remove('active');
                    solo_1v1_btn.style.display = 'block';
                    custom_ta_game.style.visibility = 'visible';
                }
            }
            if (power_selector.classList.contains('active')) {
                power_selector.classList.remove('active');
                powerUP.classList.remove('checked');
                (0, init_powerUP_GrenadeFlash_js_1.reset_powerUP_grenade)();
                (0, init_powerUP_teammate_js_1.reset_powerUP_teammate)();
                (0, init_powerUP_inverse_js_1.reset_powerUP_inverse_player)();
                powerUP_nb = 0;
                if (number_powerUP_1.classList.contains('checked')) {
                    number_powerUP_1.classList.remove('checked');
                }
                if (number_powerUP_3.classList.contains('checked')) {
                    number_powerUP_3.classList.remove('checked');
                }
                if (number_powerUP_5.classList.contains('checked')) {
                    number_powerUP_5.classList.remove('checked');
                }
            }
        });
        var skin_perso_game_multi = document.getElementById('skin_perso_game_multi');
        back_to_menu_view7.addEventListener('click', function () {
            console.log('Back to menu view7 clicked');
            view3.classList.add('active');
            view7.classList.remove('active');
            back_to_select_mode_view7.classList.remove('active');
            if (skin_perso.classList.contains('checked')) {
                skin_perso.classList.remove('checked');
                if (choose_your_skin.classList.contains('active')) {
                    choose_your_skin.classList.remove('active');
                    solo_1v1_btn.style.display = 'block';
                    custom_ta_game.style.visibility = 'visible';
                    (0, init_skin_perso_js_1.disable_skin_perso_player_solo)();
                }
            }
            if (power_selector.classList.contains('active')) {
                power_selector.classList.remove('active');
                powerUP.classList.remove('checked');
                (0, init_powerUP_GrenadeFlash_js_1.reset_powerUP_grenade)();
                (0, init_powerUP_teammate_js_1.reset_powerUP_teammate)();
                (0, init_powerUP_inverse_js_1.reset_powerUP_inverse_player)();
                powerUP_nb = 0;
                if (number_powerUP_1.classList.contains('checked')) {
                    number_powerUP_1.classList.remove('checked');
                }
                if (number_powerUP_3.classList.contains('checked')) {
                    number_powerUP_3.classList.remove('checked');
                }
                if (number_powerUP_5.classList.contains('checked')) {
                    number_powerUP_5.classList.remove('checked');
                }
            }
        });
        back_to_menu_view8.addEventListener('click', function () {
            view8.classList.remove('active');
            view4.classList.add('active');
            back_to_select_mode_view8.classList.remove('active');
            if (skin_perso_game_multi.classList.contains('checked')) {
                skin_perso_game_multi.classList.remove('checked');
                if (choose_your_skin_game_multi.classList.contains('active')) {
                    choose_your_skin_game_multi.classList.remove('active');
                    multiplayer_btn.style.display = 'block';
                    custom_ta_game_multi.style.visibility = 'visible';
                    (0, init_skin_perso_multi_js_1.disable_skin_multi)();
                }
            }
            if (power_selector_game_multi.classList.contains('active')) {
                power_selector_game_multi.classList.remove('active');
                powerUP_multi.classList.remove('checked');
                (0, init_powerUP_GernadeFlash_multi_js_1.reset_powerUP_grenadeTeam_player)();
                (0, init_power_up_freeze_js_1.reset_powerUP_freeze_Team_player)();
                powerUP_nb = 0;
                powerUP_nb_multi = 0;
                if (number_powerUP_1_game_multi.classList.contains('checked')) {
                    number_powerUP_1_game_multi.classList.remove('checked');
                }
                if (number_powerUP_3_game_multi.classList.contains('checked')) {
                    number_powerUP_3_game_multi.classList.remove('checked');
                }
                if (number_powerUP_5_game_multi.classList.contains('checked')) {
                    number_powerUP_5_game_multi.classList.remove('checked');
                }
            }
        });
        /***********************************************************************/
        /**************************POWER_UP_SOLO********************************/
        /***********************************************************************/
        powerUP.addEventListener('click', function () {
            powerUP.classList.toggle('checked');
            if (powerUP.classList.contains('checked')) {
                console.log('PowerUP is active');
                power_selector.classList.add('active');
            }
            else {
                console.log('PowerUP is inactive');
                power_selector.classList.remove('active');
                (0, init_powerUP_GrenadeFlash_js_1.reset_powerUP_grenade)();
                (0, init_powerUP_teammate_js_1.reset_powerUP_teammate)();
                (0, init_powerUP_inverse_js_1.reset_powerUP_inverse_player)();
                powerUP_nb = 0;
                powerUP_nb_multi = 0;
                if (number_powerUP_1.classList.contains('checked')) {
                    number_powerUP_1.classList.remove('checked');
                }
                if (number_powerUP_3.classList.contains('checked')) {
                    number_powerUP_3.classList.remove('checked');
                }
                if (number_powerUP_5.classList.contains('checked')) {
                    number_powerUP_5.classList.remove('checked');
                }
            }
        });
        number_powerUP_1.addEventListener('click', function () {
            number_powerUP_1.classList.toggle('checked');
            number_powerUP_3.classList.remove('checked');
            number_powerUP_5.classList.remove('checked');
            console.log('1 powerUP selected and 3 and 5 unselected');
            (0, init_powerUP_GrenadeFlash_js_1.init_nb_powerUP_grenadeFlash)(1);
            (0, init_powerUP_teammate_js_1.init_nb_powerUP_teammate)(1);
            (0, init_powerUP_inverse_js_1.init_powerUP_inverse_player)(1);
            powerUP_nb = 1;
        });
        number_powerUP_3.addEventListener('click', function () {
            number_powerUP_3.classList.toggle('checked');
            number_powerUP_1.classList.remove('checked');
            number_powerUP_5.classList.remove('checked');
            console.log('3 powerUP selected and 1 and 5 unselected');
            (0, init_powerUP_GrenadeFlash_js_1.init_nb_powerUP_grenadeFlash)(3);
            (0, init_powerUP_teammate_js_1.init_nb_powerUP_teammate)(3);
            (0, init_powerUP_inverse_js_1.init_powerUP_inverse_player)(3);
            powerUP_nb = 3;
        });
        number_powerUP_5.addEventListener('click', function () {
            number_powerUP_5.classList.toggle('checked');
            number_powerUP_1.classList.remove('checked');
            number_powerUP_3.classList.remove('checked');
            console.log('5 powerUP selected and 1 and 3 unselected');
            (0, init_powerUP_GrenadeFlash_js_1.init_nb_powerUP_grenadeFlash)(5);
            (0, init_powerUP_teammate_js_1.init_nb_powerUP_teammate)(5);
            (0, init_powerUP_inverse_js_1.init_powerUP_inverse_player)(5);
            powerUP_nb = 5;
        });
        /***********************************************************************/
        /**************************POWER_UP_multi*******************************/
        /***********************************************************************/
        var powerUP_multi = document.getElementById('powerUP_multi');
        var number_powerUP_1_game_multi = document.getElementById('number_powerUP_1_game_multi');
        var number_powerUP_3_game_multi = document.getElementById('number_powerUP_3_game_multi');
        var number_powerUP_5_game_multi = document.getElementById('number_powerUP_5_game_multi');
        var power_selector_game_multi = document.getElementById('power_selector_game_multi');
        powerUP_multi.addEventListener('click', function () {
            powerUP_multi.classList.toggle('checked');
            if (powerUP_multi.classList.contains('checked')) {
                console.log('PowerUP is active');
                power_selector_game_multi.classList.add('active');
            }
            else {
                console.log('PowerUP is inactive');
                power_selector_game_multi.classList.remove('active');
                (0, init_powerUP_GernadeFlash_multi_js_1.reset_powerUP_grenadeTeam_player)();
                (0, init_power_up_freeze_js_1.reset_powerUP_freeze_Team_player)();
                powerUP_nb = 0;
                powerUP_nb_multi = 0;
                if (number_powerUP_1_game_multi.classList.contains('checked')) {
                    number_powerUP_1_game_multi.classList.remove('checked');
                }
                if (number_powerUP_3_game_multi.classList.contains('checked')) {
                    number_powerUP_3_game_multi.classList.remove('checked');
                }
                if (number_powerUP_5_game_multi.classList.contains('checked')) {
                    number_powerUP_5_game_multi.classList.remove('checked');
                }
            }
        });
        number_powerUP_1_game_multi.addEventListener('click', function () {
            number_powerUP_1_game_multi.classList.toggle('checked');
            number_powerUP_3_game_multi.classList.remove('checked');
            number_powerUP_5_game_multi.classList.remove('checked');
            console.log('1 powerUP selected and 3 and 5 unselected');
            (0, init_powerUP_GernadeFlash_multi_js_1.init_nb_powerUP_grenadeFlash_team_player)(1);
            (0, init_power_up_freeze_js_1.init_powerUP_freeze_Team_player)(1);
            powerUP_nb_multi = 1;
        });
        number_powerUP_3_game_multi.addEventListener('click', function () {
            number_powerUP_3_game_multi.classList.toggle('checked');
            number_powerUP_1_game_multi.classList.remove('checked');
            number_powerUP_5_game_multi.classList.remove('checked');
            console.log('3 powerUP selected and 1 and 5 unselected');
            (0, init_powerUP_GernadeFlash_multi_js_1.init_nb_powerUP_grenadeFlash_team_player)(3);
            (0, init_power_up_freeze_js_1.init_powerUP_freeze_Team_player)(3);
            powerUP_nb_multi = 3;
        });
        number_powerUP_5_game_multi.addEventListener('click', function () {
            number_powerUP_5_game_multi.classList.toggle('checked');
            number_powerUP_1_game_multi.classList.remove('checked');
            number_powerUP_3_game_multi.classList.remove('checked');
            console.log('5 powerUP selected and 1 and 3 unselected');
            (0, init_powerUP_GernadeFlash_multi_js_1.init_nb_powerUP_grenadeFlash_team_player)(5);
            (0, init_power_up_freeze_js_1.init_powerUP_freeze_Team_player)(5);
            powerUP_nb_multi = 5;
        });
        if ((0, index_js_1.getValue_leave_game)() == true) {
            powerUP_nb = 0;
            powerUP_nb_multi = 0;
            (0, index_js_1.setLeaveGameVar)(false);
        }
        /***********************************************************************/
        /**************************SKIN-SOLO************************************/
        /***********************************************************************/
        var choose_your_skin = document.getElementById('choose_your_skin');
        var valide_ton_skin = document.getElementById('valide_ton_skin');
        var custom_ta_game = document.getElementById('custom_ta_game');
        var solo_1v1_btn = document.getElementById('solo_1v1_btn');
        var switch_skn_left_id1 = document.getElementById('switch_skn_left_id1');
        var switch_skn_right_id1 = document.getElementById('switch_skn_right_id1');
        var switch_skn_left_id2 = document.getElementById('switch_skn_left_id2');
        var switch_skn_right_id2 = document.getElementById('switch_skn_right_id2');
        skin_perso.addEventListener('click', function () {
            skin_perso.classList.toggle('checked');
            if (skin_perso.classList.contains('checked')) {
                console.log('Skin perso is active');
                choose_your_skin.classList.add('active');
                solo_1v1_btn.style.display = 'none';
                custom_ta_game.style.visibility = 'hidden';
                (0, init_skin_perso_js_1.enable_skin_perso_player_solo)();
                valide_ton_skin.addEventListener('click', function () {
                    console.log('Valide ton skin button clicked');
                    choose_your_skin.classList.remove('active');
                    solo_1v1_btn.style.display = 'block';
                    custom_ta_game.style.visibility = 'visible';
                    (0, init_skin_perso_js_1.disable_skin_perso_player_solo_and_save)();
                });
            }
            else {
                console.log('Skin perso is inactive');
                if (choose_your_skin.classList.contains('active')) {
                    choose_your_skin.classList.remove('active');
                    solo_1v1_btn.style.display = 'block';
                    custom_ta_game.style.visibility = 'visible';
                    (0, init_skin_perso_js_1.disable_skin_perso_player_solo)();
                }
            }
        });
        switch_skn_left_id1.addEventListener('click', function () {
            console.log('Switch skin left id1 clicked');
            (0, init_skin_perso_js_1.switch_skin_perso_player1_left)();
        });
        switch_skn_right_id1.addEventListener('click', function () {
            console.log('Switch skin right id1 clicked');
            (0, init_skin_perso_js_1.switch_skin_perso_player1_right)();
        });
        switch_skn_left_id2.addEventListener('click', function () {
            console.log('Switch skin left id2 clicked');
            (0, init_skin_perso_js_1.switch_skin_perso_player2_left)();
        });
        switch_skn_right_id2.addEventListener('click', function () {
            console.log('Switch skin right id2 clicked');
            (0, init_skin_perso_js_1.switch_skin_perso_player2_right)();
        });
        /***********************************************************************/
        /**************************SKIN_MULTI***********************************/
        /***********************************************************************/
        var choose_your_skin_game_multi = document.getElementById('choose_your_skin_game_multi');
        var valide_ton_skin_game_multi = document.getElementById('valide_ton_skin_game_multi');
        var switch_skn_left_id1_game_multi = document.getElementById('switch_skn_left_id1_game_multi');
        var switch_skn_right_id1_game_multi = document.getElementById('switch_skn_right_id1_game_multi');
        var switch_skn_left_id2_game_multi = document.getElementById('switch_skn_left_id2_game_multi');
        var switch_skn_right_id2_game_multi = document.getElementById('switch_skn_right_id2_game_multi');
        var switch_skn_left_id3_game_multi = document.getElementById('switch_skn_left_id3_game_multi');
        var switch_skn_right_id3_game_multi = document.getElementById('switch_skn_right_id3_game_multi');
        var switch_skn_left_id4_game_multi = document.getElementById('switch_skn_left_id4_game_multi');
        var switch_skn_right_id4_game_multi = document.getElementById('switch_skn_right_id4_game_multi');
        var custom_ta_game_multi = document.getElementById('custom_ta_game_multi');
        var multiplayer_btn = document.getElementById('multiplayer_btn');
        skin_perso_game_multi.addEventListener('click', function () {
            skin_perso_game_multi.classList.toggle('checked');
            if (skin_perso_game_multi.classList.contains('checked')) {
                console.log('Skin perso is active');
                choose_your_skin_game_multi.classList.add('active');
                multiplayer_btn.style.display = 'none';
                custom_ta_game_multi.style.visibility = 'hidden';
                (0, init_skin_perso_multi_js_1.enable_skin_multi)();
                valide_ton_skin_game_multi.addEventListener('click', function () {
                    console.log('Valide ton skin button clicked');
                    choose_your_skin_game_multi.classList.remove('active');
                    multiplayer_btn.style.display = 'block';
                    custom_ta_game_multi.style.visibility = 'visible';
                    (0, init_skin_perso_multi_js_1.disable_skin_and_save_multi)();
                });
            }
            else {
                console.log('Skin perso is inactive');
                if (choose_your_skin_game_multi.classList.contains('active')) {
                    choose_your_skin_game_multi.classList.remove('active');
                    multiplayer_btn.style.display = 'block';
                    custom_ta_game_multi.style.visibility = 'visible';
                    (0, init_skin_perso_multi_js_1.disable_skin_multi)();
                }
            }
        });
        switch_skn_left_id1_game_multi.addEventListener('click', function () {
            console.log('Switch skin left id1 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player1_left_multi)();
        });
        switch_skn_right_id1_game_multi.addEventListener('click', function () {
            console.log('Switch skin right id1 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player1_right_multi)();
        });
        switch_skn_left_id2_game_multi.addEventListener('click', function () {
            console.log('Switch skin left id2 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player2_left_multi)();
        });
        switch_skn_right_id2_game_multi.addEventListener('click', function () {
            console.log('Switch skin right id2 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player2_right_multi)();
        });
        switch_skn_left_id3_game_multi.addEventListener('click', function () {
            console.log('Switch skin left id3 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player3_left_multi)();
        });
        switch_skn_right_id3_game_multi.addEventListener('click', function () {
            console.log('Switch skin right id3 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player3_right_multi)();
        });
        switch_skn_left_id4_game_multi.addEventListener('click', function () {
            console.log('Switch skin left id4 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player4_left_multi)();
        });
        switch_skn_right_id4_game_multi.addEventListener('click', function () {
            console.log('Switch skin right id4 clicked');
            (0, init_skin_perso_multi_js_1.switch_skin_perso_player4_right_multi)();
        });
        /***********************************************************************/
        /**************************POWER_UP_INFO*******************************/
        /***********************************************************************/
        var power_up_info_id = document.getElementById('power_up_info_id');
        var container_info_power_up = document.getElementById('container_info_power_up');
        var exit_powerUP_info = document.getElementById('exit_powerUP_info');
        power_up_info_id.addEventListener('click', function () {
            container_info_power_up.classList.add('active');
            view6.classList.remove('active');
            back_to_select_mode_view6.classList.remove('active');
        });
        exit_powerUP_info.addEventListener('click', function () {
            container_info_power_up.classList.remove('active');
            view6.classList.add('active');
            back_to_select_mode_view6.classList.add('active');
        });
        /***********************************************************************/
        /**************************POWER_UP_INFO_MULTI*************************/
        /***********************************************************************/
        var power_up_info_id_multi = document.getElementById('power_up_info_id_multi');
        var container_info_power_up_multi = document.getElementById('container_info_power_up_multi');
        var exit_powerUP_info_multi = document.getElementById('exit_powerUP_info_multi');
        power_up_info_id_multi.addEventListener('click', function () {
            container_info_power_up_multi.classList.add('active');
            view8.classList.remove('active');
            back_to_select_mode_view8.classList.remove('active');
        });
        exit_powerUP_info_multi.addEventListener('click', function () {
            container_info_power_up_multi.classList.remove('active');
            view8.classList.add('active');
            back_to_select_mode_view8.classList.add('active');
        });
        /***********************************************************************/
        /*************************PARRAMETRE JEU ET PROFILE*********************/
        /***********************************************************************/
        var parametre_jeu = document.getElementById('parrametre_jeux_btn');
        var parametre_profile = document.getElementById('profile_parrametre_btn');
        var parametre_jeu_view = document.getElementById('parametres_jeu');
        var parametre_profile_view = document.getElementById('parametres_profile');
        var container_menu = document.getElementById('container');
        parametre_jeu.addEventListener('click', function () {
            console.log('Parrametre jeu clicked');
            parametre_jeu_view.classList.add('active');
            view5.classList.remove('active');
            btn_back_home.classList.remove('active');
            view1.classList.remove('active');
            container_menu.classList.add('active');
            btn_back_home.classList.add('active');
        });
        parametre_profile.addEventListener('click', function () {
            console.log('Parrametre profile clicked');
            parametre_profile_view.classList.add('active');
            view5.classList.remove('active');
            btn_back_home.classList.remove('active');
            view1.classList.remove('active');
            btn_back_home.classList.add('active');
        });
        btn_back_home.addEventListener('click', function () {
            if (parametre_jeu_view.classList.contains('active')) {
                parametre_jeu_view.classList.remove('active');
                view5.classList.add('active');
                // btn_back_home.classList.remove('active');
                view1.classList.add('active');
                container_menu.classList.remove('active');
            }
            if (parametre_profile_view.classList.contains('active')) {
                parametre_profile_view.classList.remove('active');
                view5.classList.add('active');
                // btn_back_home.classList.remove('active');
                view1.classList.add('active');
            }
        });
        /***********************************************************************/
        /*************************Parametre_profil******************************/
        /***********************************************************************/
        var valid_mdp = document.getElementById('valid_mdp');
        var modif_profil = document.getElementById('modif_profil');
        // const modif_profil_photo = document.getElementById('profile_photo_circle');
        var profile_param_unlocked_id = document.getElementById('profile_param_unlocked_id');
        var valid_profile_info = document.getElementById('valid_profile_info');
        var fa_selector = document.getElementById('fa_selector');
        var active_fa = document.getElementById('active_fa');
        // valid_mdp.addEventListener('click', () => {
        // 	console.log('Valide mdp clicked');
        // 	modif_profil.classList.add('hidden');
        // 	btn_back_home.classList.remove('active');
        // 	profile_param_unlocked_id.classList.add('active');
        // });
        // modif_profil_photo.addEventListener('click', () => {
        // 	console.log('modif profile photo clicked');
        // 	document.getElementById("profile_photo_input").click();
        // 	changeProfilePicture();
        // });
        // valid_profile_info.addEventListener('click', () => {
        // 	console.log('Valide profile info clicked');
        // 	profile_param_unlocked_id.classList.remove('active');
        // 	modif_profil.classList.remove('hidden');
        // 	btn_back_home.classList.add('active');
        // });
        active_fa.addEventListener('click', function () {
            active_fa.classList.toggle('checked');
            if (active_fa.classList.contains('checked')) {
                console.log('FA is active');
                fa_selector.classList.add('active');
            }
            else {
                console.log('FA is inactive');
                fa_selector.classList.remove('active');
            }
        });
        /***********************************************************************/
        /*************************platformer************************************/
        /***********************************************************************/
        var platformer = document.getElementById('platformer_view');
        platformer.addEventListener('click', function () {
            console.log('Platformer button clicked');
            (0, camera_js_1.handleViewTransitions)("platformer", "vue2");
        });
        /***********************************************************************/
        /*************************Option deconnected****************************/
        /***********************************************************************/
        var option_deconnect = document.getElementById('option_deconnect');
        var option_btn = document.getElementById('option_btn');
        var option_deconnected_btn = document.getElementById('option_deconnected_btn');
        option_btn.addEventListener('click', function () {
            console.log('Option deconnect clicked');
            option_deconnect.classList.add('active');
            view5.classList.remove('active');
            btn_back_home.classList.remove('active');
            view1.classList.remove('active');
        });
        option_deconnected_btn.addEventListener('click', function () {
            console.log('Option deconnect back clicked');
            option_deconnect.classList.remove('active');
            view5.classList.add('active');
            btn_back_home.classList.add('active');
            view1.classList.add('active');
        });
    };
    return Game_menu;
}(AbstractView_js_1.default));
exports.default = Game_menu;
function getPowerUP_value() {
    return powerUP_nb;
}
function getPowerUP_value_multi() {
    return powerUP_nb_multi;
}
