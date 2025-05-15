import AbstractView from "./AbstractView.js";
import { getPowerUP_value_multi } from "./Game_menu.js";
import { leave_Multiplayer_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { setLeaveGameVar } from "../index.js";
import { disable_skin_multi_podium } from "../../../srcs/game/gameplay/multiplayer/init_teamPlayer_podium.js";
import { isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { getIsTeam1Win, getIsTeam2Win } from "../../../srcs/game/gameplay/score.js";
let space_pressed = false;
export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("multi_player_game");
        this.cooldowns = {};
        this.cooldownTimes = {
            "z": 15000,
            "x": 15000,
            "1": 15000,
            "2": 15000,
            " ": 1000,
        };
        this.boundKeyPressHandler = this.handleKeyPress.bind(this);
        document.addEventListener("keydown", this.boundKeyPressHandler);
        if (window.location.pathname === "/multi_player_game") {
            this.gameLoop = setInterval(() => { this.checkGameOver(); 1000; });
        }
    }
    async getHtml() {
        return /*html*/ `
			<link rel="stylesheet" href="./static/js/css/multi_player_game.css">
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
				<div class="container-Player1" id="container-player1-id">
					<h1>Player 1 - Player 2</h1>
					<div class="container-item_player1">
						<p id="nb-item-grenade-1"></p>
						<div class="item-circle" id="item-circle-grenade1">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-1"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-1"></div>
						</div>
						<p id="nb-item-teammate-1"></p>
						<div class="item-circle" id="item-circle-teammate1">
							<img src="../../../srcs/game/assets/image/freeze.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-1"></div>
							<div class="overlay-reloading-freeze" id="overlay-reloading-freeze-1"></div>
						</div>
					</div>
				</div>
				<div class="container-Player2" id="container-player2-id">
					<h1>Player 3 - Player 4</h1>
					<div class="container-item_player2">
						<p id="nb-item-grenade-2"></p>
						<div class="item-circle" id="item-circle-grenade2">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-2"></div>
						</div>
						<p id="nb-item-teammate-2"></p>
						<div class="item-circle" id="item-circle-teammate2">
							<img src="../../../srcs/game/assets/image/freeze.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-2"></div>
							<div class="overlay-reloading-freeze" id="overlay-reloading-freeze-2"></div>
						</div>
					</div>
				</div>
				<div class="container-EndGame">
					<div class="winner">
						<h1 id="Winner_id"></h1>
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
    leave_game_multi() {
        document.getElementById("leave_game_id").addEventListener("click", () => {
            console.log("leave_the_game");
            this.cleanup();
            setLeaveGameVar(true);
            space_pressed = false;
            handleViewTransitions("vue2", "vue4");
            setTimeout(() => {
                window.history.back();
                leave_Multiplayer_Game();
            }, 1500);
        });
    }
    leave_game_2_multi() {
        document.getElementById("leave_game_2_id").addEventListener("click", () => {
            console.log("leave_the_game2222222222");
            this.cleanup();
            setLeaveGameVar(true);
            disable_skin_multi_podium();
            space_pressed = false;
            handleViewTransitions("vue2", "vue4");
            setTimeout(() => {
                window.history.back();
                leave_Multiplayer_Game();
            }, 1500);
        });
    }
    init_powerUP_player_multi() {
        const container_player1 = document.getElementById("container-player1-id");
        const container_player2 = document.getElementById("container-player2-id");
        console.log("powerUP_value_multi", getPowerUP_value_multi());
        if (getPowerUP_value_multi() !== 0) {
            console.log("powerUP_value_multi je rentre ici");
            // container_player1.classList.add("active");
            // container_player2.classList.add("active");
            container_player1.style.visibility = "visible";
            container_player2.style.visibility = "visible";
        }
        else {
            console.log("powerUP_value_multi je rentre ici222");
            // container_player1.classList.remove("active");
            // container_player2.classList.remove("active");
            container_player1.style.visibility = "hidden";
            container_player2.style.visibility = "hidden";
        }
        document.getElementById("nb-item-grenade-1").innerHTML = getPowerUP_value_multi();
        document.getElementById("nb-item-teammate-1").innerHTML = getPowerUP_value_multi();
        document.getElementById("nb-item-grenade-2").innerHTML = getPowerUP_value_multi();
        document.getElementById("nb-item-teammate-2").innerHTML = getPowerUP_value_multi();
    }
    updateOverlays() {
        const nb_powerUP_grenade_player1 = parseInt(document.getElementById("nb-item-grenade-1").innerHTML, 10);
        const nb_powerUP_grenade_player2 = parseInt(document.getElementById("nb-item-grenade-2").innerHTML, 10);
        const nb_powerUP_teammate_player1 = parseInt(document.getElementById("nb-item-teammate-1").innerHTML, 10);
        const nb_powerUP_teammate_player2 = parseInt(document.getElementById("nb-item-teammate-2").innerHTML, 10);
        document.getElementById("overlay-grenade-1").classList.toggle("active", nb_powerUP_grenade_player1 === 0);
        document.getElementById("overlay-grenade-2").classList.toggle("active", nb_powerUP_grenade_player2 === 0);
        document.getElementById("overlay-teammate-1").classList.toggle("active", nb_powerUP_teammate_player1 === 0);
        document.getElementById("overlay-teammate-2").classList.toggle("active", nb_powerUP_teammate_player2 === 0);
    }
    handleKeyPress(event) {
        // Vérifier si la touche est une touche de l'inventaire
        const key = event.key;
        if (!(key in this.cooldownTimes))
            return;
        // Vérifier si la touche est en cooldown
        if (this.cooldowns[key])
            return; // Ignore l'action si en cooldown
        if (key === " ") {
            console.log("space pressed");
            const press_space = document.getElementById("press_space_id");
            if (press_space) {
                press_space.style.visibility = "hidden";
                press_space.style.animation = "none";
            }
            else {
                console.error("press_space_id introuvable !");
            }
            space_pressed = true;
        }
        if (space_pressed) {
            let elem = null;
            switch (key) {
                case "z":
                    elem = document.getElementById("nb-item-grenade-1");
                    break;
                case "x":
                    elem = document.getElementById("nb-item-teammate-1");
                    break;
                case "1":
                    elem = document.getElementById("nb-item-grenade-2");
                    break;
                case "2":
                    elem = document.getElementById("nb-item-teammate-2");
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
                            overlayReloading_teammate = document.getElementById("overlay-reloading-freeze-1");
                            itemCircle = document.getElementById("item-circle-teammate1");
                            break;
                        case "1":
                            overlayReloading = document.getElementById("overlay-reloading-grenade-2");
                            itemCircle = document.getElementById("item-circle-grenade2");
                            break;
                        case "2":
                            overlayReloading_teammate = document.getElementById("overlay-reloading-freeze-2");
                            itemCircle = document.getElementById("item-circle-teammate2");
                            break;
                    }
                    if (currentValue - 1 === 0) {
                        itemCircle.classList.add("active");
                        this.updateOverlays();
                        return;
                    }
                    if (overlayReloading && currentValue - 1 !== 0) {
                        overlayReloading.classList.add("active");
                    }
                    if (itemCircle) {
                        itemCircle.classList.add("active");
                    }
                    if (overlayReloading_teammate && currentValue - 1 !== 0) {
                        overlayReloading_teammate.classList.add("active");
                    }
                    setTimeout(() => {
                        delete this.cooldowns[key];
                        console.log(`${key} cooldown terminé`);
                        if (overlayReloading && currentValue - 1 !== 0)
                            overlayReloading.classList.remove("active");
                        if (overlayReloading_teammate && currentValue - 1 !== 0)
                            overlayReloading_teammate.classList.remove("active");
                        if (itemCircle && currentValue - 1 !== 0)
                            itemCircle.classList.remove("active");
                    }, this.cooldownTimes[key]);
                }
            }
        }
    }
    event_multiPlayer_game() {
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
        if (window.location.pathname !== "/multi_player_game")
            return;
        const winnerContainer = document.querySelector(".container-EndGame");
        let team_player1_win = getIsTeam1Win();
        let team_player2_win = getIsTeam2Win();
        if (!winnerContainer)
            return;
        if (isGameFinished()) {
            winnerContainer.classList.add("active");
            clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
            if (team_player1_win) {
                document.getElementById("Winner_id").innerHTML = "Player 1 - Player 2 Win";
                document.getElementById("looser_id").innerHTML = "Player 3 - Player 4 Loose";
            }
            else if (team_player2_win) {
                document.getElementById("Winner_id").innerHTML = "Player 3 - Player 4 Win";
                document.getElementById("looser_id").innerHTML = "Player 1 - Player 2 Loose";
            }
        }
        else {
            winnerContainer.classList.remove("active");
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfcGxheWVyX2dhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wdWJsaWMvc3RhdGljL2pzL3ZpZXdzL211bHRpX3BsYXllcl9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFOUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sbUVBQW1FLENBQUM7QUFDOUcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFFcEYsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBRTFCLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBT3hDO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNwQixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxJQUFJO1NBQ1QsQ0FBQztRQUVGLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxRQUFRLENBQUMsZ0JB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QUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDZDQUE2QztZQUMzRSxJQUFJLGdCQUFnQixFQUNwQixDQUFDO2dCQUNBLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLHlCQUF5QixDQUFDO2dCQUMzRSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztZQUM5RSxDQUFDO2lCQUNJLElBQUksZ0JBQWdCLEVBQ3pCLENBQUM7Z0JBQ0EsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcseUJBQXlCLENBQUM7Z0JBQzNFLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLDJCQUEyQixDQUFDO1lBQzlFLENBQUM7UUFDRixDQUFDO2FBRUQsQ0FBQztZQUNBLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUM7SUFDRixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgZ2V0UG93ZXJVUF92YWx1ZV9tdWx0aSB9IGZyb20gXCIuL0dhbWVfbWVudS5qc1wiO1xuaW1wb3J0IHsgbGVhdmVfTXVsdGlwbGF5ZXJfR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbmltcG9ydCB7IHNldExlYXZlR2FtZVZhciB9IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuaW1wb3J0IHsgZ2V0UG93ZXJVUF92YWx1ZSB9IGZyb20gXCIuL0dhbWVfbWVudS5qc1wiO1xuaW1wb3J0IHsgZGlzYWJsZV9za2luX211bHRpX3BvZGl1bSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvbXVsdGlwbGF5ZXIvaW5pdF90ZWFtUGxheWVyX3BvZGl1bS5qc1wiO1xuaW1wb3J0IHsgaXNHYW1lRmluaXNoZWQgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3Njb3JlLmpzXCI7XG5pbXBvcnQgeyBnZXRJc1RlYW0xV2luLCBnZXRJc1RlYW0yV2luIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xuXG5sZXQgc3BhY2VfcHJlc3NlZCA9IGZhbHNlO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0VmlldyB7XG5cblx0Y29vbGRvd25zOiBhbnk7XG5cdGNvb2xkb3duVGltZXM6IGFueTtcblx0Ym91bmRLZXlQcmVzc0hhbmRsZXI6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcblx0XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwibXVsdGlfcGxheWVyX2dhbWVcIik7XG5cblx0XHR0aGlzLmNvb2xkb3ducyA9IHt9O1xuXG5cdFx0dGhpcy5jb29sZG93blRpbWVzID0ge1xuXHRcdFx0XCJ6XCI6IDE1MDAwLFxuXHRcdFx0XCJ4XCI6IDE1MDAwLFxuXHRcdFx0XCIxXCI6IDE1MDAwLFxuXHRcdFx0XCIyXCI6IDE1MDAwLFxuXHRcdFx0XCIgXCI6IDEwMDAsXG5cdFx0fTtcblxuXHRcdHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIgPSB0aGlzLmhhbmRsZUtleVByZXNzLmJpbmQodGhpcyk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5ib3VuZEtleVByZXNzSGFuZGxlcik7XG5cblx0XHRpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBcIi9tdWx0aV9wbGF5ZXJfZ2FtZVwiKSB7XG5cdFx0XHR0aGlzLmdhbWVMb29wID0gc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLmNoZWNrR2FtZU92ZXIoKTsgMTAwMCB9KTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCkge1xuXHRcdHJldHVybiAvKmh0bWwqL2Bcblx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi9zdGF0aWMvanMvY3NzL211bHRpX3BsYXllcl9nYW1lLmNzc1wiPlxuXHRcdFx0PGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmxhY2srT3BzK09uZSZkaXNwbGF5PXN3YXBcIiByZWw9XCJzdHlsZXNoZWV0XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwcmVzc19zcGFjZVwiID5cblx0XHRcdFx0XHQ8aDEgaWQ9XCJwcmVzc19zcGFjZV9pZFwiPlByZXNzIFNQQUNFIHRvIFN0YXJ0PC9oMT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItbGVhdmVcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwib3B0aW9uXCIgaWQ9XCJvcHRpb25fYnRuXCI+XG5cdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvbWVudS5zdmdcIiBhbHQ9XCJsZWF2ZVwiPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsXCIgaWQ9XCJwYW5lbF9pZFwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJvcHRpb24taW4tcGFuZWxcIiBpZD1cIm9wdGlvbl9idG4tcmVtb3ZlXCI+XG5cdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvbWVudS5zdmdcIiBhbHQ9XCJsZWF2ZVwiPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJsZWF2ZV9nYW1lXCIgaWQ9XCJsZWF2ZV9nYW1lX2lkXCI+TGVhdmUgR2FtZTwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1QbGF5ZXIxXCIgaWQ9XCJjb250YWluZXItcGxheWVyMS1pZFwiPlxuXHRcdFx0XHRcdDxoMT5QbGF5ZXIgMSAtIFBsYXllciAyPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWl0ZW1fcGxheWVyMVwiPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWdyZW5hZGUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtZ3JlbmFkZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVmbGFzaFRlc3QuanBnXCIgYWx0PVwiSXRlbSAxXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWdyZW5hZGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tdGVhbW1hdGUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtdGVhbW1hdGUxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9mcmVlemUucG5nXCIgYWx0PVwiSXRlbSAyXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LXRlYW1tYXRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZVwiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctZnJlZXplLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1QbGF5ZXIyXCIgaWQ9XCJjb250YWluZXItcGxheWVyMi1pZFwiPlxuXHRcdFx0XHRcdDxoMT5QbGF5ZXIgMyAtIFBsYXllciA0PC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWl0ZW1fcGxheWVyMlwiPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWdyZW5hZGUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtZ3JlbmFkZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVmbGFzaFRlc3QuanBnXCIgYWx0PVwiSXRlbSAxXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tdGVhbW1hdGUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtdGVhbW1hdGUyXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9mcmVlemUucG5nXCIgYWx0PVwiSXRlbSAyXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LXRlYW1tYXRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZVwiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctZnJlZXplLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1FbmRHYW1lXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIndpbm5lclwiPlxuXHRcdFx0XHRcdFx0PGgxIGlkPVwiV2lubmVyX2lkXCI+PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibG9vc2VyXCI+XG5cdFx0XHRcdFx0XHQ8aDEgaWQ9XCJsb29zZXJfaWRcIj48L2gxPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJsZWF2ZV9nYW1lXzJcIiBpZD1cImxlYXZlX2dhbWVfMl9pZFwiPlF1aXR0ZXIgbGEgcGFydGllPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblx0fVxuXG5cdGNsZWFudXAoKSB7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5ib3VuZEtleVByZXNzSGFuZGxlcik7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTtcblx0fVxuXG5cdGxlYXZlX2dhbWVfbXVsdGkoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWF2ZV9nYW1lX2lkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImxlYXZlX3RoZV9nYW1lXCIpO1xuXHRcdFx0dGhpcy5jbGVhbnVwKCk7XG5cblx0XHRcdHNldExlYXZlR2FtZVZhcih0cnVlKTtcblx0XHRcdHNwYWNlX3ByZXNzZWQgPSBmYWxzZTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTJcIiwgXCJ2dWU0XCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHRcdFx0bGVhdmVfTXVsdGlwbGF5ZXJfR2FtZSgpO1xuXHRcdFx0fSwgMTUwMCk7XG5cdFx0fSk7XG5cdH1cblxuXHRsZWF2ZV9nYW1lXzJfbXVsdGkoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWF2ZV9nYW1lXzJfaWRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwibGVhdmVfdGhlX2dhbWUyMjIyMjIyMjIyXCIpO1xuXHRcdFx0dGhpcy5jbGVhbnVwKCk7XG5cblx0XHRcdHNldExlYXZlR2FtZVZhcih0cnVlKTtcblx0XHRcdGRpc2FibGVfc2tpbl9tdWx0aV9wb2RpdW0oKTtcblx0XHRcdHNwYWNlX3ByZXNzZWQgPSBmYWxzZTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTJcIiwgXCJ2dWU0XCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHRcdFx0bGVhdmVfTXVsdGlwbGF5ZXJfR2FtZSgpO1xuXHRcdFx0fSwgMTUwMCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpbml0X3Bvd2VyVVBfcGxheWVyX211bHRpKCkge1xuXG5cdFx0Y29uc3QgY29udGFpbmVyX3BsYXllcjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXIxLWlkXCIpO1xuXHRcdGNvbnN0IGNvbnRhaW5lcl9wbGF5ZXIyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyMi1pZFwiKTtcblxuXHRcdGNvbnNvbGUubG9nKFwicG93ZXJVUF92YWx1ZV9tdWx0aVwiLCBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkpO1xuXG5cdFx0aWYgKGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKSAhPT0gMClcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhcInBvd2VyVVBfdmFsdWVfbXVsdGkgamUgcmVudHJlIGljaVwiKTtcblx0XHRcdC8vIGNvbnRhaW5lcl9wbGF5ZXIxLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHQvLyBjb250YWluZXJfcGxheWVyMi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Y29udGFpbmVyX3BsYXllcjEuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXHRcdFx0Y29udGFpbmVyX3BsYXllcjIuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCJwb3dlclVQX3ZhbHVlX211bHRpIGplIHJlbnRyZSBpY2kyMjJcIik7XG5cdFx0XHQvLyBjb250YWluZXJfcGxheWVyMS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0Ly8gY29udGFpbmVyX3BsYXllcjIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIxLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdFx0Y29udGFpbmVyX3BsYXllcjIuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0fVxuXG5cblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0xXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTJcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZV9tdWx0aSgpO1xuXHR9XG5cblx0dXBkYXRlT3ZlcmxheXMoKSB7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0xXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjIgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWdyZW5hZGUtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktZ3JlbmFkZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjIgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS10ZWFtbWF0ZS0xXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktdGVhbW1hdGUtMlwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMiA9PT0gMCk7XG5cdH1cblxuXHRoYW5kbGVLZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuXHRcdC8vIFbDqXJpZmllciBzaSBsYSB0b3VjaGUgZXN0IHVuZSB0b3VjaGUgZGUgbCdpbnZlbnRhaXJlXG5cdFx0Y29uc3Qga2V5ID0gZXZlbnQua2V5O1xuXHRcdFxuXHRcdGlmICghKGtleSBpbiB0aGlzLmNvb2xkb3duVGltZXMpKSByZXR1cm47XG5cdFxuXHRcdC8vIFbDqXJpZmllciBzaSBsYSB0b3VjaGUgZXN0IGVuIGNvb2xkb3duXG5cdFx0aWYgKHRoaXMuY29vbGRvd25zW2tleV0pIHJldHVybjsgLy8gSWdub3JlIGwnYWN0aW9uIHNpIGVuIGNvb2xkb3duXG5cblx0XHRpZiAoa2V5ID09PSBcIiBcIikge1xuXHRcdFx0Y29uc29sZS5sb2coXCJzcGFjZSBwcmVzc2VkXCIpO1xuXHRcdFx0Y29uc3QgcHJlc3Nfc3BhY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXNzX3NwYWNlX2lkXCIpO1xuXHRcdFx0aWYgKHByZXNzX3NwYWNlKSB7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdFx0XHRwcmVzc19zcGFjZS5zdHlsZS5hbmltYXRpb24gPSBcIm5vbmVcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJwcmVzc19zcGFjZV9pZCBpbnRyb3V2YWJsZSAhXCIpO1xuXHRcdFx0fVxuXHRcdFx0c3BhY2VfcHJlc3NlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKHNwYWNlX3ByZXNzZWQpXG5cdFx0e1xuXHRcdGxldCBlbGVtID0gbnVsbDtcblx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0xXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdGlmIChlbGVtKSB7XG5cdFx0XHRsZXQgY3VycmVudFZhbHVlID0gcGFyc2VJbnQoZWxlbS5pbm5lckhUTUwsIDEwKTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPiAwKSB7XG5cdFx0XHRcdGVsZW0uaW5uZXJIVE1MID0gKGN1cnJlbnRWYWx1ZSAtIDEpLnRvU3RyaW5nKCk7IC8vTk9URSAtIGphaSBjaGFuZ2VyIGxlIHR5cGUgcG91ciBxdWUgY2EgcGFzc2UgaWNpXG5cdFx0XHRcdFxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHtrZXl9IHV0aWxpc8OpLCBjb29sZG93biBhY3RpdsOpIHBvdXIgJHt0aGlzLmNvb2xkb3duVGltZXNba2V5XX1tc2ApO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTWV0dHJlIGVuIGNvb2xkb3duIGNldHRlIHRvdWNoZVxuXHRcdFx0XHR0aGlzLmNvb2xkb3duc1trZXldID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIEFqb3V0ZXIgbGEgY2xhc3NlIGQnYW5pbWF0aW9uIHBvdXIgZMOpbWFycmVyIGwnb3ZlcmxheSByZWxvYWRpbmdcblx0XHRcdFx0bGV0IGl0ZW1DaXJjbGUgPSBudWxsO1xuXHRcdFx0XHRsZXQgb3ZlcmxheVJlbG9hZGluZyA9IG51bGw7XG5cdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gbnVsbDtcblxuXHRcdFx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0XHRcdGNhc2UgXCJ6XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJ4XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMVwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTJcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMlwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSAtIDEgPT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVPdmVybGF5cygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGl0ZW1DaXJjbGUpIHtcblx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5jb29sZG93bnNba2V5XTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHtrZXl9IGNvb2xkb3duIHRlcm1pbsOpYCk7XG5cdFxuXHRcdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChpdGVtQ2lyY2xlICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cblx0XHRcdFx0fSwgdGhpcy5jb29sZG93blRpbWVzW2tleV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZXZlbnRfbXVsdGlQbGF5ZXJfZ2FtZSgpIHtcblx0XHRjb25zdCBvcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbl9idG5cIik7XG5cdFx0Y29uc3QgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhbmVsX2lkXCIpO1xuXHRcdGNvbnN0IG9wdGlvbl9yZW1vdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbl9idG4tcmVtb3ZlXCIpO1xuXG5cdFx0XG5cdFx0b3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIm9wdGlvbiBjbGlja2VkXCIpO1xuXHRcdFx0cGFuZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJyZW1vdmVcIik7XG5cdFx0XHRvcHRpb24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHR9KTtcblx0XG5cdFx0b3B0aW9uX3JlbW92ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJvcHRpb25fcmVtb3ZlIGNsaWNrZWRcIik7XG5cdFx0XHRwYW5lbC5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlXCIpO1xuXHRcdFx0b3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0cGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdH0sIDExMDApO1xuXHRcdH0pO1xuXHR9XG5cblx0Y2hlY2tHYW1lT3ZlcigpIHtcblx0XHRpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICE9PSBcIi9tdWx0aV9wbGF5ZXJfZ2FtZVwiKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHdpbm5lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLUVuZEdhbWVcIik7XG5cdFx0bGV0IHRlYW1fcGxheWVyMV93aW4gPSBnZXRJc1RlYW0xV2luKCk7XG5cdFx0bGV0IHRlYW1fcGxheWVyMl93aW4gPSBnZXRJc1RlYW0yV2luKCk7XG5cdFx0aWYgKCF3aW5uZXJDb250YWluZXIpXG5cdFx0XHRyZXR1cm47XG5cdFx0aWYgKGlzR2FtZUZpbmlzaGVkKCkpIHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTsgLy8gQXJyw6p0ZSBsYSBib3VjbGUgcXVhbmQgbGEgcGFydGllIGVzdCBmaW5pZVxuXHRcdFx0aWYgKHRlYW1fcGxheWVyMV93aW4pXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2lubmVyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDEgLSBQbGF5ZXIgMiBXaW5cIjtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb29zZXJfaWRcIikuaW5uZXJIVE1MID0gXCJQbGF5ZXIgMyAtIFBsYXllciA0IExvb3NlXCI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0ZWFtX3BsYXllcjJfd2luKVxuXHRcdFx0e1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIldpbm5lcl9pZFwiKS5pbm5lckhUTUwgPSBcIlBsYXllciAzIC0gUGxheWVyIDQgV2luXCI7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9vc2VyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDEgLSBQbGF5ZXIgMiBMb29zZVwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIFxuXHRcdHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fVxufSJdfQ==