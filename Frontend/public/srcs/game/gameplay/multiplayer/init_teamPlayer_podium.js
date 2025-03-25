import { currentSkinPlayer1_multi, currentSkinPlayer2_multi, currentSkinPlayer3_multi, currentSkinPlayer4_multi } from "./init_skin_perso_multi.js";
import { getIsTeam1Win, getIsTeam2Win } from "../score.js";

let currentSkinTeamPlayerFirst_multi_1 = 0;
let currentSkinTeamPlayerFirst_multi_2 = 0;
let currentSkinTeamPlayerSecond_multi_1 = 0;
let currentSkinTeamPlayerSecond_multi_2 = 0;

let defaultSkinPlayerFirst_multi = 0;
let defaultSkinPlayerSecond_multi = 0;

const skinPaths = [
    { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
    { name: "player_skin_2", path: "/srcs/game/assets/player_skin/", file: "player_bleuv2.glb" },
    { name: "player_skin_3", path: "/srcs/game/assets/player_skin/", file: "player_rougev2.glb" },
    { name: "player_skin_4", path: "/srcs/game/assets/player_skin/", file: "player_vert.glb" }
];

let player1_podium_multi = [];
let player2_podium_multi = [];
let player3_podium_multi = [];
let player4_podium_multi = [];


function loadSkin(skin, scene, x, y, z, scaleX, scaleY, scaleZ) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skin.path, skin.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = new BABYLON.Vector3(x, y, z);
                rootMesh.scaling = new BABYLON.Vector3(scaleX, scaleY, scaleZ);
                rootMesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
                rootMesh.metadata = { isPlayer_skin_podium: true };
                rootMesh.setEnabled(false);
                resolve(rootMesh);
            } else {
                reject(`Erreur lors du chargement de ${skin.name}`);
            }
        });
    });
}


function loadSkinsForPlayer(skinPaths, scene, playerSkins, offsetX, offsetY, offsetZ, scaleX, scaleY, scaleZ)
{
    let loadPromises = skinPaths.map((skin) => loadSkin(skin, scene, offsetX, offsetY, offsetZ, scaleX, scaleY, scaleZ));

    Promise.all(loadPromises)
        .then((meshes) => {
            meshes.forEach((mesh, index) =>
            {
                mesh.position = new BABYLON.Vector3(offsetX, offsetY, offsetZ);
                playerSkins.push(mesh);
                console.log(`Skin ${skinPaths[index].name} chargé avec succès pour l'index ${index}`);
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

export function init_skins_perso_player1_multi_podium(scene) {
    loadSkinsForPlayer(skinPaths, scene, player1_podium_multi, -62, 304.5, -57, 4, 4, 4);
}

export function init_skins_perso_player2_multi_podium(scene) {
    loadSkinsForPlayer(skinPaths, scene, player2_podium_multi, -65, 304.5, -53, 4, 4, 4);
}

export function init_skins_perso_player3_multi_podium(scene) {
    loadSkinsForPlayer(skinPaths, scene, player3_podium_multi, -62, 303, -49, 4, 4, 4);
}

export function init_skins_perso_player4_multi_podium(scene) {
    loadSkinsForPlayer(skinPaths, scene, player4_podium_multi, -65, 303, -45, 4, 4, 4);
}

export function enable_skin_multi_podium() {

	let is_team1_win = getIsTeam1Win();
	let is_team2_win = getIsTeam2Win();

    if (player1_podium_multi.length === 0) return;
    if (player2_podium_multi.length === 0) return;
    if (player3_podium_multi.length === 0) return;
    if (player4_podium_multi.length === 0) return;

	if (is_team1_win && !is_team2_win) {
		currentSkinTeamPlayerFirst_multi_1 = currentSkinPlayer1_multi;
		currentSkinTeamPlayerFirst_multi_2 = currentSkinPlayer2_multi;
		currentSkinTeamPlayerSecond_multi_1 = currentSkinPlayer3_multi;
		currentSkinTeamPlayerSecond_multi_2 = currentSkinPlayer4_multi;

		player1_podium_multi.forEach(skin => skin.setEnabled(false));
		player1_podium_multi[currentSkinTeamPlayerFirst_multi_1].setEnabled(true);

		player2_podium_multi.forEach(skin => skin.setEnabled(false));
		player2_podium_multi[currentSkinTeamPlayerFirst_multi_2].setEnabled(true);

		player3_podium_multi.forEach(skin => skin.setEnabled(false));
		player3_podium_multi[currentSkinTeamPlayerSecond_multi_1].setEnabled(true);

		player4_podium_multi.forEach(skin => skin.setEnabled(false));
		player4_podium_multi[currentSkinTeamPlayerSecond_multi_2].setEnabled(true);
	}

	else if (is_team2_win && !is_team1_win) {
		currentSkinTeamPlayerFirst_multi_1 = currentSkinPlayer3_multi;
		currentSkinTeamPlayerFirst_multi_2 = currentSkinPlayer4_multi;
		currentSkinTeamPlayerSecond_multi_1 = currentSkinPlayer1_multi;
		currentSkinTeamPlayerSecond_multi_2 = currentSkinPlayer2_multi;

		player1_podium_multi.forEach(skin => skin.setEnabled(false));
		player1_podium_multi[currentSkinTeamPlayerFirst_multi_1].setEnabled(true);

		player2_podium_multi.forEach(skin => skin.setEnabled(false));
		player2_podium_multi[currentSkinTeamPlayerFirst_multi_2].setEnabled(true);

		player3_podium_multi.forEach(skin => skin.setEnabled(false));
		player3_podium_multi[currentSkinTeamPlayerSecond_multi_1].setEnabled(true);

		player4_podium_multi.forEach(skin => skin.setEnabled(false));
		player4_podium_multi[currentSkinTeamPlayerSecond_multi_2].setEnabled(true);
	}
}

export function disable_skin_multi_podium() {
	if (player1_podium_multi.length === 0) return;
	if (player2_podium_multi.length === 0) return;

	player1_podium_multi[currentSkinTeamPlayerFirst_multi_1].setEnabled(false);
	currentSkinTeamPlayerFirst_multi_1 = defaultSkinPlayerFirst_multi;

	player2_podium_multi[currentSkinTeamPlayerFirst_multi_2].setEnabled(false);
	currentSkinTeamPlayerFirst_multi_2 = defaultSkinPlayerSecond_multi;

	player3_podium_multi[currentSkinTeamPlayerSecond_multi_1].setEnabled(false);
	currentSkinTeamPlayerSecond_multi_1 = defaultSkinPlayerFirst_multi;

	player4_podium_multi[currentSkinTeamPlayerSecond_multi_2].setEnabled(false);
	currentSkinTeamPlayerSecond_multi_2 = defaultSkinPlayerSecond_multi;
}

export { currentSkinTeamPlayerFirst_multi_1, currentSkinTeamPlayerFirst_multi_2, currentSkinTeamPlayerSecond_multi_1, currentSkinTeamPlayerSecond_multi_2, player1_podium_multi, player2_podium_multi, player3_podium_multi, player4_podium_multi };
