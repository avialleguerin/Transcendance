"use strict";
// import AbstractView from "./AbstractView.js";
// import { getPlayer_1_win, getPlayer_2_win, isGameFinished } from "../../../srcs/game/gameplay/score.js";
// import { leave_Game, leave_tournament_game } from "../../../srcs/game/gameplay/babylon.js";
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import { destroy_game_solo_tournament } from "../../../srcs/game/gameplay/tournament/tournament.js";
// export default class extends AbstractView {
// 	constructor() {
// 		super();
// 		this.setTitle("Tournament");
// 		this.cooldowns = {};
// 		this.cooldownTimes = {
// 			" ": 1000,
// 		};
// 		this.boundKeyPressHandler = this.handleKeyPress.bind(this);
// 		document.addEventListener("keydown", this.boundKeyPressHandler);
// 		if (window.location.pathname === "/tournament_game") {
// 			this.gameLoop = setInterval(() => { this.checkGameOver_tournament(); 1000 });
// 		}
// 	}
// 	async getHtml() {
// 		return /*html*/`
// 		<link rel="stylesheet" href="./static/js/css/tournament_game.css">
// 		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
// 		<div class="press_space" >
// 			<h1 id="press_space_id">Press SPACE to Start</h1>
// 		</div>
// 		<div class="container-EndGame">
// 			<div class="winner">
// 				<h1 id="winner_id"></h1>
// 			</div>
// 			<button class="leave_game_2" id="leave_game_2_id">Quitter la partie</button>
// 		</div>
// 	</div>
// 	`;
// 	}
// 	handleKeyPress(event) {
// 		const key = event.key;
// 		if (!(key in this.cooldownTimes)) return;
// 		if (this.cooldowns[key]) return; // Ignore l'action si en cooldown
// 		if (key === " ") {
// 			const press_space = document.getElementById("press_space_id");
// 			if (press_space) {
// 				press_space.style.visibility = "hidden";
// 				press_space.style.animation = "none";
// 			} else {
// 				console.error("press_space_id introuvable !");
// 			}
// 		}
// 	}
// 	checkGameOver_tournament() {
// 		if (window.location.pathname !== "/tournament_game")
// 			return;
// 		const winnerContainer = document.querySelector(".container-EndGame");
// 		let player_1_win = getPlayer_1_win();
// 		let player_2_win = getPlayer_2_win();	
// 		if (!winnerContainer)
// 			return;
// 		if (isGameFinished()) {
// 			winnerContainer.classList.add("active");
// 			clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
// 			if (player_1_win)
// 			{
// 				document.getElementById("winner_id").innerHTML = "Player 1 Win";
// 			}
// 			else if (player_2_win)
// 			{
// 				document.getElementById("winner_id").innerHTML = "Player 2 Win";
// 			}
// 		}
// 		else 
// 		{
// 			winnerContainer.classList.remove("active");
// 		}
// 	}
// 	event_tournament_game() {
// 		const leave_game_2 = document.getElementById("leave_game_2_id");
// 		leave_game_2.addEventListener("click", () => {
// 			window.history.back();
// 			clearInterval(this.gameLoop); // Arrête la boucle quand la partie est finie
// 			handleViewTransitions('tournament', 'vue4');
// 			console.log("Destruction de l'environnement et des objets du jeudeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
// 			setTimeout(() => {
// 				leave_tournament_game();
// 			}, 1500);
// 		});
// 	}
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91cm5hbWVudF9nYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy90b3VybmFtZW50X2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGdEQUFnRDtBQUNoRCwyR0FBMkc7QUFDM0csOEZBQThGO0FBQzlGLHVGQUF1RjtBQUN2Rix1R0FBdUc7QUFFdkcsOENBQThDO0FBQzlDLG1CQUFtQjtBQUNuQixhQUFhO0FBQ2IsaUNBQWlDO0FBRWpDLHlCQUF5QjtBQUV6QiwyQkFBMkI7QUFDM0IsZ0JBQWdCO0FBQ2hCLE9BQU87QUFFUCxnRUFBZ0U7QUFFaEUscUVBQXFFO0FBRXJFLDJEQUEyRDtBQUMzRCxtRkFBbUY7QUFDbkYsTUFBTTtBQUNOLEtBQUs7QUFFTCxxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLHVFQUF1RTtBQUN2RSx1R0FBdUc7QUFDdkcsK0JBQStCO0FBQy9CLHVEQUF1RDtBQUN2RCxXQUFXO0FBQ1gsb0NBQW9DO0FBQ3BDLDBCQUEwQjtBQUMxQiwrQkFBK0I7QUFDL0IsWUFBWTtBQUNaLGtGQUFrRjtBQUNsRixXQUFXO0FBQ1gsVUFBVTtBQUNWLE1BQU07QUFDTixLQUFLO0FBRUwsMkJBQTJCO0FBQzNCLDJCQUEyQjtBQUMzQiw4Q0FBOEM7QUFFOUMsdUVBQXVFO0FBRXZFLHVCQUF1QjtBQUN2QixvRUFBb0U7QUFDcEUsd0JBQXdCO0FBQ3hCLCtDQUErQztBQUMvQyw0Q0FBNEM7QUFDNUMsY0FBYztBQUNkLHFEQUFxRDtBQUNyRCxPQUFPO0FBQ1AsTUFBTTtBQUNOLEtBQUs7QUFFTCxnQ0FBZ0M7QUFDaEMseURBQXlEO0FBQ3pELGFBQWE7QUFDYiwwRUFBMEU7QUFDMUUsMENBQTBDO0FBQzFDLDJDQUEyQztBQUMzQywwQkFBMEI7QUFDMUIsYUFBYTtBQUNiLDRCQUE0QjtBQUM1Qiw4Q0FBOEM7QUFDOUMsaUZBQWlGO0FBQ2pGLHVCQUF1QjtBQUN2QixPQUFPO0FBQ1AsdUVBQXVFO0FBQ3ZFLE9BQU87QUFDUCw0QkFBNEI7QUFDNUIsT0FBTztBQUNQLHVFQUF1RTtBQUN2RSxPQUFPO0FBQ1AsTUFBTTtBQUNOLFVBQVU7QUFDVixNQUFNO0FBQ04saURBQWlEO0FBQ2pELE1BQU07QUFDTixLQUFLO0FBRUwsNkJBQTZCO0FBQzdCLHFFQUFxRTtBQUVyRSxtREFBbUQ7QUFDbkQsNEJBQTRCO0FBQzVCLGlGQUFpRjtBQUNqRixrREFBa0Q7QUFDbEQsdUlBQXVJO0FBQ3ZJLHdCQUF3QjtBQUN4QiwrQkFBK0I7QUFDL0IsZUFBZTtBQUNmLFFBQVE7QUFDUixLQUFLO0FBQ0wsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG4vLyBpbXBvcnQgeyBnZXRQbGF5ZXJfMV93aW4sIGdldFBsYXllcl8yX3dpbiwgaXNHYW1lRmluaXNoZWQgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3Njb3JlLmpzXCI7XG4vLyBpbXBvcnQgeyBsZWF2ZV9HYW1lLCBsZWF2ZV90b3VybmFtZW50X2dhbWUgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbi8vIGltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG4vLyBpbXBvcnQgeyBkZXN0cm95X2dhbWVfc29sb190b3VybmFtZW50IH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS90b3VybmFtZW50L3RvdXJuYW1lbnQuanNcIjtcblxuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuLy8gXHRjb25zdHJ1Y3RvcigpIHtcbi8vIFx0XHRzdXBlcigpO1xuLy8gXHRcdHRoaXMuc2V0VGl0bGUoXCJUb3VybmFtZW50XCIpO1xuXG4vLyBcdFx0dGhpcy5jb29sZG93bnMgPSB7fTtcblxuLy8gXHRcdHRoaXMuY29vbGRvd25UaW1lcyA9IHtcbi8vIFx0XHRcdFwiIFwiOiAxMDAwLFxuLy8gXHRcdH07XG5cbi8vIFx0XHR0aGlzLmJvdW5kS2V5UHJlc3NIYW5kbGVyID0gdGhpcy5oYW5kbGVLZXlQcmVzcy5iaW5kKHRoaXMpO1xuICAgIFxuLy8gXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMuYm91bmRLZXlQcmVzc0hhbmRsZXIpO1xuXG4vLyBcdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gXCIvdG91cm5hbWVudF9nYW1lXCIpIHtcbi8vIFx0XHRcdHRoaXMuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuY2hlY2tHYW1lT3Zlcl90b3VybmFtZW50KCk7IDEwMDAgfSk7XG4vLyBcdFx0fVxuLy8gXHR9XG5cbi8vIFx0YXN5bmMgZ2V0SHRtbCgpIHtcbi8vIFx0XHRyZXR1cm4gLypodG1sKi9gXG4vLyBcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvdG91cm5hbWVudF9nYW1lLmNzc1wiPlxuLy8gXHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuLy8gXHRcdDxkaXYgY2xhc3M9XCJwcmVzc19zcGFjZVwiID5cbi8vIFx0XHRcdDxoMSBpZD1cInByZXNzX3NwYWNlX2lkXCI+UHJlc3MgU1BBQ0UgdG8gU3RhcnQ8L2gxPlxuLy8gXHRcdDwvZGl2PlxuLy8gXHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXItRW5kR2FtZVwiPlxuLy8gXHRcdFx0PGRpdiBjbGFzcz1cIndpbm5lclwiPlxuLy8gXHRcdFx0XHQ8aDEgaWQ9XCJ3aW5uZXJfaWRcIj48L2gxPlxuLy8gXHRcdFx0PC9kaXY+XG4vLyBcdFx0XHQ8YnV0dG9uIGNsYXNzPVwibGVhdmVfZ2FtZV8yXCIgaWQ9XCJsZWF2ZV9nYW1lXzJfaWRcIj5RdWl0dGVyIGxhIHBhcnRpZTwvYnV0dG9uPlxuLy8gXHRcdDwvZGl2PlxuLy8gXHQ8L2Rpdj5cbi8vIFx0YDtcbi8vIFx0fVxuXG4vLyBcdGhhbmRsZUtleVByZXNzKGV2ZW50KSB7XG4vLyBcdFx0Y29uc3Qga2V5ID0gZXZlbnQua2V5O1xuLy8gXHRcdGlmICghKGtleSBpbiB0aGlzLmNvb2xkb3duVGltZXMpKSByZXR1cm47XG5cdFxuLy8gXHRcdGlmICh0aGlzLmNvb2xkb3duc1trZXldKSByZXR1cm47IC8vIElnbm9yZSBsJ2FjdGlvbiBzaSBlbiBjb29sZG93blxuXG4vLyBcdFx0aWYgKGtleSA9PT0gXCIgXCIpIHtcbi8vIFx0XHRcdGNvbnN0IHByZXNzX3NwYWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmVzc19zcGFjZV9pZFwiKTtcbi8vIFx0XHRcdGlmIChwcmVzc19zcGFjZSkge1xuLy8gXHRcdFx0XHRwcmVzc19zcGFjZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbi8vIFx0XHRcdFx0cHJlc3Nfc3BhY2Uuc3R5bGUuYW5pbWF0aW9uID0gXCJub25lXCI7XG4vLyBcdFx0XHR9IGVsc2Uge1xuLy8gXHRcdFx0XHRjb25zb2xlLmVycm9yKFwicHJlc3Nfc3BhY2VfaWQgaW50cm91dmFibGUgIVwiKTtcbi8vIFx0XHRcdH1cbi8vIFx0XHR9XG4vLyBcdH1cblxuLy8gXHRjaGVja0dhbWVPdmVyX3RvdXJuYW1lbnQoKSB7XG4vLyBcdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvdG91cm5hbWVudF9nYW1lXCIpXG4vLyBcdFx0XHRyZXR1cm47XG4vLyBcdFx0Y29uc3Qgd2lubmVyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb250YWluZXItRW5kR2FtZVwiKTtcbi8vIFx0XHRsZXQgcGxheWVyXzFfd2luID0gZ2V0UGxheWVyXzFfd2luKCk7XG4vLyBcdFx0bGV0IHBsYXllcl8yX3dpbiA9IGdldFBsYXllcl8yX3dpbigpO1x0XG4vLyBcdFx0aWYgKCF3aW5uZXJDb250YWluZXIpXG4vLyBcdFx0XHRyZXR1cm47XG4vLyBcdFx0aWYgKGlzR2FtZUZpbmlzaGVkKCkpIHtcbi8vIFx0XHRcdHdpbm5lckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuLy8gXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTsgLy8gQXJyw6p0ZSBsYSBib3VjbGUgcXVhbmQgbGEgcGFydGllIGVzdCBmaW5pZVxuLy8gXHRcdFx0aWYgKHBsYXllcl8xX3dpbilcbi8vIFx0XHRcdHtcbi8vIFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aW5uZXJfaWRcIikuaW5uZXJIVE1MID0gXCJQbGF5ZXIgMSBXaW5cIjtcbi8vIFx0XHRcdH1cbi8vIFx0XHRcdGVsc2UgaWYgKHBsYXllcl8yX3dpbilcbi8vIFx0XHRcdHtcbi8vIFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aW5uZXJfaWRcIikuaW5uZXJIVE1MID0gXCJQbGF5ZXIgMiBXaW5cIjtcbi8vIFx0XHRcdH1cbi8vIFx0XHR9XG4vLyBcdFx0ZWxzZSBcbi8vIFx0XHR7XG4vLyBcdFx0XHR3aW5uZXJDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbi8vIFx0XHR9XG4vLyBcdH1cblxuLy8gXHRldmVudF90b3VybmFtZW50X2dhbWUoKSB7XG4vLyBcdFx0Y29uc3QgbGVhdmVfZ2FtZV8yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWF2ZV9nYW1lXzJfaWRcIik7XG5cbi8vIFx0XHRsZWF2ZV9nYW1lXzIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbi8vIFx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbi8vIFx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7IC8vIEFycsOqdGUgbGEgYm91Y2xlIHF1YW5kIGxhIHBhcnRpZSBlc3QgZmluaWVcbi8vIFx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucygndG91cm5hbWVudCcsICd2dWU0Jyk7XG4vLyBcdFx0XHRjb25zb2xlLmxvZyhcIkRlc3RydWN0aW9uIGRlIGwnZW52aXJvbm5lbWVudCBldCBkZXMgb2JqZXRzIGR1IGpldWRlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlXCIpO1xuLy8gXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG4vLyBcdFx0XHRcdGxlYXZlX3RvdXJuYW1lbnRfZ2FtZSgpO1xuLy8gXHRcdFx0fSwgMTUwMCk7XG4vLyBcdFx0fSk7XG4vLyBcdH1cbi8vIH1cbiJdfQ==