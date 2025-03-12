import { getScene } from "../../babylon.js";

const skinColors = [
	new BABYLON.Color3(1, 1, 0),
	new BABYLON.Color3(0, 1, 0),
	new BABYLON.Color3(0, 0, 1),
	new BABYLON.Color3(1, 0, 0)
];

let currentSkinPlayer1 = 0;
let currentSkinPlayer2 = 0;

let player1Mesh;
let player2Mesh;

const scene = getScene();

export function init_skin_perso_player1() {
	player1Mesh = new BABYLON.MeshBuilder.CreateBox("player1Box", {height: 1, width: 1, depth: 1}, scene);
	player1Mesh.position = new BABYLON.Vector3(-15, 100, -15);
	player1Mesh.scaling = new BABYLON.Vector3(2.5, 7, 2.5);
	
	const material = new BABYLON.StandardMaterial("material1", scene);
	material.diffuseColor = skinColors[currentSkinPlayer1];
	player1Mesh.material = material;
	
}

export function init_skin_perso_player2() {
	player2Mesh = new BABYLON.MeshBuilder.CreateBox("player2Box", {height: 1, width: 1, depth: 1}, scene);
	player2Mesh.position = new BABYLON.Vector3(-25, 100, -15);
	player2Mesh.scaling = new BABYLON.Vector3(2.5, 7, 2.5);
	
	const material = new BABYLON.StandardMaterial("material2", scene);
	material.diffuseColor = skinColors[currentSkinPlayer2];
	player2Mesh.material = material;
	
}

export function switch_skin_perso_player1_left() {
    if (!player1Mesh || !player1Mesh.material) {
        console.error("Player 1 mesh or material not found!");
        return;
    }
    
    currentSkinPlayer1 = (currentSkinPlayer1 - 1 + skinColors.length) % skinColors.length;
    
    // Créer un nouveau matériau à chaque changement
    const newMaterial = new BABYLON.StandardMaterial("material1_" + currentSkinPlayer1, scene);
    newMaterial.diffuseColor = skinColors[currentSkinPlayer1];
    player1Mesh.material = newMaterial;
    
}

export function switch_skin_perso_player1_right() {
    if (!player1Mesh || !player1Mesh.material) {
        console.error("Player 1 mesh or material not found!");
        return;
    }
    
    currentSkinPlayer1 = (currentSkinPlayer1 + 1) % skinColors.length;
    
    // Créer un nouveau matériau à chaque changement
    const newMaterial = new BABYLON.StandardMaterial("material1_" + currentSkinPlayer1, scene);
    newMaterial.diffuseColor = skinColors[currentSkinPlayer1];
    player1Mesh.material = newMaterial;
    
}

export function switch_skin_perso_player2_left() {
	if (!player2Mesh || !player2Mesh.material) {
		console.error("Player 2 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer2 = (currentSkinPlayer2 - 1 + skinColors.length) % skinColors.length;

	const newMaterial = new BABYLON.StandardMaterial("material2_" + currentSkinPlayer2, scene);
	newMaterial.diffuseColor = skinColors[currentSkinPlayer2];
	player2Mesh.material = newMaterial;
	
}

export function switch_skin_perso_player2_right() {
	if (!player2Mesh || !player2Mesh.material) {
		console.error("Player 2 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer2 = (currentSkinPlayer2 + 1) % skinColors.length;
	
	const newMaterial = new BABYLON.StandardMaterial("material2_" + currentSkinPlayer2, scene);
	newMaterial.diffuseColor = skinColors[currentSkinPlayer2];
	player2Mesh.material = newMaterial;
}

export function getCurrentSkinIndexPlayer1() {
	return currentSkinPlayer1;
}

export function getCurrentSkinIndexPlayer2() {
	return currentSkinPlayer2;
}

export function delete_skin_perso_player1() {
	player1Mesh.dispose();
}

export function delete_skin_perso_player2() {
	player2Mesh.dispose();
}