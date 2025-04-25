// // PlatformerView.js
// import AbstractView from "../AbstractView.js";
// import { initGame } from "./game.js";
// import { initCanvas } from "./constants.js";
// import { handleViewTransitions } from "../../../../srcs/game/gameplay/views/camera.js";

// let game_started = false;

// export default class PlatformerView extends AbstractView {
//     constructor() {
//         super();
//         this.setTitle("platformer");

//         if (window.location.pathname === "/PlatformView") {
// 			this.gameLoop = setInterval(() => { this.check_game_is_finish(); 1000 });
// 		}
//     }

//     async getHtml() {
//         return `
//             <link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
//             <style>
//                 canvas {
//                     z-index: 100;
//                     display: block;
//                     margin: 0 auto;
//                     background-color: black;
//                     position: absolute;
//                     top: 50%;
//                     left: 50%;
//                     transform: translate(-50%, -50%);
//                 }
//             </style>
//             <canvas id="game-canvas"></canvas>
//         `;
//     }

//     init_game_platformer() {
//         console.log("Initializing platformer game");
//         // Initialize the canvas first
//         initCanvas();
//         // Then initialize the game
//         initGame();
//         Setgame_started(true);
//     }

//     check_game_is_finish() {
//         if (window.location.pathname !== "/PlatformView")
//             return;
//         let game_is_finish = Getgame_started();
//         if (game_is_finish === false)
//         {
//             console.log("Game is not started yet");
//             handleViewTransitions("vue2", "platformer");
//             window.history.back();
//             clearInterval(this.gameLoop);
//         }
//     }
// }

// export function Setgame_started(value) {
//     game_started = value;
// }

// export function Getgame_started() {
//     return game_started;
// }

// PlatformerView.js
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
        if (game_is_finish === false)
        {
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