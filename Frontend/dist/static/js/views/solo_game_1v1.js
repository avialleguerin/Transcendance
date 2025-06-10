import AbstractView from "./AbstractView.js";
import { getPowerUP_value } from "./Game_menu.js";
import { leave_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { setLeaveGameVar } from "../index.js";
import { isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { disable_skin_perso_player_first_and_seconde } from "../../../srcs/game/gameplay/solo/skin/init_skin_player_podium.js";
import { getPlayer_1_win, getPlayer_2_win } from "../../../srcs/game/gameplay/score.js";
import { disable_skin_perso_player_first_and_seconde_default } from "../../../srcs/game/gameplay/solo/skin/init_skin_player_default.js";
import { get_skin_is_init } from "../../../srcs/game/gameplay/solo/skin/init_skin_utils.js";
let spacePressed = false;
let bool = false;
let is_init = get_skin_is_init();
export default class solo_game extends AbstractView {
    constructor() {
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
        if (bool == false) {
            if (window.location.pathname === "/solo_game_1v1") {
                console.log("solo_game_1v1.js ////////////////////////////////////////////////////////////////////////////////////////////////////////");
                document.addEventListener("keydown", this.boundKeyPressHandler);
                this.gameLoop = setInterval(() => { this.checkGameOver(); }, 1000);
                bool = true;
            }
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

				<div class="container-Player1" id="container-player1_id">
					<h1 id="player1-username" >${localStorage.getItem('Player1')}</h1>
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
					<h1 id="player1-username" >${localStorage.getItem('Player2')}</h1>
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
					<div class="place_playerName">
						<div class="winner">
							<h1 id="winner_id"></h1>
						</div>
						<div class="looser">
							<h1 id="looser_id"></h1>
						</div>
					</div>
					<button class="leave_game_2" id="leave_game_2_id" onclick="create_1v1_game(event, '${localStorage.getItem('Player1')}', '${localStorage.getItem('Player2')}')">Quitter la partie</button>
				</div>
			</div>
		`;
    }
    cleanup() {
        document.removeEventListener("keydown", this.boundKeyPressHandler);
        clearInterval(this.gameLoop);
    }
    leave_game_2() {
        document.getElementById("leave_game_2_id").addEventListener("click", () => {
            this.cleanup();
            setLeaveGameVar(true);
            if (!is_init)
                disable_skin_perso_player_first_and_seconde_default();
            else
                disable_skin_perso_player_first_and_seconde();
            spacePressed = false;
            bool = false;
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
        const key = event.key;
        // Vérifier si la touche a un cooldown défini
        if (!(key in this.cooldownTimes))
            return;
        if (this.cooldowns[key]) {
            return;
        } // Ignore l'action si en cooldown
        // Vérifier si la touche est en cooldown
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
                    elem.innerHTML = (currentValue - 1).toString();
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
                        //  vérifiez que this.cooldowns est bien accessible
                        // Terminer le cooldown et arrêter l'animation
                        delete this.cooldowns[key];
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
    checkGameOver() {
        if (window.location.pathname !== "/solo_game_1v1")
            return;
        const winnerContainer = document.querySelector(".container-EndGame");
        let player_1_win = getPlayer_1_win();
        let player_2_win = getPlayer_2_win();
        const container_player1 = document.getElementById("container-player1_id");
        const container_player2 = document.getElementById("container-player2_id");
        if (!winnerContainer)
            return;
        if (isGameFinished()) {
            winnerContainer.classList.add("active");
            clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
            if (player_1_win) {
                document.getElementById("winner_id").innerHTML = `${localStorage.getItem("Player1")}`;
                document.getElementById("looser_id").innerHTML = `${localStorage.getItem("Player2")}`;
            }
            else if (player_2_win) {
                document.getElementById("winner_id").innerHTML = `${localStorage.getItem("Player2")}`;
                document.getElementById("looser_id").innerHTML = `${localStorage.getItem("Player1")}`;
            }
            if (container_player1.classList.contains("active"))
                container_player1.classList.remove("active");
            if (container_player2.classList.contains("active"))
                container_player2.classList.remove("active");
        }
        else {
            winnerContainer.classList.remove("active");
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sb19nYW1lXzF2MS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3Mvc29sb19nYW1lXzF2MS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDcEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM5QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdEUsT0FBTyxFQUFFLDJDQUEyQyxFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDL0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN4RixPQUFPLEVBQUUsbURBQW1ELEVBQUUsTUFBTSxtRUFBbUUsQ0FBQztBQUN4SSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUU1RixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDekIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLElBQUksT0FBTyxHQUFHLGdCQUFnQixFQUFFLENBQUM7QUFFakMsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsWUFBWTtJQVFsRDtRQUNDLE1BQU0sV0FBVyxHQUFrQixjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMv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QUFRLENBQUM7Z0JBQ2pELGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUMsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDakQsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDO2FBRUQsQ0FBQztZQUNBLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUM7SUFDRixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgZ2V0UG93ZXJVUF92YWx1ZSB9IGZyb20gXCIuL0dhbWVfbWVudS5qc1wiO1xuaW1wb3J0IHsgbGVhdmVfR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbmltcG9ydCB7IHNldExlYXZlR2FtZVZhciB9IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuaW1wb3J0IHsgaXNHYW1lRmluaXNoZWQgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3Njb3JlLmpzXCI7XG5pbXBvcnQgeyBkaXNhYmxlX3NraW5fcGVyc29fcGxheWVyX2ZpcnN0X2FuZF9zZWNvbmRlIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvL3NraW4vaW5pdF9za2luX3BsYXllcl9wb2RpdW0uanNcIjtcbmltcG9ydCB7IGdldFBsYXllcl8xX3dpbiwgZ2V0UGxheWVyXzJfd2luIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xuaW1wb3J0IHsgZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9maXJzdF9hbmRfc2Vjb25kZV9kZWZhdWx0IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvL3NraW4vaW5pdF9za2luX3BsYXllcl9kZWZhdWx0LmpzXCI7XG5pbXBvcnQgeyBnZXRfc2tpbl9pc19pbml0IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvL3NraW4vaW5pdF9za2luX3V0aWxzLmpzXCI7XG5cbmxldCBzcGFjZVByZXNzZWQgPSBmYWxzZTtcbmxldCBib29sID0gZmFsc2U7XG5sZXQgaXNfaW5pdCA9IGdldF9za2luX2lzX2luaXQoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mgc29sb19nYW1lIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblxuXHRcblx0Y29vbGRvd25zOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfTtcblx0Y29vbGRvd25UaW1lczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcblx0Ym91bmRLZXlQcmVzc0hhbmRsZXI6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcblx0Z2FtZUxvb3A6IG51bWJlciB8IG51bGw7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Y29uc3QgYWNjZXNzVG9rZW46IHN0cmluZyB8IG51bGwgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhY2Nlc3NUb2tlbicpO1xuXHRcdGlmICghYWNjZXNzVG9rZW4gfHwgYWNjZXNzVG9rZW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCAnLycpO1xuXHRcdFx0aW1wb3J0KCcuL0hvbWUuanMnKS50aGVuKChtb2R1bGU6IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBIb21lID0gbW9kdWxlLmRlZmF1bHQ7XG5cdFx0XHRcdGNvbnN0IGhvbWVJbnN0YW5jZSA9IG5ldyBIb21lKCk7XG5cdFx0XHRcdGhvbWVJbnN0YW5jZS5nZXRIdG1sKCkudGhlbigoaHRtbDogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgYXBwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKTtcblx0XHRcdFx0XHRpZiAoYXBwRWxlbWVudCkge1xuXHRcdFx0XHRcdFx0YXBwRWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuXHRcdFx0XHRcdFx0aWYgKGhvbWVJbnN0YW5jZS5jcmVhdGVBY2NvdW50ICYmIHR5cGVvZiBob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHRob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwic29sb19nYW1lXCIpO1xuXG5cdFx0dGhpcy5jb29sZG93bnMgPSB7fTtcblxuXHRcdHRoaXMuY29vbGRvd25UaW1lcyA9IHtcblx0XHRcdFwielwiOiAxNTAwMCxcblx0XHRcdFwieFwiOiAyMDAwMCxcblx0XHRcdFwiY1wiOiAxNTAwMCxcblx0XHRcdFwiMVwiOiAxNTAwMCxcblx0XHRcdFwiMlwiOiAyMDAwMCxcblx0XHRcdFwiM1wiOiAxNTAwMCxcblx0XHRcdFwidFwiOiAxMDAwLFxuXHRcdFx0XCIgXCI6IDEwMDAsXG5cdFx0fTtcblxuXHRcdHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIgPSB0aGlzLmhhbmRsZUtleVByZXNzLmJpbmQodGhpcyk7XG4gICAgXG5cdFx0XG5cdFx0aWYgKGJvb2wgPT0gZmFsc2UpIHtcblx0XHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IFwiL3NvbG9fZ2FtZV8xdjFcIikge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcInNvbG9fZ2FtZV8xdjEuanMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cIik7XG5cblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5ib3VuZEtleVByZXNzSGFuZGxlcik7XG5cdFx0XHRcdHRoaXMuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuY2hlY2tHYW1lT3ZlcigpO30sIDEwMDAgKTtcblx0XHRcdFx0Ym9vbCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgZ2V0SHRtbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdHJldHVybiAvKmh0bWwqL2Bcblx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi9zdGF0aWMvanMvY3NzL3NvbG9fZ2FtZV8xdjEuY3NzXCI+XG5cdFx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInByZXNzX3NwYWNlXCIgPlxuXHRcdFx0XHRcdDxoMSBpZD1cInByZXNzX3NwYWNlX2lkXCI+UHJlc3MgU1BBQ0UgdG8gU3RhcnQ8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLVBsYXllcjFcIiBpZD1cImNvbnRhaW5lci1wbGF5ZXIxX2lkXCI+XG5cdFx0XHRcdFx0PGgxIGlkPVwicGxheWVyMS11c2VybmFtZVwiID4ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdQbGF5ZXIxJyl9PC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWl0ZW1fcGxheWVyMVwiPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWdyZW5hZGUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidG91Y2hfcGxheWVyMVwiPlo8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWdyZW5hZGUxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlZmxhc2hUZXN0LmpwZ1wiIGFsdD1cIkl0ZW0gMVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1ncmVuYWRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLXRlYW1tYXRlLTFcIj48L3A+XG5cdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRvdWNoX3BsYXllcjFcIj5YPC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS10ZWFtbWF0ZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RlYW1tYXRldjMucG5nXCIgYWx0PVwiSXRlbSAyXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LXRlYW1tYXRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy10ZWFtbWF0ZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1hdXRyZS0xXCI+PC9wPlxuXHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0b3VjaF9wbGF5ZXIxXCI+QzwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtaW52ZXJzZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ludmVyc2VfcG93ZXJVUC5wbmdcIiBhbHQ9XCJJdGVtIDNcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktaW52ZXJzZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZ1wiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctaW52ZXJzZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItUGxheWVyMlwiIGlkPVwiY29udGFpbmVyLXBsYXllcjJfaWRcIj5cblx0XHRcdFx0XHQ8aDEgaWQ9XCJwbGF5ZXIxLXVzZXJuYW1lXCIgPiR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjInKX08L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItaXRlbV9wbGF5ZXIyXCI+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tZ3JlbmFkZS0yXCI+PC9wPlxuXHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0b3VjaF9wbGF5ZXIyXCI+MTwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtZ3JlbmFkZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVmbGFzaFRlc3QuanBnXCIgYWx0PVwiSXRlbSAxXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tdGVhbW1hdGUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidG91Y2hfcGxheWVyMlwiPjI8L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLXRlYW1tYXRlMlwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGVhbW1hdGV2My5wbmdcIiBhbHQ9XCJJdGVtIDJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktdGVhbW1hdGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGVcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWF1dHJlLTJcIj48L3A+XG5cdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRvdWNoX3BsYXllcjJcIj4zPC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS1pbnZlcnNlMlwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvaW52ZXJzZV9wb3dlclVQLnBuZ1wiIGFsdD1cIkl0ZW0gM1wiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1pbnZlcnNlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1pbnZlcnNlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1FbmRHYW1lXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBsYWNlX3BsYXllck5hbWVcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ3aW5uZXJcIj5cblx0XHRcdFx0XHRcdFx0PGgxIGlkPVwid2lubmVyX2lkXCI+PC9oMT5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImxvb3NlclwiPlxuXHRcdFx0XHRcdFx0XHQ8aDEgaWQ9XCJsb29zZXJfaWRcIj48L2gxPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImxlYXZlX2dhbWVfMlwiIGlkPVwibGVhdmVfZ2FtZV8yX2lkXCIgb25jbGljaz1cImNyZWF0ZV8xdjFfZ2FtZShldmVudCwgJyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BsYXllcjEnKX0nLCAnJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGxheWVyMicpfScpXCI+UXVpdHRlciBsYSBwYXJ0aWU8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXHR9XG5cblx0Y2xlYW51cCgpIHtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyKTtcblx0XHRjbGVhckludGVydmFsKHRoaXMuZ2FtZUxvb3ApO1xuXHR9XG5cblx0bGVhdmVfZ2FtZV8yKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV8yX2lkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRcblx0XHRcdHRoaXMuY2xlYW51cCgpO1xuXHRcdFx0c2V0TGVhdmVHYW1lVmFyKHRydWUpO1xuXHRcdFx0aWYgKCFpc19pbml0KVxuXHRcdFx0XHRkaXNhYmxlX3NraW5fcGVyc29fcGxheWVyX2ZpcnN0X2FuZF9zZWNvbmRlX2RlZmF1bHQoKTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGlzYWJsZV9za2luX3BlcnNvX3BsYXllcl9maXJzdF9hbmRfc2Vjb25kZSgpO1xuXHRcdFx0c3BhY2VQcmVzc2VkID0gZmFsc2U7XG5cdFx0XHRib29sID0gZmFsc2U7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUyXCIsIFwidnVlNFwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRcdGxlYXZlX0dhbWUoKTtcblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXHR9XG5cdFx0XG5cblx0aW5pdF9wb3dlclVQX3BsYXllcigpIHtcblx0XHRjb25zb2xlLmxvZyhcInBvd2VyVVAgdmFsdWUgPT0gXCIsIGdldFBvd2VyVVBfdmFsdWUoKSk7XG5cblx0XHRjb25zdCBjb250YWluZXJfcGxheWVyMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllcjFfaWRcIik7XG5cdFx0Y29uc3QgY29udGFpbmVyX3BsYXllcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXIyX2lkXCIpO1xuICAgICAgICBpZiAoZ2V0UG93ZXJVUF92YWx1ZSgpICE9PSAwKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcInBvd2VyVVAgdmFsdWVqZSByZWVlZWVkamtoa2plZndoamtld2hma2p3ZSA9PSBcIiwgZ2V0UG93ZXJVUF92YWx1ZSgpKTtcblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIxLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRjb250YWluZXJfcGxheWVyMi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdH1cbiAgICAgICAgZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiBlbHNlICAgIHBvd2VyVVAgdmFsdWVqZSByZWVlZWVkamtoa2plZndoamtld2hma2p3ZSA9PSBcIiwgZ2V0UG93ZXJVUF92YWx1ZSgpKTtcblx0XHRcdGlmIChjb250YWluZXJfcGxheWVyMS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpXG5cdFx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIxLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRpZiAoY29udGFpbmVyX3BsYXllcjIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKVxuXHRcdFx0XHRjb250YWluZXJfcGxheWVyMi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0fVxuXG5cdHVwZGF0ZU92ZXJsYXlzKCkge1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIxID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMiA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTJcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIxID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTJcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9pbnZlcnNlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX2ludmVyc2VfcGxheWVyMiA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1hdXRyZS0yXCIpLmlubmVySFRNTCwgMTApO1xuXHRcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktZ3JlbmFkZS0xXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjEgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1ncmVuYWRlLTJcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMiA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXRlYW1tYXRlLTFcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjEgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS10ZWFtbWF0ZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIyID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktaW52ZXJzZS0xXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9pbnZlcnNlX3BsYXllcjEgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1pbnZlcnNlLTJcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX2ludmVyc2VfcGxheWVyMiA9PT0gMCk7XG5cdH1cblxuXHRoYW5kbGVLZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkgeyAvL05PVEUgLSBqYWkgYWpvdXRlciBsZSB0eXBlIGV2ZW50OiBLZXlib2FyZEV2ZW50XG5cdFx0Y29uc3Qga2V5ID0gZXZlbnQua2V5O1xuXHRcdFxuXHRcdFxuXHRcdFxuXHRcdFxuXHRcdC8vIFbDqXJpZmllciBzaSBsYSB0b3VjaGUgYSB1biBjb29sZG93biBkw6lmaW5pXG5cdFx0aWYgKCEoa2V5IGluIHRoaXMuY29vbGRvd25UaW1lcykpIHJldHVybjtcblx0XHRcblx0XHRpZiAodGhpcy5jb29sZG93bnNba2V5XSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH0gLy8gSWdub3JlIGwnYWN0aW9uIHNpIGVuIGNvb2xkb3duXG5cdFx0Ly8gVsOpcmlmaWVyIHNpIGxhIHRvdWNoZSBlc3QgZW4gY29vbGRvd25cblxuXHRcdGlmIChrZXkgPT09IFwiIFwiKSB7XG5cdFx0XHRjb25zdCBwcmVzc19zcGFjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJlc3Nfc3BhY2VfaWRcIik7XG5cdFx0XHRpZiAocHJlc3Nfc3BhY2UpIHtcblx0XHRcdFx0cHJlc3Nfc3BhY2Uuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLmFuaW1hdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJwcmVzc19zcGFjZV9pZCBpbnRyb3V2YWJsZSAhXCIpO1xuXHRcdFx0fVxuXHRcdFx0c3BhY2VQcmVzc2VkID0gdHJ1ZTtcblx0XHR9XG5cblxuXHRcdGlmIChzcGFjZVByZXNzZWQpXG5cdFx0e1xuXHRcdFx0bGV0IGVsZW0gPSBudWxsO1xuXHRcdFx0c3dpdGNoIChrZXkpIHtcblx0XHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjXCI6XG5cdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1hdXRyZS0xXCIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiMVwiOlxuXHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiMlwiOlxuXHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIjNcIjpcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTJcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XG5cdFx0XHRpZiAoZWxlbSkge1xuXHRcdFx0XHRsZXQgY3VycmVudFZhbHVlID0gcGFyc2VJbnQoZWxlbS5pbm5lckhUTUwsIDEwKTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+IDApIHtcblx0XHRcdFx0XHRlbGVtLmlubmVySFRNTCA9IChjdXJyZW50VmFsdWUgLSAxKS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHRoaXMuY29vbGRvd25zW2tleV0gPSB0cnVlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIEFqb3V0ZXIgbGEgY2xhc3NlIGQnYW5pbWF0aW9uIHBvdXIgZMOpbWFycmVyIGwnb3ZlcmxheSByZWxvYWRpbmdcblx0XHRcdFx0XHRsZXQgaXRlbUNpcmNsZSA9IG51bGw7XG5cdFx0XHRcdFx0bGV0IG92ZXJsYXlSZWxvYWRpbmcgPSBudWxsO1xuXHRcdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gbnVsbDtcblxuXHRcdFx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdFx0XHRjYXNlIFwielwiOlxuXHRcdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWdyZW5hZGUxXCIpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCJ4XCI6XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlLTFcIik7XG5cdFx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMVwiKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIFwiY1wiOlxuXHRcdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1pbnZlcnNlLTFcIik7XG5cdFx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWludmVyc2UxXCIpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMlwiKTtcblx0XHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtZ3JlbmFkZTJcIik7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcIjJcIjpcblx0XHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtdGVhbW1hdGUyXCIpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCIzXCI6XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWludmVyc2UtMlwiKTtcblx0XHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtaW52ZXJzZTJcIik7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgLSAxID09PSAwKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlT3ZlcmxheXMoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZyAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0XHQvLyBMYW5jZXIgbCdhbmltYXRpb24gZW4gYWpvdXRhbnQgdW5lIGNsYXNzZSBDU1MgcG91ciBkw6ltYXJyZXJcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQXNzdXJlei12b3VzIHF1ZSAuaXRlbS1sb2FkaW5nIGVzdCBkw6lmaW5pIGRhbnMgdm90cmUgQ1NTXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChpdGVtQ2lyY2xlKSB7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0Ly8gTGFuY2VyIGwnYW5pbWF0aW9uIGVuIGFqb3V0YW50IHVuZSBjbGFzc2UgQ1NTIHBvdXIgZMOpbWFycmVyXG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFzc3VyZXotdm91cyBxdWUgLml0ZW0tbG9hZGluZyBlc3QgZMOpZmluaSBkYW5zIHZvdHJlIENTU1xuXHRcdFx0XHRcdH1cblx0XHRcblx0XHRcdFx0XHQvLyBSZXRpcmVyIGxlIGNvb2xkb3duIGFwcsOocyBsZSBkw6lsYWkgZMOpZmluaSBwb3VyIGNldHRlIHRvdWNoZVxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gIHbDqXJpZmlleiBxdWUgdGhpcy5jb29sZG93bnMgZXN0IGJpZW4gYWNjZXNzaWJsZVxuXG5cdFx0XHRcdFx0XHQvLyBUZXJtaW5lciBsZSBjb29sZG93biBldCBhcnLDqnRlciBsJ2FuaW1hdGlvblxuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMuY29vbGRvd25zW2tleV07XG5cdFx0XG5cdFx0XHRcdFx0XHQvLyBSZXRpcmVyIGxhIGNsYXNzZSBkJ2FuaW1hdGlvbiBhcHLDqHMgbGUgY29vbGRvd25cblx0XHRcdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoaXRlbUNpcmNsZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0sIHRoaXMuY29vbGRvd25UaW1lc1trZXldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNoZWNrR2FtZU92ZXIoKSB7XG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvc29sb19nYW1lXzF2MVwiKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHdpbm5lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLUVuZEdhbWVcIik7XG5cdFx0bGV0IHBsYXllcl8xX3dpbiA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdGxldCBwbGF5ZXJfMl93aW4gPSBnZXRQbGF5ZXJfMl93aW4oKTtcblx0XHRjb25zdCBjb250YWluZXJfcGxheWVyMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllcjFfaWRcIik7XG5cdFx0Y29uc3QgY29udGFpbmVyX3BsYXllcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXIyX2lkXCIpO1xuXG5cdFx0aWYgKCF3aW5uZXJDb250YWluZXIpXG5cdFx0XHRyZXR1cm47XG5cdFx0aWYgKGlzR2FtZUZpbmlzaGVkKCkpIHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTsgLy8gQXJyw6p0ZSBsYSBib3VjbGUgcXVhbmQgbGEgcGFydGllIGVzdCBmaW5pZVxuXHRcdFx0aWYgKHBsYXllcl8xX3dpbilcblx0XHRcdHtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aW5uZXJfaWRcIikuaW5uZXJIVE1MID0gYCR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJQbGF5ZXIxXCIpfWA7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9vc2VyX2lkXCIpLmlubmVySFRNTCA9IGAke2xvY2FsU3RvcmFnZS5nZXRJdGVtKFwiUGxheWVyMlwiKX1gO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocGxheWVyXzJfd2luKVxuXHRcdFx0e1xuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpbm5lcl9pZFwiKS5pbm5lckhUTUwgPSBgJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIlBsYXllcjJcIil9YDtcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb29zZXJfaWRcIikuaW5uZXJIVE1MID0gYCR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJQbGF5ZXIxXCIpfWA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY29udGFpbmVyX3BsYXllcjEuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKVxuXHRcdFx0XHRjb250YWluZXJfcGxheWVyMS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0aWYgKGNvbnRhaW5lcl9wbGF5ZXIyLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSlcblx0XHRcdFx0Y29udGFpbmVyX3BsYXllcjIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHR9XG5cdFx0ZWxzZSBcblx0XHR7XG5cdFx0XHR3aW5uZXJDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHR9XG5cdH1cbn0iXX0=