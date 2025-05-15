import AbstractView from "./AbstractView.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { leave_Multiplayer_Game } from "../../../srcs/game/gameplay/babylon.js";
export default class Multiplayer_game extends AbstractView {
    constructor() {
        super();
        this.setTitle("Multiplayer_game");
    }
    async getHtml() {
        return /*html*/ `
			<link rel="stylesheet" href="./static/js/css/solo_game_1v1.css">
			<script type="module" src="./static/js/script/game_menu.js"></script>
			<div class="container">
				<h1>Solo_game</h1>
				<div class="button-container">
					<button id="back_button" class="btn" data-link="/back_button"> 
						<a href="/Game_menu" class="nav-link" data-link>Leave the game</a>
					</button>
				</div>
			</div>
		`;
    }
    Back_to_Menu_duo() {
        document.getElementById("back_button").addEventListener("click", () => {
            console.log("Back to menu");
            handleViewTransitions("vue2", "vue4");
            setTimeout(() => {
                leave_Multiplayer_Game();
            }, 1500);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVvX2dhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkdW9fZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUVoRixNQUFNLENBQUMsT0FBTyxPQUFPLGdCQUFpQixTQUFRLFlBQVk7SUFDekQ7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWixPQUFPLFFBQVEsQ0FBQTs7Ozs7Ozs7Ozs7R0FXZCxDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtRQUNmLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVCLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN0QyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNmLHNCQUFzQixFQUFFLENBQUM7WUFDMUIsQ0FBQyxFQUFHLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbmltcG9ydCB7IGxlYXZlX011bHRpcGxheWVyX0dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlwbGF5ZXJfZ2FtZSBleHRlbmRzIEFic3RyYWN0VmlldyB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zZXRUaXRsZShcIk11bHRpcGxheWVyX2dhbWVcIik7XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIC8qaHRtbCovYFxuXHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3Mvc29sb19nYW1lXzF2MS5jc3NcIj5cblx0XHRcdDxzY3JpcHQgdHlwZT1cIm1vZHVsZVwiIHNyYz1cIi4vc3RhdGljL2pzL3NjcmlwdC9nYW1lX21lbnUuanNcIj48L3NjcmlwdD5cblx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0PGgxPlNvbG9fZ2FtZTwvaDE+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfYnV0dG9uXCIgY2xhc3M9XCJidG5cIiBkYXRhLWxpbms9XCIvYmFja19idXR0b25cIj4gXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwiL0dhbWVfbWVudVwiIGNsYXNzPVwibmF2LWxpbmtcIiBkYXRhLWxpbms+TGVhdmUgdGhlIGdhbWU8L2E+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0YDtcblx0fVxuXG5cdEJhY2tfdG9fTWVudV9kdW8oKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrX2J1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJCYWNrIHRvIG1lbnVcIik7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUyXCIsIFwidnVlNFwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRsZWF2ZV9NdWx0aXBsYXllcl9HYW1lKCk7XG5cdFx0XHR9ICwgMTUwMCk7XG5cdFx0fSk7XG5cdH1cbn0iXX0=