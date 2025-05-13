import AbstractView from "./AbstractView";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { leave_Multiplayer_Game } from "../../../srcs/game/gameplay/babylon.js";
export default class Multiplayer_game extends AbstractView {
    constructor() {
        super();
        this.setTitle("Multiplayer_game");
    }
    async getHtml() {
        return `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVvX2dhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wdWJsaWMvc3RhdGljL2pzL3ZpZXdzL2R1b19nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRWhGLE1BQU0sQ0FBQyxPQUFPLE9BQU8sZ0JBQWlCLFNBQVEsWUFBWTtJQUN6RDtRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNaLE9BQU87Ozs7Ozs7Ozs7O0dBV04sQ0FBQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7UUFDZixRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1QixxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDdEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZixzQkFBc0IsRUFBRSxDQUFDO1lBQzFCLENBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXdcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBsZWF2ZV9NdWx0aXBsYXllcl9HYW1lIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpcGxheWVyX2dhbWUgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJNdWx0aXBsYXllcl9nYW1lXCIpO1xuXHR9XG5cblx0YXN5bmMgZ2V0SHRtbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRcdHJldHVybiBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy9zb2xvX2dhbWVfMXYxLmNzc1wiPlxuXHRcdFx0PHNjcmlwdCB0eXBlPVwibW9kdWxlXCIgc3JjPVwiLi9zdGF0aWMvanMvc2NyaXB0L2dhbWVfbWVudS5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8aDE+U29sb19nYW1lPC9oMT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwiYmFja19idXR0b25cIiBjbGFzcz1cImJ0blwiIGRhdGEtbGluaz1cIi9iYWNrX2J1dHRvblwiPiBcblx0XHRcdFx0XHRcdDxhIGhyZWY9XCIvR2FtZV9tZW51XCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5MZWF2ZSB0aGUgZ2FtZTwvYT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgO1xuXHR9XG5cblx0QmFja190b19NZW51X2R1bygpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2tfYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkJhY2sgdG8gbWVudVwiKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTJcIiwgXCJ2dWU0XCIpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGxlYXZlX011bHRpcGxheWVyX0dhbWUoKTtcblx0XHRcdH0gLCAxNTAwKTtcblx0XHR9KTtcblx0fVxufSJdfQ==