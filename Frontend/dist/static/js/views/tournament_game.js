import AbstractView from "./AbstractView.js";
import { getPlayer_1_win, getPlayer_2_win, isGameFinished } from "../../../srcs/game/gameplay/score.js";
import { leave_Game, leave_tournament_game } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { destroy_game_solo_tournament } from "../../../srcs/game/gameplay/tournament/tournament.js";
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
        return `
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
            console.log("Destruction de l'environnement et des objets du jeudeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
            setTimeout(() => {
                leave_tournament_game();
            }, 1500);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91cm5hbWVudF9nYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy90b3VybmFtZW50X2dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDeEcsT0FBTyxFQUFFLFVBQVUsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBRXBHLE1BQU0sQ0FBQyxPQUFPLE1BQU8sU0FBUSxZQUFZO0lBQ3hDO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDcEIsR0FBRyxFQUFFLElBQUk7U0FDVCxDQUFDO1FBRUYsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFaEUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQztJQUNGLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNaLE9BQU87Ozs7Ozs7Ozs7Ozs7RUFhUCxDQUFDO0lBQ0YsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFLO1FBQ25CLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUM7WUFBRSxPQUFPO1FBRXpDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLENBQUMsaUNBQWlDO1FBRWxFLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5RCxJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUNqQixXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7Z0JBQ3hDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztZQUN0QyxDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVELHdCQUF3QjtRQUN2QixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLGtCQUFrQjtZQUNsRCxPQUFPO1FBQ1IsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3JFLElBQUksWUFBWSxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ3JDLElBQUksWUFBWSxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxlQUFlO1lBQ25CLE9BQU87UUFDUixJQUFJLGNBQWMsRUFBRSxFQUFFLENBQUM7WUFDdEIsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDZDQUE2QztZQUMzRSxJQUFJLFlBQVksRUFDaEIsQ0FBQztnQkFDQSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUM7WUFDakUsQ0FBQztpQkFDSSxJQUFJLFlBQVksRUFDckIsQ0FBQztnQkFDQSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUM7WUFDakUsQ0FBQztRQUNGLENBQUM7YUFFRCxDQUFDO1lBQ0EsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNGLENBQUM7SUFFRCxxQkFBcUI7UUFDcEIsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRWhFLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDZDQUE2QztZQUMzRSxxQkFBcUIsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtSEFBbUgsQ0FBQyxDQUFDO1lBQ2pJLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YscUJBQXFCLEVBQUUsQ0FBQztZQUN6QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG5pbXBvcnQgeyBnZXRQbGF5ZXJfMV93aW4sIGdldFBsYXllcl8yX3dpbiwgaXNHYW1lRmluaXNoZWQgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3Njb3JlLmpzXCI7XG5pbXBvcnQgeyBsZWF2ZV9HYW1lLCBsZWF2ZV90b3VybmFtZW50X2dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBkZXN0cm95X2dhbWVfc29sb190b3VybmFtZW50IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS90b3VybmFtZW50L3RvdXJuYW1lbnQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJUb3VybmFtZW50XCIpO1xuXG5cdFx0dGhpcy5jb29sZG93bnMgPSB7fTtcblxuXHRcdHRoaXMuY29vbGRvd25UaW1lcyA9IHtcblx0XHRcdFwiIFwiOiAxMDAwLFxuXHRcdH07XG5cblx0XHR0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyID0gdGhpcy5oYW5kbGVLZXlQcmVzcy5iaW5kKHRoaXMpO1xuICAgIFxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gXCIvdG91cm5hbWVudF9nYW1lXCIpIHtcblx0XHRcdHRoaXMuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuY2hlY2tHYW1lT3Zlcl90b3VybmFtZW50KCk7IDEwMDAgfSk7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gYFxuXHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi9zdGF0aWMvanMvY3NzL3RvdXJuYW1lbnRfZ2FtZS5jc3NcIj5cblx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHQ8ZGl2IGNsYXNzPVwicHJlc3Nfc3BhY2VcIiA+XG5cdFx0XHQ8aDEgaWQ9XCJwcmVzc19zcGFjZV9pZFwiPlByZXNzIFNQQUNFIHRvIFN0YXJ0PC9oMT5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyLUVuZEdhbWVcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ3aW5uZXJcIj5cblx0XHRcdFx0PGgxIGlkPVwid2lubmVyX2lkXCI+PC9oMT5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGJ1dHRvbiBjbGFzcz1cImxlYXZlX2dhbWVfMlwiIGlkPVwibGVhdmVfZ2FtZV8yX2lkXCI+UXVpdHRlciBsYSBwYXJ0aWU8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5cdGA7XG5cdH1cblxuXHRoYW5kbGVLZXlQcmVzcyhldmVudCkge1xuXHRcdGNvbnN0IGtleSA9IGV2ZW50LmtleTtcblx0XHRpZiAoIShrZXkgaW4gdGhpcy5jb29sZG93blRpbWVzKSkgcmV0dXJuO1xuXHRcblx0XHRpZiAodGhpcy5jb29sZG93bnNba2V5XSkgcmV0dXJuOyAvLyBJZ25vcmUgbCdhY3Rpb24gc2kgZW4gY29vbGRvd25cblxuXHRcdGlmIChrZXkgPT09IFwiIFwiKSB7XG5cdFx0XHRjb25zdCBwcmVzc19zcGFjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJlc3Nfc3BhY2VfaWRcIik7XG5cdFx0XHRpZiAocHJlc3Nfc3BhY2UpIHtcblx0XHRcdFx0cHJlc3Nfc3BhY2Uuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLmFuaW1hdGlvbiA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcInByZXNzX3NwYWNlX2lkIGludHJvdXZhYmxlICFcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y2hlY2tHYW1lT3Zlcl90b3VybmFtZW50KCkge1xuXHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgIT09IFwiL3RvdXJuYW1lbnRfZ2FtZVwiKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHdpbm5lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLUVuZEdhbWVcIik7XG5cdFx0bGV0IHBsYXllcl8xX3dpbiA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdGxldCBwbGF5ZXJfMl93aW4gPSBnZXRQbGF5ZXJfMl93aW4oKTtcdFxuXHRcdGlmICghd2lubmVyQ29udGFpbmVyKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGlmIChpc0dhbWVGaW5pc2hlZCgpKSB7XG5cdFx0XHR3aW5uZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7IC8vIEFycsOqdGUgbGEgYm91Y2xlIHF1YW5kIGxhIHBhcnRpZSBlc3QgZmluaWVcblx0XHRcdGlmIChwbGF5ZXJfMV93aW4pXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lubmVyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDEgV2luXCI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwbGF5ZXJfMl93aW4pXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lubmVyX2lkXCIpLmlubmVySFRNTCA9IFwiUGxheWVyIDIgV2luXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgXG5cdFx0e1xuXHRcdFx0d2lubmVyQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHR9XG5cblx0ZXZlbnRfdG91cm5hbWVudF9nYW1lKCkge1xuXHRcdGNvbnN0IGxlYXZlX2dhbWVfMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVhdmVfZ2FtZV8yX2lkXCIpO1xuXG5cdFx0bGVhdmVfZ2FtZV8yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuZ2FtZUxvb3ApOyAvLyBBcnLDqnRlIGxhIGJvdWNsZSBxdWFuZCBsYSBwYXJ0aWUgZXN0IGZpbmllXG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoJ3RvdXJuYW1lbnQnLCAndnVlNCcpO1xuXHRcdFx0Y29uc29sZS5sb2coXCJEZXN0cnVjdGlvbiBkZSBsJ2Vudmlyb25uZW1lbnQgZXQgZGVzIG9iamV0cyBkdSBqZXVkZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZVwiKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRsZWF2ZV90b3VybmFtZW50X2dhbWUoKTtcblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=