import AbstractView from "./AbstractView";
import { getPowerUP_value } from "./Game_menu";
import { leave_Game } from "../../../srcs/game/gameplay/babylon";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera";
import { setLeaveGameVar } from "../index";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sb19nYW1lXzF2MS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3Mvc29sb19nYW1lXzF2MS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2pGLE9BQU8sRUFBdUIsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWhFLE1BQU0sQ0FBQyxPQUFPLE9BQU8sU0FBVSxTQUFRLFlBQVk7SUFNbEQ7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNwQixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7U0FDVixDQUFDO1FBRUYsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNaLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUMsQ0FBQztRQUNyRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUduRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3XCI7XG5pbXBvcnQgeyBnZXRQb3dlclVQX3ZhbHVlIH0gZnJvbSBcIi4vR2FtZV9tZW51XCI7XG5pbXBvcnQgeyBsZWF2ZV9HYW1lIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uXCI7XG5pbXBvcnQgeyBoYW5kbGVWaWV3VHJhbnNpdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2NhbWVyYVwiO1xuaW1wb3J0IHsgZ2V0VmFsdWVfbGVhdmVfZ2FtZSwgc2V0TGVhdmVHYW1lVmFyIH0gZnJvbSBcIi4uL2luZGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHNvbG9fZ2FtZSBleHRlbmRzIEFic3RyYWN0VmlldyB7XG5cblx0Y29vbGRvd25zOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfTtcblx0Y29vbGRvd25UaW1lczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcblx0Ym91bmRLZXlQcmVzc0hhbmRsZXI6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJzb2xvX2dhbWVcIik7XG5cblx0XHR0aGlzLmNvb2xkb3ducyA9IHt9O1xuXG5cdFx0dGhpcy5jb29sZG93blRpbWVzID0ge1xuXHRcdFx0XCJ6XCI6IDE1MDAwLFxuXHRcdFx0XCJ4XCI6IDIwMDAwLFxuXHRcdFx0XCJjXCI6IDE1MDAwLFxuXHRcdFx0XCIxXCI6IDE1MDAwLFxuXHRcdFx0XCIyXCI6IDIwMDAwLFxuXHRcdFx0XCIzXCI6IDE1MDAwXG5cdFx0fTtcblxuXHRcdHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIgPSB0aGlzLmhhbmRsZUtleVByZXNzLmJpbmQodGhpcyk7XG4gICAgXG5cdFx0Y29uc29sZS5sb2coXCJzb2xvX2dhbWVfMXYxLmpzXCIpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXHR9XG5cblx0YXN5bmMgZ2V0SHRtbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdHJldHVybiBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy9zb2xvX2dhbWVfMXYxLmNzc1wiPlxuXHRcdFx0PGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmxhY2srT3BzK09uZSZkaXNwbGF5PXN3YXBcIiByZWw9XCJzdHlsZXNoZWV0XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItbGVhdmVcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwib3B0aW9uXCIgaWQ9XCJvcHRpb25fYnRuXCI+XG5cdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvbWVudS5zdmdcIiBhbHQ9XCJsZWF2ZVwiPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBhbmVsXCIgaWQ9XCJwYW5lbF9pZFwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJvcHRpb24taW4tcGFuZWxcIiBpZD1cIm9wdGlvbl9idG4tcmVtb3ZlXCI+XG5cdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvbWVudS5zdmdcIiBhbHQ9XCJsZWF2ZVwiPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJsZWF2ZV9nYW1lXCIgaWQ9XCJsZWF2ZV9nYW1lX2lkXCI+XG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwiL0dhbWVfbWVudVwiIGNsYXNzPVwibmF2LWxpbmtcIiBkYXRhLWxpbms+TGVhdmUgR2FtZTwvYT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1QbGF5ZXIxXCIgaWQ9XCJjb250YWluZXItcGxheWVyMV9pZFwiPlxuXHRcdFx0XHRcdDxoMT5QbGF5ZXIgMTwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1pdGVtX3BsYXllcjFcIj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1ncmVuYWRlLTFcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWdyZW5hZGUxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlZmxhc2hUZXN0LmpwZ1wiIGFsdD1cIkl0ZW0gMVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1ncmVuYWRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLXRlYW1tYXRlLTFcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLXRlYW1tYXRlMVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvdGVhbW1hdGV2My5wbmdcIiBhbHQ9XCJJdGVtIDJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktdGVhbW1hdGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGVcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlLTFcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWF1dHJlLTFcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWludmVyc2UxXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9pbnZlcnNlX3Bvd2VyVVAucG5nXCIgYWx0PVwiSXRlbSAzXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWludmVyc2UtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWludmVyc2UtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLVBsYXllcjJcIiBpZD1cImNvbnRhaW5lci1wbGF5ZXIyX2lkXCI+XG5cdFx0XHRcdFx0PGgxPlBsYXllciAyPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWl0ZW1fcGxheWVyMlwiPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLWdyZW5hZGUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtZ3JlbmFkZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2dyZW5hZGVmbGFzaFRlc3QuanBnXCIgYWx0PVwiSXRlbSAxXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgaWQ9XCJvdmVybGF5LWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmdcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tdGVhbW1hdGUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtdGVhbW1hdGUyXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS90ZWFtbWF0ZXYzLnBuZ1wiIGFsdD1cIkl0ZW0gMlwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS10ZWFtbWF0ZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZy10ZWFtbWF0ZVwiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctdGVhbW1hdGUtMlwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tYXV0cmUtMlwiPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpdGVtLWNpcmNsZVwiIGlkPVwiaXRlbS1jaXJjbGUtaW52ZXJzZTJcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ludmVyc2VfcG93ZXJVUC5wbmdcIiBhbHQ9XCJJdGVtIDNcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktaW52ZXJzZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZ1wiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctaW52ZXJzZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXHR9XG5cblx0Y2xlYW51cCgpIHtcblx0XHRjb25zb2xlLmxvZyhcIkNsZWFuaW5nIHVwIHNvbG8gZ2FtZSBldmVudCBsaXN0ZW5lcnNcIik7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5ib3VuZEtleVByZXNzSGFuZGxlcik7XG5cdH1cblxuXHRsZWF2ZV9nYW1lKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV9pZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJsZWF2ZV90aGVfZ2FtZWRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkXCIpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmNsZWFudXAoKTtcblx0XHRcdHNldExlYXZlR2FtZVZhcih0cnVlKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTJcIiwgXCJ2dWU0XCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGxlYXZlX0dhbWUoKTtcblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXHR9XG5cdFx0XG5cblx0aW5pdF9wb3dlclVQX3BsYXllcigpIHtcblx0XHRjb25zb2xlLmxvZyhcInBvd2VyVVAgdmFsdWUgPT0gXCIsIGdldFBvd2VyVVBfdmFsdWUoKSk7XG5cblx0XHRjb25zdCBjb250YWluZXJfcGxheWVyMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllcjFfaWRcIik7XG5cdFx0Y29uc3QgY29udGFpbmVyX3BsYXllcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXIyX2lkXCIpO1xuXG5cdFx0aWYgKGdldFBvd2VyVVBfdmFsdWUoKSAhPT0gMClcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhcInBvd2VyVVAgdmFsdWVqZSByZWVlZWVkamtoa2plZndoamtld2hma2p3ZSA9PSBcIiwgZ2V0UG93ZXJVUF92YWx1ZSgpKTtcblx0XHRcdGNvbnRhaW5lcl9wbGF5ZXIxLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRjb250YWluZXJfcGxheWVyMi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Y29uc29sZS5sb2coXCIgZWxzZSAgICBwb3dlclVQIHZhbHVlamUgcmVlZWVlZGpraGtqZWZ3aGprZXdoZmtqd2UgPT0gXCIsIGdldFBvd2VyVVBfdmFsdWUoKSk7XG5cdFx0XHRpZiAoY29udGFpbmVyX3BsYXllcjEuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKVxuXHRcdFx0XHRjb250YWluZXJfcGxheWVyMS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0aWYgKGNvbnRhaW5lcl9wbGF5ZXIyLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSlcblx0XHRcdFx0Y29udGFpbmVyX3BsYXllcjIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHR9XG5cblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0xXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWUoKS50b1N0cmluZygpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0xXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWUoKS50b1N0cmluZygpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1hdXRyZS0xXCIpLmlubmVySFRNTCA9IGdldFBvd2VyVVBfdmFsdWUoKS50b1N0cmluZygpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTJcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTJcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTJcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZSgpLnRvU3RyaW5nKCk7XG5cdH1cblxuXHR1cGRhdGVPdmVybGF5cygpIHtcblx0XHRjb25zdCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMSA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjIgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMSA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0xXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMiA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0yXCIpLmlubmVySFRNTCwgMTApO1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIxID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTFcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF9pbnZlcnNlX3BsYXllcjIgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tYXV0cmUtMlwiKS5pbm5lckhUTUwsIDEwKTtcblx0XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWdyZW5hZGUtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktZ3JlbmFkZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9ncmVuYWRlX3BsYXllcjIgPT09IDApO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS10ZWFtbWF0ZS0xXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktdGVhbW1hdGUtMlwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMiA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWludmVyc2UtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIxID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktaW52ZXJzZS0yXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgbmJfcG93ZXJVUF9pbnZlcnNlX3BsYXllcjIgPT09IDApO1xuXHR9XG5cblx0aGFuZGxlS2V5UHJlc3MoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHsgLy9OT1RFIC0gamFpIGFqb3V0ZXIgbGUgdHlwZSBldmVudDogS2V5Ym9hcmRFdmVudFxuXHRcdGNvbnNvbGUubG9nKFwiZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZFwiKTtcblx0XHRjb25zdCBrZXkgPSBldmVudC5rZXk7XG5cdFx0XG5cdFx0Ly8gVsOpcmlmaWVyIHNpIGxhIHRvdWNoZSBhIHVuIGNvb2xkb3duIGTDqWZpbmlcblx0XHRpZiAoIShrZXkgaW4gdGhpcy5jb29sZG93blRpbWVzKSkgcmV0dXJuO1xuXHRcblx0XHQvLyBWw6lyaWZpZXIgc2kgbGEgdG91Y2hlIGVzdCBlbiBjb29sZG93blxuXHRcdGlmICh0aGlzLmNvb2xkb3duc1trZXldKSByZXR1cm47IC8vIElnbm9yZSBsJ2FjdGlvbiBzaSBlbiBjb29sZG93blxuXG5cdFxuXHRcdGxldCBlbGVtID0gbnVsbDtcblx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0xXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNcIjpcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWF1dHJlLTFcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIjFcIjpcblx0XHRcdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIFwiMlwiOlxuXHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTJcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIjNcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1hdXRyZS0yXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFxuXHRcdGlmIChlbGVtKSB7XG5cdFx0XHRsZXQgY3VycmVudFZhbHVlID0gcGFyc2VJbnQoZWxlbS5pbm5lckhUTUwsIDEwKTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPiAwKSB7XG5cdFx0XHRcdGVsZW0uaW5uZXJIVE1MID0gKGN1cnJlbnRWYWx1ZSAtIDEpLnRvU3RyaW5nKCk7IC8vTk9URSAtIGphaSBjaGFuZ2VyIGxlIHR5cGUgcG91ciBxdWUgY2EgcGFzc2UgaWNpXG5cdFx0XHRcdFxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHtrZXl9IHV0aWxpc8OpLCBjb29sZG93biBhY3RpdsOpIHBvdXIgJHt0aGlzLmNvb2xkb3duVGltZXNba2V5XX1tc2ApO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTWV0dHJlIGVuIGNvb2xkb3duIGNldHRlIHRvdWNoZVxuXHRcdFx0XHR0aGlzLmNvb2xkb3duc1trZXldID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIEFqb3V0ZXIgbGEgY2xhc3NlIGQnYW5pbWF0aW9uIHBvdXIgZMOpbWFycmVyIGwnb3ZlcmxheSByZWxvYWRpbmdcblx0XHRcdFx0bGV0IGl0ZW1DaXJjbGUgPSBudWxsO1xuXHRcdFx0XHRsZXQgb3ZlcmxheVJlbG9hZGluZyA9IG51bGw7XG5cdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gbnVsbDtcblxuXHRcdFx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0XHRcdGNhc2UgXCJ6XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJ4XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy10ZWFtbWF0ZS0xXCIpO1xuXHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtdGVhbW1hdGUxXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcImNcIjpcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWludmVyc2UtMVwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWludmVyc2UxXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIjFcIjpcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLWdyZW5hZGUtMlwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLWdyZW5hZGUyXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIjJcIjpcblx0XHRcdFx0XHRcdG92ZXJsYXlSZWxvYWRpbmdfdGVhbW1hdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktcmVsb2FkaW5nLXRlYW1tYXRlLTJcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS10ZWFtbWF0ZTJcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiM1wiOlxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1yZWxvYWRpbmctaW52ZXJzZS0yXCIpO1xuXHRcdFx0XHRcdFx0aXRlbUNpcmNsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlbS1jaXJjbGUtaW52ZXJzZTJcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgLSAxID09PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aXRlbUNpcmNsZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlT3ZlcmxheXMoKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZyAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0Ly8gTGFuY2VyIGwnYW5pbWF0aW9uIGVuIGFqb3V0YW50IHVuZSBjbGFzc2UgQ1NTIHBvdXIgZMOpbWFycmVyXG5cdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyBBc3N1cmV6LXZvdXMgcXVlIC5pdGVtLWxvYWRpbmcgZXN0IGTDqWZpbmkgZGFucyB2b3RyZSBDU1Ncblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXRlbUNpcmNsZSkge1xuXHRcdFx0XHRcdGl0ZW1DaXJjbGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApIHtcblx0XHRcdFx0XHQvLyBMYW5jZXIgbCdhbmltYXRpb24gZW4gYWpvdXRhbnQgdW5lIGNsYXNzZSBDU1MgcG91ciBkw6ltYXJyZXJcblx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFzc3VyZXotdm91cyBxdWUgLml0ZW0tbG9hZGluZyBlc3QgZMOpZmluaSBkYW5zIHZvdHJlIENTU1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHQvLyBSZXRpcmVyIGxlIGNvb2xkb3duIGFwcsOocyBsZSBkw6lsYWkgZMOpZmluaSBwb3VyIGNldHRlIHRvdWNoZVxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHQvLyBUZXJtaW5lciBsZSBjb29sZG93biBldCBhcnLDqnRlciBsJ2FuaW1hdGlvblxuXHRcdFx0XHRcdGRlbGV0ZSB0aGlzLmNvb2xkb3duc1trZXldO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke2tleX0gY29vbGRvd24gdGVybWluw6lgKTtcblx0XG5cdFx0XHRcdFx0Ly8gUmV0aXJlciBsYSBjbGFzc2UgZCdhbmltYXRpb24gYXByw6hzIGxlIGNvb2xkb3duXG5cdFx0XHRcdFx0aWYgKG92ZXJsYXlSZWxvYWRpbmcgJiYgY3VycmVudFZhbHVlIC0gMSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChpdGVtQ2lyY2xlICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApIHtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSwgdGhpcy5jb29sZG93blRpbWVzW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0ZXZlbnRfc29sb19nYW1lKCkge1xuXHRcdGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uX2J0blwiKTtcblx0XHRjb25zdCBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFuZWxfaWRcIik7XG5cdFx0Y29uc3Qgb3B0aW9uX3JlbW92ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uX2J0bi1yZW1vdmVcIik7XG5cblx0XHRcblx0XHRvcHRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwib3B0aW9uIGNsaWNrZWRcIik7XG5cdFx0XHRwYW5lbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0cGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcInJlbW92ZVwiKTtcblx0XHRcdG9wdGlvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdH0pO1xuXHRcblx0XHRvcHRpb25fcmVtb3ZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIm9wdGlvbl9yZW1vdmUgY2xpY2tlZFwiKTtcblx0XHRcdHBhbmVsLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVcIik7XG5cdFx0XHRvcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0fSwgMTEwMCk7XG5cdFx0fSk7XG5cdH1cbn0iXX0=