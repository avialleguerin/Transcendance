import AbstractView from "./AbstractView.js";
import { getPowerUP_value_multi } from "./Game_menu.js";
import { leave_Multiplayer_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { setLeaveGameVar } from "../index.js";
import { disable_skin_multi_podium } from "../../../srcs/game/gameplay/multiplayer/init_teamPlayer_podium.js";
import { isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { getIsTeam1Win, getIsTeam2Win } from "../../../srcs/game/gameplay/score.js";
import { disable_skin_multi_podium_default } from "../../../srcs/game/gameplay/multiplayer/init_teamPlayer_podium_default.js";
import { get_skin_is_init } from "../../../srcs/game/gameplay/solo/skin/init_skin_utils.js";
let space_pressed = false;
let bool = false;
let is_init = get_skin_is_init();
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
        if (bool === false) {
            this.boundKeyPressHandler = this.handleKeyPress.bind(this);
            document.addEventListener("keydown", this.boundKeyPressHandler);
            if (window.location.pathname === "/multi_player_game") {
                this.gameLoop = setInterval(() => { this.checkGameOver(); }, 1000);
            }
            bool = true;
        }
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken || accessToken === undefined) {
            history.pushState({}, '', '/');
            import('./Home.js').then((module) => {
                const Home = module.default;
                const homeInstance = new Home();
                homeInstance.getHtml().then((html) => {
                    const appElement = document.getElementById('app');
                    if (appElement) {
                        appElement.innerHTML = html;
                        if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
                            homeInstance.createAccount();
                        }
                    }
                });
            });
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
				<div class="container-Player1" id="container-player1-id">
					<h1>${localStorage.getItem("Player1")} - ${localStorage.getItem("Player2")}</h1>
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
						<div class="item-circle" id="item-circle-freeze1">
							<img src="../../../srcs/game/assets/image/freeze.png" alt="Item 2">
							<div class="overlay" id="overlay-freeze-1"></div>
							<div class="overlay-reloading-freeze" id="overlay-reloading-freeze-1"></div>
						</div>
					</div>
				</div>
				<div class="container-Player2" id="container-player2-id">
					<h1>${localStorage.getItem("Player3")} - ${localStorage.getItem("Player4")}</h1>
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
						<div class="item-circle" id="item-circle-freeze2">
							<img src="../../../srcs/game/assets/image/freeze.png" alt="Item 2">
							<div class="overlay" id="overlay-freeze-2"></div>
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
					<button class="leave_game_2" id="leave_game_2_id" onclick="create_2v2_game(event)">Quitter la partie</button>
				</div>
			</div>
		`;
    }
    cleanup() {
        document.removeEventListener("keydown", this.boundKeyPressHandler);
        clearInterval(this.gameLoop);
    }
    leave_game_2_multi() {
        document.getElementById("leave_game_2_id").addEventListener("click", () => {
            console.log("leave_the_game2222222222");
            this.cleanup();
            setLeaveGameVar(true);
            if (!is_init)
                disable_skin_multi_podium_default();
            else
                disable_skin_multi_podium();
            space_pressed = false;
            bool = false;
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
            container_player1.style.visibility = "visible";
            container_player2.style.visibility = "visible";
        }
        else {
            console.log("powerUP_value_multi je rentre ici222");
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
        document.getElementById("overlay-freeze-1").classList.toggle("active", nb_powerUP_teammate_player1 === 0);
        document.getElementById("overlay-freeze-2").classList.toggle("active", nb_powerUP_teammate_player2 === 0);
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
                            itemCircle = document.getElementById("item-circle-freeze1");
                            break;
                        case "1":
                            overlayReloading = document.getElementById("overlay-reloading-grenade-2");
                            itemCircle = document.getElementById("item-circle-grenade2");
                            break;
                        case "2":
                            overlayReloading_teammate = document.getElementById("overlay-reloading-freeze-2");
                            itemCircle = document.getElementById("item-circle-freeze2");
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
    checkGameOver() {
        if (window.location.pathname !== "/multi_player_game")
            return;
        const winnerContainer = document.querySelector(".container-EndGame");
        let team_player1_win = getIsTeam1Win();
        let team_player2_win = getIsTeam2Win();
        const container_player1 = document.getElementById("container-player1-id");
        const container_player2 = document.getElementById("container-player2-id");
        if (!winnerContainer)
            return;
        if (isGameFinished()) {
            winnerContainer.classList.add("active");
            clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
            if (team_player1_win) {
                document.getElementById("Winner_id").innerHTML = localStorage.getItem("Player1") + " - " + localStorage.getItem("Player2");
                document.getElementById("looser_id").innerHTML = localStorage.getItem("Player3") + " - " + localStorage.getItem("Player4");
            }
            else if (team_player2_win) {
                document.getElementById("Winner_id").innerHTML = localStorage.getItem("Player3") + " - " + localStorage.getItem("Player4");
                document.getElementById("looser_id").innerHTML = localStorage.getItem("Player1") + " - " + localStorage.getItem("Player2");
            }
            container_player1.style.visibility = "hidden";
            container_player2.style.visibility = "hidden";
        }
        else {
            winnerContainer.classList.remove("active");
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfcGxheWVyX2dhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wdWJsaWMvc3RhdGljL2pzL3ZpZXdzL211bHRpX3BsYXllcl9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDOUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sbUVBQW1FLENBQUM7QUFDOUcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sMkVBQTJFLENBQUM7QUFDOUgsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFFNUYsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQzFCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNqQixJQUFJLE9BQU8sR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO0FBRWpDLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBUXhDO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNwQixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lB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bnQiOlsiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IGdldFBvd2VyVVBfdmFsdWVfbXVsdGkgfSBmcm9tIFwiLi9HYW1lX21lbnUuanNcIjtcbmltcG9ydCB7IGxlYXZlX011bHRpcGxheWVyX0dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBzZXRMZWF2ZUdhbWVWYXIgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IGRpc2FibGVfc2tpbl9tdWx0aV9wb2RpdW0gfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L211bHRpcGxheWVyL2luaXRfdGVhbVBsYXllcl9wb2RpdW0uanNcIjtcbmltcG9ydCB7IGlzR2FtZUZpbmlzaGVkIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xuaW1wb3J0IHsgZ2V0SXNUZWFtMVdpbiwgZ2V0SXNUZWFtMldpbiB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc2NvcmUuanNcIjtcbmltcG9ydCB7IGRpc2FibGVfc2tpbl9tdWx0aV9wb2RpdW1fZGVmYXVsdCB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvbXVsdGlwbGF5ZXIvaW5pdF90ZWFtUGxheWVyX3BvZGl1bV9kZWZhdWx0LmpzXCI7XG5pbXBvcnQgeyBnZXRfc2tpbl9pc19pbml0IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvL3NraW4vaW5pdF9za2luX3V0aWxzLmpzXCI7XG5cbmxldCBzcGFjZV9wcmVzc2VkID0gZmFsc2U7XG5sZXQgYm9vbCA9IGZhbHNlO1xubGV0IGlzX2luaXQgPSBnZXRfc2tpbl9pc19pbml0KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblxuXHRjb29sZG93bnM6IGFueTtcblx0Y29vbGRvd25UaW1lczogYW55O1xuXHRib3VuZEtleVByZXNzSGFuZGxlcjogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xuXHRnYW1lTG9vcDogbnVtYmVyIHwgbnVsbDtcblx0XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwibXVsdGlfcGxheWVyX2dhbWVcIik7XG5cblx0XHR0aGlzLmNvb2xkb3ducyA9IHt9O1xuXG5cdFx0dGhpcy5jb29sZG93blRpbWVzID0ge1xuXHRcdFx0XCJ6XCI6IDE1MDAwLFxuXHRcdFx0XCJ4XCI6IDE1MDAwLFxuXHRcdFx0XCIxXCI6IDE1MDAwLFxuXHRcdFx0XCIyXCI6IDE1MDAwLFxuXHRcdFx0XCIgXCI6IDEwMDAsXG5cdFx0fTtcblxuXHRcdGlmIChib29sID09PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5ib3VuZEtleVByZXNzSGFuZGxlciA9IHRoaXMuaGFuZGxlS2V5UHJlc3MuYmluZCh0aGlzKTtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXG5cdFx0XHRpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBcIi9tdWx0aV9wbGF5ZXJfZ2FtZVwiKSB7XG5cdFx0XHRcdHRoaXMuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuY2hlY2tHYW1lT3ZlcigpO30sIDEwMDAgKTtcblx0XHRcdH1cblx0XHRcdGJvb2wgPSB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgbnVsbCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2FjY2Vzc1Rva2VuJyk7XG5cdFx0aWYgKCFhY2Nlc3NUb2tlbiB8fCBhY2Nlc3NUb2tlbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsICcvJyk7XG5cdFx0XHRpbXBvcnQoJy4vSG9tZS5qcycpLnRoZW4oKG1vZHVsZTogYW55KSA9PiB7XG5cdFx0XHRcdGNvbnN0IEhvbWUgPSBtb2R1bGUuZGVmYXVsdDtcblx0XHRcdFx0Y29uc3QgaG9tZUluc3RhbmNlID0gbmV3IEhvbWUoKTtcblx0XHRcdFx0aG9tZUluc3RhbmNlLmdldEh0bWwoKS50aGVuKChodG1sOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRjb25zdCBhcHBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuXHRcdFx0XHRcdGlmIChhcHBFbGVtZW50KSB7XG5cdFx0XHRcdFx0XHRhcHBFbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG5cdFx0XHRcdFx0XHRpZiAoaG9tZUluc3RhbmNlLmNyZWF0ZUFjY291bnQgJiYgdHlwZW9mIGhvbWVJbnN0YW5jZS5jcmVhdGVBY2NvdW50ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRcdGhvbWVJbnN0YW5jZS5jcmVhdGVBY2NvdW50KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGFzeW5jIGdldEh0bWwoKSB7XG5cdFx0cmV0dXJuIC8qaHRtbCovYFxuXHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvbXVsdGlfcGxheWVyX2dhbWUuY3NzXCI+XG5cdFx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInByZXNzX3NwYWNlXCIgPlxuXHRcdFx0XHRcdDxoMSBpZD1cInByZXNzX3NwYWNlX2lkXCI+UHJlc3MgU1BBQ0UgdG8gU3RhcnQ8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1QbGF5ZXIxXCIgaWQ9XCJjb250YWluZXItcGxheWVyMS1pZFwiPlxuXHRcdFx0XHRcdDxoMT4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyMVwiKX0gLSAke2xvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyMlwiKX08L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItaXRlbV9wbGF5ZXIxXCI+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tZ3JlbmFkZS0xXCI+PC9wPlxuXHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0b3VjaF9wbGF5ZXIxXCI+WjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtZ3JlbmFkZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVmbGFzaFRlc3QuanBnXCIgYWx0PVwiSXRlbSAxXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWdyZW5hZGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tdGVhbW1hdGUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidG91Y2hfcGxheWVyMVwiPlg8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWZyZWV6ZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ZyZWV6ZS5wbmdcIiBhbHQ9XCJJdGVtIDJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktZnJlZXplLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZVwiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctZnJlZXplLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1QbGF5ZXIyXCIgaWQ9XCJjb250YWluZXItcGxheWVyMi1pZFwiPlxuXHRcdFx0XHRcdDxoMT4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyM1wiKX0gLSAke2xvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyNFwiKX08L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItaXRlbV9wbGF5ZXIyXCI+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tZ3JlbmFkZS0yXCI+PC9wPlxuXHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0b3VjaF9wbGF5ZXIyXCI+MTwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtZ3JlbmFkZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVmbGFzaFRlc3QuanBnXCIgYWx0PVwiSXRlbSAxXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tdGVhbW1hdGUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidG91Y2hfcGxheWVyMlwiPjI8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWZyZWV6ZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ZyZWV6ZS5wbmdcIiBhbHQ9XCJJdGVtIDJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktZnJlZXplLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZVwiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctZnJlZXplLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1FbmRHYW1lXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIndpbm5lclwiPlxuXHRcdFx0XHRcdFx0PGgxIGlkPVwiV2lubmVyX2lkXCI+PC9oMT5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibG9vc2VyXCI+XG5cdFx0XHRcdFx0XHQ8aDEgaWQ9XCJsb29zZXJfaWRcIj48L2gxPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJsZWF2ZV9nYW1lXzJcIiBpZD1cImxlYXZlX2dhbWVfMl9pZFwiIG9uY2xpY2s9XCJjcmVhdGVfMnYyX2dhbWUoZXZlbnQpXCI+UXVpdHRlciBsYSBwYXJ0aWU8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXHR9XG5cblx0Y2xlYW51cCgpIHtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyKTtcblx0XHRjbGVhckludGVydmFsKHRoaXMuZ2FtZUxvb3ApO1xuXHR9XG5cblx0bGVhdmVfZ2FtZV8yX211bHRpKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV8yX2lkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImxlYXZlX3RoZV9nYW1lMjIyMjIyMjIyMlwiKTtcblx0XHRcdHRoaXMuY2xlYW51cCgpO1xuXG5cdFx0XHRzZXRMZWF2ZUdhbWVWYXIodHJ1ZSk7XG5cdFx0XHRpZiAoIWlzX2luaXQpXG5cdFx0XHRcdGRpc2FibGVfc2tpbl9tdWx0aV9wb2RpdW1fZGVmYXVsdCgpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkaXNhYmxlX3NraW5fbXVsdGlfcG9kaXVtKCk7XG5cdFx0XHRzcGFjZV9wcmVzc2VkID0gZmFsc2U7XG5cdFx0XHRib29sID0gZmFsc2U7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUyXCIsIFwidnVlNFwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRcdGxlYXZlX011bHRpcGxheWVyX0dhbWUoKTtcblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXHR9XG5cblx0aW5pdF9wb3dlclVQX3BsYXllcl9tdWx0aSgpIHtcblxuXHRcdGNvbnN0IGNvbnRhaW5lcl9wbGF5ZXIxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyMS1pZFwiKTtcblx0XHRjb25zdCBjb250YWluZXJfcGxheWVyMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllcjItaWRcIik7XG5cblx0XHRjb25zb2xlLmxvZyhcInBvd2VyVVBfdmFsdWVfbXVsdGlcIiwgZ2V0UG93ZXJVUF92YWx1ZV9tdWx0aSgpKTtcbiAgICAgICAgaWYgKGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKSAhPT0gMCkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJwb3dlclVQX3ZhbHVlX211bHRpIGplIHJlbnRyZSBpY2lcIik7XG5cdFx0XHRjb250YWluZXJfcGxheWVyMS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG5cdFx0XHRjb250YWluZXJfcGxheWVyMi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG5cdFx0fVxuICAgICAgICBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKFwicG93ZXJVUF92YWx1ZV9tdWx0aSBqZSByZW50cmUgaWNpMjIyXCIpO1xuXHRcdFx0Y29udGFpbmVyX3BsYXllcjEuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRjb250YWluZXJfcGxheWVyMi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHR9XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKS50b1N0cmluZygpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0yXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKS50b1N0cmluZygpO1xuXHR9XG5cblx0dXBkYXRlT3ZlcmxheXMoKSB7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0xXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjIgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWdyZW5hZGUtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktZ3JlbmFkZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjIgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1mcmVlemUtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMSA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWZyZWV6ZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIyID09PSAwKTtcblx0fVxuXG5cdGhhbmRsZUtleVByZXNzKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG5cdFx0Ly8gVsOpcmlmaWVyIHNpIGxhIHRvdWNoZSBlc3QgdW5lIHRvdWNoZSBkZSBsJ2ludmVudGFpcmVcblx0XHRjb25zdCBrZXkgPSBldmVudC5rZXk7XG5cdFx0XG5cdFx0aWYgKCEoa2V5IGluIHRoaXMuY29vbGRvd25UaW1lcykpIHJldHVybjtcblx0XG5cdFx0Ly8gVsOpcmlmaWVyIHNpIGxhIHRvdWNoZSBlc3QgZW4gY29vbGRvd25cblx0XHRpZiAodGhpcy5jb29sZG93bnNba2V5XSkgcmV0dXJuOyAvLyBJZ25vcmUgbCdhY3Rpb24gc2kgZW4gY29vbGRvd25cblxuXHRcdGlmIChrZXkgPT09IFwiIFwiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcInNwYWNlIHByZXNzZWRcIik7XG5cdFx0XHRjb25zdCBwcmVzc19zcGFjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJlc3Nfc3BhY2VfaWRcIik7XG5cdFx0XHRpZiAocHJlc3Nfc3BhY2UpIHtcblx0XHRcdFx0cHJlc3Nfc3BhY2Uuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLmFuaW1hdGlvbiA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcInByZXNzX3NwYWNlX2lkIGludHJvdXZhYmxlICFcIik7XG5cdFx0XHR9XG5cdFx0XHRzcGFjZV9wcmVzc2VkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoc3BhY2VfcHJlc3NlZClcblx0XHR7XG5cdFx0bGV0IGVsZW0gPSBudWxsO1xuXHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRjYXNlIFwielwiOlxuXHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwieFwiOlxuXHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIjFcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTJcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIjJcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0yXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFx0aWYgKGVsZW0pIHtcblx0XHRcdGxldCBjdXJyZW50VmFsdWUgPSBwYXJzZUludChlbGVtLmlubmVySFRNTCwgMTApO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+IDApIHtcblx0XHRcdFx0ZWxlbS5pbm5lckhUTUwgPSAoY3VycmVudFZhbHVlIC0gMSkudG9TdHJpbmcoKTsgLy9OT1RFIC0gamFpIGNoYW5nZXIgbGUgdHlwZSBwb3VyIHF1ZSBjYSBwYXNzZSBpY2lcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnNvbGUubG9nKGAke2tleX0gdXRpbGlzw6ksIGNvb2xkb3duIGFjdGl2w6kgcG91ciAke3RoaXMuY29vbGRvd25UaW1lc1trZXldfW1zYCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBNZXR0cmUgZW4gY29vbGRvd24gY2V0dGUgdG91Y2hlXG5cdFx0XHRcdHRoaXMuY29vbGRvd25zW2tleV0gPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gQWpvdXRlciBsYSBjbGFzc2UgZCdhbmltYXRpb24gcG91ciBkw6ltYXJyZXIgbCdvdmVybGF5IHJlbG9hZGluZ1xuXHRcdFx0XHRsZXQgaXRlbUNpcmNsZSA9IG51bGw7XG5cdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nID0gbnVsbDtcblx0XHRcdFx0bGV0IG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgPSBudWxsO1xuXG5cdFx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMVwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWdyZW5hZGUxXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZS0xXCIpO1xuXHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtZnJlZXplMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTJcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMlwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWZyZWV6ZTJcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgLSAxID09PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aXRlbUNpcmNsZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlT3ZlcmxheXMoKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZyAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpdGVtQ2lyY2xlKSB7XG5cdFx0XHRcdFx0aXRlbUNpcmNsZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuY29vbGRvd25zW2tleV07XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7a2V5fSBjb29sZG93biB0ZXJtaW7DqWApO1xuXHRcblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZyAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXG5cdFx0XHRcdFx0aWYgKG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMClcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAoaXRlbUNpcmNsZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHRcdFx0aXRlbUNpcmNsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXG5cdFx0XHRcdH0sIHRoaXMuY29vbGRvd25UaW1lc1trZXldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNoZWNrR2FtZU92ZXIoKSB7XG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvbXVsdGlfcGxheWVyX2dhbWVcIilcblx0XHRcdHJldHVybjtcblx0XHRjb25zdCB3aW5uZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lci1FbmRHYW1lXCIpO1xuXHRcdGxldCB0ZWFtX3BsYXllcjFfd2luID0gZ2V0SXNUZWFtMVdpbigpO1xuXHRcdGxldCB0ZWFtX3BsYXllcjJfd2luID0gZ2V0SXNUZWFtMldpbigpO1xuXHRcdGNvbnN0IGNvbnRhaW5lcl9wbGF5ZXIxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyMS1pZFwiKTtcblx0XHRjb25zdCBjb250YWluZXJfcGxheWVyMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllcjItaWRcIik7XG5cdFx0aWYgKCF3aW5uZXJDb250YWluZXIpXG5cdFx0XHRyZXR1cm47XG5cdFx0aWYgKGlzR2FtZUZpbmlzaGVkKCkpIHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTsgLy8gQXJyw6p0ZSBsYSBib3VjbGUgcXVhbmQgbGEgcGFydGllIGVzdCBmaW5pZVxuICAgICAgICAgICAgaWYgKHRlYW1fcGxheWVyMV93aW4pIHtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJXaW5uZXJfaWRcIikuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJQbGF5ZXIxXCIpICsgXCIgLSBcIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyMlwiKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb29zZXJfaWRcIikuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJQbGF5ZXIzXCIpICsgXCIgLSBcIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyNFwiKTtcblx0XHRcdH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRlYW1fcGxheWVyMl93aW4pIHtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJXaW5uZXJfaWRcIikuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJQbGF5ZXIzXCIpICsgXCIgLSBcIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyNFwiKTtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb29zZXJfaWRcIikuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJQbGF5ZXIxXCIpICsgXCIgLSBcIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyMlwiKTtcblx0XHRcdH1cblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIxLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuXHRcdFx0Y29udGFpbmVyX3BsYXllcjIuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0fVxuICAgICAgICBlbHNlIHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fVxufVxuIl19