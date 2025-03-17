import { grenade_flash_Team_player1_2, grenade_flash_Team_player3_4 } from "./init_powerUP_GernadeFlash_multi.js";
import { activateFreezeTeam1, activateFreezeTeam2, isfreeze_team1, isfreeze_team2 } from "./init_power_up_freeze.js";
import { currentSkinPlayer1_multi, currentSkinPlayer2_multi, currentSkinPlayer3_multi, currentSkinPlayer4_multi } from "../init_skin_perso_multi.js";

let minX_player_1;
let maxX_player_1;

let minX_player_2;
let maxX_player_2;

let minX_player_3;
let maxX_player_3;

let minX_player_4;
let maxX_player_4;

function init_border()
{
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

	minX_player_1 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 24;
	maxX_player_1 = borderTop.position.x - (borderTop.scaling.x / 2) - 13;

	minX_player_2 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 36;
	maxX_player_2 = borderTop.position.x - (borderTop.scaling.x / 2) + 0;

	minX_player_3 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 36;
	maxX_player_3 = borderTop.position.x - (borderTop.scaling.x / 2) + 0;

	minX_player_4 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 24;
	maxX_player_4 = borderTop.position.x - (borderTop.scaling.x / 2) - 13;
}

export function init_2v2_Players() {
	init_border();
	
	// Créer les TransformNodes parents
	const parent_player_1 = new BABYLON.TransformNode("parent_player_1", scene);
	const parent_player_2 = new BABYLON.TransformNode("parent_player_2", scene);
	
	const parent_player_3 = new BABYLON.TransformNode("parent_player_3", scene);
	const parent_player_4 = new BABYLON.TransformNode("parent_player_4", scene);
	parent_player_1.metadata = { isPlayer_parent: true };
	parent_player_2.metadata = { isPlayer_parent: true };
	parent_player_3.metadata = { isPlayer_parent: true };
	parent_player_4.metadata = { isPlayer_parent: true };

	// Joueur 1
	const paddle_left_player_1 = createPaddle("paddle_left_player_1", new BABYLON.Vector3(-18, 301, -120), parent_player_1);
	const paddle_right_player_1 = createPaddle("paddle_right_player_1", new BABYLON.Vector3(7, 301, -120), parent_player_1);

	// Joueur 2
	const paddle_left_player_2 = createPaddle("paddle_left_player_2", new BABYLON.Vector3(-30, 301, -108), parent_player_2);
	const paddle_right_player_2 = createPaddle("paddle_right_player_2", new BABYLON.Vector3(-5, 301, -108), parent_player_2);

	// Joueur 3
	const paddle_left_player_3 = createPaddle("paddle_left_player_3", new BABYLON.Vector3(-30, 301, -36), parent_player_3);
	const paddle_right_player_3 = createPaddle("paddle_right_player_3", new BABYLON.Vector3(-5, 301, -36), parent_player_3);

	// Joueur 4
	const paddle_left_player_4 = createPaddle("paddle_left_player_4", new BABYLON.Vector3(-18, 301, -24), parent_player_4);
	const paddle_right_player_4 = createPaddle("paddle_right_player_4", new BABYLON.Vector3(7, 301, -24), parent_player_4);

	// Stocker les paddles directement dans les objets parents pour un accès facile
	parent_player_1.leftPaddle = paddle_left_player_1;
	parent_player_1.rightPaddle = paddle_right_player_1;
	
	parent_player_2.leftPaddle = paddle_left_player_2;
	parent_player_2.rightPaddle = paddle_right_player_2;
	
	parent_player_3.leftPaddle = paddle_left_player_3;
	parent_player_3.rightPaddle = paddle_right_player_3;
	
	parent_player_4.leftPaddle = paddle_left_player_4;
	parent_player_4.rightPaddle = paddle_right_player_4;

	paddle_left_player_1.metadata = { isPlayer_paddle: true };
	paddle_right_player_1.metadata = { isPlayer_paddle: true };
	paddle_left_player_2.metadata = { isPlayer_paddle: true };
	paddle_right_player_2.metadata = { isPlayer_paddle: true };
	paddle_left_player_3.metadata = { isPlayer_paddle: true };
	paddle_right_player_3.metadata = { isPlayer_paddle: true };
	paddle_left_player_4.metadata = { isPlayer_paddle: true };
	paddle_right_player_4.metadata = { isPlayer_paddle: true };

	return [parent_player_1, parent_player_2, parent_player_3, parent_player_4];
}

// Fonction utilitaire pour créer un paddle
function createPaddle(name, position, parent) {
	const paddle = new BABYLON.MeshBuilder.CreateBox(name, {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle.position = position;
	paddle.checkPaddleCollision = true;
	paddle.visibility = 0;
	paddle.setParent(parent);
	console.log("parent === ", parent.name);

	// Fonction pour importer un mesh joueur
	function importPlayerMesh(path, filename) {
		BABYLON.SceneLoader.ImportMesh("", path, filename, scene, function (newMeshes) {
			const rootMesh = newMeshes.find(mesh => mesh.name === "__root__");
			if (rootMesh) {
				rootMesh.position = paddle.getAbsolutePosition().clone();
				rootMesh.scaling = new BABYLON.Vector3(6, 6, 6);
				rootMesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
				rootMesh.metadata = { isPlayer: true };
			}

			// Créer un repère pour la position du joueur
			const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
				width: 10,
				height: 0.1,
				depth: 1
			}, scene);
			playerRepere.position = paddle.getAbsolutePosition().clone();
			playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
			playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
			playerRepere.metadata = { isPlayerRepere: true };

			// Synchroniser la position ABSOLUE avec le paddle
			scene.registerBeforeRender(() => {
				const paddleAbsPos = paddle.getAbsolutePosition();
				rootMesh.position.copyFrom(paddleAbsPos);
				playerRepere.position.copyFrom(paddleAbsPos);
			});
		});
	}

	// Vérification du parent et chargement du modèle 3D approprié
	if (parent.name.startsWith("parent_player_")) {
		console.log("JE SUIS LA ");
		
		// Cas spécial pour "parent_player_4" avec plusieurs skins
		if (parent.name === "parent_player_4") {
			let skinPath = null;
			let skinFile = null;

			if (currentSkinPlayer4_multi === 0) {
				skinPath = "/srcs/game/assets/player/";
				skinFile = "PlayerIdleAnnimation.glb";
			}
			else if (currentSkinPlayer4_multi === 1) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_bleu.glb";
			} else if (currentSkinPlayer4_multi === 2) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_rouge.glb";
			} else if (currentSkinPlayer4_multi === 3) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_vert.glb";
			}

			importPlayerMesh(skinPath, skinFile);
		} else if (parent.name === "parent_player_3") {
			let skinPath = null;
			let skinFile = null;

			if (currentSkinPlayer3_multi === 0) {
				skinPath = "/srcs/game/assets/player/";
				skinFile = "PlayerIdleAnnimation.glb";
			}
			if (currentSkinPlayer3_multi === 1) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_bleu.glb";
			} else if (currentSkinPlayer3_multi === 2) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_rouge.glb";
			} else if (currentSkinPlayer3_multi === 3) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_vert.glb";
			}

			importPlayerMesh(skinPath, skinFile);
		}
		else if (parent.name === "parent_player_2") {
			let skinPath = null;
			let skinFile = null;

			if (currentSkinPlayer2_multi === 0) {
				skinPath = "/srcs/game/assets/player/";
				skinFile = "PlayerIdleAnnimation.glb";
			}
			else if (currentSkinPlayer2_multi === 1) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_bleu.glb";
			} else if (currentSkinPlayer2_multi === 2) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_rouge.glb";
			} else if (currentSkinPlayer2_multi === 3) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_vert.glb";
			}

			importPlayerMesh(skinPath, skinFile);
		}

		else if (parent.name === "parent_player_1") {
			let skinPath = null;
			let skinFile = null;

			if (currentSkinPlayer1_multi === 0) {
				skinPath = "/srcs/game/assets/player";
				skinFile = "PlayerIdleAnnimation.glb";
			}
			else if (currentSkinPlayer1_multi === 1) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_bleu.glb";
			} else if (currentSkinPlayer1_multi === 2) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_rouge.glb";
			} else if (currentSkinPlayer1_multi === 3) {
				skinPath = "/srcs/game/assets/player_skin/";
				skinFile = "idle_vert.glb";
			}

			importPlayerMesh(skinPath, skinFile);
		}

		// Cas général pour les autres joueurs
	}

	return paddle;
}

const paddleSpeed = 1.1;
const keys = {};

addEventListener("keydown", (event) => keys[event.key] = true);
addEventListener("keyup", (event) => keys[event.key] = false);


export function UpdatePLayerPoseMulti(player_1, player_2, player_3, player_4) {
	
	if (isfreeze_team1 == false)
	{
		if (keys["w"] && player_1.position.x > minX_player_1) {
			player_1.position.x -= paddleSpeed;
		}
		if (keys["s"] && player_1.position.x < maxX_player_1) {
			player_1.position.x += paddleSpeed;
		}

		if (keys["e"] && player_2.position.x > minX_player_2) {
			player_2.position.x -= paddleSpeed;
		}
		if (keys["d"] && player_2.position.x < maxX_player_2) {
			player_2.position.x += paddleSpeed;
		}
	}

	if (isfreeze_team1 == true)
	{
		player_1.position.x = player_1.position.x;
		player_2.position.x = player_2.position.x;
	}

	if (isfreeze_team2 == false)
	{
		if (keys["i"] && player_3.position.x > minX_player_3) {
			player_3.position.x -= paddleSpeed;
		}
		if (keys["k"] && player_3.position.x < maxX_player_3) {
			player_3.position.x += paddleSpeed;
		}
		if (keys["o"] && player_4.position.x > minX_player_4) {
			player_4.position.x -= paddleSpeed;
		}
		if (keys["l"] && player_4.position.x < maxX_player_4) {
			player_4.position.x += paddleSpeed;
		}
	}

	if (isfreeze_team2 == true)
	{
		player_3.position.x = player_3.position.x;
		player_4.position.x = player_4.position.x;
	}

	if (keys["x"] && !isfreeze_team1) {
        activateFreezeTeam2();
    }

    if (keys["2"] && !isfreeze_team2) {
        activateFreezeTeam1();
    }


	if (keys["z"])
	{
		grenade_flash_Team_player1_2();
	}

	if (keys["1"])
	{
		grenade_flash_Team_player3_4();
	}
}
