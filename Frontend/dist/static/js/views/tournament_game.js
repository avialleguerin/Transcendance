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
		<link rel="stylesheet" href="./static/js/css/tournament_game.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="press_space" >
			<h1 id="press_space_id">Press SPACE to Start</h1>
		</div>
		<div class="container-EndGame">
			<div class="winner">
				<h1 id="winner_id"></h1>
			</div>
			<button class="leave_game_2" id="leave_game_2_id" onclick="create_1v1_game(event, '${localStorage.getItem('current_player1')}', '${localStorage.getItem('current_player2')}')">Quitter la partie</button>
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
            if (player_1_win)
                document.getElementById("winner_id").innerHTML = localStorage.getItem("current_player1") + " won !";
            else if (player_2_win)
                document.getElementById("winner_id").innerHTML = localStorage.getItem("current_player2") + " won !";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91cm5hbWVudF9nYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy90b3VybmFtZW50X2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDeEcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsTUFBTSxDQUFDLE9BQU8sTUFBTyxTQUFRLFlBQVk7SUFNeEM7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNwQixHQUFHLEVBQUUsSUFBSTtTQUNULENBQUM7UUFFRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0QsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVoRSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLGtCQUFrQixFQUFFLENBQUM7WUFDckQsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDO1FBQ0QsTUFBTSxXQUFXLEdBQWtCLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENB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QUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUN0RyxDQUFDO2FBRUQsQ0FBQztZQUNBLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUM7SUFDRixDQUFDO0lBRUQscUJBQXFCO1FBQ3BCLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVoRSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RCLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyw2Q0FBNkM7WUFDM0UscUJBQXFCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMscURBQXFELENBQUMsQ0FBQztZQUNuRSxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNmLHFCQUFxQixFQUFFLENBQUM7WUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuaW1wb3J0IHsgZ2V0UGxheWVyXzFfd2luLCBnZXRQbGF5ZXJfMl93aW4sIGlzR2FtZUZpbmlzaGVkIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zY29yZS5qc1wiO1xuaW1wb3J0IHsgbGVhdmVfdG91cm5hbWVudF9nYW1lIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uLmpzXCI7XG5pbXBvcnQgeyBoYW5kbGVWaWV3VHJhbnNpdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2NhbWVyYS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRwcml2YXRlIGNvb2xkb3duczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj47XG5cdHByaXZhdGUgY29vbGRvd25UaW1lczogUmVjb3JkPHN0cmluZywgbnVtYmVyPjtcblx0cHJpdmF0ZSBnYW1lTG9vcDogbnVtYmVyOyAgLy8gTk9URSAtIG9yICdhbnknXG5cdHByaXZhdGUgYm91bmRLZXlQcmVzc0hhbmRsZXI6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJUb3VybmFtZW50XCIpO1xuXG5cdFx0dGhpcy5jb29sZG93bnMgPSB7fTtcblxuXHRcdHRoaXMuY29vbGRvd25UaW1lcyA9IHtcblx0XHRcdFwiIFwiOiAxMDAwLFxuXHRcdH07XG5cblx0XHR0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyID0gdGhpcy5oYW5kbGVLZXlQcmVzcy5iaW5kKHRoaXMpO1xuICAgIFxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gXCIvdG91cm5hbWVudF9nYW1lXCIpIHtcblx0XHRcdHRoaXMuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuY2hlY2tHYW1lT3Zlcl90b3VybmFtZW50KCk7IDEwMDAgfSk7XG5cdFx0fVxuXHRcdGNvbnN0IGFjY2Vzc1Rva2VuOiBzdHJpbmcgfCBudWxsID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWNjZXNzVG9rZW4nKTtcblx0XHRpZiAoIWFjY2Vzc1Rva2VuIHx8IGFjY2Vzc1Rva2VuID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgJy8nKTtcblx0XHRcdGltcG9ydCgnLi9Ib21lLmpzJykudGhlbigobW9kdWxlOiBhbnkpID0+IHtcblx0XHRcdFx0Y29uc3QgSG9tZSA9IG1vZHVsZS5kZWZhdWx0O1xuXHRcdFx0XHRjb25zdCBob21lSW5zdGFuY2UgPSBuZXcgSG9tZSgpO1xuXHRcdFx0XHRob21lSW5zdGFuY2UuZ2V0SHRtbCgpLnRoZW4oKGh0bWw6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGFwcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG5cdFx0XHRcdFx0aWYgKGFwcEVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdGFwcEVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRcdFx0XHRcdGlmIChob21lSW5zdGFuY2UuY3JlYXRlQWNjb3VudCAmJiB0eXBlb2YgaG9tZUluc3RhbmNlLmNyZWF0ZUFjY291bnQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdFx0aG9tZUluc3RhbmNlLmNyZWF0ZUFjY291bnQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvdG91cm5hbWVudF9nYW1lLmNzc1wiPlxuXHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdDxkaXYgY2xhc3M9XCJwcmVzc19zcGFjZVwiID5cblx0XHRcdDxoMSBpZD1cInByZXNzX3NwYWNlX2lkXCI+UHJlc3MgU1BBQ0UgdG8gU3RhcnQ8L2gxPlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItRW5kR2FtZVwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cIndpbm5lclwiPlxuXHRcdFx0XHQ8aDEgaWQ9XCJ3aW5uZXJfaWRcIj48L2gxPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8YnV0dG9uIGNsYXNzPVwibGVhdmVfZ2FtZV8yXCIgaWQ9XCJsZWF2ZV9nYW1lXzJfaWRcIiBvbmNsaWNrPVwiY3JlYXRlXzF2MV9nYW1lKGV2ZW50LCAnJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9wbGF5ZXIxJyl9JywgJyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfcGxheWVyMicpfScpXCI+UXVpdHRlciBsYSBwYXJ0aWU8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5cdGA7XG5cdH1cblxuXHRoYW5kbGVLZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuXHRcdGNvbnN0IGtleSA9IGV2ZW50LmtleTtcblx0XHRpZiAoIShrZXkgaW4gdGhpcy5jb29sZG93blRpbWVzKSkgcmV0dXJuO1xuXHRcblx0XHRpZiAodGhpcy5jb29sZG93bnNba2V5XSkgcmV0dXJuOyAvLyBJZ25vcmUgbCdhY3Rpb24gc2kgZW4gY29vbGRvd25cblxuXHRcdGlmIChrZXkgPT09IFwiIFwiKSB7XG5cdFx0XHRjb25zdCBwcmVzc19zcGFjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJlc3Nfc3BhY2VfaWRcIik7XG5cdFx0XHRpZiAocHJlc3Nfc3BhY2UpIHtcblx0XHRcdFx0cHJlc3Nfc3BhY2Uuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG5cdFx0XHRcdHByZXNzX3NwYWNlLnN0eWxlLmFuaW1hdGlvbiA9IFwibm9uZVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcInByZXNzX3NwYWNlX2lkIGludHJvdXZhYmxlICFcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y2hlY2tHYW1lT3Zlcl90b3VybmFtZW50KCkge1xuXHRcdGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgIT09IFwiL3RvdXJuYW1lbnRfZ2FtZVwiKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnN0IHdpbm5lckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLUVuZEdhbWVcIik7XG5cdFx0bGV0IHBsYXllcl8xX3dpbiA9IGdldFBsYXllcl8xX3dpbigpO1xuXHRcdGxldCBwbGF5ZXJfMl93aW4gPSBnZXRQbGF5ZXJfMl93aW4oKTtcdFxuXHRcdGlmICghd2lubmVyQ29udGFpbmVyKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGlmIChpc0dhbWVGaW5pc2hlZCgpKSB7XG5cdFx0XHR3aW5uZXJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7IC8vIEFycsOqdGUgbGEgYm91Y2xlIHF1YW5kIGxhIHBhcnRpZSBlc3QgZmluaWVcblx0XHRcdGlmIChwbGF5ZXJfMV93aW4pXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2lubmVyX2lkXCIpLmlubmVySFRNTCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY3VycmVudF9wbGF5ZXIxXCIpICsgXCIgd29uICFcIjtcblx0XHRcdGVsc2UgaWYgKHBsYXllcl8yX3dpbilcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aW5uZXJfaWRcIikuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjdXJyZW50X3BsYXllcjJcIikgKyBcIiB3b24gIVwiO1xuXHRcdH1cblx0XHRlbHNlIFxuXHRcdHtcblx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fVxuXG5cdGV2ZW50X3RvdXJuYW1lbnRfZ2FtZSgpIHtcblx0XHRjb25zdCBsZWF2ZV9nYW1lXzIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlYXZlX2dhbWVfMl9pZFwiKTtcblxuXHRcdGxlYXZlX2dhbWVfMi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTsgLy8gQXJyw6p0ZSBsYSBib3VjbGUgcXVhbmQgbGEgcGFydGllIGVzdCBmaW5pZVxuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKCd0b3VybmFtZW50JywgJ3Z1ZTQnKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiRGVzdHJ1Y3Rpb24gZGUgbCdlbnZpcm9ubmVtZW50IGV0IGRlcyBvYmpldHMgZHUgamV1XCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGxlYXZlX3RvdXJuYW1lbnRfZ2FtZSgpO1xuXHRcdFx0fSwgMTUwMCk7XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==