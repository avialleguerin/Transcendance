import {create_game} from "./init_game.js";

// const gameInstance = create_game(scene);

let minX = 0;
let maxX = 0;


let player_1;
let player_2;

let idleModel = null;
let runModel = null;
let currentModel = null;

export function init_players(scene) {

	//creation des skin des joueur

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
	player_1.visibility = 0;
    
    player_2 = new BABYLON.MeshBuilder.CreateBox("player_2", {
        width: 10,
        height: 1.5,
        depth: 1.5
    }, scene);
    player_2.position = new BABYLON.Vector3(-7, 301, -24);
    player_2.checkPaddleCollision = true;
	player_2.visibility = 0;


    BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
				console.log("Meshes importés :", newMeshes);
		newMeshes.forEach((mesh, index) => {
			console.log(`Mesh ${index}:`, mesh.name, mesh);
		});
		const rootMesh = newMeshes.find(mesh => mesh.name === "__root__"); 
		if (rootMesh) {
			console.log("Root mesh trouvé :", rootMesh);
			rootMesh.position = player_1.position.clone(); // Position initiale identique au paddle
			rootMesh.scaling = new BABYLON.Vector3(6, 6, 6);
			rootMesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
		}

		newMeshes.forEach(mesh => {
			if (mesh instanceof BABYLON.Mesh) {
				mesh.rotationQuaternion = null;
				mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
			}
		});
        // const playerModel = newMeshes[0];
        // playerModel.position = player_1.position.clone(); // Position initiale identique au paddle
        // playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
		// playerModel.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);

		const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
			width: 10,
			height: 0.1,
			depth: 1,
		}, scene);
		playerRepere.position = new BABYLON.Vector3(-7, 301, -120);
		playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
		playerRepere.material.emissiveColor = new BABYLON.Color3.Red() 
        
        // Synchronisation continue de la position
        scene.registerBeforeRender(() => {
            rootMesh.position.x = player_1.position.x;
            rootMesh.position.y = player_1.position.y;
            rootMesh.position.z = player_1.position.z;
			playerRepere.position.x = player_1.position.x;
			playerRepere.position.y = player_1.position.y;
			// playerRepere.position.z = player_1.position.z;
        });
    });

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
		const playerModel = newMeshes[0];
		playerModel.position = player_2.position.clone(); // Position initiale identique au paddle
		playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
		playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);

		const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
			width: 10,
			height: 0.1,
			depth: 1,
		}, scene);
		playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
		playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
		playerRepere.material.emissiveColor = new BABYLON.Color3.Red() 


		// Synchronisation continue de la position
		scene.registerBeforeRender(() => {
			playerModel.position.x = player_2.position.x;
			playerModel.position.y = player_2.position.y;
			playerModel.position.z = player_2.position.z;
			playerRepere.position.x = player_2.position.x;
			playerRepere.position.y = player_2.position.y;
			// playerRepere.position.z = player_2.position.z;
		});
	});


	// BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "player_idleAnnimation.glb", scene, function (newMeshes) {
	// 	idleModel = newMeshes[0];
	// 	setupModel(idleModel);
	// 	currentModel = idleModel;
	// });
	
	// BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "player_move1.glb", scene, function (newMeshes) {
	// 	runModel = newMeshes[0];
	// 	setupModel(runModel);
	// 	runModel.setEnabled(false); // Cacher le modèle run au début
	// });

	// function setupModel(model) {
	// 	if (model) {
	// 		model.position = player_2.position.clone();
	// 		model.scaling = new BABYLON.Vector3(6, 6, 6);
	// 		model.rotation = new BABYLON.Vector3(0, Math.PI, 0);
	// 	}
	// }
	
	// // Dans registerBeforeRender
	// scene.registerBeforeRender(() => {
	// 	if (idleModel && runModel) {
	// 		// Mise à jour de la position pour les deux modèles
	// 		idleModel.position.x = player_2.position.x;
	// 		idleModel.position.y = player_2.position.y;
	// 		idleModel.position.z = player_2.position.z;
			
	// 		runModel.position.x = player_2.position.x;
	// 		runModel.position.y = player_2.position.y;
	// 		runModel.position.z = player_2.position.z;
	
	// 		// Vérifier si le joueur se déplace
	// 		const isMoving = keys["i"] || keys["k"];
			
	// 		// Changer de modèle si nécessaire
	// 		if (isMoving && currentModel === idleModel) {
	// 			idleModel.setEnabled(false);
	// 			runModel.setEnabled(true);
	// 			currentModel = runModel;
	// 		} 
	// 		else if (!isMoving && currentModel === runModel) {
	// 			runModel.setEnabled(false);
	// 			idleModel.setEnabled(true);
	// 			currentModel = idleModel;
	// 		}
	// 	}
	// });


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