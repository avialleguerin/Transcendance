// PlatformerView.js
import AbstractView from "../AbstractView.js";
import { initGame } from "./game.js";
import { initCanvas } from "./constants.js";

export default class PlatformerView extends AbstractView {
    constructor() {
        super();
        this.setTitle("platformer");
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
        // Initialize the canvas first
        initCanvas();
        // Then initialize the game
        initGame();
    }
}