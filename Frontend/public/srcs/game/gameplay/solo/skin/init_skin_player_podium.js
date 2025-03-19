import { currentSkinPlayer1, currentSkinPlayer2 } from "./init_skin_perso.js";
import { getPlayer_1_win, getPlayer_2_win } from "../../score.js";

let currentSkinPlayerFirst = 0;
let currentSkinPlayerSeconde = 0;
let defaultSkinPlayerFirst = 0;
let defaultSkinPlayerSeconde = 0;

const skinPaths = [
    { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
    { name: "player_skin_2", path: "/srcs/game/assets/player_skin/", file: "player_bleuv2.glb" },
    { name: "player_skin_3", path: "/srcs/game/assets/player_skin/", file: "player_rougev2.glb" },
    { name: "player_skin_4", path: "/srcs/game/assets/player_skin/", file: "player_vert.glb" }
];

let player1Skins_podium = [];
let player2Skins_podium = [];

// Fonction pour charger les skins
// Fonction pour charger les skins, avec promesses pour garantir l'ordre
function loadSkin(skin, scene, x, y, z) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skin.path, skin.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = new BABYLON.Vector3(x, y, z); // Modifier selon la position voulue
                rootMesh.scaling = new BABYLON.Vector3(4, 4, 4);
                rootMesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);

                rootMesh.setEnabled(false); // Masquer tous les skins au départ
                resolve(rootMesh); // Résoudre la promesse avec le mesh
            } else {
                reject(`Erreur lors du chargement de ${skin.name}`);
            }
        });
    });
}

function loadSkinsForPlayer(skinPaths, scene, playerSkins, x, y, z)
{
    let loadPromises = skinPaths.map((skin) => loadSkin(skin, scene, x, y, z));

    Promise.all(loadPromises)
        .then((meshes) => {
            meshes.forEach((mesh, index) =>
            {
                playerSkins.push(mesh);
                console.log(`Skin ${skinPaths[index].name} chargé avec succès pour l'index ${index}`);
            });
        })
        .catch((error) =>
        {
            console.error(error);
        });
}

export function init_skins_perso_first(scene)
{
    loadSkinsForPlayer(skinPaths, scene, player1Skins_podium, -63, 304.5, -55);
}

export function init_skins_perso_seconde(scene)
{
    loadSkinsForPlayer(skinPaths, scene, player2Skins_podium, -63, 303, -50	);
}


export function enable_skin_perso_player_first_and_second()
{
	let isPlayer1_win_score = getPlayer_1_win();
	let isPlayer2_win_score = getPlayer_2_win();
	console.log("player_1_win", isPlayer1_win_score);
	console.log("player_2_win", isPlayer2_win_score);

	if (player1Skins_podium.length === 0)
	{
		console.log("player1Skins_podium.length === 0");
		return;
	}
	if (player2Skins_podium.length === 0)
	{
		console.log("player2Skins_podium.length === 0");
		return;
	}
	if (isPlayer1_win_score && !isPlayer2_win_score)
	{
		console.log("currentSkinPlayerFirst = currentSkinPlayer1;currentSkinPlayerSeconde = currentSkinPlayer2;", currentSkinPlayerFirst, currentSkinPlayerSeconde);

		currentSkinPlayerFirst = currentSkinPlayer1;
		currentSkinPlayerSeconde = currentSkinPlayer2;

		console.log("currentSkinPlayerFirst = currentSkinPlayer1;currentSkinPlayerSeconde = currentSkinPlayer2;", currentSkinPlayerFirst, currentSkinPlayerSeconde);

		player1Skins_podium.forEach(skin => skin.setEnabled(false));
		player1Skins_podium[currentSkinPlayerFirst].setEnabled(true);
		
		player2Skins_podium.forEach(skin => skin.setEnabled(false));
		player2Skins_podium[currentSkinPlayerSeconde].setEnabled(true);
	}
	else if (isPlayer2_win_score && !isPlayer1_win_score)
	{
		currentSkinPlayerFirst = currentSkinPlayer2;
		currentSkinPlayerSeconde = currentSkinPlayer1;

		player1Skins_podium.forEach(skin => skin.setEnabled(false));
		player1Skins_podium[currentSkinPlayerSeconde].setEnabled(true);
		
		player2Skins_podium.forEach(skin => skin.setEnabled(false));
		player2Skins_podium[currentSkinPlayerFirst].setEnabled(true);
	}
	console.log("Skins activéswwwwwwwwwwwwwwwww");


}

export function disable_skin_perso_player_first_and_seconde()
{
    if (player1Skins_podium.length === 0) return;
    if (player2Skins_podium.length === 0) return;

    player1Skins_podium[currentSkinPlayerFirst].setEnabled(false);
	currentSkinPlayerFirst = defaultSkinPlayerFirst;

    player2Skins_podium[currentSkinPlayerSeconde].setEnabled(false);
	currentSkinPlayerSeconde = defaultSkinPlayerSeconde;
}


export { currentSkinPlayerFirst, currentSkinPlayerSeconde };