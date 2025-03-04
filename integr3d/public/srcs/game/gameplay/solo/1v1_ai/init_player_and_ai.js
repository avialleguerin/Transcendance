import { simple_ai_move } from "./ai_move.js";


let minX = 0;
let maxX = 0;

function init_border() {
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

	minX = borderBottom.position.x + (borderBottom.scaling.x / 2) + 4.5;
	maxX = borderTop.position.x - (borderTop.scaling.x / 2) - 4.5;
}

export function init_players_and_ai(scene, player_1, ai_player) {

	init_border();

	player_1 = new BABYLON.MeshBuilder.CreateBox("player_1", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);
	player_1.position = new BABYLON.Vector3(-7, 301, -120);
	player_1.checkPaddleCollision = true;
	player_1.metadata = { isPlayer_paddle: true };  // Tag ajouté pour identifier ce mesh comme joueur
	player_1.visibility = 0;
	
	ai_player = new BABYLON.MeshBuilder.CreateBox("ai_player", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);
	ai_player.position = new BABYLON.Vector3(-7, 301, -24);
	ai_player.checkPaddleCollision = true;
	ai_player.metadata = { isPlayer_paddle: true };  // Tag ajouté pour identifier ce mesh comme joueur
	ai_player.visibility = 0;


	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
		const rootMesh = newMeshes.find(mesh => mesh.name === "__root__");
		if (rootMesh) {
			rootMesh.position = player_1.position.clone();
			rootMesh.scaling = new BABYLON.Vector3(6, 6, 6);
			rootMesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
			rootMesh.metadata = { isPlayer: true };  // Tag ajouté pour identifier ce mesh comme joueur
		}
	
		newMeshes.forEach(mesh => {
			if (mesh instanceof BABYLON.Mesh) {
				mesh.rotationQuaternion = null;
				mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
				mesh.metadata = { isPlayer: true };  // Tag ajouté pour identifier ce mesh comme joueur
			}
		});
	
		const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
			width: 10,
			height: 0.1,
			depth: 1,
		}, scene);
		playerRepere.position = new BABYLON.Vector3(-7, 301, -120);
		playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
		playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
		playerRepere.metadata = { isPlayerRepere: true };  // Tag ajouté pour le repère du joueur
	
		scene.registerBeforeRender(() => {
			rootMesh.position.x = player_1.position.x;
			rootMesh.position.y = player_1.position.y;
			rootMesh.position.z = player_1.position.z;
			playerRepere.position.x = player_1.position.x;
			playerRepere.position.y = player_1.position.y;
		});
	});
	
	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
		const playerModel = newMeshes[0];
		playerModel.position = ai_player.position.clone();
		playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
		playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
		playerModel.metadata = { isPlayer: true };  // Tag ajouté pour le joueur 2
	
		const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
			width: 10,
			height: 0.1,
			depth: 1,
		}, scene);
		playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
		playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
		playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
		playerRepere.metadata = { isPlayerRepere: true };  // Tag ajouté pour le repère du joueur 2
	
		// Synchronisation continue de la position
		scene.registerBeforeRender(() => {
			playerModel.position.x = ai_player.position.x;
			playerModel.position.y = ai_player.position.y;
			playerModel.position.z = ai_player.position.z;
			playerRepere.position.x = ai_player.position.x;
			playerRepere.position.y = ai_player.position.y;
		});
	});
	
	

	
	console.log("player 1 " + player_1.position);
	console.log("player 2 " + ai_player.position);

	return { player_1, ai_player };
}

// Fonction pour récupérer les références des joueurs
export function getPlayerRef() {
	console.log("player 1 bis " + player_1.position);
	console.log("player 2 bis " + ai_player.position);
	return { player_1, ai_player };
}



const paddleSpeed = 1.1;
const keys = {}; 
// const init_players_instance = init_players(scene);

addEventListener("keydown", (event) => keys[event.key] = true);
addEventListener("keyup", (event) => keys[event.key] = false);


export function UpdatePlayerAndAI_Pose(player_1, ai_player, ball) {
	if (keys["w"] && player_1.position.x > minX) {
		player_1.position.x -= paddleSpeed;
	}
	if (keys["s"] && player_1.position.x < maxX) {
		player_1.position.x += paddleSpeed;
	}
	// if (keys["i"] && ai_player.position.x > minX) {
	// 	ai_player.position.x -= paddleSpeed;
	// }
	// if (keys["k"] && ai_player.position.x < maxX) {
	// 	ai_player.position.x += paddleSpeed;
	// }
	simple_ai_move(ai_player, ball, minX, maxX);
}
