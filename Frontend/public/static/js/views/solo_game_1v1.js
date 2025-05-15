import AbstractView from "./AbstractView.js";
import { getPowerUP_value } from "./Game_menu.js";
import { leave_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { setLeaveGameVar } from "../index.js";
import { isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { disable_skin_perso_player_first_and_seconde } from "../../../srcs/game/gameplay/solo/skin/init_skin_player_podium.js";
import { getPlayer_1_win, getPlayer_2_win } from "../../../srcs/game/gameplay/score.js";
let spacePressed = false;
export default class solo_game extends AbstractView {
    constructor() {
        super();
        this.setTitle("solo_game");
        this.cooldowns = {};
        this.cooldownTimes = {
            "z": 15000,
            "x": 20000,
            "c": 15000,
            "1": 15000,
            "2": 20000,
            "3": 15000,
            "t": 1000,
            " ": 1000,
        };
        this.boundKeyPressHandler = this.handleKeyPress.bind(this);
        console.log("solo_game_1v1.js");
        document.addEventListener("keydown", this.boundKeyPressHandler);
        if (window.location.pathname === "/solo_game_1v1") {
            this.gameLoop = setInterval(() => { this.checkGameOver(); 1000; });
        }
    }
    async getHtml() {
        return /*html*/ `
			<link rel="stylesheet" href="./static/js/css/solo_game_1v1.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="press_space" >
					<h1 id="press_space_id">Press SPACE to Start</h1>
				</div>
				<div class="container-leave">
					<button class="option" id="option_btn">
						<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
					</button>
				</div>
				<div class="panel" id="panel_id">
					<button class="option-in-panel" id="option_btn-remove">
						<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
					</button>
					<button class="leave_game" id="leave_game_id">Leave Game</button>
				</div>

				<div class="container-Player1" id="container-player1_id">
					<h1>Player 1</h1>
					<div class="container-item_player1">
						<p id="nb-item-grenade-1"></p>
						<p class="touch_player1">Z</p>
						<div class="item-circle" id="item-circle-grenade1">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-1"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-1"></div>
						</div>
						<p id="nb-item-teammate-1"></p>
						<p class="touch_player1">X</p>
						<div class="item-circle" id="item-circle-teammate1">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-1"></div>
							<div class="overlay-reloading-teammate" id="overlay-reloading-teammate-1"></div>
						</div>
						<p id="nb-item-autre-1"></p>
						<p class="touch_player1">C</p>
						<div class="item-circle" id="item-circle-inverse1">
							<img src="../../../srcs/game/assets/image/inverse_powerUP.png" alt="Item 3">
							<div class="overlay" id="overlay-inverse-1"></div>
							<div class="overlay-reloading" id="overlay-reloading-inverse-1"></div>
						</div>
					</div>
				</div>
				<div class="container-Player2" id="container-player2_id">
					<h1>Player 2</h1>
					<div class="container-item_player2">
						<p id="nb-item-grenade-2"></p>
						<p class="touch_player2">1</p>
						<div class="item-circle" id="item-circle-grenade2">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-2"></div>
						</div>
						<p id="nb-item-teammate-2"></p>
						<p class="touch_player2">2</p>
						<div class="item-circle" id="item-circle-teammate2">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-2"></div>
							<div class="overlay-reloading-teammate" id="overlay-reloading-teammate-2"></div>
						</div>
						<p id="nb-item-autre-2"></p>
						<p class="touch_player2">3</p>
						<div class="item-circle" id="item-circle-inverse2">
							<img src="../../../srcs/game/assets/image/inverse_powerUP.png" alt="Item 3">
							<div class="overlay" id="overlay-inverse-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-inverse-2"></div>
						</div>
					</div>
				</div>
				<div class="container-EndGame">
					<div class="winner">
						<h1 id="winner_id"></h1>
					</div>
					<div class="looser">
						<h1 id="looser_id"></h1>
					</div>
					<button class="leave_game_2" id="leave_game_2_id">Quitter la partie</button>
				</div>
			</div>
		`;
    }
    cleanup() {
        document.removeEventListener("keydown", this.boundKeyPressHandler);
        clearInterval(this.gameLoop);
    }
    leave_game() {
        document.getElementById("leave_game_id").addEventListener("click", () => {
            this.cleanup();
            setLeaveGameVar(true);
            spacePressed = false;
            handleViewTransitions("vue2", "vue4");
            setTimeout(() => {
                window.history.back();
                leave_Game();
            }, 1500);
        });
    }
    leave_game_2() {
        document.getElementById("leave_game_2_id").addEventListener("click", () => {
            this.cleanup();
            setLeaveGameVar(true);
            disable_skin_perso_player_first_and_seconde();
            spacePressed = false;
            handleViewTransitions("vue2", "vue4");
            setTimeout(() => {
                window.history.back();
                leave_Game();
            }, 1500);
        });
    }
    init_powerUP_player() {
        console.log("powerUP value == ", getPowerUP_value());
        const container_player1 = document.getElementById("container-player1_id");
        const container_player2 = document.getElementById("container-player2_id");
        if (getPowerUP_value() !== 0) {
            console.log("powerUP valueje reeeeedjkhkjefwhjkewhfkjwe == ", getPowerUP_value());
            container_player1.classList.add("active");
            container_player2.classList.add("active");
        }
        else {
            console.log(" else    powerUP valueje reeeeedjkhkjefwhjkewhfkjwe == ", getPowerUP_value());
            if (container_player1.classList.contains("active"))
                container_player1.classList.remove("active");
            if (container_player2.classList.contains("active"))
                container_player2.classList.remove("active");
        }
        document.getElementById("nb-item-grenade-1").innerHTML = getPowerUP_value().toString();
        document.getElementById("nb-item-teammate-1").innerHTML = getPowerUP_value().toString();
        document.getElementById("nb-item-autre-1").innerHTML = getPowerUP_value().toString();
        document.getElementById("nb-item-grenade-2").innerHTML = getPowerUP_value().toString();
        document.getElementById("nb-item-teammate-2").innerHTML = getPowerUP_value().toString();
        document.getElementById("nb-item-autre-2").innerHTML = getPowerUP_value().toString();
    }
    updateOverlays() {
        const nb_powerUP_grenade_player1 = parseInt(document.getElementById("nb-item-grenade-1").innerHTML, 10);
        const nb_powerUP_grenade_player2 = parseInt(document.getElementById("nb-item-grenade-2").innerHTML, 10);
        const nb_powerUP_teammate_player1 = parseInt(document.getElementById("nb-item-teammate-1").innerHTML, 10);
        const nb_powerUP_teammate_player2 = parseInt(document.getElementById("nb-item-teammate-2").innerHTML, 10);
        const nb_powerUP_inverse_player1 = parseInt(document.getElementById("nb-item-autre-1").innerHTML, 10);
        const nb_powerUP_inverse_player2 = parseInt(document.getElementById("nb-item-autre-2").innerHTML, 10);
        document.getElementById("overlay-grenade-1").classList.toggle("active", nb_powerUP_grenade_player1 === 0);
        document.getElementById("overlay-grenade-2").classList.toggle("active", nb_powerUP_grenade_player2 === 0);
        document.getElementById("overlay-teammate-1").classList.toggle("active", nb_powerUP_teammate_player1 === 0);
        document.getElementById("overlay-teammate-2").classList.toggle("active", nb_powerUP_teammate_player2 === 0);
        document.getElementById("overlay-inverse-1").classList.toggle("active", nb_powerUP_inverse_player1 === 0);
        document.getElementById("overlay-inverse-2").classList.toggle("active", nb_powerUP_inverse_player2 === 0);
    }
    handleKeyPress(event) {
        console.log("Key pressed:", event.key);
        const key = event.key;
        // Vérifier si la touche a un cooldown défini
        if (!(key in this.cooldownTimes))
            return;
        // Vérifier si la touche est en cooldown
        if (this.cooldowns[key])
            return; // Ignore l'action si en cooldown
        if (key === " ") {
            const press_space = document.getElementById("press_space_id");
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
            let elem = null;
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
                let currentValue = parseInt(elem.innerHTML, 10);
                if (currentValue > 0) {
                    elem.innerHTML = (currentValue - 1).toString(); //NOTE - jai changer le type pour que ca passe ici
                    console.log(`${key} utilisé, cooldown activé pour ${this.cooldownTimes[key]}ms`);
                    // Mettre en cooldown cette touche
                    this.cooldowns[key] = true;
                    // Ajouter la classe d'animation pour démarrer l'overlay reloading
                    let itemCircle = null;
                    let overlayReloading = null;
                    let overlayReloading_teammate = null;
                    switch (key) {
                        case "z":
                            overlayReloading = document.getElementById("overlay-reloading-grenade-1");
                            itemCircle = document.getElementById("item-circle-grenade1");
                            break;
                        case "x":
                            overlayReloading_teammate = document.getElementById("overlay-reloading-teammate-1");
                            itemCircle = document.getElementById("item-circle-teammate1");
                            break;
                        case "c":
                            overlayReloading = document.getElementById("overlay-reloading-inverse-1");
                            itemCircle = document.getElementById("item-circle-inverse1");
                            break;
                        case "1":
                            overlayReloading = document.getElementById("overlay-reloading-grenade-2");
                            itemCircle = document.getElementById("item-circle-grenade2");
                            break;
                        case "2":
                            overlayReloading_teammate = document.getElementById("overlay-reloading-teammate-2");
                            itemCircle = document.getElementById("item-circle-teammate2");
                            break;
                        case "3":
                            overlayReloading = document.getElementById("overlay-reloading-inverse-2");
                            itemCircle = document.getElementById("item-circle-inverse2");
                            break;
                    }
                    if (currentValue - 1 === 0) {
                        itemCircle.classList.add("active");
                        this.updateOverlays();
                        return;
                    }
                    if (overlayReloading && currentValue - 1 !== 0) {
                        // Lancer l'animation en ajoutant une classe CSS pour démarrer
                        overlayReloading.classList.add("active"); // Assurez-vous que .item-loading est défini dans votre CSS
                    }
                    if (itemCircle) {
                        itemCircle.classList.add("active");
                    }
                    if (overlayReloading_teammate && currentValue - 1 !== 0) {
                        // Lancer l'animation en ajoutant une classe CSS pour démarrer
                        overlayReloading_teammate.classList.add("active"); // Assurez-vous que .item-loading est défini dans votre CSS
                    }
                    // Retirer le cooldown après le délai défini pour cette touche
                    setTimeout(() => {
                        // Terminer le cooldown et arrêter l'animation
                        delete this.cooldowns[key];
                        console.log(`${key} cooldown terminé`);
                        // Retirer la classe d'animation après le cooldown
                        if (overlayReloading && currentValue - 1 !== 0) {
                            overlayReloading.classList.remove("active");
                        }
                        if (overlayReloading_teammate && currentValue - 1 !== 0) {
                            overlayReloading_teammate.classList.remove("active");
                        }
                        if (itemCircle && currentValue - 1 !== 0) {
                            itemCircle.classList.remove("active");
                        }
                    }, this.cooldownTimes[key]);
                }
            }
        }
    }
    event_solo_game() {
        const option = document.getElementById("option_btn");
        const panel = document.getElementById("panel_id");
        const option_remove = document.getElementById("option_btn-remove");
        option.addEventListener("click", () => {
            console.log("option clicked");
            panel.classList.add("active");
            panel.classList.remove("remove");
            option.classList.add("active");
        });
        option_remove.addEventListener("click", () => {
            console.log("option_remove clicked");
            panel.classList.add("remove");
            option.classList.remove("active");
            setTimeout(() => {
                panel.classList.remove("active");
            }, 1100);
        });
    }
    checkGameOver() {
        if (window.location.pathname !== "/solo_game_1v1")
            return;
        const winnerContainer = document.querySelector(".container-EndGame");
        let player_1_win = getPlayer_1_win();
        let player_2_win = getPlayer_2_win();
        if (!winnerContainer)
            return;
        if (isGameFinished()) {
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sb19nYW1lXzF2MS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvbG9fZ2FtZV8xdjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBdUIsZUFBZSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsMkNBQTJDLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUMvSCxPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXhGLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztBQUV6QixNQUFNLENBQUMsT0FBTyxPQUFPLFNBQVUsU0FBUSxZQUFZO0lBT2xEO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDcEIsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLElBQUk7WUFDVCxHQUFHLEVBQUUsSUFBSTtTQUNULENBQUM7UUFFRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7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OlsiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IGdldFBvd2VyVVBfdmFsdWUgfSBmcm9tIFwiLi9HYW1lX21lbnUuanNcIjtcbmltcG9ydCB7IGxlYXZlX0dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBnZXRWYWx1ZV9sZWF2ZV9nYW1lLCBzZXRMZWF2ZUdhbWVWYXIgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IGlzR2FtZUZpbmlzaGVkIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xuaW1wb3J0IHsgZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9maXJzdF9hbmRfc2Vjb25kZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc29sby9za2luL2luaXRfc2tpbl9wbGF5ZXJfcG9kaXVtLmpzXCI7XG5pbXBvcnQgeyBnZXRQbGF5ZXJfMV93aW4sIGdldFBsYXllcl8yX3dpbiB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc2NvcmUuanNcIjtcblxubGV0IHNwYWNlUHJlc3NlZCA9IGZhbHNlO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBzb2xvX2dhbWUgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXG5cdGNvb2xkb3duczogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH07XG5cdGNvb2xkb3duVGltZXM6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG5cdGJvdW5kS2V5UHJlc3NIYW5kbGVyOiAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ7XG5cdGdhbWVMb29wOiBOb2RlSlMuVGltZW91dCB8IG51bGw7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwic29sb19nYW1lXCIpO1xuXG5cdFx0dGhpcy5jb29sZG93bnMgPSB7fTtcblxuXHRcdHRoaXMuY29vbGRvd25UaW1lcyA9IHtcblx0XHRcdFwielwiOiAxNTAwMCxcblx0XHRcdFwieFwiOiAyMDAwMCxcblx0XHRcdFwiY1wiOiAxNTAwMCxcblx0XHRcdFwiMVwiOiAxNTAwMCxcblx0XHRcdFwiMlwiOiAyMDAwMCxcblx0XHRcdFwiM1wiOiAxNTAwMCxcblx0XHRcdFwidFwiOiAxMDAwLFxuXHRcdFx0XCIgXCI6IDEwMDAsXG5cdFx0fTtcblxuXHRcdHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIgPSB0aGlzLmhhbmRsZUtleVByZXNzLmJpbmQodGhpcyk7XG4gICAgXG5cdFx0Y29uc29sZS5sb2coXCJzb2xvX2dhbWVfMXYxLmpzXCIpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gXCIvc29sb19nYW1lXzF2MVwiKSB7XG5cdFx0XHR0aGlzLmdhbWVMb29wID0gc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLmNoZWNrR2FtZU92ZXIoKTsgMTAwMCB9KTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIC8qaHRtbCovYFxuXHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3Mvc29sb19nYW1lXzF2MS5jc3NcIj5cblx0XHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJlc3Nfc3BhY2VcIiA+XG5cdFx0XHRcdFx0PGgxIGlkPVwicHJlc3Nfc3BhY2VfaWRcIj5QcmVzcyBTUEFDRSB0byBTdGFydDwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWxlYXZlXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm9wdGlvblwiIGlkPVwib3B0aW9uX2J0blwiPlxuXHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL21lbnUuc3ZnXCIgYWx0PVwibGVhdmVcIj5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwYW5lbFwiIGlkPVwicGFuZWxfaWRcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwib3B0aW9uLWluLXBhbmVsXCIgaWQ9XCJvcHRpb25fYnRuLXJlbW92ZVwiPlxuXHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL21lbnUuc3ZnXCIgYWx0PVwibGVhdmVcIj5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwibGVhdmVfZ2FtZVwiIGlkPVwibGVhdmVfZ2FtZV9pZFwiPkxlYXZlIEdhbWU8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1QbGF5ZXIxXCIgaWQ9XCJjb250YWluZXItcGxheWVyMV9pZFwiPlxuXHRcdFx0XHRcdDxoMT5QbGF5ZXIgMTwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1pdGVtX3BsYXllcjFcIj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1ncmVuYWRlLTFcIj48L3A+XG5cdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRvdWNoX3BsYXllcjFcIj5aPC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS1ncmVuYWRlMVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZ3JlbmFkZWZsYXNoVGVzdC5qcGdcIiBhbHQ9XCJJdGVtIDFcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktZ3JlbmFkZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZ1wiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctZ3JlbmFkZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS10ZWFtbWF0ZS0xXCI+PC9wPlxuXHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0b3VjaF9wbGF5ZXIxXCI+WDwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtdGVhbW1hdGUxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90ZWFtbWF0ZXYzLnBuZ1wiIGFsdD1cIkl0ZW0gMlwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS10ZWFtbWF0ZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZy10ZWFtbWF0ZVwiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tYXV0cmUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidG91Y2hfcGxheWVyMVwiPkM8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWludmVyc2UxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9pbnZlcnNlX3Bvd2VyVVAucG5nXCIgYWx0PVwiSXRlbSAzXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWludmVyc2UtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWludmVyc2UtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLVBsYXllcjJcIiBpZD1cImNvbnRhaW5lci1wbGF5ZXIyX2lkXCI+XG5cdFx0XHRcdFx0PGgxPlBsYXllciAyPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWl0ZW1fcGxheWVyMlwiPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWdyZW5hZGUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidG91Y2hfcGxheWVyMlwiPjE8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWdyZW5hZGUyXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlZmxhc2hUZXN0LmpwZ1wiIGFsdD1cIkl0ZW0gMVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1ncmVuYWRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLXRlYW1tYXRlLTJcIj48L3A+XG5cdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRvdWNoX3BsYXllcjJcIj4yPC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS10ZWFtbWF0ZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RlYW1tYXRldjMucG5nXCIgYWx0PVwiSXRlbSAyXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LXRlYW1tYXRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy10ZWFtbWF0ZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1hdXRyZS0yXCI+PC9wPlxuXHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0b3VjaF9wbGF5ZXIyXCI+MzwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtaW52ZXJzZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ludmVyc2VfcG93ZXJVUC5wbmdcIiBhbHQ9XCJJdGVtIDNcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktaW52ZXJzZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZ1wiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctaW52ZXJzZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItRW5kR2FtZVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ3aW5uZXJcIj5cblx0XHRcdFx0XHRcdDxoMSBpZD1cIndpbm5lcl9pZFwiPjwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImxvb3NlclwiPlxuXHRcdFx0XHRcdFx0PGgxIGlkPVwibG9vc2VyX2lkXCI+PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwibGVhdmVfZ2FtZV8yXCIgaWQ9XCJsZWF2ZV9nYW1lXzJfaWRcIj5RdWl0dGVyIGxhIHBhcnRpZTwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cblxuXHRjbGVhbnVwKCkge1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7XG5cdH1cblxuXHRsZWF2ZV9nYW1lKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV9pZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0XG5cdFx0XHR0aGlzLmNsZWFudXAoKTtcblx0XHRcdHNldExlYXZlR2FtZVZhcih0cnVlKTtcblx0XHRcdHNwYWNlUHJlc3NlZCA9IGZhbHNlO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlMlwiLCBcInZ1ZTRcIik7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0XHRsZWF2ZV9HYW1lKCk7XG5cdFx0XHR9LCAxNTAwKTtcblx0XHR9KTtcblx0fVxuXG5cdGxlYXZlX2dhbWVfMigpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlYXZlX2dhbWVfMl9pZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0XG5cdFx0XHR0aGlzLmNsZWFudXAoKTtcblx0XHRcdHNldExlYXZlR2FtZVZhcih0cnVlKTtcblx0XHRcdGRpc2FibGVfc2tpbl9wZXJzb19wbGF5ZXJfZmlyc3RfYW5kX3NlY29uZGUoKTtcblx0XHRcdHNwYWNlUHJlc3NlZCA9IGZhbHNlO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlMlwiLCBcInZ1ZTRcIik7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0XHRsZWF2ZV9HYW1lKCk7XG5cdFx0XHR9LCAxNTAwKTtcblx0XHR9KTtcblx0fVxuXHRcdFxuXG5cdGluaXRfcG93ZXJVUF9wbGF5ZXIoKSB7XG5cdFx0Y29uc29sZS5sb2coXCJwb3dlclVQIHZhbHVlID09IFwiLCBnZXRQb3dlclVQX3ZhbHVlKCkpO1xuXG5cdFx0Y29uc3QgY29udGFpbmVyX3BsYXllcjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXIxX2lkXCIpO1xuXHRcdGNvbnN0IGNvbnRhaW5lcl9wbGF5ZXIyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyMl9pZFwiKTtcblxuXHRcdGlmIChnZXRQb3dlclVQX3ZhbHVlKCkgIT09IDApXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCJwb3dlclVQIHZhbHVlamUgcmVlZWVlZGpraGtqZWZ3aGprZXdoZmtqd2UgPT0gXCIsIGdldFBvd2VyVVBfdmFsdWUoKSk7XG5cdFx0XHRjb250YWluZXJfcGxheWVyMS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Y29udGFpbmVyX3BsYXllcjIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGNvbnNvbGUubG9nKFwiIGVsc2UgICAgcG93ZXJVUCB2YWx1ZWplIHJlZWVlZWRqa2hramVmd2hqa2V3aGZrandlID09IFwiLCBnZXRQb3dlclVQX3ZhbHVlKCkpO1xuXHRcdFx0aWYgKGNvbnRhaW5lcl9wbGF5ZXIxLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSlcblx0XHRcdFx0Y29udGFpbmVyX3BsYXllcjEuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdGlmIChjb250YWluZXJfcGxheWVyMi5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpXG5cdFx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0fVxuXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWUoKS50b1N0cmluZygpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0yXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWUoKS50b1N0cmluZygpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1hdXRyZS0yXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWUoKS50b1N0cmluZygpO1xuXHR9XG5cblx0dXBkYXRlT3ZlcmxheXMoKSB7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0xXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjIgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX2ludmVyc2VfcGxheWVyMSA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1hdXRyZS0xXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTJcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1ncmVuYWRlLTFcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMSA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWdyZW5hZGUtMlwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIyID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktdGVhbW1hdGUtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMSA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXRlYW1tYXRlLTJcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjIgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1pbnZlcnNlLTFcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX2ludmVyc2VfcGxheWVyMSA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWludmVyc2UtMlwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIyID09PSAwKTtcblx0fVxuXG5cdGhhbmRsZUtleVByZXNzKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7IC8vTk9URSAtIGphaSBham91dGVyIGxlIHR5cGUgZXZlbnQ6IEtleWJvYXJkRXZlbnRcblx0XHRjb25zb2xlLmxvZyhcIktleSBwcmVzc2VkOlwiLCBldmVudC5rZXkpO1xuXHRcdGNvbnN0IGtleSA9IGV2ZW50LmtleTtcblxuXG5cblx0XHRcblx0XHQvLyBWw6lyaWZpZXIgc2kgbGEgdG91Y2hlIGEgdW4gY29vbGRvd24gZMOpZmluaVxuXHRcdGlmICghKGtleSBpbiB0aGlzLmNvb2xkb3duVGltZXMpKSByZXR1cm47XG5cdFxuXHRcdC8vIFbDqXJpZmllciBzaSBsYSB0b3VjaGUgZXN0IGVuIGNvb2xkb3duXG5cdFx0aWYgKHRoaXMuY29vbGRvd25zW2tleV0pIHJldHVybjsgLy8gSWdub3JlIGwnYWN0aW9uIHNpIGVuIGNvb2xkb3duXG5cblx0XHRpZiAoa2V5ID09PSBcIiBcIikge1xuXHRcdFx0Y29uc3QgcHJlc3Nfc3BhY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXNzX3NwYWNlX2lkXCIpO1xuXHRcdFx0aWYgKHByZXNzX3NwYWNlKSB7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdFx0XHRwcmVzc19zcGFjZS5zdHlsZS5hbmltYXRpb24gPSBcIm5vbmVcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJwcmVzc19zcGFjZV9pZCBpbnRyb3V2YWJsZSAhXCIpO1xuXHRcdFx0fVxuXHRcdFx0c3BhY2VQcmVzc2VkID0gdHJ1ZTtcblx0XHR9XG5cblxuXHRcdGlmIChzcGFjZVByZXNzZWQpXG5cdFx0e1xuXHRcdFx0bGV0IGVsZW0gPSBudWxsO1xuXHRcdFx0c3dpdGNoIChrZXkpIHtcblx0XHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcImNcIjpcblx0XHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIjFcIjpcblx0XHRcdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTJcIik7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlIFwiMlwiOlxuXHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIjNcIjpcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTJcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XG5cdFx0XHRpZiAoZWxlbSkge1xuXHRcdFx0XHRsZXQgY3VycmVudFZhbHVlID0gcGFyc2VJbnQoZWxlbS5pbm5lckhUTUwsIDEwKTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+IDApIHtcblx0XHRcdFx0XHRlbGVtLmlubmVySFRNTCA9IChjdXJyZW50VmFsdWUgLSAxKS50b1N0cmluZygpOyAvL05PVEUgLSBqYWkgY2hhbmdlciBsZSB0eXBlIHBvdXIgcXVlIGNhIHBhc3NlIGljaVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke2tleX0gdXRpbGlzw6ksIGNvb2xkb3duIGFjdGl2w6kgcG91ciAke3RoaXMuY29vbGRvd25UaW1lc1trZXldfW1zYCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gTWV0dHJlIGVuIGNvb2xkb3duIGNldHRlIHRvdWNoZVxuXHRcdFx0XHRcdHRoaXMuY29vbGRvd25zW2tleV0gPSB0cnVlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIEFqb3V0ZXIgbGEgY2xhc3NlIGQnYW5pbWF0aW9uIHBvdXIgZMOpbWFycmVyIGwnb3ZlcmxheSByZWxvYWRpbmdcblx0XHRcdFx0XHRsZXQgaXRlbUNpcmNsZSA9IG51bGw7XG5cdFx0XHRcdFx0bGV0IG92ZXJsYXlSZWxvYWRpbmcgPSBudWxsO1xuXHRcdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gbnVsbDtcblxuXHRcdFx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdFx0XHRjYXNlIFwielwiOlxuXHRcdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWdyZW5hZGUxXCIpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCJ4XCI6XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlLTFcIik7XG5cdFx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMVwiKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIFwiY1wiOlxuXHRcdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1pbnZlcnNlLTFcIik7XG5cdFx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWludmVyc2UxXCIpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMlwiKTtcblx0XHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtZ3JlbmFkZTJcIik7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIjJcIjpcblx0XHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtdGVhbW1hdGUyXCIpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCIzXCI6XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWludmVyc2UtMlwiKTtcblx0XHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtaW52ZXJzZTJcIik7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgLSAxID09PSAwKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlT3ZlcmxheXMoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZyAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0XHQvLyBMYW5jZXIgbCdhbmltYXRpb24gZW4gYWpvdXRhbnQgdW5lIGNsYXNzZSBDU1MgcG91ciBkw6ltYXJyZXJcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQXNzdXJlei12b3VzIHF1ZSAuaXRlbS1sb2FkaW5nIGVzdCBkw6lmaW5pIGRhbnMgdm90cmUgQ1NTXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChpdGVtQ2lyY2xlKSB7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0Ly8gTGFuY2VyIGwnYW5pbWF0aW9uIGVuIGFqb3V0YW50IHVuZSBjbGFzc2UgQ1NTIHBvdXIgZMOpbWFycmVyXG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFzc3VyZXotdm91cyBxdWUgLml0ZW0tbG9hZGluZyBlc3QgZMOpZmluaSBkYW5zIHZvdHJlIENTU1xuXHRcdFx0XHRcdH1cblx0XHRcblx0XHRcdFx0XHQvLyBSZXRpcmVyIGxlIGNvb2xkb3duIGFwcsOocyBsZSBkw6lsYWkgZMOpZmluaSBwb3VyIGNldHRlIHRvdWNoZVxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gVGVybWluZXIgbGUgY29vbGRvd24gZXQgYXJyw6p0ZXIgbCdhbmltYXRpb25cblx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmNvb2xkb3duc1trZXldO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7a2V5fSBjb29sZG93biB0ZXJtaW7DqWApO1xuXHRcdFxuXHRcdFx0XHRcdFx0Ly8gUmV0aXJlciBsYSBjbGFzc2UgZCdhbmltYXRpb24gYXByw6hzIGxlIGNvb2xkb3duXG5cdFx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZyAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGl0ZW1DaXJjbGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9LCB0aGlzLmNvb2xkb3duVGltZXNba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRldmVudF9zb2xvX2dhbWUoKSB7XG5cdFx0Y29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25fYnRuXCIpO1xuXHRcdGNvbnN0IHBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYW5lbF9pZFwiKTtcblx0XHRjb25zdCBvcHRpb25fcmVtb3ZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25fYnRuLXJlbW92ZVwiKTtcblxuXHRcdFxuXHRcdG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJvcHRpb24gY2xpY2tlZFwiKTtcblx0XHRcdHBhbmVsLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKFwicmVtb3ZlXCIpO1xuXHRcdFx0b3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0fSk7XG5cdFxuXHRcdG9wdGlvbl9yZW1vdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwib3B0aW9uX3JlbW92ZSBjbGlja2VkXCIpO1xuXHRcdFx0cGFuZWwuY2xhc3NMaXN0LmFkZChcInJlbW92ZVwiKTtcblx0XHRcdG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHR9LCAxMTAwKTtcblx0XHR9KTtcblx0fVxuXG5cdGNoZWNrR2FtZU92ZXIoKSB7XG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvc29sb19nYW1lXzF2MVwiKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHdpbm5lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLUVuZEdhbWVcIik7XG5cdFx0bGV0IHBsYXllcl8xX3dpbiA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdGxldCBwbGF5ZXJfMl93aW4gPSBnZXRQbGF5ZXJfMl93aW4oKTtcdFxuXHRcdGlmICghd2lubmVyQ29udGFpbmVyKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGlmIChpc0dhbWVGaW5pc2hlZCgpKSB7XG5cdFx0XHR3aW5uZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7IC8vIEFycsOqdGUgbGEgYm91Y2xlIHF1YW5kIGxhIHBhcnRpZSBlc3QgZmluaWVcblx0XHRcdGlmIChwbGF5ZXJfMV93aW4pXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lubmVyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDEgV2luXCI7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9vc2VyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDIgTG9vc2VcIjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHBsYXllcl8yX3dpbilcblx0XHRcdHtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aW5uZXJfaWRcIikuaW5uZXJIVE1MID0gXCJQbGF5ZXIgMiBXaW5cIjtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb29zZXJfaWRcIikuaW5uZXJIVE1MID0gXCJQbGF5ZXIgMSBMb29zZVwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIFxuXHRcdHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fVxufSJdfQ==