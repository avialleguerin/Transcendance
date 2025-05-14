import AbstractView from "../AbstractView.js";
import { initGame } from "./game.js";
import { initCanvas, fadeOutCanvas } from "./constants.js";
import { handleViewTransitions } from "../../../../srcs/game/gameplay/views/camera.js";
let game_started = false;
export default class PlatformerView extends AbstractView {
    constructor() {
        super();
        this.setTitle("platformer");
        if (window.location.pathname === "/PlatformView") {
            this.gameLoop = setInterval(() => { this.check_game_is_finish(); }, 1000);
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
    }
    async afterRender() {
        // Cette méthode est appelée après que le HTML a été inséré dans le DOM
        this.init_game_platformer();
    }
    check_game_is_finish() {
        if (window.location.pathname !== "/PlatformView")
            return;
        let game_is_finish = Getgame_started();
        if (game_is_finish === false) {
            console.log("Game is not started yet");
            handleViewTransitions("vue2", "platformer");
            window.history.back();
            clearInterval(this.gameLoop);
        }
    }
}
export function Setgame_started(value) {
    game_started = value;
}
export function Getgame_started() {
    return game_started;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhdGZvcm1WaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy9wbGF0Zm9ybWVyL1BsYXRmb3JtVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFlBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFdkYsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBRXpCLE1BQU0sQ0FBQyxPQUFPLE9BQU8sY0FBZSxTQUFRLFlBQVk7SUFDcEQ7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFNUIsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxlQUFlLEVBQUUsQ0FBQztZQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5RSxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1QsT0FBTzs7Ozs7Ozs7Ozs7Ozs7O1NBZU4sQ0FBQztJQUNOLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRTVDLHFEQUFxRDtRQUNyRCxVQUFVLEVBQUUsQ0FBQztRQUViLDJCQUEyQjtRQUMzQixRQUFRLEVBQUUsQ0FBQztRQUVYLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVc7UUFDYix1RUFBdUU7UUFDdkUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELG9CQUFvQjtRQUNoQixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLGVBQWU7WUFDNUMsT0FBTztRQUNYLElBQUksY0FBYyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ3ZDLElBQUksY0FBYyxLQUFLLEtBQUssRUFDNUIsQ0FBQztZQUNHLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN2QyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUFDLEtBQUs7SUFDakMsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUN6QixDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWU7SUFDM0IsT0FBTyxZQUFZLENBQUM7QUFDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi4vQWJzdHJhY3RWaWV3LmpzXCI7XG5pbXBvcnQgeyBpbml0R2FtZSB9IGZyb20gXCIuL2dhbWUuanNcIjtcbmltcG9ydCB7IGluaXRDYW52YXMsIGZhZGVPdXRDYW52YXMgfSBmcm9tIFwiLi9jb25zdGFudHMuanNcIjtcbmltcG9ydCB7IGhhbmRsZVZpZXdUcmFuc2l0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvdmlld3MvY2FtZXJhLmpzXCI7XG5cbmxldCBnYW1lX3N0YXJ0ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhdGZvcm1lclZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldFRpdGxlKFwicGxhdGZvcm1lclwiKTtcblxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lID09PSBcIi9QbGF0Zm9ybVZpZXdcIikge1xuICAgICAgICAgICAgdGhpcy5nYW1lTG9vcCA9IHNldEludGVydmFsKCgpID0+IHsgdGhpcy5jaGVja19nYW1lX2lzX2ZpbmlzaCgpOyB9LCAxMDAwKTtcbiAgICAgICAgfSAgIFxuICAgIH1cblxuICAgIGFzeW5jIGdldEh0bWwoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cbiAgICAgICAgICAgIDxzdHlsZT5cbiAgICAgICAgICAgICAgICBjYW52YXMge1xuICAgICAgICAgICAgICAgICAgICB6LWluZGV4OiAxMDA7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAgYXV0bztcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDUwJTtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zdHlsZT5cbiAgICAgICAgICAgIDxjYW52YXMgaWQ9XCJnYW1lLWNhbnZhc1wiPjwvY2FudmFzPlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIGluaXRfZ2FtZV9wbGF0Zm9ybWVyKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwbGF0Zm9ybWVyIGdhbWVcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBjYW52YXMgZmlyc3QgKGF2ZWMgZmFkZSBpbiBpbnTDqWdyw6kpXG4gICAgICAgIGluaXRDYW52YXMoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFRoZW4gaW5pdGlhbGl6ZSB0aGUgZ2FtZVxuICAgICAgICBpbml0R2FtZSgpO1xuICAgICAgICBcbiAgICAgICAgU2V0Z2FtZV9zdGFydGVkKHRydWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGFmdGVyUmVuZGVyKCkge1xuICAgICAgICAvLyBDZXR0ZSBtw6l0aG9kZSBlc3QgYXBwZWzDqWUgYXByw6hzIHF1ZSBsZSBIVE1MIGEgw6l0w6kgaW5zw6lyw6kgZGFucyBsZSBET01cbiAgICAgICAgdGhpcy5pbml0X2dhbWVfcGxhdGZvcm1lcigpO1xuICAgIH1cblxuICAgIGNoZWNrX2dhbWVfaXNfZmluaXNoKCkge1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICE9PSBcIi9QbGF0Zm9ybVZpZXdcIilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IGdhbWVfaXNfZmluaXNoID0gR2V0Z2FtZV9zdGFydGVkKCk7XG4gICAgICAgIGlmIChnYW1lX2lzX2ZpbmlzaCA9PT0gZmFsc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBpcyBub3Qgc3RhcnRlZCB5ZXRcIik7XG4gICAgICAgICAgICBoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUyXCIsIFwicGxhdGZvcm1lclwiKTtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lTG9vcCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRnYW1lX3N0YXJ0ZWQodmFsdWUpIHtcbiAgICBnYW1lX3N0YXJ0ZWQgPSB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEdldGdhbWVfc3RhcnRlZCgpIHtcbiAgICByZXR1cm4gZ2FtZV9zdGFydGVkO1xufSJdfQ==