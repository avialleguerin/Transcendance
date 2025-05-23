import { currentSkinPlayer1, currentSkinPlayer2 } from "./init_skin_perso.js";
import { getPlayer_1_win, getPlayer_2_win } from "../../score.js";
import { get_skin_is_init } from "./init_skin_utils.js";
import { init_skins_perso_player1_multi_podium, init_skins_perso_player2_multi_podium, init_skins_perso_player3_multi_podium, init_skins_perso_player4_multi_podium } from "../../multiplayer/init_teamPlayer_podium.js";


let currentSkinPlayerFirst = 0;
let currentSkinPlayerSeconde = 0;
let defaultSkinPlayerFirst = 0;
let defaultSkinPlayerSeconde = 0;



function getSkinPaths() {
    let skin = get_skin_is_init();
    console.log("skinnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn: ", skin);

    if (skin === true) {
        console.log("je rentre laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaatrueeeeeeeeeeeeeeeeeeeeeee");
        return [
            { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
            { name: "player_skin_2", path: "/srcs/game/assets/player_skin/", file: "player_bleuv2.glb" },
            { name: "player_skin_3", path: "/srcs/game/assets/player_skin/", file: "player_rougev2.glb" },
            { name: "player_skin_4", path: "/srcs/game/assets/player_skin/", file: "player_vert.glb" }
        ];
    } else {
        console.log("je rentre laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        return [
            { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
        ];
    }
}

let skinPaths = getSkinPaths();

let player1Skins_podium = [];
let player2Skins_podium = [];

function loadSkin(skin, scene, x, y, z) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skin.path, skin.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh)
			{
                rootMesh.position = new BABYLON.Vector3(x, y, z);
                rootMesh.scaling = new BABYLON.Vector3(4, 4, 4);
                rootMesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
                rootMesh.metadata = { isPlayer_skin_podium: true };
                rootMesh.setEnabled(false);
                resolve(rootMesh);
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

    console.log("enable_skin_perso_player_first_and_second");
    console.log("isPlayer1_win_score: ", isPlayer1_win_score);
    console.log("isPlayer2_win_score: ", isPlayer2_win_score);

    console.log("player1Skins_podium: ", player1Skins_podium);
    console.log("player2Skins_podium: ", player2Skins_podium);
	if (player1Skins_podium.length === 0)
		return;
	if (player2Skins_podium.length === 0)
		return;
	if (isPlayer1_win_score && !isPlayer2_win_score)
	{
		currentSkinPlayerFirst = currentSkinPlayer1;
		currentSkinPlayerSeconde = currentSkinPlayer2;

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
		player1Skins_podium[currentSkinPlayerFirst].setEnabled(true);
		
		player2Skins_podium.forEach(skin => skin.setEnabled(false));
		player2Skins_podium[currentSkinPlayerSeconde].setEnabled(true);
	}
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


export function init_skin_default(scene)
{
    init_skins_perso_player1_multi_podium(scene);
    init_skins_perso_player2_multi_podium(scene);
    init_skins_perso_player3_multi_podium(scene);
    init_skins_perso_player4_multi_podium(scene);

    init_skins_perso_first(scene);
    init_skins_perso_seconde(scene);
}


export { currentSkinPlayerFirst, currentSkinPlayerSeconde, player1Skins_podium, player2Skins_podium };