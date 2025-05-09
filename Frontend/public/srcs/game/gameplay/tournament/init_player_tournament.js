
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

export function init_players_tournament(scene, player_1_tournament, player_2_tournament) {

	init_border();

	player_1_tournament = new BABYLON.MeshBuilder.CreateBox("player_1_tournament", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);
	player_1_tournament.position = new BABYLON.Vector3(-7, 301, -120);
	player_1_tournament.checkPaddleCollision = true;
	player_1_tournament.metadata = { isPlayer_paddle: true };  // Tag ajouté pour identifier ce mesh comme joueur
	player_1_tournament.visibility = 0;
	
	player_2_tournament = new BABYLON.MeshBuilder.CreateBox("player_2_tournament", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);
	player_2_tournament.position = new BABYLON.Vector3(-7, 301, -24);
	player_2_tournament.checkPaddleCollision = true;
	player_2_tournament.metadata = { isPlayer_paddle: true };  // Tag ajouté pour identifier ce mesh comme joueur
	player_2_tournament.visibility = 0;

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
		const rootMesh = newMeshes.find(mesh => mesh.name === "__root__");
		if (rootMesh) {
			rootMesh.position = player_1_tournament.position.clone();
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
			rootMesh.position.x = player_1_tournament.position.x;
			rootMesh.position.y = player_1_tournament.position.y;
			rootMesh.position.z = player_1_tournament.position.z;
			playerRepere.position.x = player_1_tournament.position.x;
			playerRepere.position.y = player_1_tournament.position.y;
		});
	});

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
		const playerModel = newMeshes[0];
		playerModel.position = player_2_tournament.position.clone();
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
			playerModel.position.x = player_2_tournament.position.x;
			playerModel.position.y = player_2_tournament.position.y;
			playerModel.position.z = player_2_tournament.position.z;
			playerRepere.position.x = player_2_tournament.position.x;
			playerRepere.position.y = player_2_tournament.position.y;
		});
	});

	return { player_1_tournament, player_2_tournament };
}




const paddleSpeed = 1.1;
const keys = {}; 
// const init_players_instance = init_players(scene);

addEventListener("keydown", (event) => keys[event.key] = true);
addEventListener("keyup", (event) => keys[event.key] = false);


export function move_player_tournament(player_1_tournament, player_2_tournament)
{
	if (keys["w"] && player_1_tournament.position.x > minX)
	{
		player_1_tournament.position.x -= paddleSpeed;
	}
	if (keys["s"] && player_1_tournament.position.x < maxX)
	{
		player_1_tournament.position.x += paddleSpeed;
	}
	if (keys["i"] && player_2_tournament.position.x > minX)
	{
		player_2_tournament.position.x -= paddleSpeed;
	}
	if (keys["k"] && player_2_tournament.position.x < maxX)
	{
		player_2_tournament.position.x += paddleSpeed;
	}
}