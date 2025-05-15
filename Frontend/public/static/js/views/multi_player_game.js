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
        document.getElementById("nb-item-grenade-1").innerHTML = getPowerUP_value_multi().toString();
        document.getElementById("nb-item-teammate-1").innerHTML = getPowerUP_value_multi().toString();
        document.getElementById("nb-item-grenade-2").innerHTML = getPowerUP_value_multi().toString();
        document.getElementById("nb-item-teammate-2").innerHTML = getPowerUP_value_multi().toString();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfcGxheWVyX2dhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtdWx0aV9wbGF5ZXJfZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNoRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTlDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG1FQUFtRSxDQUFDO0FBQzlHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXBGLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztBQUUxQixNQUFNLENBQUMsT0FBTyxNQUFPLFNBQVEsWUFBWTtJQVF4QztRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDcEIsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsSUFBSTtTQUNULENBQUM7UUFFRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsb0JBQW9C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QVEsQ0FBQyxDQUFDO1lBQ3hDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyw2Q0FBNkM7WUFDM0UsSUFBSSxnQkFBZ0IsRUFDcEIsQ0FBQztnQkFDQSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztnQkFDM0UsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsMkJBQTJCLENBQUM7WUFDOUUsQ0FBQztpQkFDSSxJQUFJLGdCQUFnQixFQUN6QixDQUFDO2dCQUNBLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLHlCQUF5QixDQUFDO2dCQUMzRSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztZQUM5RSxDQUFDO1FBQ0YsQ0FBQzthQUVELENBQUM7WUFDQSxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDO0lBQ0YsQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IGdldFBvd2VyVVBfdmFsdWVfbXVsdGkgfSBmcm9tIFwiLi9HYW1lX21lbnUuanNcIjtcbmltcG9ydCB7IGxlYXZlX011bHRpcGxheWVyX0dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBzZXRMZWF2ZUdhbWVWYXIgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IGdldFBvd2VyVVBfdmFsdWUgfSBmcm9tIFwiLi9HYW1lX21lbnUuanNcIjtcbmltcG9ydCB7IGRpc2FibGVfc2tpbl9tdWx0aV9wb2RpdW0gfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L211bHRpcGxheWVyL2luaXRfdGVhbVBsYXllcl9wb2RpdW0uanNcIjtcbmltcG9ydCB7IGlzR2FtZUZpbmlzaGVkIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xuaW1wb3J0IHsgZ2V0SXNUZWFtMVdpbiwgZ2V0SXNUZWFtMldpbiB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc2NvcmUuanNcIjtcblxubGV0IHNwYWNlX3ByZXNzZWQgPSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXG5cdGNvb2xkb3duczogYW55O1xuXHRjb29sZG93blRpbWVzOiBhbnk7XG5cdGJvdW5kS2V5UHJlc3NIYW5kbGVyOiAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ7XG5cdGdhbWVMb29wOiBOb2RlSlMuVGltZW91dCB8IG51bGw7XG5cdFxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zZXRUaXRsZShcIm11bHRpX3BsYXllcl9nYW1lXCIpO1xuXG5cdFx0dGhpcy5jb29sZG93bnMgPSB7fTtcblxuXHRcdHRoaXMuY29vbGRvd25UaW1lcyA9IHtcblx0XHRcdFwielwiOiAxNTAwMCxcblx0XHRcdFwieFwiOiAxNTAwMCxcblx0XHRcdFwiMVwiOiAxNTAwMCxcblx0XHRcdFwiMlwiOiAxNTAwMCxcblx0XHRcdFwiIFwiOiAxMDAwLFxuXHRcdH07XG5cblx0XHR0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyID0gdGhpcy5oYW5kbGVLZXlQcmVzcy5iaW5kKHRoaXMpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gXCIvbXVsdGlfcGxheWVyX2dhbWVcIikge1xuXHRcdFx0dGhpcy5nYW1lTG9vcCA9IHNldEludGVydmFsKCgpID0+IHsgdGhpcy5jaGVja0dhbWVPdmVyKCk7IDEwMDAgfSk7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy9tdWx0aV9wbGF5ZXJfZ2FtZS5jc3NcIj5cblx0XHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJlc3Nfc3BhY2VcIiA+XG5cdFx0XHRcdFx0PGgxIGlkPVwicHJlc3Nfc3BhY2VfaWRcIj5QcmVzcyBTUEFDRSB0byBTdGFydDwvaDE+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWxlYXZlXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm9wdGlvblwiIGlkPVwib3B0aW9uX2J0blwiPlxuXHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL21lbnUuc3ZnXCIgYWx0PVwibGVhdmVcIj5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwYW5lbFwiIGlkPVwicGFuZWxfaWRcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwib3B0aW9uLWluLXBhbmVsXCIgaWQ9XCJvcHRpb25fYnRuLXJlbW92ZVwiPlxuXHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL21lbnUuc3ZnXCIgYWx0PVwibGVhdmVcIj5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwibGVhdmVfZ2FtZVwiIGlkPVwibGVhdmVfZ2FtZV9pZFwiPkxlYXZlIEdhbWU8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItUGxheWVyMVwiIGlkPVwiY29udGFpbmVyLXBsYXllcjEtaWRcIj5cblx0XHRcdFx0XHQ8aDE+UGxheWVyIDEgLSBQbGF5ZXIgMjwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1pdGVtX3BsYXllcjFcIj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1ncmVuYWRlLTFcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWdyZW5hZGUxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlZmxhc2hUZXN0LmpwZ1wiIGFsdD1cIkl0ZW0gMVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1ncmVuYWRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLXRlYW1tYXRlLTFcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLXRlYW1tYXRlMVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZnJlZXplLnBuZ1wiIGFsdD1cIkl0ZW0gMlwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS10ZWFtbWF0ZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemVcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItUGxheWVyMlwiIGlkPVwiY29udGFpbmVyLXBsYXllcjItaWRcIj5cblx0XHRcdFx0XHQ8aDE+UGxheWVyIDMgLSBQbGF5ZXIgNDwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1pdGVtX3BsYXllcjJcIj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1ncmVuYWRlLTJcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWdyZW5hZGUyXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlZmxhc2hUZXN0LmpwZ1wiIGFsdD1cIkl0ZW0gMVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1ncmVuYWRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLXRlYW1tYXRlLTJcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLXRlYW1tYXRlMlwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZnJlZXplLnBuZ1wiIGFsdD1cIkl0ZW0gMlwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS10ZWFtbWF0ZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemVcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItRW5kR2FtZVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ3aW5uZXJcIj5cblx0XHRcdFx0XHRcdDxoMSBpZD1cIldpbm5lcl9pZFwiPjwvaDE+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImxvb3NlclwiPlxuXHRcdFx0XHRcdFx0PGgxIGlkPVwibG9vc2VyX2lkXCI+PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwibGVhdmVfZ2FtZV8yXCIgaWQ9XCJsZWF2ZV9nYW1lXzJfaWRcIj5RdWl0dGVyIGxhIHBhcnRpZTwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cblxuXHRjbGVhbnVwKCkge1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7XG5cdH1cblxuXHRsZWF2ZV9nYW1lX211bHRpKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV9pZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJsZWF2ZV90aGVfZ2FtZVwiKTtcblx0XHRcdHRoaXMuY2xlYW51cCgpO1xuXG5cdFx0XHRzZXRMZWF2ZUdhbWVWYXIodHJ1ZSk7XG5cdFx0XHRzcGFjZV9wcmVzc2VkID0gZmFsc2U7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUyXCIsIFwidnVlNFwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRcdGxlYXZlX011bHRpcGxheWVyX0dhbWUoKTtcblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXHR9XG5cblx0bGVhdmVfZ2FtZV8yX211bHRpKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV8yX2lkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImxlYXZlX3RoZV9nYW1lMjIyMjIyMjIyMlwiKTtcblx0XHRcdHRoaXMuY2xlYW51cCgpO1xuXG5cdFx0XHRzZXRMZWF2ZUdhbWVWYXIodHJ1ZSk7XG5cdFx0XHRkaXNhYmxlX3NraW5fbXVsdGlfcG9kaXVtKCk7XG5cdFx0XHRzcGFjZV9wcmVzc2VkID0gZmFsc2U7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUyXCIsIFwidnVlNFwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRcdGxlYXZlX011bHRpcGxheWVyX0dhbWUoKTtcblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXHR9XG5cblx0aW5pdF9wb3dlclVQX3BsYXllcl9tdWx0aSgpIHtcblxuXHRcdGNvbnN0IGNvbnRhaW5lcl9wbGF5ZXIxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyMS1pZFwiKTtcblx0XHRjb25zdCBjb250YWluZXJfcGxheWVyMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllcjItaWRcIik7XG5cblx0XHRjb25zb2xlLmxvZyhcInBvd2VyVVBfdmFsdWVfbXVsdGlcIiwgZ2V0UG93ZXJVUF92YWx1ZV9tdWx0aSgpKTtcblxuXHRcdGlmIChnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkgIT09IDApXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCJwb3dlclVQX3ZhbHVlX211bHRpIGplIHJlbnRyZSBpY2lcIik7XG5cdFx0XHQvLyBjb250YWluZXJfcGxheWVyMS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Ly8gY29udGFpbmVyX3BsYXllcjIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIxLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIyLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGNvbnNvbGUubG9nKFwicG93ZXJVUF92YWx1ZV9tdWx0aSBqZSByZW50cmUgaWNpMjIyXCIpO1xuXHRcdFx0Ly8gY29udGFpbmVyX3BsYXllcjEuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdC8vIGNvbnRhaW5lcl9wbGF5ZXIyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRjb250YWluZXJfcGxheWVyMS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIyLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdH1cblxuXG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKS50b1N0cmluZygpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0yXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKS50b1N0cmluZygpO1xuXHR9XG5cblx0dXBkYXRlT3ZlcmxheXMoKSB7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0xXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjIgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWdyZW5hZGUtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktZ3JlbmFkZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjIgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS10ZWFtbWF0ZS0xXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktdGVhbW1hdGUtMlwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMiA9PT0gMCk7XG5cdH1cblxuXHRoYW5kbGVLZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuXHRcdC8vIFbDqXJpZmllciBzaSBsYSB0b3VjaGUgZXN0IHVuZSB0b3VjaGUgZGUgbCdpbnZlbnRhaXJlXG5cdFx0Y29uc3Qga2V5ID0gZXZlbnQua2V5O1xuXHRcdFxuXHRcdGlmICghKGtleSBpbiB0aGlzLmNvb2xkb3duVGltZXMpKSByZXR1cm47XG5cdFxuXHRcdC8vIFbDqXJpZmllciBzaSBsYSB0b3VjaGUgZXN0IGVuIGNvb2xkb3duXG5cdFx0aWYgKHRoaXMuY29vbGRvd25zW2tleV0pIHJldHVybjsgLy8gSWdub3JlIGwnYWN0aW9uIHNpIGVuIGNvb2xkb3duXG5cblx0XHRpZiAoa2V5ID09PSBcIiBcIikge1xuXHRcdFx0Y29uc29sZS5sb2coXCJzcGFjZSBwcmVzc2VkXCIpO1xuXHRcdFx0Y29uc3QgcHJlc3Nfc3BhY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXNzX3NwYWNlX2lkXCIpO1xuXHRcdFx0aWYgKHByZXNzX3NwYWNlKSB7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdFx0XHRwcmVzc19zcGFjZS5zdHlsZS5hbmltYXRpb24gPSBcIm5vbmVcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJwcmVzc19zcGFjZV9pZCBpbnRyb3V2YWJsZSAhXCIpO1xuXHRcdFx0fVxuXHRcdFx0c3BhY2VfcHJlc3NlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKHNwYWNlX3ByZXNzZWQpXG5cdFx0e1xuXHRcdGxldCBlbGVtID0gbnVsbDtcblx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0xXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdGlmIChlbGVtKSB7XG5cdFx0XHRsZXQgY3VycmVudFZhbHVlID0gcGFyc2VJbnQoZWxlbS5pbm5lckhUTUwsIDEwKTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPiAwKSB7XG5cdFx0XHRcdGVsZW0uaW5uZXJIVE1MID0gKGN1cnJlbnRWYWx1ZSAtIDEpLnRvU3RyaW5nKCk7IC8vTk9URSAtIGphaSBjaGFuZ2VyIGxlIHR5cGUgcG91ciBxdWUgY2EgcGFzc2UgaWNpXG5cdFx0XHRcdFxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHtrZXl9IHV0aWxpc8OpLCBjb29sZG93biBhY3RpdsOpIHBvdXIgJHt0aGlzLmNvb2xkb3duVGltZXNba2V5XX1tc2ApO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTWV0dHJlIGVuIGNvb2xkb3duIGNldHRlIHRvdWNoZVxuXHRcdFx0XHR0aGlzLmNvb2xkb3duc1trZXldID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIEFqb3V0ZXIgbGEgY2xhc3NlIGQnYW5pbWF0aW9uIHBvdXIgZMOpbWFycmVyIGwnb3ZlcmxheSByZWxvYWRpbmdcblx0XHRcdFx0bGV0IGl0ZW1DaXJjbGUgPSBudWxsO1xuXHRcdFx0XHRsZXQgb3ZlcmxheVJlbG9hZGluZyA9IG51bGw7XG5cdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gbnVsbDtcblxuXHRcdFx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0XHRcdGNhc2UgXCJ6XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJ4XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMVwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTJcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMlwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSAtIDEgPT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVPdmVybGF5cygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGl0ZW1DaXJjbGUpIHtcblx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5jb29sZG93bnNba2V5XTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHtrZXl9IGNvb2xkb3duIHRlcm1pbsOpYCk7XG5cdFxuXHRcdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChpdGVtQ2lyY2xlICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cblx0XHRcdFx0fSwgdGhpcy5jb29sZG93blRpbWVzW2tleV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZXZlbnRfbXVsdGlQbGF5ZXJfZ2FtZSgpIHtcblx0XHRjb25zdCBvcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbl9idG5cIik7XG5cdFx0Y29uc3QgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhbmVsX2lkXCIpO1xuXHRcdGNvbnN0IG9wdGlvbl9yZW1vdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbl9idG4tcmVtb3ZlXCIpO1xuXG5cdFx0XG5cdFx0b3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIm9wdGlvbiBjbGlja2VkXCIpO1xuXHRcdFx0cGFuZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJyZW1vdmVcIik7XG5cdFx0XHRvcHRpb24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHR9KTtcblx0XG5cdFx0b3B0aW9uX3JlbW92ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJvcHRpb25fcmVtb3ZlIGNsaWNrZWRcIik7XG5cdFx0XHRwYW5lbC5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlXCIpO1xuXHRcdFx0b3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0cGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdH0sIDExMDApO1xuXHRcdH0pO1xuXHR9XG5cblx0Y2hlY2tHYW1lT3ZlcigpIHtcblx0XHRpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICE9PSBcIi9tdWx0aV9wbGF5ZXJfZ2FtZVwiKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHdpbm5lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLUVuZEdhbWVcIik7XG5cdFx0bGV0IHRlYW1fcGxheWVyMV93aW4gPSBnZXRJc1RlYW0xV2luKCk7XG5cdFx0bGV0IHRlYW1fcGxheWVyMl93aW4gPSBnZXRJc1RlYW0yV2luKCk7XG5cdFx0aWYgKCF3aW5uZXJDb250YWluZXIpXG5cdFx0XHRyZXR1cm47XG5cdFx0aWYgKGlzR2FtZUZpbmlzaGVkKCkpIHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTsgLy8gQXJyw6p0ZSBsYSBib3VjbGUgcXVhbmQgbGEgcGFydGllIGVzdCBmaW5pZVxuXHRcdFx0aWYgKHRlYW1fcGxheWVyMV93aW4pXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2lubmVyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDEgLSBQbGF5ZXIgMiBXaW5cIjtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb29zZXJfaWRcIikuaW5uZXJIVE1MID0gXCJQbGF5ZXIgMyAtIFBsYXllciA0IExvb3NlXCI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0ZWFtX3BsYXllcjJfd2luKVxuXHRcdFx0e1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIldpbm5lcl9pZFwiKS5pbm5lckhUTUwgPSBcIlBsYXllciAzIC0gUGxheWVyIDQgV2luXCI7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9vc2VyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDEgLSBQbGF5ZXIgMiBMb29zZVwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIFxuXHRcdHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fVxufSJdfQ==