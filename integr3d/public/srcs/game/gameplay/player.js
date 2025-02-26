let minX = 0;
let maxX = 0;

let idleModel = null;
let runModel = null;
let currentModel = null;

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

export function init_players(scene, player_1, player_2) {

	init_border();

	player_1 = new BABYLON.MeshBuilder.CreateBox("player_1", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);
	player_1.position = new BABYLON.Vector3(-7, 301, -120);
	player_1.checkPaddleCollision = true;
	player_1.metadata = { isPlayer_paddle: true };  // Tag ajouté pour identifier ce mesh comme joueur
	// player_1.visibility = 0;
	
	player_2 = new BABYLON.MeshBuilder.CreateBox("player_2", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);
	player_2.position = new BABYLON.Vector3(-7, 301, -24);
	player_2.checkPaddleCollision = true;
	player_2.metadata = { isPlayer_paddle: true };  // Tag ajouté pour identifier ce mesh comme joueur
	// player_2.visibility = 0;


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
		playerModel.position = player_2.position.clone();
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
			playerModel.position.x = player_2.position.x;
			playerModel.position.y = player_2.position.y;
			playerModel.position.z = player_2.position.z;
			playerRepere.position.x = player_2.position.x;
			playerRepere.position.y = player_2.position.y;
		});
	});
	
	

	
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


export function destroy_players(scene) {
	// Supprimer uniquement les joueurs et leurs repères
	scene.meshes.forEach(mesh => {
		if (mesh.metadata && (mesh.metadata.isPlayer)) {
			mesh.dispose();  // Supprime les meshes qui sont des joueurs ou des repères
		}
	});

	console.log("Les joueurs et leurs repères ont été supprimés");
}

export function destroy_players_repere(scene) {
	
	scene.meshes.forEach(mesh => {
		if (mesh.metadata && mesh.metadata.isPlayerRepere) {
			mesh.dispose();
		}
	});
}

export function destroy_player_paddle(scene) {
	scene.meshes.forEach(mesh => {
		if (mesh.metadata && mesh.metadata.isPlayer_paddle) {
			mesh.dispose();
		}
	});
}