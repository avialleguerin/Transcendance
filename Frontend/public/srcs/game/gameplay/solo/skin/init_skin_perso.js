import { player1Skins_multi, player2Skins_multi, player3Skins_multi, player4Skins_multi } from "../../multiplayer/init_skin_perso_multi.js";
import { player1_podium_multi, player2_podium_multi, player3_podium_multi, player4_podium_multi } from "../../multiplayer/init_teamPlayer_podium.js";
import { player1Skins_podium, player2Skins_podium } from "./init_skin_player_podium.js";
// import { getScene } from "../../babylon.js";
// const scene = getScene();
let currentSkinPlayer1 = 0;
let currentSkinPlayer2 = 0;
let defaultSkinPlayer1 = 0;
let defaultSkinPlayer2 = 0;

const skinPaths = [
    { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
    { name: "player_skin_2", path: "/srcs/game/assets/player_skin/", file: "player_bleuv2.glb" },
    { name: "player_skin_3", path: "/srcs/game/assets/player_skin/", file: "player_rougev2.glb" },
    { name: "player_skin_4", path: "/srcs/game/assets/player_skin/", file: "player_vert.glb" }
];

let player1Skins = [];
let player2Skins = [];

function loadSkin(skin, scene) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skin.path, skin.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = new BABYLON.Vector3(0, 100, -15);
                rootMesh.scaling = new BABYLON.Vector3(4, 4, 4);
                rootMesh.rotation = new BABYLON.Vector3(0, 0, 0);
                rootMesh.metadata = { isPlayer_skin_menu: true };

                rootMesh.setEnabled(false);
                resolve(rootMesh);
            } else {
                reject(`Erreur lors du chargement de ${skin.name}`);
            }
        });
    });
}

function loadSkinsForPlayer(skinPaths, scene, playerSkins, offsetX)
{
    let loadPromises = skinPaths.map((skin) => loadSkin(skin, scene));

    Promise.all(loadPromises)
        .then((meshes) => {
            meshes.forEach((mesh, index) =>
            {
                mesh.position.x += offsetX;
                playerSkins.push(mesh);
            });
        })
        .catch((error) =>
        {
            console.error(error);
        });
}

export function init_skins_perso_player1(scene)
{
    console.log("init_skins_perso_player1");
    loadSkinsForPlayer(skinPaths, scene, player1Skins, -15);
}

export function init_skins_perso_player2(scene)
{
    console.log("init_skins_perso_player2");
    loadSkinsForPlayer(skinPaths, scene, player2Skins, -25);
}

export function enable_skin_perso_player_solo()
{
    currentSkinPlayer1 = defaultSkinPlayer1;
    currentSkinPlayer2 = defaultSkinPlayer2;

    if (player1Skins.length === 0)
    {
        console.log("player1Skins.length === 0");
        return;
    }

    if (player2Skins.length === 0) return;


    player1Skins.forEach(skin => skin.setEnabled(false));
	player1Skins[defaultSkinPlayer1].setEnabled(true);

    player2Skins.forEach(skin => skin.setEnabled(false));
    player2Skins[defaultSkinPlayer2].setEnabled(true);


}

export function disable_skin_perso_player_solo()
{
    if (player1Skins.length === 0) return;
    if (player2Skins.length === 0) return;

    player1Skins[currentSkinPlayer1].setEnabled(false);
	currentSkinPlayer1 = defaultSkinPlayer1;

    player2Skins[currentSkinPlayer2].setEnabled(false);
	currentSkinPlayer2 = defaultSkinPlayer2;
}


export function disable_skin_perso_player_solo_and_save()
{
    if (player1Skins.length === 0) return;
    if (player2Skins.length === 0) return;

    player1Skins[currentSkinPlayer1].setEnabled(false);
    player2Skins[currentSkinPlayer2].setEnabled(false);
}


export function switch_skin_perso_player1_right() {
    if (player1Skins.length === 0) return;

    // Désactiver l'ancien skin
    player1Skins[currentSkinPlayer1].setEnabled(false);

    // Changer d'index
    currentSkinPlayer1 = (currentSkinPlayer1 + 1) % player1Skins.length;

    // Activer le nouveau skin
    player1Skins[currentSkinPlayer1].setEnabled(true);
	console.log("currentSkinPlayer1", currentSkinPlayer1);
}

export function switch_skin_perso_player1_left() {
    if (player1Skins.length === 0) return;

    player1Skins[currentSkinPlayer1].setEnabled(false);
    currentSkinPlayer1 = (currentSkinPlayer1 - 1 + player1Skins.length) % player1Skins.length;
    player1Skins[currentSkinPlayer1].setEnabled(true);
	console.log("currentSkinPlayer1", currentSkinPlayer1);
}

export function switch_skin_perso_player2_right() {
    if (player2Skins.length === 0) return;

    player2Skins[currentSkinPlayer2].setEnabled(false);
    currentSkinPlayer2 = (currentSkinPlayer2 + 1) % player2Skins.length;
    player2Skins[currentSkinPlayer2].setEnabled(true);
	console.log("currentSkinPlayer2", currentSkinPlayer2);
}

export function switch_skin_perso_player2_left() {
    if (player2Skins.length === 0) return;

    player2Skins[currentSkinPlayer2].setEnabled(false);
    currentSkinPlayer2 = (currentSkinPlayer2 - 1 + player2Skins.length) % player2Skins.length;
    player2Skins[currentSkinPlayer2].setEnabled(true);

	console.log("currentSkinPlayer2", currentSkinPlayer2);
}

function setEnabledAllByMetadata(scene, metadataKey, enabled) {
    scene.meshes
        .filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
        .forEach(mesh => mesh.setEnabled(enabled));
}


export function destroy_all_by_metadata_skin(scene, metadataKey) {

    if (metadataKey == "isPlayer_skin_menu")
    {
        player1Skins.length = 0;
        player2Skins.length = 0;
        player1Skins_multi.length = 0;
        player2Skins_multi.length = 0;
        player3Skins_multi.length = 0;
        player4Skins_multi.length = 0;
        setEnabledAllByMetadata(scene, "isPlayer_skin_menu", false);
        scene.meshes
            .filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
            .forEach(mesh => mesh.dispose());
    }
    else if (metadataKey == "isPlayer_skin_podium")
    {
        player1_podium_multi.length = 0;
        player2_podium_multi.length = 0;
        player3_podium_multi.length = 0;
        player4_podium_multi.length = 0;
        player1Skins_podium.length = 0;
        player2Skins_podium.length = 0;

        setEnabledAllByMetadata(scene, "isPlayer_skin_podium", false);
        scene.meshes
            .filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
            .forEach(mesh => mesh.dispose());
    }
}


export { currentSkinPlayer1, currentSkinPlayer2 };