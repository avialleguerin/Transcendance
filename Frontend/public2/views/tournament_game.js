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
var score_js_1 = require("../../../srcs/game/gameplay/score.js");
var babylon_js_1 = require("../../../srcs/game/gameplay/babylon.js");
var camera_js_1 = require("../../../srcs/game/gameplay/views/camera.js");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        var _this = _super.call(this) || this;
        _this.setTitle("Tournament");
        _this.cooldowns = {};
        _this.cooldownTimes = {
            " ": 1000,
        };
        _this.boundKeyPressHandler = _this.handleKeyPress.bind(_this);
        document.addEventListener("keydown", _this.boundKeyPressHandler);
        if (window.location.pathname === "/tournament_game") {
            _this.gameLoop = setInterval(function () { _this.checkGameOver_tournament(); 1000; });
        }
        return _this;
    }
    default_1.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /*html*/ "\n\t\t<link rel=\"stylesheet\" href=\"./static/js/css/tournament_game.css\">\n\t\t<link href=\"https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap\" rel=\"stylesheet\">\n\t\t<div class=\"press_space\" >\n\t\t\t<h1 id=\"press_space_id\">Press SPACE to Start</h1>\n\t\t</div>\n\t\t<div class=\"container-EndGame\">\n\t\t\t<div class=\"winner\">\n\t\t\t\t<h1 id=\"winner_id\"></h1>\n\t\t\t</div>\n\t\t\t<button class=\"leave_game_2\" id=\"leave_game_2_id\">Quitter la partie</button>\n\t\t</div>\n\t</div>\n\t"];
            });
        });
    };
    default_1.prototype.handleKeyPress = function (event) {
        var key = event.key;
        if (!(key in this.cooldownTimes))
            return;
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
        }
    };
    default_1.prototype.checkGameOver_tournament = function () {
        if (window.location.pathname !== "/tournament_game")
            return;
        var winnerContainer = document.querySelector(".container-EndGame");
        var player_1_win = (0, score_js_1.getPlayer_1_win)();
        var player_2_win = (0, score_js_1.getPlayer_2_win)();
        if (!winnerContainer)
            return;
        if ((0, score_js_1.isGameFinished)()) {
            winnerContainer.classList.add("active");
            clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
            if (player_1_win) {
                document.getElementById("winner_id").innerHTML = "Player 1 Win";
            }
            else if (player_2_win) {
                document.getElementById("winner_id").innerHTML = "Player 2 Win";
            }
        }
        else {
            winnerContainer.classList.remove("active");
        }
    };
    default_1.prototype.event_tournament_game = function () {
        var _this = this;
        var leave_game_2 = document.getElementById("leave_game_2_id");
        leave_game_2.addEventListener("click", function () {
            window.history.back();
            clearInterval(_this.gameLoop); // Arrête la boucle quand la partie est finie
            (0, camera_js_1.handleViewTransitions)('tournament', 'vue4');
            console.log("Destruction de l'environnement et des objets du jeu");
            setTimeout(function () {
                (0, babylon_js_1.leave_tournament_game)();
            }, 1500);
        });
    };
    return default_1;
}(AbstractView_js_1.default));
exports.default = default_1;
