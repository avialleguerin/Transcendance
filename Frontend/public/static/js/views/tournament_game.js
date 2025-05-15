import AbstractView from "./AbstractView.js";
import { getPlayer_1_win, getPlayer_2_win, isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { leave_tournament_game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Tournament");
        this.cooldowns = {};
        this.cooldownTimes = {
            " ": 1000,
        };
        this.boundKeyPressHandler = this.handleKeyPress.bind(this);
        document.addEventListener("keydown", this.boundKeyPressHandler);
        if (window.location.pathname === "/tournament_game") {
            this.gameLoop = setInterval(() => { this.checkGameOver_tournament(); 1000; });
        }
    }
    async getHtml() {
        return /*html*/ `
		<link rel="stylesheet" href="./static/js/css/tournament_game.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="press_space" >
			<h1 id="press_space_id">Press SPACE to Start</h1>
		</div>
		<div class="container-EndGame">
			<div class="winner">
				<h1 id="winner_id"></h1>
			</div>
			<button class="leave_game_2" id="leave_game_2_id">Quitter la partie</button>
		</div>
	</div>
	`;
    }
    handleKeyPress(event) {
        const key = event.key;
        if (!(key in this.cooldownTimes))
            return;
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
        }
    }
    checkGameOver_tournament() {
        if (window.location.pathname !== "/tournament_game")
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
            }
            else if (player_2_win) {
                document.getElementById("winner_id").innerHTML = "Player 2 Win";
            }
        }
        else {
            winnerContainer.classList.remove("active");
        }
    }
    event_tournament_game() {
        const leave_game_2 = document.getElementById("leave_game_2_id");
        leave_game_2.addEventListener("click", () => {
            window.history.back();
            clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
            handleViewTransitions('tournament', 'vue4');
            console.log("Destruction de l'environnement et des objets du jeu");
            setTimeout(() => {
                leave_tournament_game();
            }, 1500);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91cm5hbWVudF9nYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG91cm5hbWVudF9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3hHLE9BQU8sRUFBYyxxQkFBcUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBR3BGLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBTXhDO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDcEIsR0FBRyxFQUFFLElBQUk7U0FDVCxDQUFDO1FBRUYsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFaEUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQztJQUNGLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNaLE9BQU8sUUFBUSxDQUFBOzs7Ozs7Ozs7Ozs7O0VBYWYsQ0FBQztJQUNGLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBb0I7UUFDbEMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUN0QixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUFFLE9BQU87UUFFekMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sQ0FBQyxpQ0FBaUM7UUFFbEUsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDakIsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzlELElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQ2pCLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztnQkFDeEMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQ3RDLENBQUM7aUJBQU0sQ0FBQztnQkFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDL0MsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRUQsd0JBQXdCO1FBQ3ZCLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssa0JBQWtCO1lBQ2xELE9BQU87UUFDUixNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDckUsSUFBSSxZQUFZLEdBQUcsZUFBZSxFQUFFLENBQUM7UUFDckMsSUFBSSxZQUFZLEdBQUcsZUFBZSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGVBQWU7WUFDbkIsT0FBTztRQUNSLElBQUksY0FBYyxFQUFFLEVBQUUsQ0FBQztZQUN0QixlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsNkNBQTZDO1lBQzNFLElBQUksWUFBWSxFQUNoQixDQUFDO2dCQUNBLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztZQUNqRSxDQUFDO2lCQUNJLElBQUksWUFBWSxFQUNyQixDQUFDO2dCQUNBLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztZQUNqRSxDQUFDO1FBQ0YsQ0FBQzthQUVELENBQUM7WUFDQSxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDO0lBQ0YsQ0FBQztJQUVELHFCQUFxQjtRQUNwQixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFaEUsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsNkNBQTZDO1lBQzNFLHFCQUFxQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7WUFDbkUsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZixxQkFBcUIsRUFBRSxDQUFDO1lBQ3pCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IGdldFBsYXllcl8xX3dpbiwgZ2V0UGxheWVyXzJfd2luLCBpc0dhbWVGaW5pc2hlZCB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc2NvcmUuanNcIjtcbmltcG9ydCB7IGxlYXZlX0dhbWUsIGxlYXZlX3RvdXJuYW1lbnRfZ2FtZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbmltcG9ydCB7IGRlc3Ryb3lfZ2FtZV9zb2xvX3RvdXJuYW1lbnQgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3RvdXJuYW1lbnQvdG91cm5hbWVudC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0VmlldyB7XG5cdHByaXZhdGUgY29vbGRvd25zOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPjtcblx0cHJpdmF0ZSBjb29sZG93blRpbWVzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+O1xuXHRwcml2YXRlIGdhbWVMb29wOiBOb2RlSlMuVGltZW91dDsgIC8vIE5PVEUgLSBvciAnYW55J1xuXHRwcml2YXRlIGJvdW5kS2V5UHJlc3NIYW5kbGVyOiAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHZvaWQ7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwiVG91cm5hbWVudFwiKTtcblxuXHRcdHRoaXMuY29vbGRvd25zID0ge307XG5cblx0XHR0aGlzLmNvb2xkb3duVGltZXMgPSB7XG5cdFx0XHRcIiBcIjogMTAwMCxcblx0XHR9O1xuXG5cdFx0dGhpcy5ib3VuZEtleVByZXNzSGFuZGxlciA9IHRoaXMuaGFuZGxlS2V5UHJlc3MuYmluZCh0aGlzKTtcbiAgICBcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyKTtcblxuXHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IFwiL3RvdXJuYW1lbnRfZ2FtZVwiKSB7XG5cdFx0XHR0aGlzLmdhbWVMb29wID0gc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLmNoZWNrR2FtZU92ZXJfdG91cm5hbWVudCgpOyAxMDAwIH0pO1xuXHRcdH1cblx0fVxuXG5cdGFzeW5jIGdldEh0bWwoKSB7XG5cdFx0cmV0dXJuIC8qaHRtbCovYFxuXHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi9zdGF0aWMvanMvY3NzL3RvdXJuYW1lbnRfZ2FtZS5jc3NcIj5cblx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwicHJlc3Nfc3BhY2VcIiA+XG5cdFx0XHQ8aDEgaWQ9XCJwcmVzc19zcGFjZV9pZFwiPlByZXNzIFNQQUNFIHRvIFN0YXJ0PC9oMT5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLUVuZEdhbWVcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ3aW5uZXJcIj5cblx0XHRcdFx0PGgxIGlkPVwid2lubmVyX2lkXCI+PC9oMT5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGJ1dHRvbiBjbGFzcz1cImxlYXZlX2dhbWVfMlwiIGlkPVwibGVhdmVfZ2FtZV8yX2lkXCI+UXVpdHRlciBsYSBwYXJ0aWU8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5cdGA7XG5cdH1cblxuXHRoYW5kbGVLZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuXHRcdGNvbnN0IGtleSA9IGV2ZW50LmtleTtcblx0XHRpZiAoIShrZXkgaW4gdGhpcy5jb29sZG93blRpbWVzKSkgcmV0dXJuO1xuXHRcblx0XHRpZiAodGhpcy5jb29sZG93bnNba2V5XSkgcmV0dXJuOyAvLyBJZ25vcmUgbCdhY3Rpb24gc2kgZW4gY29vbGRvd25cblxuXHRcdGlmIChrZXkgPT09IFwiIFwiKSB7XG5cdFx0XHRjb25zdCBwcmVzc19zcGFjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJlc3Nfc3BhY2VfaWRcIik7XG5cdFx0XHRpZiAocHJlc3Nfc3BhY2UpIHtcblx0XHRcdFx0cHJlc3Nfc3BhY2Uuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLmFuaW1hdGlvbiA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcInByZXNzX3NwYWNlX2lkIGludHJvdXZhYmxlICFcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y2hlY2tHYW1lT3Zlcl90b3VybmFtZW50KCkge1xuXHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgIT09IFwiL3RvdXJuYW1lbnRfZ2FtZVwiKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHdpbm5lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLUVuZEdhbWVcIik7XG5cdFx0bGV0IHBsYXllcl8xX3dpbiA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdGxldCBwbGF5ZXJfMl93aW4gPSBnZXRQbGF5ZXJfMl93aW4oKTtcdFxuXHRcdGlmICghd2lubmVyQ29udGFpbmVyKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGlmIChpc0dhbWVGaW5pc2hlZCgpKSB7XG5cdFx0XHR3aW5uZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7IC8vIEFycsOqdGUgbGEgYm91Y2xlIHF1YW5kIGxhIHBhcnRpZSBlc3QgZmluaWVcblx0XHRcdGlmIChwbGF5ZXJfMV93aW4pXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lubmVyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDEgV2luXCI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwbGF5ZXJfMl93aW4pXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lubmVyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDIgV2luXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgXG5cdFx0e1xuXHRcdFx0d2lubmVyQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHR9XG5cblx0ZXZlbnRfdG91cm5hbWVudF9nYW1lKCkge1xuXHRcdGNvbnN0IGxlYXZlX2dhbWVfMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV8yX2lkXCIpO1xuXG5cdFx0bGVhdmVfZ2FtZV8yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuZ2FtZUxvb3ApOyAvLyBBcnLDqnRlIGxhIGJvdWNsZSBxdWFuZCBsYSBwYXJ0aWUgZXN0IGZpbmllXG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoJ3RvdXJuYW1lbnQnLCAndnVlNCcpO1xuXHRcdFx0Y29uc29sZS5sb2coXCJEZXN0cnVjdGlvbiBkZSBsJ2Vudmlyb25uZW1lbnQgZXQgZGVzIG9iamV0cyBkdSBqZXVcIik7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0bGVhdmVfdG91cm5hbWVudF9nYW1lKCk7XG5cdFx0XHR9LCAxNTAwKTtcblx0XHR9KTtcblx0fVxufVxuIl19