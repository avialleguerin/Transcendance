import {create_game} from "./init_game.js";

// const gameInstance = create_game(scene);

let minX = 0;
let maxX = 0;


let player_1;
let player_2;

export function init_players(scene) {
    const borderTop = new BABYLON.MeshBuilder.CreateBox("border", {
        width: 115,
        height: 3,
        depth: 1
    }, scene);
    borderTop.position = new BABYLON.Vector3(25, 300, -72);
    borderTop.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    borderTop.visibility = 0;
    
    const borderBottom = new BABYLON.MeshBuilder.CreateBox("border", {
        width: 115,
        height: 3,
        depth: 1
    }, scene);
    borderBottom.position = new BABYLON.Vector3(-40, 300, -72);
    borderBottom.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    borderBottom.visibility = 0;
    
    // Assigner directement aux variables globales
    player_1 = new BABYLON.MeshBuilder.CreateBox("player_1", {
        width: 10,
        height: 1.5,
        depth: 1.5
    }, scene);
    player_1.position = new BABYLON.Vector3(-7, 301, -120);
    player_1.checkPaddleCollision = true;
    
    player_2 = new BABYLON.MeshBuilder.CreateBox("player_2", {
        width: 10,
        height: 1.5,
        depth: 1.5
    }, scene);
    player_2.position = new BABYLON.Vector3(-7, 301, -24);
    player_2.checkPaddleCollision = true;

    // Définir les limites
    minX = borderBottom.position.x + (borderBottom.scaling.x / 2) + 4.5;
    maxX = borderTop.position.x - (borderTop.scaling.x / 2) - 4.5;
    console.log("player 1 " + player_1.position);
    console.log("player 2 " + player_2.position);

    return { player_1, player_2 };
}

// Fonction pour récupérer les références des joueurs
export function getPlayerRef() {
	console.log("player 1 bis " + player_1.position);
	console.log("player 2 bis " + player_2.position);
    return { player_1, player_2 };
}



const paddleSpeed = 1.1;
const keys = {}; 
// const init_players_instance = init_players(scene);

addEventListener("keydown", (event) => keys[event.key] = true);
addEventListener("keyup", (event) => keys[event.key] = false);


export function UpdatePlayerPose(player_1, player_2) {
    if (keys["w"] && player_1.position.x > minX) {
        player_1.position.x -= paddleSpeed;
    }
    if (keys["s"] && player_1.position.x < maxX) {
        player_1.position.x += paddleSpeed;
    }
    if (keys["i"] && player_2.position.x > minX) {
        player_2.position.x -= paddleSpeed;
    }
    if (keys["k"] && player_2.position.x < maxX) {
        player_2.position.x += paddleSpeed;
    }
}