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
var camera_js_1 = require("../../../srcs/game/gameplay/views/camera.js");
var AbstractView_js_1 = require("./AbstractView.js");
var babylon_js_1 = require("../../../srcs/game/gameplay/babylon.js");
var score_js_1 = require("../../../srcs/game/gameplay/score.js");
var count = 0;
var tournamentStarted = false;
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        var _this = _super.call(this) || this;
        _this.setTitle("Tournament");
        if (window.location.pathname === "/tournament") {
            _this.gameLoop = setInterval(function () { return _this.checktournamentstart(); }, 1000);
        }
        return _this;
        // tournamentStarted = localStorage.getItem('tournamentStarted') === 'true';
    }
    default_1.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /*html*/ "\n\t\t<link rel=\"stylesheet\" href=\"./static/js/css/tournament.css\">\n\t\t<link href=\"https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap\" rel=\"stylesheet\">\n\t\t<div class=\"tournament_view\" id=\"tournament_view\">\n\t\t\t<div class=\"tournament_view-content\">\n\t\t\t\t<h1>TOURNAMENT</h1>\n\t\t\t\t<button id=\"start_tournament\" class=\"btn_start_tournament\">START</button>\n\t\t\t\t<button id=\"back_to_menu_view_tournament\" class=\"btn_back_tournament\">BACK</button>\n\t\t\t\t<div class=\"container_name_player\" id=\"container_name_player\">\n\t\t\t\t\t<h1>Customize your name</h1>\n\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t<label for=\"player1\">player 1</label>\n\t\t\t\t\t\t<input type=\"text\" id=\"player1\" class=\"input_name_player\" placeholder=\"Player name 1\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t<label for=\"player2\">player 2</label>\n\t\t\t\t\t\t<input type=\"text\" id=\"player2\" class=\"input_name_player\" placeholder=\"Player namer 2\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t<label for=\"player3\">player 3</label>\n\t\t\t\t\t\t<input type=\"text\" id=\"player3\" class=\"input_name_player\" placeholder=\"Player namer 3\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t<label for=\"player4\">player 4</label>\n\t\t\t\t\t\t<input type=\"text\" id=\"player4\" class=\"input_name_player\" placeholder=\"Player namer 4\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<button id=\"continue\" class=\"continue_btn\">OK</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"tournament_graphic\" id=\"tournament_graphic_id\">\n\t\t\t\t\t<p class=\"winnerBracket\" id=\"winnerBracket_id\">Winner Bracket</p>\n\t\t\t\t\t<p class=\"loserBracket\" id=\"loserBracket_id\">Loser Bracket</p>\n\t\t\t\t\t<p class=\"joueur1\" id=\"joueur1_id\">joueur 1</p>\n\t\t\t\t\t<p class=\"joueur2\" id=\"joueur2_id\">joueur 2</p>\n\t\t\t\t\t<p class=\"joueur3\" id=\"joueur3_id\">joueur 3</p>\n\t\t\t\t\t<p class=\"joueur4\" id=\"joueur4_id\">joueur 4</p>\n\t\t\t\t\t<img src=\"../../../srcs/game/assets/image/tournament_with_bracket.svg\" alt=\"tournament\">\n\t\t\t\t\t<button id=\"start_game\" class=\"btn_start_game\">\n\t\t\t\t\t\t<a href=\"/tournament_game\" class=\"nav-link\" data-link>JOUER</a>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button id=\"finiched_game\" class=\"btn_finished_game\">FINISHED</button>\n\t\t\t\t\t<button id=\"leave_tournament\" class=\"btn_leave_tournament\">X</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"message\" id=\"message_id\">\n\t\t\t\t\t<p>ATTENTION : Si vous quittez le tournoi, vous ne pourrez pas revenir en arri\u00E8re.</p>\n\t\t\t\t\t<button class=\"close_message\" id=\"close_message_id\">X</button>\n\t\t\t\t\t<button class=\"comfirm_leave_tournament\" id=\"confirm_leave_tournament\">Quitter le tournoi</button>\n\t\t\t\t</div>\n\t\t\t</div>\t\n\t\t</div>\n\t"];
            });
        });
    };
    default_1.prototype.exit_tournament = function () {
        document.getElementById('back_to_menu_view_tournament').addEventListener('click', function () {
            (0, camera_js_1.handleViewTransitions)('vue2', 'tournament');
            window.history.back();
        });
    };
    default_1.prototype.start_tournament_game = function () {
        document.getElementById('start_game').addEventListener('click', function () {
            console.log('Start game clicked');
            (0, camera_js_1.handleViewTransitions)('tournament_game_start', 'tournament');
            (0, babylon_js_1.startTournamentGame)();
            count = parseInt(localStorage.getItem('tournamentCount')) || 0;
            count++;
            localStorage.setItem('tournamentCount', count.toString());
            if (count >= 6) {
                var start_game = document.getElementById('start_game');
                start_game.style.display = 'none';
                var finiched_game = document.getElementById('finiched_game');
                finiched_game.style.display = 'block';
            }
        });
    };
    default_1.prototype.init_tournament = function () {
        var joueur1_id = document.getElementById('joueur1_id');
        var joueur2_id = document.getElementById('joueur2_id');
        var joueur3_id = document.getElementById('joueur3_id');
        var joueur4_id = document.getElementById('joueur4_id');
        updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id);
        var countFromStorage = parseInt(localStorage.getItem('tournamentCount')) || 0;
        console.log('Tournament count:', count);
        console.log('Tournament started:', tournamentStarted);
        console.log('Tournament count from storage:', countFromStorage);
        if (countFromStorage >= 6) {
            var startGameBtn = document.getElementById('start_game');
            var finishGameBtn = document.getElementById('finiched_game');
            if (startGameBtn)
                startGameBtn.style.display = 'none';
            if (finishGameBtn)
                finishGameBtn.style.display = 'block';
        }
        else {
            var finishGameBtn = document.getElementById('finiched_game');
            if (finishGameBtn)
                finishGameBtn.style.display = 'none';
        }
    };
    default_1.prototype.tournament_event = function () {
        var start_tournament = document.getElementById('start_tournament');
        var container_name_player = document.getElementById('container_name_player');
        var tournament_graphic_id = document.getElementById('tournament_graphic_id');
        var back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
        var finish_tournament = document.getElementById('finiched_game');
        start_tournament.addEventListener('click', function () {
            tournamentStarted = true;
            localStorage.setItem('tournamentStarted', tournamentStarted.toString());
            container_name_player.classList.add('hidden');
            tournament_graphic_id.classList.add('active');
            start_tournament.style.display = 'none';
            back_to_menu_view_tournament.style.display = 'none';
        });
        var leave_tournament = document.getElementById('leave_tournament');
        var message_id = document.getElementById('message_id');
        leave_tournament.addEventListener('click', function () {
            message_id.classList.add('active');
            tournament_graphic_id.style.filter = "blur(5px)";
            tournament_graphic_id.style.pointerEvents = "none";
        });
        var close_message = document.getElementById('close_message_id');
        close_message.addEventListener('click', function () {
            message_id.classList.remove('active');
            tournament_graphic_id.style.filter = "none";
            tournament_graphic_id.style.pointerEvents = "auto";
        });
        var confirm_leave_tournament = document.getElementById('confirm_leave_tournament');
        // Get the player elements
        var joueur1_id = document.getElementById('joueur1_id');
        var joueur2_id = document.getElementById('joueur2_id');
        var joueur3_id = document.getElementById('joueur3_id');
        var joueur4_id = document.getElementById('joueur4_id');
        confirm_leave_tournament.addEventListener('click', function () {
            message_id.classList.remove('active');
            tournament_graphic_id.style.filter = "none";
            tournament_graphic_id.style.pointerEvents = "auto";
            tournament_graphic_id.classList.remove('active');
            container_name_player.classList.remove('hidden');
            tournamentStarted = false;
            resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
            back_to_menu_view_tournament.style.display = 'block';
            start_tournament.style.display = 'block';
        });
        finish_tournament.addEventListener('click', function () {
            tournament_graphic_id.classList.remove('active');
            container_name_player.classList.remove('hidden');
            tournamentStarted = false;
            resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
            back_to_menu_view_tournament.style.display = 'block';
            start_tournament.style.display = 'block';
            count = 0;
            localStorage.setItem('tournamentCount', count.toString());
        });
    };
    default_1.prototype.checktournamentstart = function () {
        if (window.location.pathname === "/tournament") {
            // Récupérer tous les éléments nécessaires
            var container_name_player = document.getElementById('container_name_player');
            var tournament_graphic_id = document.getElementById('tournament_graphic_id');
            var start_tournament = document.getElementById('start_tournament');
            var back_to_menu_view_tournament = document.getElementById('back_to_menu_view_tournament');
            // Vérifier que tous les éléments existent avant de les manipuler
            if (!container_name_player || !tournament_graphic_id || !start_tournament || !back_to_menu_view_tournament) {
                return; // Sortir de la fonction si un élément est manquant
            }
            if (tournamentStarted == true) {
                container_name_player.classList.add('hidden');
                tournament_graphic_id.classList.add('active');
                start_tournament.style.display = 'none';
                back_to_menu_view_tournament.style.display = 'none';
            }
            else {
                if (container_name_player.classList.contains('hidden')) {
                    container_name_player.classList.remove('hidden');
                    tournament_graphic_id.classList.remove('active');
                    start_tournament.style.display = 'block';
                    back_to_menu_view_tournament.style.display = 'block';
                }
            }
        }
    };
    return default_1;
}(AbstractView_js_1.default));
exports.default = default_1;
var POSITIONS = {
    round1: {
        player1: { top: '', left: '' },
        player2: { top: '', left: '' },
        player3: { top: '', left: '' },
        player4: { top: '', left: '' }
    },
    quart_winner: {
        winner1_2: { top: '12%', left: '38%' },
        loser1_2: { top: '62%', left: '24%' },
        winner3_4: { top: '32%', left: '38%' },
        loser3_4: { top: '70%', left: '24%' },
    },
    quart_loser: {
        winner: { top: '67%', left: '38%' },
    },
    demi_winer: {
        winner: { top: '34%', left: '58%' },
        loser: { top: '75%', left: '38%' },
    },
    demi_loser: {
        winner: { top: '43%', left: '58%' },
    },
    grande_final: {
        winner: { top: '38%', left: '72%' },
    },
};
function resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id) {
    // count = 0;
    localStorage.setItem('tournamentCount', count.toString());
    var joueurs = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
    joueurs.forEach(function (joueur) {
        joueur.style.top = '';
        joueur.style.left = '';
        joueur.style.color = 'white';
    });
}
function updateTournamentState(count, joueur1_id, joueur2_id, joueur3_id, joueur4_id) {
    resetTournamentState(joueur1_id, joueur2_id, joueur3_id, joueur4_id);
    console.log('Count:', count);
    var match1_winner, match1_loser, match2_winner, match2_loser, match3_winner, match3_loser, match4_winner, match4_loser, match5_winner, match5_loser, match6_winner, match6_loser;
    if (count >= 0) {
        var players = [joueur1_id, joueur2_id, joueur3_id, joueur4_id];
        var positions_1 = Object.values(POSITIONS.round1);
        players.forEach(function (joueur, index) {
            joueur.style.top = positions_1[index].top;
            joueur.style.left = positions_1[index].left;
            joueur.style.color = 'white';
            highlightNextPlayers(joueur1_id, joueur2_id);
        });
    }
    if (count >= 1) {
        resetHighlight([joueur1_id, joueur2_id]);
        console.log('Match 1');
        console.log("round1");
        var player1_wins = (0, score_js_1.getPlayer_1_win)();
        if (player1_wins) {
            match1_winner = joueur1_id;
            match1_loser = joueur2_id;
        }
        else {
            match1_winner = joueur2_id;
            match1_loser = joueur1_id;
        }
        match1_winner.style.top = POSITIONS.quart_winner.winner1_2.top;
        match1_winner.style.left = POSITIONS.quart_winner.winner1_2.left;
        match1_loser.style.top = POSITIONS.quart_winner.loser1_2.top;
        match1_loser.style.left = POSITIONS.quart_winner.loser1_2.left;
        highlightNextPlayers(joueur3_id, joueur4_id);
    }
    if (count >= 2) {
        resetHighlight([joueur3_id, joueur4_id]);
        console.log('Match 2');
        console.log("round2");
        var player1_wins = (0, score_js_1.getPlayer_1_win)();
        if (player1_wins) {
            match2_winner = joueur3_id;
            match2_loser = joueur4_id;
        }
        else {
            match2_winner = joueur4_id;
            match2_loser = joueur3_id;
        }
        match2_winner.style.top = POSITIONS.quart_winner.winner3_4.top;
        match2_winner.style.left = POSITIONS.quart_winner.winner3_4.left;
        match2_loser.style.top = POSITIONS.quart_winner.loser3_4.top;
        match2_loser.style.left = POSITIONS.quart_winner.loser3_4.left;
        highlightNextPlayers(match1_loser, match2_loser);
    }
    if (count >= 3 && match1_loser && match2_loser) {
        resetHighlight([match1_loser, match2_loser]);
        var quart_loser_bracket = (0, score_js_1.getPlayer_1_win)();
        if (quart_loser_bracket) {
            match3_winner = match1_loser;
            match3_loser = match2_loser;
        }
        else {
            match3_winner = match1_loser;
            match3_loser = match2_loser;
        }
        match3_winner.style.top = POSITIONS.quart_loser.winner.top;
        match3_winner.style.left = POSITIONS.quart_loser.winner.left;
        match3_loser.style.color = 'red';
        highlightNextPlayers(match1_winner, match2_winner);
    }
    if (count >= 4 && match1_winner && match2_winner) {
        resetHighlight([match1_winner, match2_winner]);
        var demi_winner_bracket = (0, score_js_1.getPlayer_1_win)();
        if (demi_winner_bracket) {
            match4_winner = match1_winner;
            match4_loser = match2_winner;
        }
        else {
            match4_winner = match2_winner;
            match4_loser = match1_winner;
        }
        match4_winner.style.top = POSITIONS.demi_winer.winner.top;
        match4_winner.style.left = POSITIONS.demi_winer.winner.left;
        match4_loser.style.top = POSITIONS.demi_winer.loser.top;
        match4_loser.style.left = POSITIONS.demi_winer.loser.left;
        highlightNextPlayers(match3_winner, match4_loser);
    }
    if (count >= 5 && match3_loser && match4_loser) {
        resetHighlight([match3_loser, match4_loser]);
        var demi_loser_bracket = (0, score_js_1.getPlayer_1_win)();
        if (demi_loser_bracket) {
            match5_winner = match3_loser;
            match5_loser = match4_loser;
        }
        else {
            match5_winner = match4_loser;
            match5_loser = match3_loser;
        }
        match5_winner.style.top = POSITIONS.demi_loser.winner.top;
        match5_winner.style.left = POSITIONS.demi_loser.winner.left;
        match5_loser.style.color = 'red';
        highlightNextPlayers(match4_winner, match5_winner);
    }
    if (count >= 6 && match5_winner && match4_winner) {
        resetHighlight([match5_winner, match4_winner]);
        var grande_final_bracket = (0, score_js_1.getPlayer_1_win)();
        if (grande_final_bracket) {
            match6_winner = match5_winner;
            match6_loser = match4_winner;
        }
        else {
            match6_winner = match4_winner;
            match6_loser = match5_winner;
        }
        match6_winner.style.top = POSITIONS.grande_final.winner.top;
        match6_winner.style.left = POSITIONS.grande_final.winner.left;
        match6_loser.style.color = 'red';
    }
}
/**
 * Highlights the players who are currently active in the tournament
 * @param players - The players to highlight
 */
function highlightNextPlayers() {
    var players = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        players[_i] = arguments[_i];
    }
    // D'abord réinitialiser tous les joueurs
    var allPlayers = document.querySelectorAll('.player');
    allPlayers.forEach(function (p) {
        var player = p;
        player.style.filter = "brightness(1)";
        player.style.color = "";
        player.style.transform = "";
        player.style.textShadow = "";
        player.style.fontWeight = "";
    });
    // Mettre en évidence les joueurs actifs
    players.forEach(function (player) {
        if (player) {
            // Effet de lumière beaucoup plus prononcé
            player.style.filter = "brightness(2.0) saturate(2.0)";
            // Couleur de texte très visible
            player.style.color = "#FFFF00"; // Jaune vif
            // Légère mise à l'échelle pour attirer l'attention
            player.style.transform = "scale(1.1)";
            // Ajouter un halo de texte pour plus de luminosité
            player.style.textShadow = "0 0 10px rgba(255, 255, 0, 0.8)";
            // Texte en gras pour plus de visibilité
            player.style.fontWeight = "bold";
            // Transition douce pour les changements
            player.style.transition = "all 0.3s ease-in-out";
        }
    });
}
// Fonction pour réinitialiser la mise en évidence des joueurs
function resetHighlight(players) {
    players.forEach(function (player) {
        if (player) {
            player.style.filter = "brightness(1)";
            player.style.color = "";
            player.style.transform = "";
            player.style.textShadow = "";
            player.style.fontWeight = "";
            player.style.transition = "all 0.3s ease-in-out";
        }
    });
}
