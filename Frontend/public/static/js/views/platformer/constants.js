// Constants for the game
export const GRAVITY = 0.5;

// Game state enum
export const GameState = {
	Menu: "Menu",
	MapMenu: "MapMenu",
	Play: "Play",
	Pause: "pause",
};

// Global game state
export const gameState = {
	current: GameState.Menu,
	previous: null,
};

// Canvas setup
export let canvas;
export let c; // context

export function initCanvas() {
	canvas = document.querySelector("#game-canvas");
	c = canvas.getContext("2d");
	canvas.width = 1024;
	canvas.height = 576;
	
	return { canvas, c };
}

// Camera settings
export const camera = {
	position: {
		x: 0,
		y: 0,
	},
};