// Constants for the game
export const GRAVITY = 0.5;

// Game state enum
export const GameState = {
    Menu: "Menu",
    MapMenu: "MapMenu",
    Play: "Play",
    EndGameFirstGame: "EndGameFirstGame",
    EndGameSecondGame: "EndGameSecondGame",
    GameHistory: "GameHistory",
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
    
    // Appliquer le fade in directement ici
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1.5s ease-in-out";
    
    // Afficher le canvas avec un fondu
    setTimeout(() => {
        canvas.style.opacity = "1";
    }, 100);
    
    return { canvas, c };
}

// Camera settings
export const camera = {
    position: {
        x: 0,
        y: 0,
    },
};

// Fonction pour le fade out du canvas
export function fadeOutCanvas(callback) {
    if (!canvas) return;
    
    // Appliquer le fade out
    canvas.style.transition = "opacity 1.5s ease-in-out";
    canvas.style.opacity = "0";
    
    // Exécuter le callback après que l'animation soit terminée
    setTimeout(() => {
        if (callback && typeof callback === 'function') {
            callback();
        }
    }, 1500);
}