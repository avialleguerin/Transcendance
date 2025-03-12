// import { getScene } from "../babylon";

const skinColors_multi = [
	new BABYLON.Color3(1, 1, 0),
	new BABYLON.Color3(0, 1, 0),
	new BABYLON.Color3(0, 0, 1),
	new BABYLON.Color3(1, 0, 0)
];

let currentSkinPlayer1_multi = 0;
let currentSkinPlayer2_multi = 0;
let currentSkinPlayer3_multi = 0;
let currentSkinPlayer4_multi = 0;

let player1Mesh_multi;
let player2Mesh_multi;
let player3Mesh_multi;
let player4Mesh_multi;


// const scene = getScene();

export function init_skin_perso_player1_multi() {
	player1Mesh_multi = new BABYLON.MeshBuilder.CreateBox("player1Box", {height: 1, width: 1, depth: 1}, scene);
	player1Mesh_multi.position = new BABYLON.Vector3(-16, 100, -28);
	player1Mesh_multi.scaling = new BABYLON.Vector3(2.5, 7, 2.5);
	
	const material = new BABYLON.StandardMaterial("material1", scene);
	material.diffuseColor = skinColors_multi[currentSkinPlayer1_multi];
	player1Mesh_multi.material = material;
	
}

export function init_skin_perso_player2_multi() {
	player2Mesh_multi = new BABYLON.MeshBuilder.CreateBox("player2Box", {height: 1, width: 1, depth: 1}, scene);
	player2Mesh_multi.position = new BABYLON.Vector3(-27, 100, -28);
	player2Mesh_multi.scaling = new BABYLON.Vector3(2.5, 7, 2.5);
	
	const material = new BABYLON.StandardMaterial("material2", scene);
	material.diffuseColor = skinColors_multi[currentSkinPlayer2_multi];
	player2Mesh_multi.material = material;
	
}

export function init_skin_perso_player3_multi() {
	player3Mesh_multi = new BABYLON.MeshBuilder.CreateBox("player3Box", {height: 1, width: 1, depth: 1}, scene);
	player3Mesh_multi.position = new BABYLON.Vector3(-14.5, 100, -2);
	player3Mesh_multi.scaling = new BABYLON.Vector3(2.5, 5, 2.5);
	
	const material = new BABYLON.StandardMaterial("material3", scene);
	material.diffuseColor = skinColors_multi[currentSkinPlayer3_multi];
	player3Mesh_multi.material = material;
	
}

export function init_skin_perso_player4_multi() {
	player4Mesh_multi = new BABYLON.MeshBuilder.CreateBox("player4Box", {height: 1, width: 1, depth: 1}, scene);
	player4Mesh_multi.position = new BABYLON.Vector3(-26.5, 100, -2);
	player4Mesh_multi.scaling = new BABYLON.Vector3(2.5, 5, 2.5);
	
	const material = new BABYLON.StandardMaterial("material4", scene);
	material.diffuseColor = skinColors_multi[currentSkinPlayer4_multi];
	player4Mesh_multi.material = material;
	
}

export function switch_skin_perso_player1_left_multi() {
    if (!player1Mesh_multi || !player1Mesh_multi.material) {
        console.error("Player 1 mesh or material not found!");
        return;
    }
    
    currentSkinPlayer1_multi = (currentSkinPlayer1_multi - 1 + skinColors_multi.length) % skinColors_multi.length;
    
    // Créer un nouveau matériau à chaque changement
    const newMaterial = new BABYLON.StandardMaterial("material1_" + currentSkinPlayer1_multi, scene);
    newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer1_multi];
    player1Mesh_multi.material = newMaterial;
    
}

export function switch_skin_perso_player1_right_multi() {
    if (!player1Mesh_multi || !player1Mesh_multi.material) {
        console.error("Player 1 mesh or material not found!");
        return;
    }
    
    currentSkinPlayer1_multi = (currentSkinPlayer1_multi + 1) % skinColors_multi.length;
    
    // Créer un nouveau matériau à chaque changement
    const newMaterial = new BABYLON.StandardMaterial("material1_" + currentSkinPlayer1_multi, scene);
    newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer1_multi];
    player1Mesh_multi.material = newMaterial;
    
}

export function switch_skin_perso_player2_left_multi() {
	if (!player2Mesh_multi || !player2Mesh_multi.material) {
		console.error("Player 2 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer2_multi = (currentSkinPlayer2_multi - 1 + skinColors_multi.length) % skinColors_multi.length;

	const newMaterial = new BABYLON.StandardMaterial("material2_" + currentSkinPlayer2_multi, scene);
	newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer2_multi];
	player2Mesh_multi.material = newMaterial;
	
}

export function switch_skin_perso_player2_right_multi() {
	if (!player2Mesh_multi || !player2Mesh_multi.material) {
		console.error("Player 2 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer2_multi = (currentSkinPlayer2_multi + 1) % skinColors_multi.length;
	
	const newMaterial = new BABYLON.StandardMaterial("material2_" + currentSkinPlayer2_multi, scene);
	newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer2_multi];
	player2Mesh_multi.material = newMaterial;
}

export function switch_skin_perso_player3_left_multi() {
	if (!player3Mesh_multi || !player3Mesh_multi.material) {
		console.error("Player 3 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer3_multi = (currentSkinPlayer3_multi - 1 + skinColors_multi.length) % skinColors_multi.length;

	const newMaterial = new BABYLON.StandardMaterial("material3_" + currentSkinPlayer3_multi, scene);
	newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer3_multi];
	player3Mesh_multi.material = newMaterial;
	
}

export function switch_skin_perso_player3_right_multi() {
	if (!player3Mesh_multi || !player3Mesh_multi.material) {
		console.error("Player 3 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer3_multi = (currentSkinPlayer3_multi + 1) % skinColors_multi.length;
	
	const newMaterial = new BABYLON.StandardMaterial("material3_" + currentSkinPlayer3_multi, scene);
	newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer3_multi];
	player3Mesh_multi.material = newMaterial;
}

export function switch_skin_perso_player4_left_multi() {
	if (!player4Mesh_multi || !player4Mesh_multi.material) {
		console.error("Player 4 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer4_multi = (currentSkinPlayer4_multi - 1 + skinColors_multi.length) % skinColors_multi.length;

	const newMaterial = new BABYLON.StandardMaterial("material4_" + currentSkinPlayer4_multi, scene);
	newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer4_multi];
	player4Mesh_multi.material = newMaterial;
}

export function switch_skin_perso_player4_right_multi() {
	if (!player4Mesh_multi || !player4Mesh_multi.material) {
		console.error("Player 4 mesh or material not found!");
		return;
	}
	
	currentSkinPlayer4_multi = (currentSkinPlayer4_multi + 1) % skinColors_multi.length;
	
	const newMaterial = new BABYLON.StandardMaterial("material4_" + currentSkinPlayer4_multi, scene);
	newMaterial.diffuseColor = skinColors_multi[currentSkinPlayer4_multi];
	player4Mesh_multi.material = newMaterial;
}

export function delete_skin_perso_player1_multi() {
	player1Mesh_multi.dispose();
}

export function delete_skin_perso_player2_multi() {
	player2Mesh_multi.dispose();
}

export function delete_skin_perso_player3_multi() {
	player3Mesh_multi.dispose();
}

export function delete_skin_perso_player4_multi() {
	player4Mesh_multi.dispose();
}
