import AbstractView from "./AbstractView.js";
import { getPowerUP_value } from "./Game_menu.js";
import { leave_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { setLeaveGameVar } from "../index.js";
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
            "3": 15000
        };
        this.boundKeyPressHandler = this.handleKeyPress.bind(this);
        console.log("solo_game_1v1.js");
        document.addEventListener("keydown", this.boundKeyPressHandler);
    }
    async getHtml() {
        return `
			<link rel="stylesheet" href="./static/js/css/solo_game_1v1.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="container-leave">
					<button class="option" id="option_btn">
						<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
					</button>
				</div>
				<div class="panel" id="panel_id">
					<button class="option-in-panel" id="option_btn-remove">
						<img src="../../../srcs/game/assets/image/menu.svg" alt="leave">
					</button>
					<button class="leave_game" id="leave_game_id">
						<a href="/Game_menu" class="nav-link" data-link>Leave Game</a>
					</button>
				</div>

				<div class="container-Player1" id="container-player1_id">
					<h1>Player 1</h1>
					<div class="container-item_player1">
						<p id="nb-item-grenade-1"></p>
						<div class="item-circle" id="item-circle-grenade1">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-1"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-1"></div>
						</div>
						<p id="nb-item-teammate-1"></p>
						<div class="item-circle" id="item-circle-teammate1">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-1"></div>
							<div class="overlay-reloading-teammate" id="overlay-reloading-teammate-1"></div>
						</div>
						<p id="nb-item-autre-1"></p>
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
						<div class="item-circle" id="item-circle-grenade2">
							<img src="../../../srcs/game/assets/image/grenadeflashTest.jpg" alt="Item 1">
							<div class="overlay" id="overlay-grenade-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-grenade-2"></div>
						</div>
						<p id="nb-item-teammate-2"></p>
						<div class="item-circle" id="item-circle-teammate2">
							<img src="../../../srcs/game/assets/image/teammatev3.png" alt="Item 2">
							<div class="overlay" id="overlay-teammate-2"></div>
							<div class="overlay-reloading-teammate" id="overlay-reloading-teammate-2"></div>
						</div>
						<p id="nb-item-autre-2"></p>
						<div class="item-circle" id="item-circle-inverse2">
							<img src="../../../srcs/game/assets/image/inverse_powerUP.png" alt="Item 3">
							<div class="overlay" id="overlay-inverse-2"></div>
							<div class="overlay-reloading" id="overlay-reloading-inverse-2"></div>
						</div>
					</div>
				</div>
			</div>
		`;
    }
    cleanup() {
        console.log("Cleaning up solo game event listeners");
        document.removeEventListener("keydown", this.boundKeyPressHandler);
    }
    leave_game() {
        document.getElementById("leave_game_id").addEventListener("click", () => {
            console.log("leave_the_gameddddddddddddddddddddddd");
            this.cleanup();
            setLeaveGameVar(true);
            handleViewTransitions("vue2", "vue4");
            setTimeout(() => {
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
        console.log("dddddddddddddddddddddddddddd");
        const key = event.key;
        // Vérifier si la touche a un cooldown défini
        if (!(key in this.cooldownTimes))
            return;
        // Vérifier si la touche est en cooldown
        if (this.cooldowns[key])
            return; // Ignore l'action si en cooldown
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sb19nYW1lXzF2MS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3Mvc29sb19nYW1lXzF2MS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDcEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsT0FBTyxFQUF1QixlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFbkUsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsWUFBWTtJQU1sRDtRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVwQixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ3BCLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztTQUNWLENBQUM7UUFFRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1osT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q0FBQyxDQUFDO1FBQ3JELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBR25FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5QixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUVILGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNyQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNmLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IGdldFBvd2VyVVBfdmFsdWUgfSBmcm9tIFwiLi9HYW1lX21lbnUuanNcIjtcbmltcG9ydCB7IGxlYXZlX0dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBnZXRWYWx1ZV9sZWF2ZV9nYW1lLCBzZXRMZWF2ZUdhbWVWYXIgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mgc29sb19nYW1lIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblxuXHRjb29sZG93bnM6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9O1xuXHRjb29sZG93blRpbWVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xuXHRib3VuZEtleVByZXNzSGFuZGxlcjogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkO1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zZXRUaXRsZShcInNvbG9fZ2FtZVwiKTtcblxuXHRcdHRoaXMuY29vbGRvd25zID0ge307XG5cblx0XHR0aGlzLmNvb2xkb3duVGltZXMgPSB7XG5cdFx0XHRcInpcIjogMTUwMDAsXG5cdFx0XHRcInhcIjogMjAwMDAsXG5cdFx0XHRcImNcIjogMTUwMDAsXG5cdFx0XHRcIjFcIjogMTUwMDAsXG5cdFx0XHRcIjJcIjogMjAwMDAsXG5cdFx0XHRcIjNcIjogMTUwMDBcblx0XHR9O1xuXG5cdFx0dGhpcy5ib3VuZEtleVByZXNzSGFuZGxlciA9IHRoaXMuaGFuZGxlS2V5UHJlc3MuYmluZCh0aGlzKTtcbiAgICBcblx0XHRjb25zb2xlLmxvZyhcInNvbG9fZ2FtZV8xdjEuanNcIik7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5ib3VuZEtleVByZXNzSGFuZGxlcik7XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi9zdGF0aWMvanMvY3NzL3NvbG9fZ2FtZV8xdjEuY3NzXCI+XG5cdFx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1sZWF2ZVwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJvcHRpb25cIiBpZD1cIm9wdGlvbl9idG5cIj5cblx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9tZW51LnN2Z1wiIGFsdD1cImxlYXZlXCI+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFuZWxcIiBpZD1cInBhbmVsX2lkXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm9wdGlvbi1pbi1wYW5lbFwiIGlkPVwib3B0aW9uX2J0bi1yZW1vdmVcIj5cblx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9tZW51LnN2Z1wiIGFsdD1cImxlYXZlXCI+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImxlYXZlX2dhbWVcIiBpZD1cImxlYXZlX2dhbWVfaWRcIj5cblx0XHRcdFx0XHRcdDxhIGhyZWY9XCIvR2FtZV9tZW51XCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5MZWF2ZSBHYW1lPC9hPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLVBsYXllcjFcIiBpZD1cImNvbnRhaW5lci1wbGF5ZXIxX2lkXCI+XG5cdFx0XHRcdFx0PGgxPlBsYXllciAxPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWl0ZW1fcGxheWVyMVwiPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWdyZW5hZGUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtZ3JlbmFkZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVmbGFzaFRlc3QuanBnXCIgYWx0PVwiSXRlbSAxXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWdyZW5hZGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tdGVhbW1hdGUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtdGVhbW1hdGUxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90ZWFtbWF0ZXYzLnBuZ1wiIGFsdD1cIkl0ZW0gMlwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS10ZWFtbWF0ZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZy10ZWFtbWF0ZVwiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tYXV0cmUtMVwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtaW52ZXJzZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ludmVyc2VfcG93ZXJVUC5wbmdcIiBhbHQ9XCJJdGVtIDNcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktaW52ZXJzZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZ1wiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctaW52ZXJzZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItUGxheWVyMlwiIGlkPVwiY29udGFpbmVyLXBsYXllcjJfaWRcIj5cblx0XHRcdFx0XHQ8aDE+UGxheWVyIDI8L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItaXRlbV9wbGF5ZXIyXCI+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tZ3JlbmFkZS0yXCI+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS1ncmVuYWRlMlwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZ3JlbmFkZWZsYXNoVGVzdC5qcGdcIiBhbHQ9XCJJdGVtIDFcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktZ3JlbmFkZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZ1wiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctZ3JlbmFkZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS10ZWFtbWF0ZS0yXCI+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS10ZWFtbWF0ZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL3RlYW1tYXRldjMucG5nXCIgYWx0PVwiSXRlbSAyXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LXRlYW1tYXRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy10ZWFtbWF0ZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1hdXRyZS0yXCI+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS1pbnZlcnNlMlwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvaW52ZXJzZV9wb3dlclVQLnBuZ1wiIGFsdD1cIkl0ZW0gM1wiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1pbnZlcnNlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1pbnZlcnNlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cblxuXHRjbGVhbnVwKCkge1xuXHRcdGNvbnNvbGUubG9nKFwiQ2xlYW5pbmcgdXAgc29sbyBnYW1lIGV2ZW50IGxpc3RlbmVyc1wiKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyKTtcblx0fVxuXG5cdGxlYXZlX2dhbWUoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWF2ZV9nYW1lX2lkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImxlYXZlX3RoZV9nYW1lZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRcIik7XG5cdFx0XHRcblx0XHRcdHRoaXMuY2xlYW51cCgpO1xuXHRcdFx0c2V0TGVhdmVHYW1lVmFyKHRydWUpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlMlwiLCBcInZ1ZTRcIik7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0bGVhdmVfR2FtZSgpO1xuXHRcdFx0fSwgMTUwMCk7XG5cdFx0fSk7XG5cdH1cblx0XHRcblxuXHRpbml0X3Bvd2VyVVBfcGxheWVyKCkge1xuXHRcdGNvbnNvbGUubG9nKFwicG93ZXJVUCB2YWx1ZSA9PSBcIiwgZ2V0UG93ZXJVUF92YWx1ZSgpKTtcblxuXHRcdGNvbnN0IGNvbnRhaW5lcl9wbGF5ZXIxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyMV9pZFwiKTtcblx0XHRjb25zdCBjb250YWluZXJfcGxheWVyMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllcjJfaWRcIik7XG5cblx0XHRpZiAoZ2V0UG93ZXJVUF92YWx1ZSgpICE9PSAwKVxuXHRcdHtcblx0XHRcdGNvbnNvbGUubG9nKFwicG93ZXJVUCB2YWx1ZWplIHJlZWVlZWRqa2hramVmd2hqa2V3aGZrandlID09IFwiLCBnZXRQb3dlclVQX3ZhbHVlKCkpO1xuXHRcdFx0Y29udGFpbmVyX3BsYXllcjEuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiBlbHNlICAgIHBvd2VyVVAgdmFsdWVqZSByZWVlZWVkamtoa2plZndoamtld2hma2p3ZSA9PSBcIiwgZ2V0UG93ZXJVUF92YWx1ZSgpKTtcblx0XHRcdGlmIChjb250YWluZXJfcGxheWVyMS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpXG5cdFx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIxLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRpZiAoY29udGFpbmVyX3BsYXllcjIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKVxuXHRcdFx0XHRjb250YWluZXJfcGxheWVyMi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlKCkudG9TdHJpbmcoKTtcblx0fVxuXG5cdHVwZGF0ZU92ZXJsYXlzKCkge1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIxID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMiA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTJcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIxID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTJcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9pbnZlcnNlX3BsYXllcjEgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX2ludmVyc2VfcGxheWVyMiA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1hdXRyZS0yXCIpLmlubmVySFRNTCwgMTApO1xuXHRcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktZ3JlbmFkZS0xXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjEgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1ncmVuYWRlLTJcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMiA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXRlYW1tYXRlLTFcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjEgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS10ZWFtbWF0ZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIyID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktaW52ZXJzZS0xXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9pbnZlcnNlX3BsYXllcjEgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1pbnZlcnNlLTJcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX2ludmVyc2VfcGxheWVyMiA9PT0gMCk7XG5cdH1cblxuXHRoYW5kbGVLZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkgeyAvL05PVEUgLSBqYWkgYWpvdXRlciBsZSB0eXBlIGV2ZW50OiBLZXlib2FyZEV2ZW50XG5cdFx0Y29uc29sZS5sb2coXCJkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkXCIpO1xuXHRcdGNvbnN0IGtleSA9IGV2ZW50LmtleTtcblx0XHRcblx0XHQvLyBWw6lyaWZpZXIgc2kgbGEgdG91Y2hlIGEgdW4gY29vbGRvd24gZMOpZmluaVxuXHRcdGlmICghKGtleSBpbiB0aGlzLmNvb2xkb3duVGltZXMpKSByZXR1cm47XG5cdFxuXHRcdC8vIFbDqXJpZmllciBzaSBsYSB0b3VjaGUgZXN0IGVuIGNvb2xkb3duXG5cdFx0aWYgKHRoaXMuY29vbGRvd25zW2tleV0pIHJldHVybjsgLy8gSWdub3JlIGwnYWN0aW9uIHNpIGVuIGNvb2xkb3duXG5cblx0XG5cdFx0bGV0IGVsZW0gPSBudWxsO1xuXHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRjYXNlIFwielwiOlxuXHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwieFwiOlxuXHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY1wiOlxuXHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMVwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiMVwiOlxuXHRcdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTJcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiM1wiOlxuXHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTJcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XG5cdFx0aWYgKGVsZW0pIHtcblx0XHRcdGxldCBjdXJyZW50VmFsdWUgPSBwYXJzZUludChlbGVtLmlubmVySFRNTCwgMTApO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+IDApIHtcblx0XHRcdFx0ZWxlbS5pbm5lckhUTUwgPSAoY3VycmVudFZhbHVlIC0gMSkudG9TdHJpbmcoKTsgLy9OT1RFIC0gamFpIGNoYW5nZXIgbGUgdHlwZSBwb3VyIHF1ZSBjYSBwYXNzZSBpY2lcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnNvbGUubG9nKGAke2tleX0gdXRpbGlzw6ksIGNvb2xkb3duIGFjdGl2w6kgcG91ciAke3RoaXMuY29vbGRvd25UaW1lc1trZXldfW1zYCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBNZXR0cmUgZW4gY29vbGRvd24gY2V0dGUgdG91Y2hlXG5cdFx0XHRcdHRoaXMuY29vbGRvd25zW2tleV0gPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gQWpvdXRlciBsYSBjbGFzc2UgZCdhbmltYXRpb24gcG91ciBkw6ltYXJyZXIgbCdvdmVybGF5IHJlbG9hZGluZ1xuXHRcdFx0XHRsZXQgaXRlbUNpcmNsZSA9IG51bGw7XG5cdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nID0gbnVsbDtcblx0XHRcdFx0bGV0IG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgPSBudWxsO1xuXG5cdFx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMVwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWdyZW5hZGUxXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlLTFcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS10ZWFtbWF0ZTFcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiY1wiOlxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1yZWxvYWRpbmctaW52ZXJzZS0xXCIpO1xuXHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtaW52ZXJzZTFcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiMVwiOlxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1yZWxvYWRpbmctZ3JlbmFkZS0yXCIpO1xuXHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtZ3JlbmFkZTJcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiMlwiOlxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIzXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1pbnZlcnNlLTJcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1pbnZlcnNlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSAtIDEgPT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVPdmVybGF5cygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApIHtcblx0XHRcdFx0XHQvLyBMYW5jZXIgbCdhbmltYXRpb24gZW4gYWpvdXRhbnQgdW5lIGNsYXNzZSBDU1MgcG91ciBkw6ltYXJyZXJcblx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFzc3VyZXotdm91cyBxdWUgLml0ZW0tbG9hZGluZyBlc3QgZMOpZmluaSBkYW5zIHZvdHJlIENTU1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpdGVtQ2lyY2xlKSB7XG5cdFx0XHRcdFx0aXRlbUNpcmNsZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMCkge1xuXHRcdFx0XHRcdC8vIExhbmNlciBsJ2FuaW1hdGlvbiBlbiBham91dGFudCB1bmUgY2xhc3NlIENTUyBwb3VyIGTDqW1hcnJlclxuXHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQXNzdXJlei12b3VzIHF1ZSAuaXRlbS1sb2FkaW5nIGVzdCBkw6lmaW5pIGRhbnMgdm90cmUgQ1NTXG5cdFx0XHRcdH1cblx0XG5cdFx0XHRcdC8vIFJldGlyZXIgbGUgY29vbGRvd24gYXByw6hzIGxlIGTDqWxhaSBkw6lmaW5pIHBvdXIgY2V0dGUgdG91Y2hlXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdC8vIFRlcm1pbmVyIGxlIGNvb2xkb3duIGV0IGFycsOqdGVyIGwnYW5pbWF0aW9uXG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuY29vbGRvd25zW2tleV07XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7a2V5fSBjb29sZG93biB0ZXJtaW7DqWApO1xuXHRcblx0XHRcdFx0XHQvLyBSZXRpcmVyIGxhIGNsYXNzZSBkJ2FuaW1hdGlvbiBhcHLDqHMgbGUgY29vbGRvd25cblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZyAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApIHtcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGl0ZW1DaXJjbGUgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0aXRlbUNpcmNsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LCB0aGlzLmNvb2xkb3duVGltZXNba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHRldmVudF9zb2xvX2dhbWUoKSB7XG5cdFx0Y29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25fYnRuXCIpO1xuXHRcdGNvbnN0IHBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYW5lbF9pZFwiKTtcblx0XHRjb25zdCBvcHRpb25fcmVtb3ZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25fYnRuLXJlbW92ZVwiKTtcblxuXHRcdFxuXHRcdG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJvcHRpb24gY2xpY2tlZFwiKTtcblx0XHRcdHBhbmVsLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKFwicmVtb3ZlXCIpO1xuXHRcdFx0b3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0fSk7XG5cdFxuXHRcdG9wdGlvbl9yZW1vdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwib3B0aW9uX3JlbW92ZSBjbGlja2VkXCIpO1xuXHRcdFx0cGFuZWwuY2xhc3NMaXN0LmFkZChcInJlbW92ZVwiKTtcblx0XHRcdG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHR9LCAxMTAwKTtcblx0XHR9KTtcblx0fVxufSJdfQ==