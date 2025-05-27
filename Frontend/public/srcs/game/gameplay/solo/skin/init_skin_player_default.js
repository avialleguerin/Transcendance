import { init_skins_perso_podium_multi_default } from "../../multiplayer/init_teamPlayer_podium_default.js";

let currentSkinPlayerFirst_default = 0;
let currentSkinPlayerSeconde_default = 0;

function getSkinPaths() {
    return [
        { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
    ];
}

let skinPaths = getSkinPaths();

let player1Skins_podium = [];
let player2Skins_podium = [];

function loadSkin(skin, scene, x, y, z) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skin.path, skin.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = new BABYLON.Vector3(x, y, z);
                rootMesh.scaling = new BABYLON.Vector3(4, 4, 4);
                rootMesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                rootMesh.metadata = { isPlayer_skin_podium: true };
                rootMesh.setEnabled(false);
                resolve(rootMesh);
            } else {
                reject("Root mesh not found.");
            }
        });
    });
}

function loadSkinsForPlayer(skinPaths, scene, playerSkins, x, y, z) {
    let loadPromises = skinPaths.map((skin) => loadSkin(skin, scene, x, y, z));

    Promise.all(loadPromises)
        .then((meshes) => {
            meshes.forEach(mesh => playerSkins.push(mesh));
        })
        .catch((error) => console.error(error));
}

export function init_skins_perso_first_default(scene) {
    loadSkinsForPlayer(skinPaths, scene, player1Skins_podium, -63, 304.5, -55);
}

export function init_skins_perso_seconde_default(scene) {
    loadSkinsForPlayer(skinPaths, scene, player2Skins_podium, -63, 303, -50);
}

export function enable_skin_perso_player_first_and_second_default() {
    if (player1Skins_podium.length === 0 || player2Skins_podium.length === 0) return;

    player1Skins_podium.forEach(skin => skin.setEnabled(false));
    player1Skins_podium[0].setEnabled(true);
    currentSkinPlayerFirst_default = 0;

    player2Skins_podium.forEach(skin => skin.setEnabled(false));
    player2Skins_podium[0].setEnabled(true);
    currentSkinPlayerSeconde_default = 0;
}

export function disable_skin_perso_player_first_and_seconde_default() {
    if (player1Skins_podium.length === 0 || player2Skins_podium.length === 0) return;

    player1Skins_podium[currentSkinPlayerFirst_default].setEnabled(false);
    player2Skins_podium[currentSkinPlayerSeconde_default].setEnabled(false);
}


export function init_skins_podium_default(scene) {
    init_skins_perso_first_default(scene);
    init_skins_perso_seconde_default(scene);
    init_skins_perso_podium_multi_default(scene);
}


export { currentSkinPlayerFirst_default, currentSkinPlayerSeconde_default, player1Skins_podium, player2Skins_podium };