import AbstractView from "../AbstractView.js";
import { initGame } from "./game.js";
import { initCanvas, fadeOutCanvas } from "./constants.js";
import { handleViewTransitions } from "../../../../srcs/game/gameplay/views/camera.js";
let game_started = false;
let check_verfication = false;
export default class PlatformerView extends AbstractView {
    constructor() {
        super();
        this.setTitle("platformer");
        if (check_verfication === true) {
            console.log("je suis laaaaaaaaaaaaaaaaaaa");
            if (window.location.pathname === "/PlatformView") {
                this.gameLoop = setInterval(() => { this.check_game_is_finish(); }, 1000);
            }
        }
    }
    async getHtml() {
        return `
            <link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
            <style>
            canvas {
                z-index: 100;
                display: block;
                margin: 0 auto;
                background-color: black;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                }
                </style>
                <canvas id="game-canvas"></canvas>
                `;
    }
    init_game_platformer() {
        console.log("Initializing platformer game");
        // Initialize the canvas first (avec fade in intégré)
        initCanvas();
        // Then initialize the game
        initGame();
        Setgame_started(true);
        check_verfication = true;
        console.log("Game started: " + Getgame_started());
        console.log("Check verification: " + check_verfication);
        console.log("Game initialized successfully");
        if (check_verfication === true) {
            console.log("je suis laaaaaaaaaaaaaaaaaaa");
            if (window.location.pathname === "/PlatformView") {
                this.gameLoop = setInterval(() => { this.check_game_is_finish(); }, 1000);
            }
        }
    }
    async afterRender() {
        this.init_game_platformer();
    }
    check_game_is_finish() {
        if (window.location.pathname !== "/PlatformView")
            return;
        let game_is_finish = Getgame_started();
        console.log("Game is finish: " + game_is_finish);
        if (game_is_finish === false) {
            console.log("Game is not started yet");
            handleViewTransitions("vue2", "platformer");
            window.history.back();
            clearInterval(this.gameLoop);
            check_verfication = false;
        }
    }
}
export function Setgame_started(value) {
    game_started = value;
}
export function Getgame_started() {
    return game_started;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhdGZvcm1WaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy9wbGF0Zm9ybWVyL1BsYXRmb3JtVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFdkYsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0FBRTlCLE1BQU0sQ0FBQyxPQUFPLE9BQU8sY0FBZSxTQUFRLFlBQVk7SUFDcEQ7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFNUIsSUFBSSxpQkFBaUIsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDNUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxlQUFlLEVBQUUsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUUsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDVCxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7aUJBZUUsQ0FBQztJQUNOLENBQUM7SUFFVCxvQkFBb0I7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRTVDLHFEQUFxRDtRQUNyRCxVQUFVLEVBQUUsQ0FBQztRQUViLDJCQUEyQjtRQUMzQixRQUFRLEVBQUUsQ0FBQztRQUVYLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDN0MsSUFBSSxpQkFBaUIsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDNUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxlQUFlLEVBQUUsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUUsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVc7UUFDYixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssZUFBZTtZQUM1QyxPQUFPO1FBQ1gsSUFBSSxjQUFjLEdBQUcsZUFBZSxFQUFFLENBQUM7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxjQUFjLENBQUMsQ0FBQztRQUNqRCxJQUFJLGNBQWMsS0FBSyxLQUFLLEVBQzVCLENBQUM7WUFDRyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdkMscUJBQXFCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QixpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDOUIsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsS0FBSztJQUNqQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZTtJQUMzQixPQUFPLFlBQVksQ0FBQztBQUN4QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IGluaXRHYW1lIH0gZnJvbSBcIi4vZ2FtZS5qc1wiO1xuaW1wb3J0IHsgaW5pdENhbnZhcywgZmFkZU91dENhbnZhcyB9IGZyb20gXCIuL2NvbnN0YW50cy5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcblxubGV0IGdhbWVfc3RhcnRlZCA9IGZhbHNlO1xubGV0IGNoZWNrX3ZlcmZpY2F0aW9uID0gZmFsc2U7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXRmb3JtZXJWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXRUaXRsZShcInBsYXRmb3JtZXJcIik7XG4gICAgICAgIFxuICAgICAgICBpZiAoY2hlY2tfdmVyZmljYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiamUgc3VpcyBsYWFhYWFhYWFhYWFhYWFhYWFhYVwiKTtcbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09IFwiL1BsYXRmb3JtVmlld1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lTG9vcCA9IHNldEludGVydmFsKCgpID0+IHsgdGhpcy5jaGVja19nYW1lX2lzX2ZpbmlzaCgpOyB9LCAxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBhc3luYyBnZXRIdG1sKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmxhY2srT3BzK09uZSZkaXNwbGF5PXN3YXBcIiByZWw9XCJzdHlsZXNoZWV0XCI+XG4gICAgICAgICAgICA8c3R5bGU+XG4gICAgICAgICAgICBjYW52YXMge1xuICAgICAgICAgICAgICAgIHotaW5kZXg6IDEwMDtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAgYXV0bztcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgICAgICAgICAgbGVmdDogNTAlO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgICAgICAgIDxjYW52YXMgaWQ9XCJnYW1lLWNhbnZhc1wiPjwvY2FudmFzPlxuICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICBpbml0X2dhbWVfcGxhdGZvcm1lcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcGxhdGZvcm1lciBnYW1lXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgY2FudmFzIGZpcnN0IChhdmVjIGZhZGUgaW4gaW50w6lncsOpKVxuICAgICAgICBpbml0Q2FudmFzKCk7XG4gICAgICAgIFxuICAgICAgICAvLyBUaGVuIGluaXRpYWxpemUgdGhlIGdhbWVcbiAgICAgICAgaW5pdEdhbWUoKTtcbiAgICAgICAgXG4gICAgICAgIFNldGdhbWVfc3RhcnRlZCh0cnVlKTtcbiAgICAgICAgY2hlY2tfdmVyZmljYXRpb24gPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgc3RhcnRlZDogXCIgKyBHZXRnYW1lX3N0YXJ0ZWQoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hlY2sgdmVyaWZpY2F0aW9uOiBcIiArIGNoZWNrX3ZlcmZpY2F0aW9uKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIGluaXRpYWxpemVkIHN1Y2Nlc3NmdWxseVwiKTtcbiAgICAgICAgaWYgKGNoZWNrX3ZlcmZpY2F0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImplIHN1aXMgbGFhYWFhYWFhYWFhYWFhYWFhYWFcIik7XG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBcIi9QbGF0Zm9ybVZpZXdcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUxvb3AgPSBzZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuY2hlY2tfZ2FtZV9pc19maW5pc2goKTsgfSwgMTAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgYXN5bmMgYWZ0ZXJSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuaW5pdF9nYW1lX3BsYXRmb3JtZXIoKTtcbiAgICB9XG5cbiAgICBjaGVja19nYW1lX2lzX2ZpbmlzaCgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvUGxhdGZvcm1WaWV3XCIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxldCBnYW1lX2lzX2ZpbmlzaCA9IEdldGdhbWVfc3RhcnRlZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgaXMgZmluaXNoOiBcIiArIGdhbWVfaXNfZmluaXNoKTtcbiAgICAgICAgaWYgKGdhbWVfaXNfZmluaXNoID09PSBmYWxzZSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIGlzIG5vdCBzdGFydGVkIHlldFwiKTtcbiAgICAgICAgICAgIGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTJcIiwgXCJwbGF0Zm9ybWVyXCIpO1xuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVMb29wKTtcbiAgICAgICAgICAgIGNoZWNrX3ZlcmZpY2F0aW9uID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRnYW1lX3N0YXJ0ZWQodmFsdWUpIHtcbiAgICBnYW1lX3N0YXJ0ZWQgPSB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEdldGdhbWVfc3RhcnRlZCgpIHtcbiAgICByZXR1cm4gZ2FtZV9zdGFydGVkO1xufSJdfQ==