let currentSkinPlayer1_multi = 0;
let currentSkinPlayer2_multi = 0;
let currentSkinPlayer3_multi = 0;
let currentSkinPlayer4_multi = 0;

let defaultSkinPlayer1 = 0;
let defaultSkinPlayer2 = 0;
let defaultSkinPlayer3 = 0;
let defaultSkinPlayer4 = 0;

const skinPaths = [
    { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
    { name: "player_skin_2", path: "/srcs/game/assets/player_skin/", file: "player_bleuv2.glb" },
    { name: "player_skin_3", path: "/srcs/game/assets/player_skin/", file: "player_rougev2.glb" },
    { name: "player_skin_4", path: "/srcs/game/assets/player_skin/", file: "player_vert.glb" }
];

let player1Skins_multi = [];
let player2Skins_multi = [];
let player3Skins_multi = [];
let player4Skins_multi = [];


function loadSkin(skin, scene, x, y, z, scaleX, scaleY, scaleZ) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skin.path, skin.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = new BABYLON.Vector3(x, y, z);
                rootMesh.scaling = new BABYLON.Vector3(scaleX, scaleY, scaleZ);
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

export function init_skins_perso_player1_multi(scene) {
    loadSkinsForPlayer(skinPaths, scene, player1Skins_multi, -16, 100, -28, 4, 4, 4);
}

export function init_skins_perso_player2_multi(scene) {
    loadSkinsForPlayer(skinPaths, scene, player2Skins_multi, -27, 100, -28, 4, 4, 4);
}

export function init_skins_perso_player3_multi(scene) {
    loadSkinsForPlayer(skinPaths, scene, player3Skins_multi, -14.5, 100, -2, 2.5, 2.5, 2.5);
}

export function init_skins_perso_player4_multi(scene) {
    loadSkinsForPlayer(skinPaths, scene, player4Skins_multi, -26.5, 100, -2, 2.5, 2.5, 2.5);
}

export function enable_skin_multi() {
    if (player1Skins_multi.length === 0) return;
    if (player2Skins_multi.length === 0) return;
    if (player3Skins_multi.length === 0) return;
    if (player4Skins_multi.length === 0) return;

    player1Skins_multi.forEach(skin => skin.setEnabled(false));
    player1Skins_multi[defaultSkinPlayer1].setEnabled(true);

    player2Skins_multi.forEach(skin => skin.setEnabled(false));
    player2Skins_multi[defaultSkinPlayer2].setEnabled(true);

    player3Skins_multi.forEach(skin => skin.setEnabled(false));
    player3Skins_multi[defaultSkinPlayer3].setEnabled(true);

    player4Skins_multi.forEach(skin => skin.setEnabled(false));
    player4Skins_multi[defaultSkinPlayer4].setEnabled(true);
}


export function disable_skin_multi() {
    if (player1Skins_multi.length === 0) return;
    if (player2Skins_multi.length === 0) return;
    if (player3Skins_multi.length === 0) return;
    if (player4Skins_multi.length === 0) return;

    player1Skins_multi[currentSkinPlayer1_multi].setEnabled(false);
    currentSkinPlayer1_multi = defaultSkinPlayer1;

    player2Skins_multi[currentSkinPlayer2_multi].setEnabled(false);
    currentSkinPlayer2_multi = defaultSkinPlayer2;

    player3Skins_multi[currentSkinPlayer3_multi].setEnabled(false);
    currentSkinPlayer3_multi = defaultSkinPlayer3;
    
    player4Skins_multi[currentSkinPlayer4_multi].setEnabled(false);
    currentSkinPlayer4_multi = defaultSkinPlayer4;
}


export function disable_skin_and_save_multi() {
    if (player1Skins_multi.length === 0) return;
    if (player2Skins_multi.length === 0) return;
    if (player3Skins_multi.length === 0) return;
    if (player4Skins_multi.length === 0) return;

    player1Skins_multi[currentSkinPlayer1_multi].setEnabled(false);
    player2Skins_multi[currentSkinPlayer2_multi].setEnabled(false);
    player3Skins_multi[currentSkinPlayer3_multi].setEnabled(false);
    player4Skins_multi[currentSkinPlayer4_multi].setEnabled(false);


}


export function switch_skin_perso_player1_right_multi() {
    if (player1Skins_multi.length === 0) return;

    player1Skins_multi[currentSkinPlayer1_multi].setEnabled(false);
    currentSkinPlayer1_multi = (currentSkinPlayer1_multi + 1) % player1Skins_multi.length;
    player1Skins_multi[currentSkinPlayer1_multi].setEnabled(true);
}

export function switch_skin_perso_player1_left_multi() {
    if (player1Skins_multi.length === 0) return;

    player1Skins_multi[currentSkinPlayer1_multi].setEnabled(false);
    currentSkinPlayer1_multi = (currentSkinPlayer1_multi - 1 + player1Skins_multi.length) % player1Skins_multi.length;
    player1Skins_multi[currentSkinPlayer1_multi].setEnabled(true);
}

export function switch_skin_perso_player2_right_multi() {
    if (player2Skins_multi.length === 0) return;

    player2Skins_multi[currentSkinPlayer2_multi].setEnabled(false);
    currentSkinPlayer2_multi = (currentSkinPlayer2_multi + 1) % player2Skins_multi.length;
    player2Skins_multi[currentSkinPlayer2_multi].setEnabled(true);
}

export function switch_skin_perso_player2_left_multi() {
    if (player2Skins_multi.length === 0) return;

    player2Skins_multi[currentSkinPlayer2_multi].setEnabled(false);
    currentSkinPlayer2_multi = (currentSkinPlayer2_multi - 1 + player2Skins_multi.length) % player2Skins_multi.length;
    player2Skins_multi[currentSkinPlayer2_multi].setEnabled(true);
}


export function switch_skin_perso_player3_right_multi() {
    if (player3Skins_multi.length === 0) return;

    player3Skins_multi[currentSkinPlayer3_multi].setEnabled(false);
    currentSkinPlayer3_multi = (currentSkinPlayer3_multi + 1) % player3Skins_multi.length;
    player3Skins_multi[currentSkinPlayer3_multi].setEnabled(true);
}

export function switch_skin_perso_player3_left_multi() {
    if (player3Skins_multi.length === 0) return;

    player3Skins_multi[currentSkinPlayer3_multi].setEnabled(false);
    currentSkinPlayer3_multi = (currentSkinPlayer3_multi - 1 + player3Skins_multi.length) % player3Skins_multi.length;
    player3Skins_multi[currentSkinPlayer3_multi].setEnabled(true);
}

export function switch_skin_perso_player4_right_multi() {
    if (player4Skins_multi.length === 0) return;

    player4Skins_multi[currentSkinPlayer4_multi].setEnabled(false);
    currentSkinPlayer4_multi = (currentSkinPlayer4_multi + 1) % player4Skins_multi.length;
    player4Skins_multi[currentSkinPlayer4_multi].setEnabled(true);
}

export function switch_skin_perso_player4_left_multi() {
    if (player4Skins_multi.length === 0) return;

    player4Skins_multi[currentSkinPlayer4_multi].setEnabled(false);
    currentSkinPlayer4_multi = (currentSkinPlayer4_multi - 1 + player4Skins_multi.length) % player4Skins_multi.length;
    player4Skins_multi[currentSkinPlayer4_multi].setEnabled(true);
}



export { currentSkinPlayer1_multi, currentSkinPlayer2_multi, currentSkinPlayer3_multi, currentSkinPlayer4_multi, player1Skins_multi, player2Skins_multi, player3Skins_multi, player4Skins_multi };