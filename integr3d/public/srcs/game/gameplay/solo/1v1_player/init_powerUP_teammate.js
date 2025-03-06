let canUsePowerUP_player1 = true;
let canUsePowerUP_player2 = true;
let nb_powerUP_player_1 = 0;
let nb_powerUP_player_2 = 0;

export function init_nb_powerUP_teammate(number)
{
	nb_powerUP_player_1 = number;
	nb_powerUP_player_2 = number;
}

export function reset_powerUP_teammate()
{
	nb_powerUP_player_1 = 0;
	nb_powerUP_player_2 = 0;
}

export function init_Teammate_player_1(scene)
{
	if (nb_powerUP_player_1 > 0 && canUsePowerUP_player1)
	{
		nb_powerUP_player_1--;
		canUsePowerUP_player1 = false;
		const player_bonus1 = BABYLON.MeshBuilder.CreateBox("player_bonus1", {
			width: 10,
			height: 1.5,
			depth: 1.5
		}, scene);
	
		player_bonus1.position = new BABYLON.Vector3(-7, 301, -118);
		player_bonus1.visibility = 0;
		player_bonus1.metadata = { isPlayer_bonus1: true };
	
		if (player_bonus1) {
			console.log("je rentre la");
			console.log(player_bonus1.position);
		}
	
		BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
			const rootMesh = newMeshes.find(mesh => mesh.name === "__root__");
			if (rootMesh) {
				rootMesh.position = player_bonus1.position.clone();
				rootMesh.scaling = new BABYLON.Vector3(6, 6, 6);
				rootMesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
				rootMesh.metadata = { isPlayer_root_bonus1: true };
			}
		
			newMeshes.forEach(mesh => {
				if (mesh instanceof BABYLON.Mesh) {
					mesh.rotationQuaternion = null;
					mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
				}
			});
		
			const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
				width: 10,
				height: 0.1,
				depth: 1,
			}, scene);
			playerRepere.position = new BABYLON.Vector3(-30, 301, -118);
			playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
			playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
			playerRepere.metadata = { isPlayerRepere_bonus1: true };
			scene.registerBeforeRender(() => {
				rootMesh.position.x = player_bonus1.position.x;
				rootMesh.position.y = player_bonus1.position.y;
				rootMesh.position.z = player_bonus1.position.z;
				playerRepere.position.x = player_bonus1.position.x;
				playerRepere.position.y = player_bonus1.position.y;
			});
			setTimeout(() => {
				destroy_metadata_player1_bonus(scene);
			}, 15000);
		});
		
		setTimeout(() => {
			canUsePowerUP_player1 = true;
			console.log("PowerUP player 1 rechargé !");
		}, 25000);
		
		return player_bonus1;
	}
	return null;
}

export function init_Teammate_player_2(scene) {
	if (nb_powerUP_player_2 > 0 && canUsePowerUP_player2) {
		nb_powerUP_player_2--;
		canUsePowerUP_player2 = false;

		const player_bonus2 = BABYLON.MeshBuilder.CreateBox("player_bonus2", {
			width: 10,
			height: 1.5,
			depth: 1.5
		}, scene);
		player_bonus2.position = new BABYLON.Vector3(-7, 301, -26.5);
		player_bonus2.visibility = 0;
		player_bonus2.metadata = { isPlayer_bonus2: true };

		BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
			const playerModel = newMeshes[0];
			playerModel.position = player_bonus2.position.clone();
			playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
			playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
			playerModel.metadata = { isPlayer_Model2: true };

			const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
				width: 10,
				height: 0.1,
				depth: 1,
			}, scene);
			playerRepere.position = new BABYLON.Vector3(-7, 301, -26.5);
			playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
			playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
			playerRepere.metadata = { isPlayerRepere2: true };
			
			scene.registerBeforeRender(() => {
				playerModel.position.x = player_bonus2.position.x;
				playerModel.position.y = player_bonus2.position.y;
				playerModel.position.z = player_bonus2.position.z;
				playerRepere.position.x = player_bonus2.position.x;
				playerRepere.position.y = player_bonus2.position.y;
			});
			
			setTimeout(() => {
				destroy_metadata_player2_bonus(scene);
			}, 15000);
		});
		
		setTimeout(() => {
			canUsePowerUP_player2 = true;
			console.log("PowerUP player 2 rechargé !");
		}, 25000);
		return player_bonus2;
	}
	return null;
}


function destroy_all_by_metadata(scene, metadataKey) {
	scene.meshes
		.filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
		.forEach(mesh => mesh.dispose());
}


function destroy_metadata_player1_bonus(scene)
{
	destroy_all_by_metadata(scene, "isPlayer_bonus1");
	destroy_all_by_metadata(scene, "isPlayer_root_bonus1");
	destroy_all_by_metadata(scene, "isPlayerRepere_bonus1");
}

function destroy_metadata_player2_bonus(scene)
{
	destroy_all_by_metadata(scene, "isPlayer_bonus2");
	destroy_all_by_metadata(scene, "isPlayer_Model2");
	destroy_all_by_metadata(scene, "isPlayerRepere2");
}