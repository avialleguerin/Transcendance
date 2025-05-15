import AbstractView from "./AbstractView.js";
import { getPowerUP_value_multi } from "./Game_menu.js";
import { leave_Multiplayer_Game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
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
        };
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }
    async getHtml() {
        return `
			<link rel="stylesheet" href="./static/js/css/multi_player_game.css">
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
				<div class="container-Player1">
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
				<div class="container-Player2">
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
			</div>
		`;
    }
    leave_game_multi() {
        document.getElementById("leave_game_id").addEventListener("click", () => {
            console.log("leave_the_game");
            handleViewTransitions("vue2", "vue4");
            setTimeout(() => {
                leave_Multiplayer_Game();
            }, 1500);
        });
    }
    init_powerUP_player_multi() {
        // console.log("powerUP value == ", getPowerUP_value());
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfcGxheWVyX2dhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wdWJsaWMvc3RhdGljL2pzL3ZpZXdzL211bHRpX3BsYXllcl9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRXBGLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBS3hDO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNwQixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztTQUNWLENBQUM7UUFFRixRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1osT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9ETixDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtRQUNmLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUN2RSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUIscUJBQXFCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2Ysc0JBQXNCLEVBQUUsQ0FBQztZQUMxQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCx5QkFBeUI7UUFDeEIsd0RBQXdEO1FBQ3hELFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3RixRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxHQUFHLHNCQUFzQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUYsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxzQkFBc0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdGLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvRixDQUFDO0lBRUQsY0FBYztRQUNiLE1BQU0sMEJBQTBCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEcsTUFBTSwwQkFBMEIsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RyxNQUFNLDJCQUEyQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFHLE1BQU0sMkJBQTJCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFMUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLDBCQUEwQixLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSwwQkFBMEIsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxRyxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsMkJBQTJCLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDNUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLDJCQUEyQixLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdHLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBb0I7UUFDbEMsdURBQXVEO1FBQ3ZELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFFdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUM7WUFBRSxPQUFPO1FBRXpDLHdDQUF3QztRQUN4QyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxDQUFDLGlDQUFpQztRQUdsRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNiLEtBQUssR0FBRztnQkFDUCxJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNO1lBQ1AsS0FBSyxHQUFHO2dCQUNQLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQ3JELE1BQU07WUFDUCxLQUFLLEdBQUc7Z0JBQ1AsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDcEQsTUFBTTtZQUNQLEtBQUssR0FBRztnQkFDUCxJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNO1FBQ1IsQ0FBQztRQUNELElBQUksSUFBSSxFQUFFLENBQUM7WUFDVixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNoRCxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLGtEQUFrRDtnQkFFbEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsa0NBQWtDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqRixrQ0FBa0M7Z0JBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUUzQixrRUFBa0U7Z0JBQ2xFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDdEIsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLElBQUkseUJBQXlCLEdBQUcsSUFBSSxDQUFDO2dCQUVyQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUNiLEtBQUssR0FBRzt3QkFDUCxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUM7d0JBQzFFLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7d0JBQzdELE1BQU07b0JBQ1AsS0FBSyxHQUFHO3dCQUNQLHlCQUF5QixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsNEJBQTRCLENBQUMsQ0FBQzt3QkFDbEYsVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQzt3QkFDOUQsTUFBTTtvQkFDUCxLQUFLLEdBQUc7d0JBQ1AsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO3dCQUMxRSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO3dCQUM3RCxNQUFNO29CQUNQLEtBQUssR0FBRzt3QkFDUCx5QkFBeUIsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLDRCQUE0QixDQUFDLENBQUM7d0JBQ2xGLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7d0JBQzlELE1BQU07Z0JBQ1IsQ0FBQztnQkFFRCxJQUFJLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUMxQixDQUFDO29CQUNBLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNuQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3RCLE9BQU87Z0JBQ1IsQ0FBQztnQkFFRCxJQUFJLGdCQUFnQixJQUFJLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUM5QyxDQUFDO29CQUNBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFDLENBQUM7Z0JBQ0QsSUFBSSxVQUFVLEVBQUUsQ0FBQztvQkFDaEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3BDLENBQUM7Z0JBRUQsSUFBSSx5QkFBeUIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFDdkQsQ0FBQztvQkFDQSx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO2dCQUVELFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBRWYsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO29CQUV2QyxJQUFJLGdCQUFnQixJQUFJLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQzt3QkFDN0MsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFN0MsSUFBSSx5QkFBeUIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUM7d0JBQ3RELHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXRELElBQUksVUFBVSxJQUFJLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQzt3QkFDdkMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXhDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRUQsc0JBQXNCO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDckQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFHbkUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzlCLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgZ2V0UG93ZXJVUF92YWx1ZV9tdWx0aSB9IGZyb20gXCIuL0dhbWVfbWVudS5qc1wiO1xuaW1wb3J0IHsgbGVhdmVfTXVsdGlwbGF5ZXJfR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXG5cdGNvb2xkb3duczogYW55O1xuXHRjb29sZG93blRpbWVzOiBhbnk7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwibXVsdGlfcGxheWVyX2dhbWVcIik7XG5cblx0XHR0aGlzLmNvb2xkb3ducyA9IHt9O1xuXG5cdFx0dGhpcy5jb29sZG93blRpbWVzID0ge1xuXHRcdFx0XCJ6XCI6IDE1MDAwLFxuXHRcdFx0XCJ4XCI6IDE1MDAwLFxuXHRcdFx0XCIxXCI6IDE1MDAwLFxuXHRcdFx0XCIyXCI6IDE1MDAwLFxuXHRcdH07XG5cblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmhhbmRsZUtleVByZXNzLmJpbmQodGhpcykpO1xuXHR9XG5cblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gYFxuXHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvbXVsdGlfcGxheWVyX2dhbWUuY3NzXCI+XG5cdFx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1sZWF2ZVwiPlxuXHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJvcHRpb25cIiBpZD1cIm9wdGlvbl9idG5cIj5cblx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9tZW51LnN2Z1wiIGFsdD1cImxlYXZlXCI+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGFuZWxcIiBpZD1cInBhbmVsX2lkXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIm9wdGlvbi1pbi1wYW5lbFwiIGlkPVwib3B0aW9uX2J0bi1yZW1vdmVcIj5cblx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9tZW51LnN2Z1wiIGFsdD1cImxlYXZlXCI+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImxlYXZlX2dhbWVcIiBpZD1cImxlYXZlX2dhbWVfaWRcIj5cblx0XHRcdFx0XHRcdDxhIGhyZWY9XCIvR2FtZV9tZW51XCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5MZWF2ZSBHYW1lPC9hPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1QbGF5ZXIxXCI+XG5cdFx0XHRcdFx0PGgxPlBsYXllciAxIC0gUGxheWVyIDI8L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItaXRlbV9wbGF5ZXIxXCI+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cIm5iLWl0ZW0tZ3JlbmFkZS0xXCI+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS1ncmVuYWRlMVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZ3JlbmFkZWZsYXNoVGVzdC5qcGdcIiBhbHQ9XCJJdGVtIDFcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktZ3JlbmFkZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZ1wiIGlkPVwib3ZlcmxheS1yZWxvYWRpbmctZ3JlbmFkZS0xXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS10ZWFtbWF0ZS0xXCI+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIml0ZW0tY2lyY2xlXCIgaWQ9XCJpdGVtLWNpcmNsZS10ZWFtbWF0ZTFcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCIuLi8uLi8uLi9zcmNzL2dhbWUvYXNzZXRzL2ltYWdlL2ZyZWV6ZS5wbmdcIiBhbHQ9XCJJdGVtIDJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXlcIiBpZD1cIm92ZXJsYXktdGVhbW1hdGUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheS1yZWxvYWRpbmctZnJlZXplXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMVwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLVBsYXllcjJcIj5cblx0XHRcdFx0XHQ8aDE+UGxheWVyIDMgLSBQbGF5ZXIgNDwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lci1pdGVtX3BsYXllcjJcIj5cblx0XHRcdFx0XHRcdDxwIGlkPVwibmItaXRlbS1ncmVuYWRlLTJcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLWdyZW5hZGUyXCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwiLi4vLi4vLi4vc3Jjcy9nYW1lL2Fzc2V0cy9pbWFnZS9ncmVuYWRlZmxhc2hUZXN0LmpwZ1wiIGFsdD1cIkl0ZW0gMVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS1ncmVuYWRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm92ZXJsYXktcmVsb2FkaW5nXCIgaWQ9XCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTJcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJuYi1pdGVtLXRlYW1tYXRlLTJcIj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaXRlbS1jaXJjbGVcIiBpZD1cIml0ZW0tY2lyY2xlLXRlYW1tYXRlMlwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIi4uLy4uLy4uL3NyY3MvZ2FtZS9hc3NldHMvaW1hZ2UvZnJlZXplLnBuZ1wiIGFsdD1cIkl0ZW0gMlwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3ZlcmxheVwiIGlkPVwib3ZlcmxheS10ZWFtbWF0ZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemVcIiBpZD1cIm92ZXJsYXktcmVsb2FkaW5nLWZyZWV6ZS0yXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXHR9XG5cblx0bGVhdmVfZ2FtZV9tdWx0aSgpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlYXZlX2dhbWVfaWRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwibGVhdmVfdGhlX2dhbWVcIik7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUyXCIsIFwidnVlNFwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRsZWF2ZV9NdWx0aXBsYXllcl9HYW1lKCk7XG5cdFx0XHR9LCAxNTAwKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXRfcG93ZXJVUF9wbGF5ZXJfbXVsdGkoKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJwb3dlclVQIHZhbHVlID09IFwiLCBnZXRQb3dlclVQX3ZhbHVlKCkpO1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZV9tdWx0aSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIikuaW5uZXJIVE1MID0gZ2V0UG93ZXJVUF92YWx1ZV9tdWx0aSgpLnRvU3RyaW5nKCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkudG9TdHJpbmcoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKS5pbm5lckhUTUwgPSBnZXRQb3dlclVQX3ZhbHVlX211bHRpKCkudG9TdHJpbmcoKTtcblx0fVxuXG5cdHVwZGF0ZU92ZXJsYXlzKCkge1xuXHRcdGNvbnN0IG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIxID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLWdyZW5hZGUtMVwiKS5pbm5lckhUTUwsIDEwKTtcblx0XHRjb25zdCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMiA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTJcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIxID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTFcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFx0Y29uc3QgbmJfcG93ZXJVUF90ZWFtbWF0ZV9wbGF5ZXIyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYi1pdGVtLXRlYW1tYXRlLTJcIikuaW5uZXJIVE1MLCAxMCk7XG5cdFxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheS1ncmVuYWRlLTFcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX2dyZW5hZGVfcGxheWVyMSA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LWdyZW5hZGUtMlwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfZ3JlbmFkZV9wbGF5ZXIyID09PSAwKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXktdGVhbW1hdGUtMVwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIG5iX3Bvd2VyVVBfdGVhbW1hdGVfcGxheWVyMSA9PT0gMCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXRlYW1tYXRlLTJcIikuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBuYl9wb3dlclVQX3RlYW1tYXRlX3BsYXllcjIgPT09IDApO1xuXHR9XG5cblx0aGFuZGxlS2V5UHJlc3MoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblx0XHQvLyBWw6lyaWZpZXIgc2kgbGEgdG91Y2hlIGVzdCB1bmUgdG91Y2hlIGRlIGwnaW52ZW50YWlyZVxuXHRcdGNvbnN0IGtleSA9IGV2ZW50LmtleTtcblx0XHRcblx0XHRpZiAoIShrZXkgaW4gdGhpcy5jb29sZG93blRpbWVzKSkgcmV0dXJuO1xuXHRcblx0XHQvLyBWw6lyaWZpZXIgc2kgbGEgdG91Y2hlIGVzdCBlbiBjb29sZG93blxuXHRcdGlmICh0aGlzLmNvb2xkb3duc1trZXldKSByZXR1cm47IC8vIElnbm9yZSBsJ2FjdGlvbiBzaSBlbiBjb29sZG93blxuXG5cdFxuXHRcdGxldCBlbGVtID0gbnVsbDtcblx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0Y2FzZSBcInpcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInhcIjpcblx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmItaXRlbS10ZWFtbWF0ZS0xXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tZ3JlbmFkZS0yXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5iLWl0ZW0tdGVhbW1hdGUtMlwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdGlmIChlbGVtKSB7XG5cdFx0XHRsZXQgY3VycmVudFZhbHVlID0gcGFyc2VJbnQoZWxlbS5pbm5lckhUTUwsIDEwKTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPiAwKSB7XG5cdFx0XHRcdGVsZW0uaW5uZXJIVE1MID0gKGN1cnJlbnRWYWx1ZSAtIDEpLnRvU3RyaW5nKCk7IC8vTk9URSAtIGphaSBjaGFuZ2VyIGxlIHR5cGUgcG91ciBxdWUgY2EgcGFzc2UgaWNpXG5cdFx0XHRcdFxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHtrZXl9IHV0aWxpc8OpLCBjb29sZG93biBhY3RpdsOpIHBvdXIgJHt0aGlzLmNvb2xkb3duVGltZXNba2V5XX1tc2ApO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gTWV0dHJlIGVuIGNvb2xkb3duIGNldHRlIHRvdWNoZVxuXHRcdFx0XHR0aGlzLmNvb2xkb3duc1trZXldID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIEFqb3V0ZXIgbGEgY2xhc3NlIGQnYW5pbWF0aW9uIHBvdXIgZMOpbWFycmVyIGwnb3ZlcmxheSByZWxvYWRpbmdcblx0XHRcdFx0bGV0IGl0ZW1DaXJjbGUgPSBudWxsO1xuXHRcdFx0XHRsZXQgb3ZlcmxheVJlbG9hZGluZyA9IG51bGw7XG5cdFx0XHRcdGxldCBvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gbnVsbDtcblxuXHRcdFx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0XHRcdGNhc2UgXCJ6XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTFcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJ4XCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMVwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMVwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIxXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1ncmVuYWRlLTJcIik7XG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVtLWNpcmNsZS1ncmVuYWRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCIyXCI6XG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nX3RlYW1tYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5LXJlbG9hZGluZy1mcmVlemUtMlwiKTtcblx0XHRcdFx0XHRcdGl0ZW1DaXJjbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIml0ZW0tY2lyY2xlLXRlYW1tYXRlMlwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSAtIDEgPT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVPdmVybGF5cygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGl0ZW1DaXJjbGUpIHtcblx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5jb29sZG93bnNba2V5XTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHtrZXl9IGNvb2xkb3duIHRlcm1pbsOpYCk7XG5cdFxuXHRcdFx0XHRcdGlmIChvdmVybGF5UmVsb2FkaW5nICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdFx0XHRvdmVybGF5UmVsb2FkaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cblx0XHRcdFx0XHRpZiAob3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZSAmJiBjdXJyZW50VmFsdWUgLSAxICE9PSAwKVxuXHRcdFx0XHRcdFx0b3ZlcmxheVJlbG9hZGluZ190ZWFtbWF0ZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChpdGVtQ2lyY2xlICYmIGN1cnJlbnRWYWx1ZSAtIDEgIT09IDApXG5cdFx0XHRcdFx0XHRpdGVtQ2lyY2xlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cblx0XHRcdFx0fSwgdGhpcy5jb29sZG93blRpbWVzW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGV2ZW50X211bHRpUGxheWVyX2dhbWUoKSB7XG5cdFx0Y29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25fYnRuXCIpO1xuXHRcdGNvbnN0IHBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYW5lbF9pZFwiKTtcblx0XHRjb25zdCBvcHRpb25fcmVtb3ZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25fYnRuLXJlbW92ZVwiKTtcblxuXHRcdFxuXHRcdG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJvcHRpb24gY2xpY2tlZFwiKTtcblx0XHRcdHBhbmVsLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKFwicmVtb3ZlXCIpO1xuXHRcdFx0b3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0fSk7XG5cdFxuXHRcdG9wdGlvbl9yZW1vdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwib3B0aW9uX3JlbW92ZSBjbGlja2VkXCIpO1xuXHRcdFx0cGFuZWwuY2xhc3NMaXN0LmFkZChcInJlbW92ZVwiKTtcblx0XHRcdG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHR9LCAxMTAwKTtcblx0XHR9KTtcblx0fVxufSJdfQ==